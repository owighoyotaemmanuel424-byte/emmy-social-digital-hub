/**
 * Emmy Social Digital Hub — Cable TV Subscription API
 * 
 * WHY:
 * 1. Supports DStv, GOtv, Startimes, and Showmax bouquet top-ups.
 * 2. Instant bouquet renewal with smartcard validation and idempotency.
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
    const provider = String(body.provider || 'DSTV');
    const smartcardNumber = String(body.smartcardNumber || '').trim().replace(/[^0-9]/g, '');
    const packageId = String(body.packageId || 'dstv_padi');
    const packageName = String(body.packageName || 'Bouquet Package');
    const customerName = String(body.customerName || 'Subscriber');
    const phone = String(body.phone || user.phone).trim().replace(/[^0-9]/g, '');
    const amount = Number(body.amount);
    const idempotencyKey = String(
      body.idempotency_key || body.idempotencyKey || `idemp_tv_${crypto.randomUUID()}`
    );

    if (!smartcardNumber || smartcardNumber.length < 8) {
      return NextResponse.json({ error: 'Invalid smartcard number format.' }, { status: 400 });
    }

    if (isNaN(amount) || amount < 1000) {
      return NextResponse.json({ error: 'Invalid subscription package price.' }, { status: 400 });
    }

    // Idempotency check
    const existingTx = await findTransactionByRef(idempotencyKey);
    if (existingTx) {
      return NextResponse.json(
        {
          success: true,
          message: 'Existing transaction returned (idempotent)',
          transactionId: existingTx.id,
          reference: existingTx.id,
          status: existingTx.status,
          amountChargedNaira: toNaira(existingTx.amountChargedKobo),
          formattedAmount: formatNaira(existingTx.amountChargedKobo),
        },
        { status: 200 }
      );
    }

    const amountChargedKobo = toKobo(amount);
    const amountCostKobo = (amountChargedKobo * BigInt(985)) / BigInt(1000); // 1.5% margin

    if (user.walletBalance < amountChargedKobo) {
      return NextResponse.json(
        {
          error: `Insufficient wallet balance. You have ${formatNaira(user.walletBalance)}, but this subscription requires ${formatNaira(amountChargedKobo)}. Please fund your wallet.`,
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
      serviceType: 'cable_tv',
      providerServiceId: packageId,
      target: smartcardNumber,
      amountCostKobo,
      amountChargedKobo,
      status: 'pending',
      metadata: {
        provider,
        smartcardNumber,
        packageName,
        packageId,
        customerName,
        phone,
        retailAmountNaira: amount,
      },
    });

    // Enqueue to QStash worker
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const workerUrl = `${protocol}://${host}/api/queue/purchase`;

    try {
      await enqueuePurchaseJob(workerUrl, {
        transactionId: tx.id,
        serviceType: 'cable_tv',
      });
    } catch (queueErr) {
      console.warn('[Emmy Hub][Cable] QStash enqueue warning:', queueErr);
    }

    if (!process.env.QSTASH_TOKEN || process.env.NODE_ENV !== 'production') {
      fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: tx.id, serviceType: 'cable_tv' }),
      }).catch((e) => console.warn('[Emmy Hub][Cable] Direct execution note:', e));
    }

    return NextResponse.json(
      {
        success: true,
        transactionId: tx.id,
        reference: tx.id,
        status: 'pending',
        amountChargedNaira: toNaira(amountChargedKobo),
        formattedAmount: formatNaira(amountChargedKobo),
        target: smartcardNumber,
        provider,
        packageName,
        customerName,
      },
      { status: 202 }
    );
  } catch (err: unknown) {
    console.error('[Emmy Hub][Cable TV Purchase API] Error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Failed to process TV subscription' }, { status: 500 });
  }
}
