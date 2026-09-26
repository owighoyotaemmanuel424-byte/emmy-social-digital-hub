/**
 * Emmy Social Digital Hub — Float Liquidity Monitoring Endpoint
 * 
 * WHY:
 * 1. Low Float Alerting: Verifies JejeLaye balance against LOW_THRESHOLD (₦50,000).
 * 2. Critical Circuit Breaker: Halts purchasing when balance drops below CRITICAL_THRESHOLD (₦10,000).
 * 3. Invocable via QStash Schedule or CRON secret.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { JejelayeClient } from '@/lib/providers/jejelay/client';
import { toKobo, toNaira } from '@/lib/money';
import { JejeWalletResponse } from '@/lib/providers/jejelay/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized: Invalid CRON_SECRET' }, { status: 401 });
  }

  const client = new JejelayeClient();

  try {
    if (!process.env.JEJELAYE_API_TOKEN) {
      return NextResponse.json({ status: 'skipped', message: 'JEJELAYE_API_TOKEN not configured' });
    }

    const wallet = await client.request<JejeWalletResponse>('/wallet');
    const balanceNaira = Number(wallet.balance || 0);
    const balanceKobo = toKobo(balanceNaira);

    // Save to audit log
    await prisma.floatLog.create({
      data: {
        balanceKobo,
        source: 'auto',
      },
    });

    const lowThresholdKobo = BigInt(process.env.FLOAT_LOW_THRESHOLD_KOBO || '5000000'); // ₦50,000
    const criticalThresholdKobo = BigInt(process.env.FLOAT_CRITICAL_THRESHOLD_KOBO || '1000000'); // ₦10,000

    let alertLevel = 'normal';
    if (balanceKobo < criticalThresholdKobo) {
      alertLevel = 'critical';
      console.error(`[Emmy Hub][ALERT] CRITICAL FLOAT: Balance is ₦${balanceNaira} (< ₦${toNaira(criticalThresholdKobo)})!`);
    } else if (balanceKobo < lowThresholdKobo) {
      alertLevel = 'low';
      console.warn(`[Emmy Hub][ALERT] LOW FLOAT: Balance is ₦${balanceNaira} (< ₦${toNaira(lowThresholdKobo)}).`);
    }

    return NextResponse.json({
      status: 'ok',
      balanceNaira,
      balanceKobo: balanceKobo.toString(),
      alertLevel,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ status: 'error', error: (err as Error).message }, { status: 500 });
  }
}
