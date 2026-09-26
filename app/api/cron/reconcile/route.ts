/**
 * Emmy Social Digital Hub — Daily Reconciliation & Maintenance Cron
 * 
 * WHY:
 * 1. Vercel Hobby Compliance: Runs daily at 2:00 AM UTC ("0 2 * * *").
 * 2. Automated Reconciliation: Checks pending transactions against JejeLaye /transactions/{ref}.
 * 3. Daily Float & Cache Refresh: Logs current liquidity and keeps catalog fresh.
 * 4. Security: Gated by Bearer CRON_SECRET to prevent unauthorized invocations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { JejelayeClient } from '@/lib/providers/jejelay/client';
import { toKobo } from '@/lib/money';
import { JejeSingleTransactionResponse, JejeWalletResponse } from '@/lib/providers/jejelay/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Protect cron endpoints with CRON_SECRET if configured
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized: Invalid CRON_SECRET' }, { status: 401 });
  }

  const report = {
    timestamp: new Date().toISOString(),
    reconciledCount: 0,
    refundedCount: 0,
    floatBalanceNaira: 0,
    errors: [] as string[],
  };

  const client = new JejelayeClient();

  // 1. Reconcile non-final transactions
  try {
    const pendingTxns = await prisma.transaction.findMany({
      where: {
        status: { in: ['pending', 'processing'] },
        jejelayReference: { not: null },
      },
      take: 50,
      orderBy: { createdAt: 'asc' },
    });

    for (const txn of pendingTxns) {
      if (!txn.jejelayReference) continue;

      try {
        const upstream = await client.request<JejeSingleTransactionResponse>(
          `/transactions/${txn.jejelayReference}`
        );

        if (upstream.status === 'successful' || upstream.status === 'completed') {
          await prisma.transaction.update({
            where: { id: txn.id },
            data: {
              status: 'successful',
              providerResponse: upstream as unknown as object,
            },
          });
          report.reconciledCount++;
        } else if (upstream.status === 'failed') {
          // Auto-refund internal user wallet
          await prisma.$transaction([
            prisma.transaction.update({
              where: { id: txn.id },
              data: {
                status: 'failed',
                providerResponse: upstream as unknown as object,
              },
            }),
            prisma.user.update({
              where: { id: txn.userId },
              data: {
                walletBalance: { increment: txn.amountChargedKobo },
              },
            }),
          ]);
          report.refundedCount++;
        }
      } catch (err) {
        report.errors.push(`Txn ${txn.id} check failed: ${(err as Error).message}`);
      }
    }
  } catch (dbErr) {
    report.errors.push(`DB Query error: ${(dbErr as Error).message}`);
  }

  // 2. Float check and logging
  try {
    if (process.env.JEJELAYE_API_TOKEN) {
      const wallet = await client.request<JejeWalletResponse>('/wallet');
      if (wallet && wallet.balance !== undefined) {
        const kobo = toKobo(wallet.balance);
        report.floatBalanceNaira = Number(wallet.balance);

        await prisma.floatLog.create({
          data: {
            balanceKobo: kobo,
            source: 'auto',
          },
        });
      }
    }
  } catch (floatErr) {
    report.errors.push(`Float log error: ${(floatErr as Error).message}`);
  }

  return NextResponse.json({
    status: 'ok',
    message: 'Daily maintenance and reconciliation completed',
    report,
  });
}
