/**
 * Emmy Social Digital Hub — Wallet Balance API
 * 
 * WHY:
 * 1. Single source of truth for customer wallet balance.
 * 2. Strictly calculates in BigInt integer Kobo precision formatted into Nigerian Naira.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import { findUserById, getUserVirtualAccount } from '@/lib/db/customer-store';
import { formatNaira, toNaira } from '@/lib/money';

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get('token')?.value ||
      req.cookies.get('emmy_auth_token')?.value ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const payload = await verifyJwt(token);
    const userId = req.headers.get('x-user-id') || payload?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const user = await findUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    const virtualAccount = await getUserVirtualAccount(user.id);

    return NextResponse.json({
      success: true,
      walletBalance: user.walletBalance.toString(),
      balanceKobo: user.walletBalance.toString(),
      balanceNaira: toNaira(user.walletBalance),
      formattedBalance: formatNaira(user.walletBalance),
      virtualAccount: virtualAccount
        ? {
            bankName: virtualAccount.bankName,
            accountNumber: virtualAccount.accountNumber,
            accountName: virtualAccount.accountName,
          }
        : null,
    });
  } catch (err: unknown) {
    console.error('[Emmy Hub][Wallet Balance] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch wallet balance' }, { status: 500 });
  }
}
