/**
 * Emmy Social Digital Hub — Financial Ledger Precision Helpers
 * 
 * WHY:
 * 1. Integer Kobo Precision: Floating point math introduces rounding errors (e.g. 0.1 + 0.2 = 0.30000000000000004).
 *    All currency operations in Emmy Hub are stored and calculated strictly in integer Kobo (1 Naira = 100 Kobo).
 * 2. BigInt Safety: Handles high volume transactions without integer overflow.
 * 3. Human Formatting: Provides consistent formatting with the Nigerian Naira symbol (₦).
 */

/**
 * Converts a Naira decimal or string (e.g. 500 or "500.50") to integer Kobo BigInt.
 */
export function toKobo(naira: number | string): bigint {
  if (typeof naira === 'string') {
    const cleaned = naira.replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    if (isNaN(num)) return BigInt(0);
    return BigInt(Math.round(num * 100));
  }
  if (isNaN(naira)) return BigInt(0);
  return BigInt(Math.round(naira * 100));
}

/**
 * Converts integer Kobo (BigInt or number) back to a decimal Naira number.
 */
export function toNaira(kobo: bigint | number): number {
  const rawKobo = typeof kobo === 'bigint' ? Number(kobo) : kobo;
  return rawKobo / 100;
}

/**
 * Formats integer Kobo into a human-readable Naira string.
 * Example: 15480000n -> "₦154,800.00"
 */
export function formatNaira(kobo: bigint | number, includeSymbol: boolean = true): string {
  const naira = toNaira(kobo);
  const formatted = naira.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return includeSymbol ? `₦${formatted}` : formatted;
}

/**
 * Arithmetic helper: Add two kobo values.
 */
export function addKobo(a: bigint, b: bigint): bigint {
  return a + b;
}

/**
 * Arithmetic helper: Deduct kobo (with floor guard at 0).
 */
export function deductKobo(balance: bigint, debit: bigint): bigint {
  if (debit > balance) {
    throw new Error('Insufficient wallet balance for debit');
  }
  return balance - debit;
}

/**
 * Checks if a user has sufficient balance to cover an operation.
 */
export function hasSufficientBalance(balanceKobo: bigint, requiredKobo: bigint): boolean {
  return balanceKobo >= requiredKobo;
}

/**
 * Applies percentage markup to a wholesale cost in kobo.
 * Example: cost = 100,000 kobo (₦1,000), percentage = 5 (5%) -> returns 105,000 kobo (₦1,050).
 */
export function applyPercentageMarkup(costKobo: bigint, percentage: number): bigint {
  const multiplier = 10000 + Math.round(percentage * 100);
  return (costKobo * BigInt(multiplier)) / BigInt(10000);
}

/**
 * Applies flat Naira markup to a wholesale cost.
 * Example: cost = 100,000 kobo (₦1,000), flatNaira = 100 -> returns 110,000 kobo (₦1,100).
 */
export function applyFlatMarkup(costKobo: bigint, flatNaira: number): bigint {
  return costKobo + toKobo(flatNaira);
}
