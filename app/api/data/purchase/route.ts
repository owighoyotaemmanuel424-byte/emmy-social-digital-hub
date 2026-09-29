/**
 * Emmy Social Digital Hub — Mobile Data Purchase API
 * 
 * WHY:
 * 1. Multi-Network Data: Supports MTN SME/CG, Airtel CG, Glo Corporate, and 9mobile SME.
 * 2. Idempotency & Kobo Precision: Protects against double debits and verifies wallet balance.
 * 3. Asynchronous QStash Dispatch: Immediate 202 response followed by queue fulfillment.
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
    const serviceId = String(body.serviceId || body.planId || '201');
    const planName = String(body.planName || 'Data Bundle');
    const network = String(body.network || 'MTN');
    const phone = String(body.phone || '').trim().replace(/[^0-9]/g, '');
    const amount = Number(body.amount);
    const idempotencyKey = String(
      body.idempotency_key || body.idempotencyKey || `idemp_data_${crypto.randomUUID()}`
    );

    // Nigerian phone validation
    if (!/^(0[789][01]\d{8}|234[789][01]\d{8})$/.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Must be an 11-digit Nigerian mobile line.' },
        { status: 400 }
      );
    }

    if (isNaN(amount) || amount < 50) {
      return NextResponse.json({ error: 'Invalid data plan price.' }, { status: 400 });
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
    const amountCostKobo = (amountChargedKobo * BigInt(96)) / BigInt(100); // 4% reseller margin

    // Check wallet balance
    if (user.walletBalance < amountChargedKobo) {
      return NextResponse.json(
        {
          error: `Insufficient wallet balance. You have ${formatNaira(user.walletBalance)}, but this data plan requires ${formatNaira(amountChargedKobo)}. Please fund your wallet.`,
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
      serviceType: 'data',
      providerServiceId: serviceId,
      target: phone,
      amountCostKobo,
      amountChargedKobo,
      status: 'pending',
      metadata: {
        network,
        planName,
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
        serviceType: 'data',
      });
    } catch (queueErr) {
      console.warn('[Emmy Hub][Data] QStash enqueue warning:', queueErr);
    }

    if (!process.env.QSTASH_TOKEN || process.env.NODE_ENV !== 'production') {
      fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: tx.id, serviceType: 'data' }),
      }).catch((e) => console.warn('[Emmy Hub][Data] Direct execution note:', e));
    }

    return NextResponse.json(
      {
        success: true,
        transactionId: tx.id,
        reference: tx.id,
        status: 'pending',
        amountChargedNaira: toNaira(amountChargedKobo),
        formattedAmount: formatNaira(amountChargedKobo),
        target: tx.target,
        network,
        planName,
      },
      { status: 202 }
    );
  } catch (err: unknown) {
    console.error('[Emmy Hub][Data Purchase API] Error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Failed to process data purchase' }, { status: 500 });
  }
}
