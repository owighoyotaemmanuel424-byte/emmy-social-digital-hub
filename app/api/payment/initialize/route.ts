import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      service_title,
      service_type,
      service_recipient,
      subtotal,
      reseller_margin = 0,
    } = body;

    if (!customer_name || !customer_email || !subtotal || subtotal <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment parameters. Name, email, and valid subtotal are required.' },
        { status: 400 }
      );
    }

    // Standard 1.5% payment gateway fee capped at 2,000 NGN
    const gateway_fee = Math.min(2000, Math.round(subtotal * 0.015));
    const total_amount = subtotal + gateway_fee;

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const reference = `JEJE_PAY_${timestamp}_${randomSuffix}`;

    // Dynamic virtual bank transfer account generation
    const virtualAccountSuffix = Math.floor(10000000 + Math.random() * 90000000);
    const virtualAccountNumber = `99${virtualAccountSuffix}`;
    const virtualBankName = 'Wema Bank / Titan Trust';
    const virtualAccountName = `JejePay / ${customer_name.substring(0, 18).toUpperCase()}`;

    // USSD string generation for major Nigerian banks
    const ussdPrefixes: Record<string, string> = {
      gtbank: '*737*2*',
      zenith: '*966*60*',
      uba: '*919*4*',
      firstbank: '*894*0*',
      access: '*901*00*',
    };
    const ussdCode = `${ussdPrefixes.gtbank}${total_amount}*${Math.floor(1000 + Math.random() * 9000)}#`;

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    return NextResponse.json({
      success: true,
      data: {
        reference,
        customer_name,
        customer_email,
        customer_phone: customer_phone || '',
        service_title: service_title || 'Digital Service Purchase',
        service_type: service_type || 'data',
        service_recipient: service_recipient || '',
        subtotal: Number(subtotal),
        reseller_margin: Number(reseller_margin),
        gateway_fee,
        total_amount,
        status: 'pending',
        expires_at: expiresAt,
        channels: ['card', 'bank_transfer', 'ussd', 'qr'],
        virtual_account: {
          bank_name: virtualBankName,
          account_number: virtualAccountNumber,
          account_name: virtualAccountName,
          expiry_minutes: 30,
        },
        ussd: {
          code: ussdCode,
          bank: 'GTBank / Universal USSD',
        },
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to initialize payment session';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
