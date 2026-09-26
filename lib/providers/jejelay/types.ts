/**
 * Emmy Social Digital Hub — JejeLaye API v1 TypeScript Definitions
 * 
 * WHY: Strict typing prevents contract divergence against the upstream provider.
 * Covers all 13 sections of the official JejeLaye API v1 specification.
 */

// ==========================================
// COMMON & SHARED TYPES
// ==========================================

export type JejeServiceType =
  | 'airtime'
  | 'data'
  | 'electricity'
  | 'tv'
  | 'education'
  | 'print_card'
  | 'bulk_sms'
  | 'social_boost'
  | 'buy_logs'
  | 'ecommerce';

export type JejeTransactionStatus =
  | 'pending'
  | 'processing'
  | 'successful'
  | 'completed'
  | 'failed'
  | 'awaiting_fulfillment';

export interface JejeApiResponse<T = unknown> {
  status: boolean | string;
  message?: string;
  data?: T;
  errors?: Record<string, string[] | string>;
  error?: string;
}

// ==========================================
// SECTION 1: AUTH & DISCOVERY
// ==========================================

export interface JejeAuthRegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface JejeAuthLoginPayload {
  email: string;
  password: string;
}

export interface JejeAuthLoginResponse {
  token: string;
  user?: {
    id: string | number;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface JejeWalletResponse {
  balance: number | string; // Naira decimal
  gift_card_balance?: number | string;
  referral_balance?: number | string;
  currency?: string;
  bank_details?: {
    bank_name: string;
    account_number: string;
    account_name: string;
  };
}

export interface JejeServiceItem {
  id: number | string;
  name: string;
  type: JejeServiceType;
  price?: number | string; // selling_price in Naira
  selling_price?: number | string;
  network?: string;
  plan_id?: string;
  denomination?: number;
  available?: boolean;
  metadata?: Record<string, unknown>;
}

export interface JejeCategoryItem {
  id: number | string;
  name: string;
  slug: string;
  service_count?: number;
}

// ==========================================
// SECTION 2: MY ACCOUNT
// ==========================================

export interface JejeUserProfile {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  wallet_balance: number | string;
  email_verified: boolean;
  created_at?: string;
}

// ==========================================
// SECTION 3: MY MONEY (WALLET & TRANSACTIONS)
// ==========================================

export interface JejeFundWalletPayload {
  amount: number; // in Naira
}

export interface JejeFundWalletResponse {
  payment_url: string;
  reference: string;
}

export interface JejeVirtualAccountResponse {
  bank_name: string;
  account_number: string;
  account_name: string;
  reference?: string;
}

export interface JejeSingleTransactionResponse {
  id: number | string;
  reference: string;
  service_type: string;
  amount: number | string;
  selling_price?: number | string;
  status: JejeTransactionStatus;
  api_response?: string | null;
  phone?: string;
  meter_number?: string;
  token?: string;
  card_pins?: string[];
  created_at: string;
  wallet_balance_before?: number | string;
  wallet_balance_after?: number | string;
}

// ==========================================
// SECTION 4: BUY SERVICES
// ==========================================

export interface JejeAirtimePurchasePayload {
  phone: string;
  amount: number;
}

export interface JejeDataPurchasePayload {
  phone: string;
  plan_id: string;
}

export interface JejeElectricityVerifyPayload {
  meter_number: string;
}

export interface JejeElectricityVerifyResponse {
  customer_name: string;
  meter_number: string;
  address?: string;
}

export interface JejeElectricityPurchasePayload {
  meter_number: string;
  amount: number;
  meter_type: 'prepaid' | 'postpaid';
  phone: string;
}

export interface JejeTvPurchasePayload {
  smart_card_number: string;
  plan_id: string;
}

export interface JejeEducationPurchasePayload {
  quantity: number;
}

export interface JejePrintCardPurchasePayload {
  quantity: number;
  denomination: number;
}

export interface JejeBulkSmsPurchasePayload {
  recipients: string[];
  sender_id: string;
  message: string;
}

export interface JejeSocialBoostPurchasePayload {
  link: string;
  quantity: number;
}

export interface JejeBuyLogsPurchasePayload {
  product: string;
  quantity: number;
}

export interface JejePurchaseSuccessResponse {
  reference: string;
  status: JejeTransactionStatus;
  selling_price: number | string;
  api_response?: string | null;
  token?: string;
  pin?: string;
  serial?: string;
  card_pins?: Array<{ pin: string; serial: string; amount: number }>;
  wallet_balance_before?: number | string;
  wallet_balance_after?: number | string;
}

// ==========================================
// SECTION 5: ONLINE STORE (PHYSICAL PRODUCTS)
// ==========================================

export interface JejeStorePurchasePayload {
  quantity: number;
  name: string;
  phone: string;
  contact_info: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  coupon_code?: string;
  shipping_method_id?: string | number;
  shipping_address?: Record<string, string>;
}

// ==========================================
// SECTION 6: MARKETPLACE (DIGITAL ACCOUNTS)
// ==========================================

export interface JejeMarketplaceItem {
  id: string | number;
  title: string;
  description: string;
  price: number;
  stock: number;
  available: boolean;
}

// ==========================================
// SECTION 7: SELL GIFT CARDS
// ==========================================

export interface JejeGiftCardBrand {
  name: string;
  slug: string;
  currencies: string[];
  card_types: Array<'physical' | 'ecode'>;
}

export interface JejeGiftCardQuotePayload {
  slug: string;
  currency: string;
  card_type: 'physical' | 'ecode';
  sub_type?: string | null;
  card_amount: number;
}

export interface JejeGiftCardQuoteResponse {
  rate_per_usd: number;
  payout_amount_naira: number;
  slug: string;
  currency: string;
}

// ==========================================
// SECTION 8: VIRTUAL NUMBERS (RECEIVE OTP)
// ==========================================

export type JejeVirtualCategory = 'usa' | 'international';
export type JejeVirtualServerKey =
  | 'usa_server_1'
  | 'usa_server_2'
  | 'international_server_1'
  | 'international_server_2';

export interface JejeVirtualNumberPurchasePayload {
  category: JejeVirtualCategory;
  server_key?: JejeVirtualServerKey;
  public_service_key: string;
  number_type: string;
  variation_id?: string;
  callback_url?: string;
  area_codes?: string;
  carrier?: string;
}

export interface JejeVirtualSessionItem {
  session_reference: string;
  phone: string;
  service: string;
  status: 'waiting_for_otp' | 'completed' | 'expired' | 'cancelled';
  otp?: string | null;
  expires_in_seconds?: number;
  can_request_another?: boolean;
}

// ==========================================
// SECTION 10: eSIM
// ==========================================

export interface JejeEsimPackage {
  package_code: string;
  category: string;
  destination: string;
  data_allowance_gb: number;
  validity_days: number;
  price_naira: number;
}

export interface JejeEsimPurchasePayload {
  package_code: string;
  category: string;
}

export interface JejeEsimSession {
  reference: string;
  qr_code_payload: string;
  iccid?: string;
  status: 'processing' | 'completed';
  nickname?: string;
  data_used_mb?: number;
  data_total_mb?: number;
  expiry_date?: string;
}

// ==========================================
// SECTION 13: WEBHOOKS
// ==========================================

export interface JejeOtpWebhookPayload {
  session_reference: string;
  phone: string;
  otp: string;
  provider_reference: string;
  status: 'otp_received' | string;
  received_at: string;
}
