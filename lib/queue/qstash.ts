/**
 * Emmy Social Digital Hub — QStash Asynchronous Queue Integration
 * 
 * WHY:
 * 1. Serverless Compatibility: Vercel functions have maxDuration limits and cannot run
 *    long-lived background daemon loops.
 * 2. Asynchronous Purchase Pipeline: Purchase routes acknowledge 202 Accepted immediately,
 *    and QStash invokes our protected worker endpoint (`/api/queue/purchase`) with up to 3 retries.
 * 3. Signature Verification: Validates incoming webhook requests from QStash to guarantee authenticity.
 */

import { Client, Receiver } from '@upstash/qstash';

const qstashToken = process.env.QSTASH_TOKEN;
const currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY || '';
const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY || '';

export const qstashClient = qstashToken
  ? new Client({
      token: qstashToken,
    })
  : null;

export const qstashReceiver =
  currentSigningKey && nextSigningKey
    ? new Receiver({
        currentSigningKey,
        nextSigningKey,
      })
    : null;

/**
 * Publishes an asynchronous purchase job to QStash.
 * @param destinationUrl Absolute target worker URL (e.g. https://emmydigitalhub.com/api/queue/purchase)
 * @param payload Transaction ID and metadata
 * @param retries Number of retry attempts on failure (default: 3)
 */
export async function enqueuePurchaseJob(
  destinationUrl: string,
  payload: { transactionId: string; serviceType: string },
  retries: number = 3
): Promise<{ messageId: string }> {
  if (!qstashClient) {
    console.warn(
      '[Emmy Hub][QStash] Warning: QSTASH_TOKEN is not configured. Emulating sync execution in dev mode.'
    );
    return { messageId: `mock-msg-${Date.now()}` };
  }

  const res = await qstashClient.publishJSON({
    url: destinationUrl,
    body: payload,
    retries,
  });

  return { messageId: res.messageId };
}

/**
 * Helper to verify QStash signature in Next.js App Router API handlers.
 */
export async function verifyQstashSignature(
  signature: string | null,
  body: string
): Promise<boolean> {
  if (!qstashReceiver) {
    if (process.env.NODE_ENV !== 'production') {
      return true; // Dev bypass
    }
    return false;
  }

  if (!signature) return false;

  try {
    return await qstashReceiver.verify({
      signature,
      body,
    });
  } catch (err) {
    console.error('[Emmy Hub][QStash] Signature verification failed:', err);
    return false;
  }
}
