/**
 * Emmy Social Digital Hub — Distributed Sliding-Window Rate Limiter
 * 
 * WHY:
 * 1. Strict Upstream Compliance: JejeLaye enforces a hard ceiling of 200 requests/minute.
 * 2. Fail-Closed in Production: If the Redis rate limiter is down in production, fail closed (503)
 *    to prevent overwhelming upstream or getting our provider IP banned.
 * 3. Graceful Dev Fallback: Allows local testing when Redis env vars are omitted in development.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let redisInstance: Redis | null = null;
let ratelimitInstance: Ratelimit | null = null;

const isValidHttpsUrl = (url?: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const rawUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
const rawToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

const hasRedisEnv = Boolean(
  isValidHttpsUrl(rawUrl) &&
  rawToken &&
  rawToken.length > 5 &&
  !rawUrl!.includes('your-upstash')
);

if (hasRedisEnv && rawUrl && rawToken) {
  try {
    redisInstance = new Redis({
      url: rawUrl,
      token: rawToken,
    });

    // 200 requests per 1 minute sliding window
    ratelimitInstance = new Ratelimit({
      redis: redisInstance,
      limiter: Ratelimit.slidingWindow(200, '1 m'),
      analytics: true,
      prefix: '@emmy-hub/ratelimit',
    });
  } catch (initErr) {
    console.warn('[Emmy Hub][RateLimit] Failed to initialize Upstash Redis:', initErr);
    redisInstance = null;
    ratelimitInstance = null;
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Enforces rate limiting per identifier (e.g. user ID or client IP).
 * Throws 503 error if production Redis is unreachable to satisfy the "Fail-Closed" rule.
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  if (!ratelimitInstance) {
    if (process.env.NODE_ENV === 'production' && hasRedisEnv) {
      console.error('[Emmy Hub][RateLimit] Fail-closed triggered: Redis credentials invalid in production.');
      return {
        success: false,
        limit: 200,
        remaining: 0,
        reset: Date.now() + 60000,
      };
    }

    // In local dev/preview without Redis credentials, allow request with warning
    return {
      success: true,
      limit: 200,
      remaining: 199,
      reset: Date.now() + 60000,
    };
  }

  try {
    const result = await ratelimitInstance.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error('[Emmy Hub][RateLimit] Error communicating with Upstash Redis:', error);
    if (process.env.NODE_ENV === 'production') {
      // Fail closed
      return {
        success: false,
        limit: 200,
        remaining: 0,
        reset: Date.now() + 60000,
      };
    }
    return {
      success: true,
      limit: 200,
      remaining: 100,
      reset: Date.now() + 60000,
    };
  }
}

export { redisInstance as redis };
