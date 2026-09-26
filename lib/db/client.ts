/**
 * Emmy Social Digital Hub — Prisma Database Client Singleton
 * 
 * WHY:
 * 1. Connection Pool Optimization: Neon PgBouncer handles connection pooling via DATABASE_URL.
 * 2. Next.js Hot Reloading: Attaching the client to globalThis in development prevents
 *    leaking multiple database connection pools across fast-refreshes.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
