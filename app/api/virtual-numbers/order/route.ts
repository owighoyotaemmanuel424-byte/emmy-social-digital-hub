/**
 * Emmy Social Digital Hub — Virtual Number Order API (SMS / OTP Verification)
 * 
 * WHY:
 * 1. Temporary phone number leasing for receiving SMS verification codes (WhatsApp, Telegram, OpenAI, etc.).
 * 2. Integrates with JejeLaye virtual numbers service and the OTP webhook listener.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { verifyJwt } from '@/lib/jwt';
import {
  findUserById,
  createTransactionRecord,
  findTransactionByRef,
} from '@/lib/db/customer-store';
import { toKobo, toNaira, formatNaira } from '@/lib/money';
import { enqueuePurchaseJob } from '@/lib/queue/qstash';

export async function POST(req: NextRequest) {
  try {
    const token =
      req.cookies.get('token')?.value ||
      req.cookies.get('emmy_auth_token')?.value ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 });
    }

    const payload = await verifyJwt(token);
    const userId = req.headers.get('x-user-id') || payload?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }

    const user = await findUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User account not found' }, { status: 404 });
    }

    const body = await req.json();
    const serviceName = String(body.serviceName || 'WhatsApp');
    const country = String(body.country || 'Nigeria');
    const countryCode = String(body.countryCode || '234');
    const priceNaira = Number(body.price || 850);
    const idempotencyKey = String(
      body.idempotency_key || body.idempotencyKey || `idemp_vnum_${crypto.randomUUID()}`
    );

    const amountChargedKobo = toKobo(priceNaira);
    const amountCostKobo = (amountChargedKobo * BigInt(95)) / BigInt(100);

    if (user.walletBalance < amountChargedKobo) {
      return NextResponse.json(
        {
          error: `Insufficient wallet balance. You have ${formatNaira(user.walletBalance)}, but leasing a virtual number requires ${formatNaira(amountChargedKobo)}. Please fund your wallet.`,
          requiredKobo: amountChargedKobo.toString(),
          currentBalanceKobo: user.walletBalance.toString(),
        },
        { status: 402 }
      );
    }

    // Record pending transaction
    const tx = await createTransactionRecord({
      userId: user.id,
      idempotencyKey,
      serviceType: 'virtual_number',
      providerServiceId: `vnum_${serviceName.toLowerCase()}`,
      target: `${serviceName} (${country})`,
      amountCostKobo,
      amountChargedKobo,
      status: 'pending',
      metadata: {
        serviceName,
        country,
        countryCode,
        retailAmountNaira: priceNaira,
        status: 'awaiting_sms',
      },
    });

    // Enqueue to QStash worker
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const workerUrl = `${protocol}://${host}/api/queue/purchase`;

    try {
      await enqueuePurchaseJob(workerUrl, {
        transactionId: tx.id,
        serviceType: 'virtual_number',
      });
    } catch (queueErr) {
      console.warn('[Emmy Hub][Virtual Number] QStash enqueue warning:', queueErr);
    }

    if (!process.env.QSTASH_TOKEN || process.env.NODE_ENV !== 'production') {
      fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: tx.id, serviceType: 'virtual_number' }),
      }).catch((e) => console.warn('[Emmy Hub][Virtual Number] Direct execution note:', e));
    }

    return NextResponse.json(
      {
        success: true,
        transactionId: tx.id,
        reference: tx.id,
        status: 'pending',
        amountChargedNaira: toNaira(amountChargedKobo),
        formattedAmount: formatNaira(amountChargedKobo),
        serviceName,
        country,
      },
      { status: 202 }
    );
  } catch (err: unknown) {
    console.error('[Emmy Hub][Virtual Number API] Error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Failed to order virtual number' }, { status: 500 });
  }
}
