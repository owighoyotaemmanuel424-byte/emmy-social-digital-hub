/**
 * Emmy Social Digital Hub — Electricity Bill Payment API
 * 
 * WHY:
 * 1. Prepaid & Postpaid Support: Handles all major Nigerian DisCos (IKEDC, EKEDC, AEDC, IBEDC, etc.).
 * 2. Token Generation: Records meter verification details and queues token generation.
 * 3. Atomic Debit & Idempotency: Protects against double charging.
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
    const disco = String(body.disco || 'IKEDC');
    const discoName = String(body.discoName || disco);
    const meterNumber = String(body.meterNumber || '').trim().replace(/[^0-9]/g, '');
    const meterType = String(body.meterType || 'prepaid');
    const customerName = String(body.customerName || 'Verified Customer');
    const phone = String(body.phone || user.phone).trim().replace(/[^0-9]/g, '');
    const amount = Number(body.amount);
    const idempotencyKey = String(
      body.idempotency_key || body.idempotencyKey || `idemp_meter_${crypto.randomUUID()}`
    );

    if (!meterNumber || meterNumber.length < 9) {
      return NextResponse.json({ error: 'Invalid meter number format.' }, { status: 400 });
    }

    if (isNaN(amount) || amount < 500 || amount > 100000) {
      return NextResponse.json(
        { error: 'Electricity recharge amount must be between ₦500 and ₦100,000.' },
        { status: 400 }
      );
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
    const amountCostKobo = (amountChargedKobo * BigInt(99)) / BigInt(100); // 1% commission

    if (user.walletBalance < amountChargedKobo) {
      return NextResponse.json(
        {
          error: `Insufficient wallet balance. You have ${formatNaira(user.walletBalance)}, but this bill requires ${formatNaira(amountChargedKobo)}. Please fund your wallet.`,
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
      serviceType: 'electricity',
      providerServiceId: disco,
      target: meterNumber,
      amountCostKobo,
      amountChargedKobo,
      status: 'pending',
      metadata: {
        disco,
        discoName,
        meterNumber,
        meterType,
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
        serviceType: 'electricity',
      });
    } catch (queueErr) {
      console.warn('[Emmy Hub][Electricity] QStash enqueue warning:', queueErr);
    }

    if (!process.env.QSTASH_TOKEN || process.env.NODE_ENV !== 'production') {
      fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: tx.id, serviceType: 'electricity' }),
      }).catch((e) => console.warn('[Emmy Hub][Electricity] Direct execution note:', e));
    }

    return NextResponse.json(
      {
        success: true,
        transactionId: tx.id,
        reference: tx.id,
        status: 'pending',
        amountChargedNaira: toNaira(amountChargedKobo),
        formattedAmount: formatNaira(amountChargedKobo),
        target: meterNumber,
        disco: discoName,
        customerName,
      },
      { status: 202 }
    );
  } catch (err: unknown) {
    console.error('[Emmy Hub][Electricity Purchase API] Error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Failed to process electricity bill' }, { status: 500 });
  }
}
