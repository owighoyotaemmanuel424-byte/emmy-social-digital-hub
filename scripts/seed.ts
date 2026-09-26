/**
 * Emmy Social Digital Hub — Database Seeding Script
 * 
 * WHY:
 * 1. Bootstrap Super Admin: Provisions the default administrator user for Emmy Hub
 *    with a securely hashed password.
 * 2. Service Catalog Pre-warming: Seeds the initial airtime & data service cache
 *    so the marketplace is immediately populated without requiring the first customer
 *    to trigger an upstream network round-trip.
 * 
 * Usage: npx tsx scripts/seed.ts
 */

import { prisma } from '../lib/db/client';
import { hashPassword } from '../lib/security';
import { toKobo, applyPercentageMarkup } from '../lib/money';
import { JejelayeClient } from '../lib/providers/jejelay/client';
import { JejeServiceItem } from '../lib/providers/jejelay/types';

async function main() {
  console.log('🚀 [Emmy Hub] Starting database seed...');

  // 1. Seed Default Admin User
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@emmydigitalhub.com';
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'EmmyHubAdmin2026!';
  const hashedPassword = await hashPassword(adminPassword);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'admin',
      name: 'Emmy Hub Super Admin',
      phone: '08140008920',
      emailVerified: true,
    },
    create: {
      email: adminEmail,
      name: 'Emmy Hub Super Admin',
      phone: '08140008920',
      passwordHash: hashedPassword,
      role: 'admin',
      walletBalance: toKobo(50000), // Initial ₦50,000 float
      emailVerified: true,
    },
  });

  console.log(`✅ [Emmy Hub] Admin user verified: ${admin.email} (Role: ${admin.role})`);

  // 2. Pre-populate Service Cache
  console.log('📡 [Emmy Hub] Syncing service catalog...');
  const client = new JejelayeClient();

  let services: JejeServiceItem[] = [];
  try {
    if (process.env.JEJELAYE_API_TOKEN) {
      services = await client.request<JejeServiceItem[]>('/services', {
        params: { type: 'airtime' },
      });
      console.log(`📡 [Emmy Hub] Fetched ${services.length} airtime services from JejeLaye API.`);
    }
  } catch (err) {
    console.warn('⚠️ [Emmy Hub] Could not reach live JejeLaye API during seed, using resilient default catalog:', (err as Error).message);
  }

  // Resilient defaults if API is not yet configured or offline during seed
  if (!services || services.length === 0) {
    services = [
      { id: '1', name: 'MTN VTU Airtime', type: 'airtime', network: 'MTN', selling_price: 100 },
      { id: '2', name: 'Airtel VTU Airtime', type: 'airtime', network: 'AIRTEL', selling_price: 100 },
      { id: '3', name: 'Glo VTU Airtime', type: 'airtime', network: 'GLO', selling_price: 100 },
      { id: '4', name: '9mobile VTU Airtime', type: 'airtime', network: '9MOBILE', selling_price: 100 },
    ];
  }

  for (const s of services) {
    const rawPrice = Number(s.selling_price || s.price || 100);
    const providerKobo = toKobo(rawPrice);
    // Apply 2% markup on airtime
    const ourKobo = applyPercentageMarkup(providerKobo, 2.0);

    await prisma.serviceCache.upsert({
      where: {
        type_providerServiceId: {
          type: 'airtime',
          providerServiceId: String(s.id),
        },
      },
      update: {
        name: s.name,
        network: s.network || 'GENERAL',
        providerPriceKobo: providerKobo,
        ourPriceKobo: ourKobo,
        rawJson: s as unknown as object,
        isActive: true,
        lastSyncedAt: new Date(),
      },
      create: {
        type: 'airtime',
        providerServiceId: String(s.id),
        name: s.name,
        network: s.network || 'GENERAL',
        providerPriceKobo: providerKobo,
        ourPriceKobo: ourKobo,
        rawJson: s as unknown as object,
        isActive: true,
        lastSyncedAt: new Date(),
      },
    });
  }

  console.log(`✅ [Emmy Hub] Cached ${services.length} services in database.`);
  console.log('🎉 [Emmy Hub] Seed process complete!');
}

main()
  .catch((e) => {
    console.error('❌ [Emmy Hub] Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
