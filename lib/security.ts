/**
 * Emmy Social Digital Hub — Security, Cryptography & Validation Utilities
 * 
 * WHY:
 * 1. Edge-compatible JWT: Uses `jose` for lightweight, standard-compliant JWT signing
 *    and verification compatible with Vercel Serverless and Edge runtimes.
 * 2. Password Hardening: Bcrypt with configurable salt rounds (default 12).
 * 3. Strict Input Boundaries: Comprehensive Zod schemas guarding every endpoint before
 *    any processing or database query runs.
 */

import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { z } from 'zod';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'emmy_social_digital_hub_jwt_super_secure_secret_key_2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

// ==========================================
// PASSWORD HASHING (BCRYPT)
// ==========================================

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ==========================================
// JWT AUTHENTICATION (JOSE)
// ==========================================

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

// ==========================================
// ZOD VALIDATION SCHEMAS
// ==========================================

export const nigerianPhoneRegex = /^(0|\+?234)[789][01]\d{8}$/;

export const RegisterSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address').toLowerCase(),
    phone: z.string().regex(nigerianPhoneRegex, 'Must be a valid Nigerian phone number (e.g. 08140008920)'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export const AirtimePurchaseSchema = z.object({
  phone: z.string().regex(nigerianPhoneRegex, 'Valid 11-digit Nigerian phone number required'),
  amount: z.number().int().min(50, 'Minimum airtime is ₦50').max(50000, 'Maximum airtime is ₦50,000'),
  service_id: z.string().or(z.number()),
  idempotency_key: z.string().min(8),
});

export const DataPurchaseSchema = z.object({
  phone: z.string().regex(nigerianPhoneRegex, 'Valid 11-digit Nigerian phone number required'),
  plan_id: z.string().min(1, 'Data plan ID is required'),
  service_id: z.string().or(z.number()),
  idempotency_key: z.string().min(8),
});

export const ElectricityVerifySchema = z.object({
  meter_number: z.string().min(6).max(20),
  service_id: z.string().or(z.number()),
});

export const ElectricityPurchaseSchema = z.object({
  meter_number: z.string().min(6).max(20),
  amount: z.number().int().min(500, 'Minimum electricity bill is ₦500').max(200000),
  meter_type: z.enum(['prepaid', 'postpaid']),
  phone: z.string().regex(nigerianPhoneRegex, 'Valid phone number required for token delivery'),
  service_id: z.string().or(z.number()),
  idempotency_key: z.string().min(8),
});

export const TvPurchaseSchema = z.object({
  smart_card_number: z.string().min(8).max(15),
  plan_id: z.string().min(1),
  service_id: z.string().or(z.number()),
  idempotency_key: z.string().min(8),
});

export const EducationPurchaseSchema = z.object({
  quantity: z.number().int().min(1).max(50),
  service_id: z.string().or(z.number()),
  idempotency_key: z.string().min(8),
});

export const PrintCardPurchaseSchema = z.object({
  quantity: z.number().int().min(1).max(100),
  denomination: z.number().int().positive(),
  service_id: z.string().or(z.number()),
  idempotency_key: z.string().min(8),
});

export const BulkSmsPurchaseSchema = z.object({
  recipients: z.array(z.string().regex(nigerianPhoneRegex)).min(1).max(1000),
  sender_id: z.string().min(3).max(11),
  message: z.string().min(1).max(1000),
  service_id: z.string().or(z.number()),
  idempotency_key: z.string().min(8),
});

export const VirtualNumberPurchaseSchema = z.object({
  category: z.enum(['usa', 'international']),
  server_key: z.enum(['usa_server_1', 'usa_server_2', 'international_server_1', 'international_server_2']).optional(),
  public_service_key: z.string().min(1),
  number_type: z.string().default('regular'),
  variation_id: z.string().optional(),
  area_codes: z.string().optional(),
  carrier: z.string().optional(),
  idempotency_key: z.string().min(8),
});

export const SupportTicketSchema = z.object({
  subject: z.string().min(4).max(120),
  message: z.string().min(10).max(2000),
  transaction_reference: z.string().optional(),
});
