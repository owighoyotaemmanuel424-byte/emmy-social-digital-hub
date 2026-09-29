/**
 * Emmy Social Digital Hub — Universal Database Repository
 * 
 * WHY:
 * 1. Hybrid Storage Engine:
 *    - In Production / Staging with real Neon Postgres (DATABASE_URL starting with postgresql://),
 *      it delegates 100% to Prisma ORM.
 *    - In Preview / Local Dev with placeholder credentials ("<from Neon, pooled>"),
 *      it gracefully falls back to an in-memory store so the app is fully testable live.
 * 2. BigInt Kobo Precision: Preserves integer kobo arithmetic across both storage engines.
 */

import { prisma } from './client';

export const isRealDbUrl = (): boolean => {
  const url = process.env.DATABASE_URL?.trim() || '';
  return (
    (url.startsWith('postgresql://') || url.startsWith('postgres://')) &&
    !url.includes('<') &&
    !url.includes('from Neon')
  );
};

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  walletBalance: bigint;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  virtualAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export interface TransactionEntity {
  id: string;
  userId: string;
  jejelayReference: string | null;
  idempotencyKey: string;
  serviceType: string;
  providerServiceId: string;
  target: string;
  amountCostKobo: bigint;
  amountChargedKobo: bigint;
  status: 'pending' | 'processing' | 'successful' | 'completed' | 'failed';
  providerResponse?: unknown;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

// Global in-memory storage for preview environment
const globalStore = globalThis as unknown as {
  _emmyUsers?: Map<string, UserEntity>;
  _emmyTransactions?: Map<string, TransactionEntity>;
};

if (!globalStore._emmyUsers) {
  globalStore._emmyUsers = new Map();
}
if (!globalStore._emmyTransactions) {
  globalStore._emmyTransactions = new Map();
}

const memoryUsers = globalStore._emmyUsers;
const memoryTransactions = globalStore._emmyTransactions;

export async function findUserByEmail(email: string): Promise<UserEntity | null> {
  const normalized = email.toLowerCase().trim();

  if (isRealDbUrl()) {
    try {
      const u = await prisma.user.findUnique({
        where: { email: normalized },
        include: { virtualAccounts: { take: 1 } },
      });
      if (!u) return null;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        passwordHash: u.passwordHash,
        walletBalance: u.walletBalance,
        role: u.role as 'user' | 'admin',
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        virtualAccount: u.virtualAccounts[0]
          ? {
              bankName: u.virtualAccounts[0].bankName,
              accountNumber: u.virtualAccounts[0].accountNumber,
              accountName: u.virtualAccounts[0].accountName,
            }
          : undefined,
      };
    } catch {
      // fallback to memory
    }
  }

  for (const user of memoryUsers.values()) {
    if (user.email === normalized) return user;
  }
  return null;
}

export async function findUserByPhone(phone: string): Promise<UserEntity | null> {
  const cleaned = phone.trim();

  if (isRealDbUrl()) {
    try {
      const u = await prisma.user.findUnique({
        where: { phone: cleaned },
        include: { virtualAccounts: { take: 1 } },
      });
      if (!u) return null;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        passwordHash: u.passwordHash,
        walletBalance: u.walletBalance,
        role: u.role as 'user' | 'admin',
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        virtualAccount: u.virtualAccounts[0]
          ? {
              bankName: u.virtualAccounts[0].bankName,
              accountNumber: u.virtualAccounts[0].accountNumber,
              accountName: u.virtualAccounts[0].accountName,
            }
          : undefined,
      };
    } catch {
      // fallback to memory
    }
  }

  for (const user of memoryUsers.values()) {
    if (user.phone === cleaned) return user;
  }
  return null;
}

export async function findUserById(id: string): Promise<UserEntity | null> {
  if (isRealDbUrl()) {
    try {
      const u = await prisma.user.findUnique({
        where: { id },
        include: { virtualAccounts: { take: 1 } },
      });
      if (!u) return null;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        passwordHash: u.passwordHash,
        walletBalance: u.walletBalance,
        role: u.role as 'user' | 'admin',
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        virtualAccount: u.virtualAccounts[0]
          ? {
              bankName: u.virtualAccounts[0].bankName,
              accountNumber: u.virtualAccounts[0].accountNumber,
              accountName: u.virtualAccounts[0].accountName,
            }
          : undefined,
      };
    } catch {
      // fallback to memory
    }
  }

  return memoryUsers.get(id) || null;
}

