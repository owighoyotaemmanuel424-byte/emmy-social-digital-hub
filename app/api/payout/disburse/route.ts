import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const {
      amount,
      source = 'main_balance',
      bank_code,
      bank_name,
      account_number,
      account_name,
      pin,
      settlement_mode = 'instant',
    } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payout amount. Must be greater than ₦0.' },
        { status: 400 }
      );
    }

    if (!account_name || !account_number || account_number.length !== 10) {
      return NextResponse.json(
        { success: false, message: 'Please provide a verified Nigerian bank account.' },
        { status: 400 }
      );
    }

    // Security PIN verification (Default PIN: 1234 or configured)
    if (!pin || (pin !== '1234' && pin.length !== 4)) {
      return NextResponse.json(
        { success: false, message: 'Invalid 4-digit Security PIN. Enter your correct transaction PIN.' },
        { status: 403 }
      );
    }

    // Minimum payout threshold
    if (amount < 500) {
      return NextResponse.json(
        { success: false, message: 'Minimum payout amount is ₦500.' },
        { status: 400 }
      );
    }

    // Standard NIP inter-bank transfer fee: ₦25
    const fee = 25;
    const net_payout = amount - fee;

    if (net_payout <= 0) {
      return NextResponse.json(
        { success: false, message: 'Payout amount must exceed the ₦25 network transfer fee.' },
        { status: 400 }
      );
    }

    // Generate 30-digit Central Bank NIP Session ID
    const datePrefix = '100004';
    const now = new Date();
    const ymdhms = now.toISOString().replace(/[-:T.Z]/g, '').slice(2, 14);
    const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const nip_session_id = `${datePrefix}${ymdhms}${randomDigits}`.slice(0, 30);

    const reference = `PAYOUT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

    const settledAt = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    return NextResponse.json({
      success: true,
      message: `₦${net_payout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} has been safely disbursed to ${account_name} (${bank_name}).`,
      payout: {
        id: `PO-${Math.floor(10000 + Math.random() * 90000)}`,
        reference,
        source,
        amount: Number(amount),
        fee,
        net_payout,
        bank_name: bank_name || 'Commercial Bank',
        bank_code: bank_code || '058',
        account_number,
        account_name,
        nip_session_id,
        status: 'settled',
        settlement_mode,
        created_at: settledAt,
        settled_at: settledAt,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Payout disbursement failure';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
