/**
 * Emmy Social Digital Hub — Service Catalog Refresh Cron
 * 
 * WHY:
 * 1. Cache-First Integrity: Syncs wholesale prices and active service IDs from JejeLaye.
 * 2. Automatic Markup Calculation: Recalculates retail prices (ourPriceKobo) when provider prices adjust.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { JejelayeClient } from '@/lib/providers/jejelay/client';
import { toKobo, applyPercentageMarkup } from '@/lib/money';
import { JejeServiceItem, JejeServiceType } from '@/lib/providers/jejelay/types';

export const dynamic = 'force-dynamic';

const SERVICE_TYPES: JejeServiceType[] = [
  'airtime',
  'data',
  'electricity',
  'tv',
  'education',
  'print_card',
  'bulk_sms',
];

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized: Invalid CRON_SECRET' }, { status: 401 });
  }

  if (!process.env.JEJELAYE_API_TOKEN) {
    return NextResponse.json({ status: 'skipped', message: 'JEJELAYE_API_TOKEN not configured' });
  }

  const client = new JejelayeClient();
  let totalSynced = 0;
  const errors: string[] = [];

  for (const type of SERVICE_TYPES) {
    try {
      const items = await client.request<JejeServiceItem[]>('/services', {
        params: { type },
      });

      if (Array.isArray(items)) {
        for (const item of items) {
          const rawPrice = Number(item.selling_price || item.price || 100);
          const providerPriceKobo = toKobo(rawPrice);
          const markupPct = type === 'airtime' ? 2 : type === 'data' ? 5 : 3;
          const ourPriceKobo = applyPercentageMarkup(providerPriceKobo, markupPct);

          await prisma.serviceCache.upsert({
            where: {
              type_providerServiceId: {
                type,
                providerServiceId: String(item.id),
              },
            },
            update: {
              name: item.name,
              network: item.network || null,
              providerPriceKobo,
              ourPriceKobo,
              rawJson: item as unknown as object,
              isActive: true,
              lastSyncedAt: new Date(),
            },
            create: {
              type,
              providerServiceId: String(item.id),
              name: item.name,
              network: item.network || null,
              providerPriceKobo,
              ourPriceKobo,
              rawJson: item as unknown as object,
              isActive: true,
              lastSyncedAt: new Date(),
            },
          });
          totalSynced++;
        }
      }
    } catch (err) {
      errors.push(`Failed syncing type ${type}: ${(err as Error).message}`);
    }
  }

  return NextResponse.json({
    status: 'ok',
    totalSynced,
    errors,
    timestamp: new Date().toISOString(),
  });
}