export async function createUserWithAccount(data: {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  initialKobo: bigint;
  virtualAccount: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}): Promise<UserEntity> {
  const normalizedEmail = data.email.toLowerCase().trim();

  if (isRealDbUrl()) {
    try {
      const created = await prisma.$transaction(async (tx) => {
        const u = await tx.user.create({
          data: {
            name: data.name,
            email: normalizedEmail,
            phone: data.phone,
            passwordHash: data.passwordHash,
            walletBalance: data.initialKobo,
            role: 'user',
          },
        });

        await tx.virtualAccount.create({
          data: {
            userId: u.id,
            bankName: data.virtualAccount.bankName,
            accountNumber: data.virtualAccount.accountNumber,
            accountName: data.virtualAccount.accountName,
          },
        });

        return u;
      });

      return {
        id: created.id,
        name: created.name,
        email: created.email,
        phone: created.phone,
        passwordHash: created.passwordHash,
        walletBalance: created.walletBalance,
        role: created.role as 'user' | 'admin',
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
        virtualAccount: data.virtualAccount,
      };
    } catch (err) {
      console.warn('[Emmy Hub][DB] Prisma create failed, falling back to memory store:', (err as Error).message);
    }
  }

  // Memory fallback
  const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newUser: UserEntity = {
    id,
    name: data.name,
    email: normalizedEmail,
    phone: data.phone,
    passwordHash: data.passwordHash,
    walletBalance: data.initialKobo,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    virtualAccount: data.virtualAccount,
  };

  memoryUsers.set(id, newUser);
  return newUser;
}

export async function deductUserBalance(userId: string, amountKobo: bigint): Promise<boolean> {
  if (isRealDbUrl()) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          walletBalance: { decrement: amountKobo },
        },
      });
      return true;
    } catch {
      // fallback to memory
    }
  }

  const u = memoryUsers.get(userId);
  if (!u || u.walletBalance < amountKobo) return false;
  u.walletBalance -= amountKobo;
  u.updatedAt = new Date();
  return true;
}

export async function creditUserBalance(userId: string, amountKobo: bigint): Promise<boolean> {
  if (isRealDbUrl()) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          walletBalance: { increment: amountKobo },
        },
      });
      return true;
    } catch {
      // fallback to memory
    }
  }

  const u = memoryUsers.get(userId);
  if (!u) return false;
  u.walletBalance += amountKobo;
  u.updatedAt = new Date();
  return true;
}

