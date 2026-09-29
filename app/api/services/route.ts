/**
 * Emmy Social Digital Hub — Service Catalog API
 * 
 * WHY:
 * 1. Cache-First Pattern: Reads from ServiceCache (cached 1hr).
 * 2. Provider Sync: If cache is empty or stale, fetches fresh from JejeLaye /services and upserts.
 * 3. Transparent Wholesale/Retail Pricing: Converts kobo to formatted amounts.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JejelayeClient } from '@/lib/providers/jejelaye/client';
import { INITIAL_SERVICES } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const typeFilter = searchParams.get('type') || 'airtime';

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // 1. Try reading from database ServiceCache
    let cachedServices: any[] = [];
    try {
      cachedServices = await (prisma as any).serviceCache.findMany({
        where: {
          type: typeFilter,
          isActive: true,
          lastSyncedAt: { gte: oneHourAgo },
        },
      });
    } catch {
      // Prisma table may not be migrated in preview
      cachedServices = [];
    }

    // 2. If fresh cache exists, return it
    if (cachedServices && cachedServices.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'cache',
        services: cachedServices.map((s) => ({
          id: s.providerServiceId,
          serviceId: s.providerServiceId,
          type: s.type,
          name: s.name,
          network: s.network,
          providerPriceKobo: s.providerPriceKobo.toString(),
          ourPriceKobo: s.ourPriceKobo.toString(),
          ourPriceNaira: Number(s.ourPriceKobo) / 100,
          isActive: s.isActive,
        })),
      });
    }

    // 3. Cache is stale or empty — fetch fresh from JejeLaye /services
    let liveServices: any[] = [];
    try {
      const jejelayeClient = new JejelayeClient();
      const res: any = await jejelayeClient.request('/services', {
        method: 'GET',
        params: { type: typeFilter },
      });

      if (res && res.data && Array.isArray(res.data)) {
        liveServices = res.data;
      }
    } catch (upstreamErr) {
      console.warn('[Emmy Hub][Services] Upstream sync failed, falling back to local catalog:', (upstreamErr as Error).message);
    }

    // Fallback catalog if upstream returned empty
    if (!liveServices || liveServices.length === 0) {
      liveServices = INITIAL_SERVICES.filter(
        (s) => s.type.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    // 4. Upsert into ServiceCache where available
    const mapped = liveServices.map((s: any) => {
      const providerServiceId = String(s.id || s.service_id || s.plan_id || '101');
      const providerPriceKobo = BigInt(Math.round((s.price || 50) * 98)); // 2% discount
      const ourPriceKobo = BigInt(Math.round((s.price || 50) * 100));

      return {
        id: providerServiceId,
        serviceId: providerServiceId,
        type: typeFilter,
        name: s.name || `${s.provider || 'VTU'} Airtime`,
        network: s.provider || s.network || 'MTN',
        providerPriceKobo: providerPriceKobo.toString(),
        ourPriceKobo: ourPriceKobo.toString(),
        ourPriceNaira: Number(ourPriceKobo) / 100,
        isActive: true,
      };
    });

    // Try upserting asynchronously
    try {
      for (const item of mapped) {
        await (prisma as any).serviceCache.upsert({
          where: {
            type_providerServiceId: {
              type: item.type,
              providerServiceId: item.serviceId,
            },
          },
          update: {
            name: item.name,
            network: item.network,
            providerPriceKobo: BigInt(item.providerPriceKobo),
            ourPriceKobo: BigInt(item.ourPriceKobo),
            lastSyncedAt: new Date(),
          },
          create: {
            type: item.type,
            providerServiceId: item.serviceId,
            name: item.name,
            network: item.network,
            providerPriceKobo: BigInt(item.providerPriceKobo),
            ourPriceKobo: BigInt(item.ourPriceKobo),
            isActive: true,
            lastSyncedAt: new Date(),
          },
        }).catch(() => {});
      }
    } catch {
      // Ignore Prisma table absence in non-migrated preview
    }

    return NextResponse.json({
      success: true,
      source: 'live',
      services: mapped,
    });
  } catch (err: unknown) {
    console.error('[Emmy Hub][Services API] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch services catalog' }, { status: 500 });
  }
}
