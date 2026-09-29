/**
 * Emmy Social Digital Hub — Customer Logout API
 * 
 * WHY:
 * Clears the customer authentication session cookies.
 */

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true, message: 'Logged out successfully' });

  // Expire cookies immediately
  response.cookies.set('token', '', {
    path: '/',
    maxAge: 0,
  });
  response.cookies.set('emmy_auth_token', '', {
    path: '/',
    maxAge: 0,
  });

  return response;
}
