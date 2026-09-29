/**
 * Emmy Social Digital Hub — Customer Registration API
 * 
 * WHY:
 * 1. Zod Validation: Enforces email, phone, and password schema.
 * 2. Frictionless Onboarding: Seamlessly registers or updates existing account so registration never fails.
 * 3. Provider Sync: Calls JejeLaye /auth/register asynchronously without blocking customer onboarding.
 * 4. Auth Cookie: Signs JWT and issues HttpOnly Secure SameSite=None Partitioned cookie.
 */

import { NextRequest, NextResponse } from 'next/server';
import { RegisterSchema, hashPassword } from '@/lib/security';
import { signJwt } from '@/lib/jwt';
import { findUserByEmail, createUser } from '@/lib/db/customer-store';
import { JejelayeClient } from '@/lib/providers/jejelaye/client';
import { toKobo } from '@/lib/money';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod validation
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || 'Invalid registration data';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { name, email, phone, password } = parsed.data;
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    // 2. Hash password with bcrypt
    const passwordHash = await hashPassword(password);

    // 3. Find or create user
    let user = await findUserByEmail(cleanEmail);
    if (!user) {
      user = await createUser({
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        passwordHash,
        initialBalanceKobo: toKobo(50000), // ₦50,000 welcome credit
        role: 'user',
      });
    } else {
      user.name = name.trim();
      user.phone = cleanPhone;
      user.passwordHash = passwordHash;
    }

    // 4. Sign JWT session token
    const token = await signJwt({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // 5. Register on JejeLaye provider side in background (failures logged without blocking)
    try {
      const jejelayeClient = new JejelayeClient();
      jejelayeClient
        .request('/auth/register', {
          method: 'POST',
          body: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: password,
            password_confirmation: password,
          },
        })
        .then((res: any) => {
          if (res?.alreadyExists) {
            console.log(`[Emmy Hub][Provider Sync] User account ${user.email} verified on upstream provider.`);
          } else {
            console.log(`[Emmy Hub][Provider Sync] User account registered on provider for user ${user.id}.`);
          }
        })
        .catch((err) => {
          const errMsg = (err as Error).message || '';
          if (/already been taken|already exists/i.test(errMsg)) {
            console.log(`[Emmy Hub][Provider Sync] User account ${user.email} already exists on upstream provider.`);
          } else {
            console.log(`[Emmy Hub][Provider Sync] Provider registration note: ${errMsg}`);
          }
        });
    } catch {
      // Non-blocking provider sync
    }

    const isHttps =
      process.env.NODE_ENV === 'production' ||
      req.headers.get('x-forwarded-proto') === 'https' ||
      (req.headers.get('host') || '').includes('run.app');

    const cookieOptions = {
      httpOnly: true,
      secure: isHttps,
      sameSite: (isHttps ? 'none' : 'lax') as 'none' | 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    // 6. Build response and set HttpOnly Secure cookies
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account ready! Welcome to Emmy Social Digital Hub.',
        token,
        redirectUrl: '/dashboard',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          walletBalance: user.walletBalance.toString(),
        },
      },
      { status: 201 }
    );

    // Set cookie "token" + "emmy_auth_token" as compatibility alias
    response.cookies.set('token', token, cookieOptions);
    response.cookies.set('emmy_auth_token', token, cookieOptions);

    if (isHttps) {
      response.headers.append(
        'Set-Cookie',
        `token=${token}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=None; Partitioned`
      );
      response.headers.append(
        'Set-Cookie',
        `emmy_auth_token=${token}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=None; Partitioned`
      );
    }

    return response;
  } catch (err: unknown) {
    console.error('[Emmy Hub][Register API] Error:', err);
    return NextResponse.json(
      { error: (err as Error).message || 'Failed to complete registration' },
      { status: 500 }
    );
  }
}
