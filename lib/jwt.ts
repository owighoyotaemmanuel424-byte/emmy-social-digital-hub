/**
 * Emmy Social Digital Hub — Lightweight Edge-Safe JWT Utilities
 * 
 * WHY:
 * 1. Separated from bcryptjs to prevent bundling Node.js native crypto into Edge Middleware.
 * 2. Uses `jose` exclusively for lightweight SignJWT and jwtVerify.
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'emmy_social_digital_hub_jwt_super_secure_secret_key_2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export interface EmmyAuthTokenPayload extends JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
}

export async function signJwt(payload: EmmyAuthTokenPayload, expiresIn: string = '7d'): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .setIssuer('emmy-social-digital-hub')
    .sign(JWT_SECRET);
}

export async function verifyJwt(token: string): Promise<EmmyAuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: 'emmy-social-digital-hub',
    });
    return payload as EmmyAuthTokenPayload;
  } catch {
    return null;
  }
}
