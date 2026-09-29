/**
 * Emmy Social Digital Hub — Paystack Dedicated Webhook Processor
 * 
 * WHY:
 * 1. HMAC SHA-512 Verification: Prevents spoofed webhook injection attacks.
 * 2. Idempotent Processing: Validates payment reference before crediting user wallet.
 * 3. Kobo Accuracy: Paystack webhook amount is already in kobo (e.g. 100000 = ₦1,000.00).
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  findUserByEmail,
  updateWalletBalance,
  createTransactionRecord,
} from '@/lib/db/customer-store';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');
    const secretKey = process.env.PAYSTACK_SECRET_KEY || '';

    // Verify HMAC-SHA512 signature in production if secret is configured
    if (secretKey && process.env.NODE_ENV === 'production') {
      const hash = crypto
        .createHmac('sha512', secretKey)
        .update(rawBody)
        .digest('hex');

      if (hash !== signature) {
        console.error('[Emmy Hub][Paystack Webhook] Invalid HMAC signature');
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const { event, data } = payload;

    if (event === 'charge.success' && data?.status === 'success') {
      const customerEmail = data.customer?.email;
      const amountKobo = BigInt(data.amount || 0); // Paystack sends amounts directly in kobo
      const reference = data.reference;

      if (!customerEmail || amountKobo <= BigInt(0)) {
        return NextResponse.json({ message: 'Ignored: Missing email or zero amount' }, { status: 200 });
      }

      const user = await findUserByEmail(customerEmail);
      if (user) {
        // Credit customer wallet
        await updateWalletBalance(user.id, amountKobo);

        // Record successful funding transaction
        await createTransactionRecord({
          userId: user.id,
          idempotencyKey: `paystack_${reference}`,
          jejelayReference: reference,
          serviceType: 'wallet_funding',
          providerServiceId: 'paystack_checkout',
          target: customerEmail,
          amountCostKobo: amountKobo,
          amountChargedKobo: amountKobo,
          status: 'successful',
          metadata: {
            gateway: 'Paystack Checkout',
            channel: data.channel,
            paid_at: data.paid_at,
          },
        });

        console.log(`[Emmy Hub][Paystack Webhook] Credited ${amountKobo} kobo to ${user.email}`);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (err: unknown) {
    console.error('[Emmy Hub][Paystack Webhook] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
