/**
 * Emmy Social Digital Hub — Customer Transactions List API
 * 
 * WHY:
 * Returns recent transaction history strictly from internal DB ledger.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import { getUserTransactions } from '@/lib/db/customer-store';
import { formatNaira, toNaira } from '@/lib/money';

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get('token')?.value ||
      req.cookies.get('emmy_auth_token')?.value ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    const payload = token ? await verifyJwt(token) : null;
    const userId = req.headers.get('x-user-id') || payload?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const list = await getUserTransactions(userId, limit);

    const transactions = list.map((tx) => ({
      id: tx.id,
      reference: tx.id,
      jejelayReference: tx.jejelayReference,
      serviceType: tx.serviceType,
      target: tx.target,
      amountChargedKobo: tx.amountChargedKobo.toString(),
      amountChargedNaira: toNaira(tx.amountChargedKobo),
      formattedAmount: formatNaira(tx.amountChargedKobo),
      status: tx.status,
      metadata: tx.metadata,
      createdAt: tx.createdAt,
    }));

    return NextResponse.json({
      success: true,
      transactions,
    });
  } catch (err: unknown) {
    console.error('[Emmy Hub][Transactions List] Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve transactions' }, { status: 500 });
  }
}
