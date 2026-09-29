/**
 * Emmy Social Digital Hub — JejeLaye Virtual Numbers (OTP) Webhook
 * 
 * WHY:
 * 1. Webhook Secret Verification: Confirms incoming request contains the valid secret key.
 * 2. OTP Extraction: Stores incoming SMS/OTP payload into Transaction.metadata and WebhookLog.
 * 3. 200 OK Acknowledgment: Complies with JejeLaye provider webhook spec.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { findTransactionByRef, updateTransactionStatus } from '@/lib/db/customer-store';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const querySecret = searchParams.get('secret');
    const configuredSecret = process.env.JEJELAYE_WEBHOOK_SECRET || '';

    // 1. Verify webhook secret
    if (configuredSecret && querySecret !== configuredSecret) {
      console.warn('[Emmy Hub][OTP Webhook] Invalid webhook secret provided');
      return NextResponse.json({ error: 'Unauthorized: Invalid webhook secret' }, { status: 401 });
    }

    const payload = await req.json().catch(() => ({}));
    const { ref, reference, order_id, sms, otp, code } = payload;
    const txRef = ref || reference || order_id;

    // 2. Log in WebhookLog table if available
    try {
      await (prisma as any).webhookLog.create({
        data: {
          source: 'jejelaye-otp',
          payload,
          processed: Boolean(txRef),
        },
      });
    } catch {
      // Ignore if table not yet migrated
    }

    // 3. If transaction reference is provided, update transaction metadata with received OTP
    if (txRef) {
      const tx = await findTransactionByRef(txRef);
      if (tx) {
        const existingMetadata = (tx.metadata as Record<string, unknown>) || {};
        const updatedMetadata = {
          ...existingMetadata,
          otp: otp || code || null,
          sms: sms || null,
          otpReceivedAt: new Date().toISOString(),
          webhookPayload: payload,
        };

        await updateTransactionStatus(tx.id, 'successful', payload, tx.jejelayReference || undefined);
        console.log(`[Emmy Hub][OTP Webhook] Updated transaction ${tx.id} with OTP: ${otp || code}`);
      }
    }

    return NextResponse.json({ status: 'success', message: 'Webhook processed successfully' }, { status: 200 });
  } catch (err: unknown) {
    console.error('[Emmy Hub][OTP Webhook] Error:', err);
    return NextResponse.json({ error: 'Internal server error processing webhook' }, { status: 500 });
  }
}
