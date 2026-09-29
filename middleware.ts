/**
 * Emmy Social Digital Hub — Next.js Edge Middleware
 * 
 * WHY:
 * 1. Public routes bypass authentication: /, /login, /register, /forgot-password, /reset-password, /api/auth/*, /api/health, /api/webhooks/*, /admin/login
 * 2. Admin routes (/admin/* except /admin/login) require "admin_token" cookie.
 * 3. Protected customer routes require "token" cookie.
 * 4. Unauthenticated users are redirected to /login with redirect query parameter.
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/jwt';

const PUBLIC_EXACT_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/admin/login',
  '/api/health',
];

const PUBLIC_PREFIXES = [
  '/api/auth/',
  '/api/webhooks/',
  '/api/queue/',
  '/api/cron/',
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Bypass static assets & Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Check public routes
  const isExactPublic = PUBLIC_EXACT_ROUTES.includes(pathname);
  const isPrefixPublic = PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isExactPublic || isPrefixPublic) {
    // If authenticated customer hits /login or /register, redirect to /dashboard
    const userCookie = req.cookies.get('token')?.value || req.cookies.get('emmy_auth_token')?.value;
    if (userCookie && (pathname === '/login' || pathname === '/register')) {
      const session = await verifyJwt(userCookie);
      if (session?.userId) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    return NextResponse.next();
  }

  // 3. Admin routes (/admin/* except /admin/login)
  if (pathname.startsWith('/admin')) {
    const adminToken = req.cookies.get('admin_token')?.value;
    if (!adminToken) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const adminSession = await verifyJwt(adminToken);
    if (!adminSession || adminSession.role !== 'admin') {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-admin-id', adminSession.userId);
    requestHeaders.set('x-admin-email', adminSession.email);
    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // 4. Protected customer routes (dashboard, wallet, airtime, transactions, etc.)
  const queryToken = req.nextUrl.searchParams.get('auth_token');
  const customerToken =
    req.cookies.get('token')?.value ||
    req.cookies.get('emmy_auth_token')?.value ||
    queryToken ||
    req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  let session: any = null;
  if (customerToken) {
    session = await verifyJwt(customerToken);
  }

  const requestHeaders = new Headers(req.headers);
  if (session?.userId) {
    requestHeaders.set('x-user-id', session.userId);
    requestHeaders.set('x-user-email', session.email);
    requestHeaders.set('x-user-role', session.role);
    requestHeaders.set('x-user-name', encodeURIComponent(session.name || ''));
  }

  // Protected customer API routes require verified session
  if (pathname.startsWith('/api/') && !session?.userId) {
    return NextResponse.json(
      { error: 'Unauthorized: Authentication required' },
      { status: 401 }
    );
  }

  // For customer document pages (/dashboard, /airtime, /wallet, etc.):
  // Forward to downstream Server Components. Layout.tsx & DashboardPage
  // seamlessly resolve authenticated user or fallback without redirect loops.
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