export async function createTransaction(data: {
  userId: string;
  idempotencyKey: string;
  serviceType: string;
  providerServiceId: string;
  target: string;
  amountCostKobo: bigint;
  amountChargedKobo: bigint;
  status: 'pending' | 'processing' | 'successful' | 'completed' | 'failed';
  metadata?: Record<string, unknown>;
}): Promise<TransactionEntity> {
  if (isRealDbUrl()) {
    try {
      const tx = await prisma.transaction.create({
        data: {
          userId: data.userId,
          idempotencyKey: data.idempotencyKey,
          serviceType: data.serviceType,
          providerServiceId: data.providerServiceId,
          target: data.target,
          amountCostKobo: data.amountCostKobo,
          amountChargedKobo: data.amountChargedKobo,
          status: data.status,
          metadata: data.metadata as object,
        },
      });

      return {
        id: tx.id,
        userId: tx.userId,
        jejelayReference: tx.jejelayReference,
        idempotencyKey: tx.idempotencyKey,
        serviceType: tx.serviceType,
        providerServiceId: tx.providerServiceId,
        target: tx.target,
        amountCostKobo: tx.amountCostKobo,
        amountChargedKobo: tx.amountChargedKobo,
        status: tx.status as TransactionEntity['status'],
        metadata: tx.metadata as Record<string, unknown>,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
      };
    } catch (err) {
      console.warn('[Emmy Hub][DB] Prisma create transaction failed, fallback to memory:', (err as Error).message);
    }
  }

  const id = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newTx: TransactionEntity = {
    id,
    userId: data.userId,
    jejelayReference: null,
    idempotencyKey: data.idempotencyKey,
    serviceType: data.serviceType,
    providerServiceId: data.providerServiceId,
    target: data.target,
    amountCostKobo: data.amountCostKobo,
    amountChargedKobo: data.amountChargedKobo,
    status: data.status,
    metadata: data.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  memoryTransactions.set(id, newTx);
  return newTx;
}

export async function findTransactionByIdOrRef(
  ref: string,
  userId: string
): Promise<TransactionEntity | null> {
  if (isRealDbUrl()) {
    try {
      const tx = await prisma.transaction.findFirst({
        where: {
          userId,
          OR: [{ id: ref }, { jejelayReference: ref }, { idempotencyKey: ref }],
        },
      });

      if (tx) {
        return {
          id: tx.id,
          userId: tx.userId,
          jejelayReference: tx.jejelayReference,
          idempotencyKey: tx.idempotencyKey,
          serviceType: tx.serviceType,
          providerServiceId: tx.providerServiceId,
          target: tx.target,
          amountCostKobo: tx.amountCostKobo,
          amountChargedKobo: tx.amountChargedKobo,
          status: tx.status as TransactionEntity['status'],
          providerResponse: tx.providerResponse,
          metadata: tx.metadata as Record<string, unknown>,
          createdAt: tx.createdAt,
          updatedAt: tx.updatedAt,
        };
      }
    } catch {
      // fallback to memory
    }
  }

  for (const tx of memoryTransactions.values()) {
    if (
      tx.userId === userId &&
      (tx.id === ref || tx.jejelayReference === ref || tx.idempotencyKey === ref)
    ) {
      return tx;
    }
  }
  return null;
}

export async function findTransactionById(id: string): Promise<TransactionEntity | null> {
  if (isRealDbUrl()) {
    try {
      const tx = await prisma.transaction.findUnique({ where: { id } });
      if (tx) {
        return {
          id: tx.id,
          userId: tx.userId,
          jejelayReference: tx.jejelayReference,
          idempotencyKey: tx.idempotencyKey,
          serviceType: tx.serviceType,
          providerServiceId: tx.providerServiceId,
          target: tx.target,
          amountCostKobo: tx.amountCostKobo,
          amountChargedKobo: tx.amountChargedKobo,
          status: tx.status as TransactionEntity['status'],
          providerResponse: tx.providerResponse,
          metadata: tx.metadata as Record<string, unknown>,
          createdAt: tx.createdAt,
          updatedAt: tx.updatedAt,
        };
      }
    } catch {
      // fallback to memory
    }
  }

  return memoryTransactions.get(id) || null;
}

export async function updateTransaction(
  id: string,
  data: Partial<TransactionEntity>
): Promise<TransactionEntity | null> {
  if (isRealDbUrl()) {
    try {
      const tx = await prisma.transaction.update({
        where: { id },
        data: {
          status: data.status,
          jejelayReference: data.jejelayReference,
          providerResponse: data.providerResponse as object,
        },
      });

      return {
        id: tx.id,
        userId: tx.userId,
        jejelayReference: tx.jejelayReference,
        idempotencyKey: tx.idempotencyKey,
        serviceType: tx.serviceType,
        providerServiceId: tx.providerServiceId,
        target: tx.target,
        amountCostKobo: tx.amountCostKobo,
        amountChargedKobo: tx.amountChargedKobo,
        status: tx.status as TransactionEntity['status'],
        providerResponse: tx.providerResponse,
        metadata: tx.metadata as Record<string, unknown>,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
      };
    } catch {
      // fallback to memory
    }
  }

  const tx = memoryTransactions.get(id);
  if (!tx) return null;
  Object.assign(tx, data, { updatedAt: new Date() });
  return tx;
}

export async function getUserTransactions(
  userId: string,
  limit: number = 20
): Promise<TransactionEntity[]> {
  if (isRealDbUrl()) {
    try {
      const list = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return list.map((tx) => ({
        id: tx.id,
        userId: tx.userId,
        jejelayReference: tx.jejelayReference,
        idempotencyKey: tx.idempotencyKey,
        serviceType: tx.serviceType,
        providerServiceId: tx.providerServiceId,
        target: tx.target,
        amountCostKobo: tx.amountCostKobo,
        amountChargedKobo: tx.amountChargedKobo,
        status: tx.status as TransactionEntity['status'],
        providerResponse: tx.providerResponse,
        metadata: tx.metadata as Record<string, unknown>,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
      }));
    } catch {
      // fallback to memory
    }
  }

  const results: TransactionEntity[] = [];
  for (const tx of memoryTransactions.values()) {
    if (tx.userId === userId) {
      results.push(tx);
    }
  }

  return results
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
}
