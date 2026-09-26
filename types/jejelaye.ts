// JejeLaye API v1 TypeScript Types & Data Models

export type ServiceType =
  | 'airtime'
  | 'data'
  | 'electricity'
  | 'tv'
  | 'education'
  | 'print_card'
  | 'bulk_sms'
  | 'social_boost'
  | 'buy_logs'
  | 'ecommerce'
  | 'virtual_number'
  | 'esim'
  | 'gift_card'
  | 'wallet_funding';

export interface JejeUser {
  id?: string | number;
  name: string;
  email: string;
  phone: string;
  is_verified?: boolean;
}

export interface WalletBalance {
  balance: number; // in Naira (NGN)
  gift_card_balance: number;
  referral_balance?: number;
  virtual_account?: {
    bank_name: string;
    account_number: string;
    account_name: string;
  };
}

export interface ServiceItem {
  id: number | string;
  name: string;
  type: ServiceType;
  provider?: string;
  category?: string;
  price: number; // Wholesale selling_price on JejeLaye
  reseller_price?: number; // Price with reseller markup
  description?: string;
  plan_id?: string;
  volume?: string;
  validity?: string;
  available?: boolean;
}

export interface TransactionRecord {
  id: string;
  reference: string;
  type: ServiceType | 'virtual_number' | 'esim' | 'gift_card' | 'wallet_funding';
  title: string;
  recipient?: string;
  details?: string;
  amount: number; // Wholesale price paid to JejeLaye
  reseller_amount: number; // Amount charged to end-client
  profit: number; // Reseller profit
  status: 'pending' | 'processing' | 'successful' | 'failed' | 'completed';
  api_response?: string | Record<string, unknown>;
  wallet_balance_before?: number;
  wallet_balance_after?: number;
  created_at: string;
  token?: string; // e.g. electricity token, exam pin, recharge card pin
  serial?: string;
}

export interface VirtualNumberSession {
  reference: string;
  category: 'usa' | 'international';
  server_key: string;
  service_name: string;
  service_code: string;
  phone_number: string;
  status: 'waiting_for_otp' | 'completed' | 'expired' | 'cancelled';
  otp?: string;
  cost: number;
  reseller_cost: number;
  created_at: string;
  expires_at: number; // epoch ms
}

export interface EmailRentalSession {
  id: string;
  email_address: string;
  service_code: string;
  domain: string;
  status: 'waiting' | 'received' | 'expired' | 'cancelled';
  code?: string;
  created_at: string;
}

export interface EsimPackage {
  package_code: string;
  title: string;
  country: string;
  flag: string;
  data_amount: string;
  duration: string;
  price: number;
  category: 'regional' | 'country' | 'global';
}

export interface EsimSession {
  reference: string;
  package_code: string;
  country: string;
  qr_code_payload: string;
  activation_code: string;
  nickname?: string;
  status: 'processing' | 'active' | 'completed' | 'suspended';
  data_used: string;
  data_remaining: string;
  expiry_date: string;
  price: number;
  created_at: string;
}

export interface GiftCardRate {
  id: string;
  name: string;
  slug: string;
  currency: string;
  physical_rate: number; // NGN per unit currency
  ecode_rate: number; // NGN per unit currency
  icon: string;
}

export interface GiftCardTrade {
  reference: string;
  brand: string;
  currency: string;
  card_country: string;
  card_type: 'physical' | 'ecode';
  card_amount: number;
  total_payout: number;
  reseller_payout?: number;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  ecode?: string;
  images_count?: number;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  transaction_reference?: string;
  status: 'open' | 'answered' | 'closed';
  created_at: string;
  replies: Array<{
    sender: 'user' | 'support';
    message: string;
    time: string;
  }>;
}

export interface ResellerConfig {
  api_token: string;
  is_live_mode: boolean;
  business_name: string;
  airtime_markup_percent: number; // e.g. 2%
  data_markup_flat: number; // e.g. 50 NGN
  cable_markup_flat: number; // e.g. 100 NGN
  electricity_markup_flat: number; // e.g. 100 NGN
  exam_markup_flat: number; // e.g. 250 NGN
  virtual_number_markup_percent: number; // e.g. 15%
  esim_markup_percent: number; // e.g. 10%
}

export type PaymentChannel = 'card' | 'bank_transfer' | 'ussd' | 'qr';

export interface PaymentTransaction {
  id: string;
  reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  service_title: string;
  service_type: ServiceType;
  service_recipient?: string;
  subtotal: number;
  reseller_margin: number;
  gateway_fee: number;
  total_amount: number;
  channel: PaymentChannel;
  status: 'pending' | 'processing' | 'successful' | 'failed';
  payment_details?: {
    card_last4?: string;
    card_brand?: string;
    bank_name?: string;
    virtual_account?: string;
    ussd_code?: string;
    paid_at?: string;
    authorization_code?: string;
  };
  fulfillment_status: 'fulfilled' | 'pending' | 'failed';
  fulfillment_token?: string;
  created_at: string;
}

export interface PayoutRecord {
  id: string;
  reference: string;
  source: 'main_balance' | 'gift_card' | 'margins';
  amount: number;
  fee: number;
  net_payout: number;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  nip_session_id: string;
  status: 'pending' | 'processing' | 'settled' | 'rejected';
  settlement_mode: 'instant' | 'daily_batch' | 'weekly';
  created_at: string;
  settled_at?: string;
}

export interface PayoutSecuritySettings {
  is_pin_set: boolean;
  daily_limit: number;
  daily_withdrawn: number;
  preferred_bank?: {
    bank_name: string;
    bank_code: string;
    account_number: string;
    account_name: string;
    is_verified: boolean;
  };
  settlement_schedule: 'instant' | 'daily_6pm' | 'weekly_friday';
  require_2fa_for_payout: boolean;
}

