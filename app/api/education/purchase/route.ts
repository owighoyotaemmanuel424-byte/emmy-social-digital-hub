/**
 * Emmy Social Digital Hub — Education Scratch Card & Exam PINs API
 * 
 * WHY:
 * 1. Supports WAEC, NECO, JAMB, and NABTEB scratch cards / result checker PINs.
 * 2. Instant PIN & Serial number generation and retrieval on receipt page.
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
    const examBoard = String(body.examBoard || 'WAEC');
    const examName = String(body.examName || 'WAEC Result Checker PIN');
    const quantity = Math.max(1, Math.min(10, Number(body.quantity) || 1));
    const unitPrice = Number(body.unitPrice || 3450);
    const totalAmount = unitPrice * quantity;
    const recipientPhone = String(body.phone || user.phone).trim().replace(/[^0-9]/g, '');
    const idempotencyKey = String(
      body.idempotency_key || body.idempotencyKey || `idemp_edu_${crypto.randomUUID()}`
    );

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

    const amountChargedKobo = toKobo(totalAmount);
    const amountCostKobo = (amountChargedKobo * BigInt(97)) / BigInt(100); // 3% margin

    if (user.walletBalance < amountChargedKobo) {
      return NextResponse.json(
        {
          error: `Insufficient wallet balance. You have ${formatNaira(user.walletBalance)}, but this order requires ${formatNaira(amountChargedKobo)}. Please fund your wallet.`,
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
      serviceType: 'education',
      providerServiceId: examBoard.toLowerCase(),
      target: recipientPhone,
      amountCostKobo,
      amountChargedKobo,
      status: 'pending',
      metadata: {
        examBoard,
        examName,
        quantity,
        unitPrice,
        phone: recipientPhone,
        retailAmountNaira: totalAmount,
      },
    });

    // Enqueue to QStash worker
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const workerUrl = `${protocol}://${host}/api/queue/purchase`;

    try {
      await enqueuePurchaseJob(workerUrl, {
        transactionId: tx.id,
        serviceType: 'education',
      });
    } catch (queueErr) {
      console.warn('[Emmy Hub][Education] QStash enqueue warning:', queueErr);
    }

    if (!process.env.QSTASH_TOKEN || process.env.NODE_ENV !== 'production') {
      fetch(workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: tx.id, serviceType: 'education' }),
      }).catch((e) => console.warn('[Emmy Hub][Education] Direct execution note:', e));
    }

    return NextResponse.json(
      {
        success: true,
        transactionId: tx.id,
        reference: tx.id,
        status: 'pending',
        amountChargedNaira: toNaira(amountChargedKobo),
        formattedAmount: formatNaira(amountChargedKobo),
        target: recipientPhone,
        examName,
        quantity,
      },
      { status: 202 }
    );
  } catch (err: unknown) {
    console.error('[Emmy Hub][Education Purchase API] Error:', err);
    return NextResponse.json({ error: (err as Error).message || 'Failed to process exam card purchase' }, { status: 500 });
  }
}
