# Emmy Social Digital Hub (Emmy Hub)
> **"Your One-Stop Digital Service Hub"**  
> Production-Ready Value-Added Telecom (VTU) & Digital Services Reseller Platform  
> Sole Provider: **JejeLaye API v1**  
> Stack: **Next.js 15+ App Router • Neon Postgres (Prisma) • Vercel Serverless • Upstash Redis & QStash**

---

## 1. System Architecture & Core Stack

```
               [ Nigerian Consumer / Reseller Partner ]
                                  │
                                  ▼
      ┌───────────────────────────────────────────────────────┐
      │        Emmy Social Digital Hub (Next.js 15)           │
      │        Edge & Serverless Routes on Vercel              │
      └───────┬───────────────────────────────┬───────────────┘
              │ (Integer Kobo Ledger)          │ (Sliding Window 200 req/min)
              ▼                               ▼
  ┌───────────────────────┐       ┌───────────────────────┐
  │ Neon Postgres         │       │ Upstash Redis         │
  │ (PgBouncer Pooling)   │       │ (Rate Limiter)        │
  └───────────────────────┘       └───────────────────────┘
              ▲
              │ (Async Purchase Queue)
              ▼
  ┌───────────────────────┐       ┌───────────────────────┐
  │ QStash (Upstash)      │──────▶│ JejeLaye API v1       │
  │ (Worker /queue/*)     │◀──────│ https://jejelayegct...│
  └───────────────────────┘       └───────────────────────┘
```

* **Framework:** Next.js 15+ (App Router) + TypeScript + Node 20 LTS
* **Database:** Neon Postgres via Prisma ORM (`binaryTargets = ["native", "rhel-openssl-3.0.x"]`, with PgBouncer connection pooling)
* **Queue:** Upstash QStash — eliminates long-lived worker servers for resilient serverless dispatching (maxDuration = 60s)
* **Rate Limiting:** Upstash Redis with `@upstash/ratelimit` sliding window (200 requests/minute to match upstream compliance)
* **Financial Ledger:** All monetary values stored and computed strictly as **BigInt Kobo** (₦1.00 = 100 kobo). Never floating-point math.
* **Security:** Bcrypt password hashing (12 rounds) + Edge-compatible JWT authentication in HttpOnly Secure cookies + Zod schema validation.

---

## 2. Upstream Provider Integration (JejeLaye API v1)

All service fulfillment is powered exclusively by the **JejeLaye API v1** (`https://jejelayegct.com.ng/api/v1`):

1. **Authentication & Discovery (`/auth`, `/services`, `/categories`):** Bearer token authentication, real-time float wallet checking.
2. **Account Management (`/profile`, `/auth/password`):** Profile queries, password changes, email verification.
3. **Wallet & Virtual Accounts (`/wallet`, `/wallet/virtual-account`):** Dedicated NIBSS automated bank account numbers for instant auto-credit wallet deposits.
4. **Core VTU & Utility Services (`/services/{id}/purchase`):**
   * **Airtime:** Instant VTU recharge for MTN, Airtel, Glo, and 9mobile.
   * **Data:** Direct SME, Gifting, and Corporate data plans.
   * **Electricity:** Meter pre-verification (`/verify`) and prepaid token generation.
   * **Cable TV:** DStv, GOtv, and StarTimes smart card renewal.
   * **Exam PINs:** WAEC, NECO, and JAMB result checkers with instant serial delivery.
   * **Recharge Card Printing (`print_card`):** Bulk voucher PIN generation.
   * **Bulk SMS:** Custom SenderID transactional routing.
5. **Online Store (`/services?type=ecommerce`):** Physical products with courier delivery address handling.
6. **Marketplace (`/marketplace`):** Digital items and aged social media logs with instant credential delivery.
7. **Gift Cards Trading (`/gift-cards/*`):** Amazon, Steam, and iTunes trades via multipart FormData with direct bank withdrawal.
8. **Virtual Phone Numbers (`/virtual-numbers/*`):** Route selector (USA Server 1/2 and International Server 1/2) for disposable SMS OTP reception.
9. **Buy Email (`/email-verification/*`):** Disposable email mailboxes for sign-ups.
10. **Global Travel eSIM (`/esim/*`):** 150+ country roaming data packages with instant QR code delivery.
11. **Support Desk (`/support-tickets`):** Ticket management linked to transaction references.
12. **Webhooks (`/api/webhooks/*`):** Automated incoming OTP notifications with signature checks.

---

## 3. Environment Variables Setup (`.env`)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description |
| :--- | :--- |
| `JEJELAYE_API_TOKEN` | Bearer token obtained from JejeLaye account login |
| `JEJELAYE_BASE_URL` | `https://jejelayegct.com.ng/api/v1` |
| `DATABASE_URL` | Neon Postgres pooled connection URL (`?sslmode=require&pgbouncer=true`) |
| `DIRECT_URL` | Neon Postgres direct connection URL (for Prisma migrations) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL for distributed rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST authentication token |
| `QSTASH_TOKEN` | Upstash QStash Bearer token for async job queue |
| `QSTASH_CURRENT_SIGNING_KEY` | Current signing key to verify QStash incoming callbacks |
| `QSTASH_NEXT_SIGNING_KEY` | Next signing key for rotation |
| `JWT_SECRET` | 32+ character random string for signing user session cookies |
| `CRON_SECRET` | Bearer secret protecting Vercel Cron endpoints |

---

## 4. Database Setup & Seeding

```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. Deploy database migrations to Neon Postgres
npm run prisma:migrate

# 3. Seed initial Super Admin and Airtime Service Catalog
npm run seed
```

---

## 5. Development & Production Run

```bash
# Start local development server on port 3000
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

---

## 6. Pre-Flight Health Check (`/api/health`)

Verify all subsystem connections (Neon Postgres, Upstash Redis, and JejeLaye Float):

```bash
curl -X GET https://your-domain.com/api/health
```

Expected JSON response:
```json
{
  "status": "healthy",
  "db": true,
  "redis": true,
  "jejelay": true,
  "float_balance_kobo": "245000000",
  "float_balance_naira": 2450000,
  "timestamp": "2026-09-26T17:00:00.000Z"
}
```

---

## 7. Phase Roadmap

- [x] **Phase 1A: Foundation** — Global branding, JejeLaye client with 429 backoff, types, Prisma schema, money helpers, security & JWT, Upstash rate limiting, QStash queue client, seed script, health diagnostics, layout, and landing page.
- [ ] **Phase 1B: First Revenue Loop** — Auth routes, internal wallet ledger, service cache cron refresh, airtime purchase via QStash worker, and transaction receipt tracker.
- [ ] **Phase 2: Core Utility Services** — Data, Electricity with verify, Cable TV, Education PINs, and Recharge Card generator.
- [ ] **Phase 3: Digital Trading** — Gift cards, Virtual OTP phone numbers with webhook receiver, and Paystack card funding.
- [ ] **Phase 4: Global Travel & Store** — Travel eSIM QR codes, marketplace accounts, physical store, and bulk SMS.
- [ ] **Phase 5: Super Admin Console** — Real-time float monitoring, automated reconciliation, and dynamic markup engine.
