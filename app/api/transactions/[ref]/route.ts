/**
 * Emmy Social Digital Hub — Single Transaction Receipt API
 * 
 * WHY:
 * 1. Strict Internal DB Isolation: Reads solely from our database ledger (never calls upstream provider directly).
 * 2. Ownership Verification: Ensures customers can only query receipts for their own transactions.
 * 3. Sanitized Provider Response: Strips any upstream bearer tokens or sensitive secrets before returning.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';
import { findTransactionByRef, findUserById } from '@/lib/db/customer-store';
import { formatNaira, toNaira } from '@/lib/money';

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ ref: string }> }
) {
  try {
    const params = await props.params;
    const ref = params.ref;

    if (!ref) {
      return NextResponse.json({ error: 'Missing transaction reference' }, { status: 400 });
    }

    // Authenticate user
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
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Read exclusively from our database
    const tx = await findTransactionByRef(ref);
    if (!tx) {
      return NextResponse.json({ error: 'Transaction record not found' }, { status: 404 });
    }

    // Ownership check
    if (tx.userId !== userId && payload?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to view this receipt' },
        { status: 403 }
      );
    }

    const customer = await findUserById(tx.userId);

    // Sanitize provider response: scrub internal provider credentials while preserving user tokens/PINs
    const sanitizedProviderResponse = tx.providerResponse
      ? JSON.parse(
          JSON.stringify(tx.providerResponse, (key, value) => {
            if (key !== 'token' && /authorization|secret|password|bearer|api_key/i.test(key)) {
              return '[REDACTED]';
            }
            return value;
          })
        )
      : null;

    return NextResponse.json({
      success: true,
      transaction: {
        id: tx.id,
        reference: tx.id,
        jejelayReference: tx.jejelayReference,
        idempotencyKey: tx.idempotencyKey,
        serviceType: tx.serviceType,
        providerServiceId: tx.providerServiceId,
        target: tx.target,
        amountChargedKobo: tx.amountChargedKobo.toString(),
        amountChargedNaira: toNaira(tx.amountChargedKobo),
        formattedAmount: formatNaira(tx.amountChargedKobo),
        status: tx.status,
        metadata: tx.metadata,
        providerResponse: sanitizedProviderResponse,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
        customer: {
          name: customer?.name || 'Customer',
          email: customer?.email || '',
          phone: customer?.phone || '',
        },
      },
    });
  } catch (err: unknown) {
    console.error('[Emmy Hub][Transaction API] Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve transaction' }, { status: 500 });
  }
}
