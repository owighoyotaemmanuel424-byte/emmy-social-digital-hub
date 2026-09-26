/**
 * Emmy Social Digital Hub — JejeLaye API v1 Resilient HTTP Client
 * 
 * WHY:
 * 1. Sole Gateway: All service fulfillment passes through this wrapper.
 * 2. Rate Limiting Safeguard: Enforces 429 backoff (60s -> 120s -> 240s) up to 3 retries.
 * 3. Security: Scrub headers before logging — the bearer API token must NEVER appear in logs.
 * 4. Error Mapping: Differentiates 401, 402 (Insufficient Float), 422, and 5xx so callers
 *    can make deterministic decisions (e.g. abort user debit on 402).
 */

import { JejeApiResponse } from './types';

export class JejelayeError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[] | string>,
    public rawResponse?: unknown
  ) {
    super(message);
    this.name = 'JejelayeError';
  }
}

export class JejelayeClient {
  private baseUrl: string;
  private token: string;
  private maxRetries = 3;

  constructor(token?: string, baseUrl?: string) {
    this.token = token || process.env.JEJELAYE_API_TOKEN || '';
    this.baseUrl = (baseUrl || process.env.JEJELAYE_BASE_URL || 'https://jejelayegct.com.ng/api/v1').replace(/\/$/, '');

    if (!this.token && process.env.NODE_ENV === 'production') {
      console.warn('[Emmy Hub] Warning: JEJELAYE_API_TOKEN is not configured in environment variables.');
    }
  }

  /**
   * Safe Logger that automatically scrubs sensitive credentials from logs.
   */
  private log(message: string, data?: unknown) {
    const sanitized = JSON.parse(
      JSON.stringify(data || {}, (key, value) => {
        if (/token|authorization|secret|password/i.test(key)) {
          return '[REDACTED]';
        }
        return value;
      })
    );
    console.log(`[Emmy Hub][JejeLaye] ${message}`, Object.keys(sanitized).length ? sanitized : '');
  }

  /**
   * Sleep helper for exponential backoff.
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Core request dispatcher with retry and error transformation.
   */
  public async request<T = unknown>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
      body?: unknown;
      params?: Record<string, string | number | undefined>;
      headers?: Record<string, string>;
      isFormData?: boolean;
    } = {}
  ): Promise<T> {
    const { method = 'GET', body, params, headers = {}, isFormData = false } = options;

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${cleanEndpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          url.searchParams.append(key, String(val));
        }
      });
    }

    let retryCount = 0;
    let backoffDelaySeconds = 60; // Upstream rate-limit reset window is 60s

    while (retryCount <= this.maxRetries) {
      const requestHeaders: Record<string, string> = {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
        ...headers,
      };

      if (!isFormData) {
        requestHeaders['Content-Type'] = 'application/json';
      }

      this.log(`Outgoing ${method} ${url.pathname}`, { query: params, hasBody: Boolean(body) });

      let response: Response;
      try {
        response = await fetch(url.toString(), {
          method,
          headers: requestHeaders,
          body: body ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
          cache: 'no-store',
        });
      } catch (networkError: unknown) {
        this.log(`Network failure connecting to JejeLaye: ${(networkError as Error).message}`);
        if (retryCount < this.maxRetries) {
          retryCount++;
          await this.delay(2000 * retryCount);
          continue;
        }
        throw new JejelayeError('Network connection to provider failed after retries', 503);
      }

      // Handle 429 Rate Limiting with exponential backoff (60s -> 120s -> 240s)
      if (response.status === 429) {
        if (retryCount < this.maxRetries) {
          retryCount++;
          const waitMs = backoffDelaySeconds * 1000;
          this.log(`429 Rate Limit Hit. Waiting ${backoffDelaySeconds}s before retry ${retryCount}/${this.maxRetries}...`);
          await this.delay(waitMs);
          backoffDelaySeconds *= 2; // 60s -> 120s -> 240s
          continue;
        } else {
          throw new JejelayeError('JejeLaye rate limit (200 req/min) exceeded after maximum retries', 429);
        }
      }

      // Parse payload
      let parsedJson: JejeApiResponse<T>;
      try {
        parsedJson = await response.json();
      } catch {
        const text = await response.text();
        this.log(`Failed to parse JSON response: ${text.slice(0, 200)}`);
        throw new JejelayeError(`Invalid response format from provider (HTTP ${response.status})`, response.status);
      }

      // Successful range 200-299
      if (response.ok) {
        this.log(`Success ${method} ${url.pathname} (${response.status})`);
        return (parsedJson.data !== undefined ? parsedJson.data : parsedJson) as T;
      }

      // Specific error mapping per requirement
      switch (response.status) {
        case 401:
          this.log('401 Unauthenticated: Provider token is missing, invalid, or expired.');
          throw new JejelayeError(
            parsedJson.message || 'Provider authentication failed. Check JEJELAYE_API_TOKEN.',
            401,
            parsedJson.errors,
            parsedJson
          );

        case 402:
          this.log('402 Insufficient Balance: Provider float exhausted. Alerting admin.');
          throw new JejelayeError(
            'Provider wallet balance insufficient to fulfill transaction. Internal wallet not charged.',
            402,
            parsedJson.errors,
            parsedJson
          );

        case 404:
          this.log(`404 Not Found on ${url.pathname}. Refreshing service catalog needed.`);
          throw new JejelayeError(
            parsedJson.message || 'Service or resource ID not found on provider.',
            404,
            parsedJson.errors,
            parsedJson
          );

        case 422:
          this.log(`422 Validation Error on ${url.pathname}:`, parsedJson.errors);
          throw new JejelayeError(
            parsedJson.message || 'Validation failed on provider submission.',
            422,
            parsedJson.errors,
            parsedJson
          );

        default:
          if (response.status >= 500 && retryCount < this.maxRetries) {
            retryCount++;
            this.log(`Provider 5xx error (${response.status}). Retrying ${retryCount}/${this.maxRetries}...`);
            await this.delay(3000 * retryCount);
            continue;
          }

          throw new JejelayeError(
            parsedJson.message || `Provider request failed with status ${response.status}`,
            response.status,
            parsedJson.errors,
            parsedJson
          );
      }
    }

    throw new JejelayeError('Maximum retries exceeded without resolution', 500);
  }
}

// Global client singleton
let jejelayeClientInstance: JejelayeClient | null = null;

export function getJejelayeClient(): JejelayeClient {
  if (!jejelayeClientInstance) {
    jejelayeClientInstance = new JejelayeClient();
  }
  return jejelayeClientInstance;
}
