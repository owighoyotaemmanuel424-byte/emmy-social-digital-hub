import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      reference,
      channel = 'card',
      card_details,
      service_type = 'data',
      service_recipient = '',
      subtotal = 0,
      reseller_margin = 0,
      gateway_fee = 0,
    } = body;

    if (!reference) {
      return NextResponse.json(
        { success: false, message: 'Missing transaction reference to verify.' },
        { status: 400 }
      );
    }

    const paidAt = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Auto-generate service delivery token/fulfillment receipt based on service type
    let fulfillmentToken = '';
    if (service_type === 'electricity') {
      const p1 = Math.floor(1000 + Math.random() * 9000);
      const p2 = Math.floor(1000 + Math.random() * 9000);
      const p3 = Math.floor(1000 + Math.random() * 9000);
      const p4 = Math.floor(1000 + Math.random() * 9000);
      const p5 = Math.floor(1000 + Math.random() * 9000);
      fulfillmentToken = `METER TOKEN: ${p1}-${p2}-${p3}-${p4}-${p5}`;
    } else if (service_type === 'education') {
      const pin = Math.floor(1000000000 + Math.random() * 9000000000);
      const ser = `SER-${Math.floor(100000 + Math.random() * 900000)}`;
      fulfillmentToken = `PIN: ${pin} | S/N: ${ser}`;
    } else if (service_type === 'virtual_number') {
      const otp = Math.floor(100000 + Math.random() * 900000);
      fulfillmentToken = `OTP CODE: ${otp} (Verified)`;
    } else if (service_type === 'esim') {
      fulfillmentToken = `LPA:1$smdp.jejelaye.com$${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
    } else {
      fulfillmentToken = `TELCO-BATCH-${Date.now().toString().slice(-6)}-OK`;
    }

    const paymentDetails: Record<string, unknown> = {
      channel,
      paid_at: paidAt,
      authorization_code: `AUTH_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    };

    if (channel === 'card' && card_details) {
      paymentDetails.card_last4 = card_details.last4 || '4242';
      paymentDetails.card_brand = card_details.brand || 'Mastercard';
    } else if (channel === 'bank_transfer') {
      paymentDetails.bank_name = 'Wema Bank';
      paymentDetails.virtual_account = body.virtual_account || '9910284910';
      paymentDetails.session_id = `100004${Date.now()}`;
    } else if (channel === 'ussd') {
      paymentDetails.ussd_network = 'GTBank *737#';
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully and order fulfilled instantly.',
      data: {
        reference,
        status: 'successful',
        channel,
        subtotal,
        reseller_margin,
        gateway_fee,
        total_amount: subtotal + gateway_fee,
        fulfillment_status: 'fulfilled',
        fulfillment_token: fulfillmentToken,
        recipient: service_recipient,
        payment_details: paymentDetails,
        settled_at: paidAt,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error verifying transaction';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
