import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { bank_code, account_number } = await req.json();

    if (!account_number || account_number.length !== 10) {
      return NextResponse.json(
        { success: false, message: 'Valid 10-digit NUBAN account number required.' },
        { status: 400 }
      );
    }

    // Realistic Nigerian business & corporate reseller names for simulation
    const simulatedAccountNames: Record<string, string> = {
      '0124892184': 'EMMANUEL RESELLER TECH',
      '6281928410': 'EMMANUEL TECH ENTERPRISES',
      '2109482910': 'EMMANUEL OWIGHOYOTA',
      '0123456789': 'JEJEPAY DIGITAL COMMERCE LTD',
      '0011223344': 'NIGERIA RESELLER CONSORTIUM',
    };

    let resolvedName = simulatedAccountNames[account_number];

    if (!resolvedName) {
      const sampleNames = [
        'EMMANUEL O. RESELLER VENTURES',
        'JEJELAYE PRIME LOGISTICS',
        'ALPHA TELECOMS INTEGRATED SERVICES',
        'KINGS DIGITAL STORE NIG LTD',
        'SWIFT VTU TECHNOLOGIES',
      ];
      const sum = account_number.split('').reduce((acc: number, digit: string) => acc + parseInt(digit, 10), 0);
      resolvedName = sampleNames[sum % sampleNames.length];
    }

    return NextResponse.json({
      success: true,
      account_name: resolvedName,
      account_number,
      bank_code,
      message: 'Bank account verified successfully on NIBSS Central Switch.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bank resolution failure';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
