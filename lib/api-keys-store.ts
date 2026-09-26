'use client';

import { useSyncExternalStore } from 'react';

export interface ResellerApiKey {
  id: string;
  resellerId: string;
  resellerName: string;
  resellerEmail: string;
  keyLabel: string;
  apiKey: string;
  environment: 'live' | 'sandbox';
  scopes: string[];
  ipWhitelist: string;
  dailyRateLimit: number;
  requestsToday: number;
  status: 'active' | 'revoked';
  webhookUrl?: string;
  createdAt: string;
  lastUsedAt: string;
}

export interface ProviderGatewayKey {
  id: string;
  providerName: string;
  serviceCategory: string;
  apiKey: string;
  apiSecret?: string;
  endpointUrl: string;
  environment: 'live' | 'sandbox';
  status: 'connected' | 'degraded' | 'disconnected';
  lastPingMs: number;
  lastChecked: string;
}

const STORAGE_KEY_RESELLER_KEYS = 'edh_admin_reseller_api_keys';
const STORAGE_KEY_PROVIDER_KEYS = 'edh_admin_provider_api_keys';

export const INITIAL_RESELLER_KEYS: ResellerApiKey[] = [
  {
    id: 'KEY-EDH-901',
    resellerId: 'RES-001',
    resellerName: 'Emmanuel Owighoyota',
    resellerEmail: 'emmanuelowighoyota9@gmail.com',
    keyLabel: 'EDH Mobile App Production Backend',
    apiKey: 'edh_live_sk_894109f2a1b7e90c3d4e5f6a7b8c9d0e',
    environment: 'live',
    scopes: ['vtu:data', 'vtu:airtime', 'bills:pay', 'logs:purchase', 'numbers:rent', 'sms:send', 'wallet:read'],
    ipWhitelist: '*',
    dailyRateLimit: 50000,
    requestsToday: 14280,
    status: 'active',
    webhookUrl: 'https://api.emmydigitalhub.com.ng/v1/webhook',
    createdAt: '2024-02-10',
    lastUsedAt: '2 mins ago',
  },
  {
    id: 'KEY-EDH-902',
    resellerId: 'RES-002',
    resellerName: 'Adebayo Ogunlesi',
    resellerEmail: 'adebayo.reseller@gmail.com',
    keyLabel: 'Adebayo VTU WooCommerce Plugin',
    apiKey: 'edh_live_sk_338902a7b8c9d0e1f2a3b4c5d6e7f8a9',
    environment: 'live',
    scopes: ['vtu:data', 'vtu:airtime', 'bills:pay', 'wallet:read'],
    ipWhitelist: '102.89.44.12, 197.210.65.18',
    dailyRateLimit: 10000,
    requestsToday: 3450,
    status: 'active',
    webhookUrl: 'https://adebayovtu.com.ng/wp-json/edh/callback',
    createdAt: '2024-03-25',
    lastUsedAt: '12 mins ago',
  },
  {
    id: 'KEY-EDH-903',
    resellerId: 'RES-003',
    resellerName: 'Chinedu Eze',
    resellerEmail: 'chinedu.vtu@yahoo.com',
    keyLabel: 'Chinedu Telegram Airtime Bot Server',
    apiKey: 'edh_live_sk_774109c1d2e3f4a5b6c7d8e9f0a1b2c3',
    environment: 'live',
    scopes: ['vtu:data', 'vtu:airtime', 'numbers:rent'],
    ipWhitelist: '154.120.99.41',
    dailyRateLimit: 5000,
    requestsToday: 890,
    status: 'active',
    webhookUrl: 'https://telegram-bot.chinedu-telecoms.ng/notify',
    createdAt: '2024-05-12',
    lastUsedAt: '45 mins ago',
  },
  {
    id: 'KEY-EDH-904',
    resellerId: 'RES-004',
    resellerName: 'Grace Michael',
    resellerEmail: 'grace.logs@outlook.com',
    keyLabel: 'Social Logs Marketplace Auto-Buyer Bot',
    apiKey: 'edh_live_sk_119048e5f6a7b8c9d0e1f2a3b4c5d6e7',
    environment: 'live',
    scopes: ['logs:purchase', 'wallet:read'],
    ipWhitelist: '*',
    dailyRateLimit: 25000,
    requestsToday: 6710,
    status: 'active',
    createdAt: '2024-02-20',
    lastUsedAt: '5 mins ago',
  },
  {
    id: 'KEY-EDH-905',
    resellerId: 'RES-005',
    resellerName: 'Femi Alabi',
    resellerEmail: 'femi.telecoms@gmail.com',
    keyLabel: 'Staging Sandbox Testing Key',
    apiKey: 'edh_test_sk_990182b3c4d5e6f7a8b9c0d1e2f3a4b5',
    environment: 'sandbox',
    scopes: ['vtu:data', 'vtu:airtime'],
    ipWhitelist: '*',
    dailyRateLimit: 1000,
    requestsToday: 42,
    status: 'revoked',
    createdAt: '2024-06-02',
    lastUsedAt: '12 days ago',
  },
];

export const INITIAL_PROVIDER_KEYS: ProviderGatewayKey[] = [
  {
    id: 'PROV-JEJELAYE',
    providerName: 'JejeLaye Core Provider Gateway v1',
    serviceCategory: 'VTU, SME Data, Utility Bills, Airtime Pin',
    apiKey: 'JEJE_LIVE_API_98412_SECRET_KEY_PROD',
    apiSecret: 'jeje_sec_994820194820194820194820',
    endpointUrl: 'https://jejelayegct.com.ng/api/v1',
    environment: 'live',
    status: 'connected',
    lastPingMs: 42,
    lastChecked: 'Just now',
  },
  {
    id: 'PROV-MONIEPOINT',
    providerName: 'Moniepoint Virtual Accounts & Webhook',
    serviceCategory: 'NIBSS Dynamic Bank Transfers & Auto-Credit',
    apiKey: 'MP_MERCHANT_KEY_8892401',
    apiSecret: 'mp_sec_wh_77192830192830192830192',
    endpointUrl: 'https://api.moniepoint.com/v1',
    environment: 'live',
    status: 'connected',
    lastPingMs: 65,
    lastChecked: '1 min ago',
  },
  {
    id: 'PROV-VIRTUAL-NUM',
    providerName: 'SMS-Activate / 5SIM Gateway',
    serviceCategory: 'Virtual Disposable Phone Numbers (OTP)',
    apiKey: 'SMS_ACTIVATE_TOKEN_482910492810',
    endpointUrl: 'https://api.sms-activate.org/stubs/handler_api.php',
    environment: 'live',
    status: 'connected',
    lastPingMs: 110,
    lastChecked: '3 mins ago',
  },
  {
    id: 'PROV-BULK-SMS',
    providerName: 'Termii Direct Route SMS Gateway',
    serviceCategory: 'Transactional & DND Bulk SMS Delivery',
    apiKey: 'TERMII_PROD_API_KEY_338910482',
    endpointUrl: 'https://api.ng.termii.com/api',
    environment: 'live',
    status: 'connected',
    lastPingMs: 78,
    lastChecked: '5 mins ago',
  },
];

function safeParseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw || typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    return fallback;
  }
}

export function getStoredResellerKeys(): ResellerApiKey[] {
  if (typeof window === 'undefined') return INITIAL_RESELLER_KEYS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESELLER_KEYS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_RESELLER_KEYS, JSON.stringify(INITIAL_RESELLER_KEYS));
      return INITIAL_RESELLER_KEYS;
    }
    return safeParseJson<ResellerApiKey[]>(raw, INITIAL_RESELLER_KEYS);
  } catch {
    return INITIAL_RESELLER_KEYS;
  }
}

export function saveResellerKeys(keys: ResellerApiKey[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_RESELLER_KEYS, JSON.stringify(keys));
    window.dispatchEvent(new Event('edh_reseller_api_keys_changed'));
  } catch (err) {
    console.error('Failed to save reseller keys', err);
  }
}

export function getStoredProviderKeys(): ProviderGatewayKey[] {
  if (typeof window === 'undefined') return INITIAL_PROVIDER_KEYS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROVIDER_KEYS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PROVIDER_KEYS, JSON.stringify(INITIAL_PROVIDER_KEYS));
      return INITIAL_PROVIDER_KEYS;
    }
    return safeParseJson<ProviderGatewayKey[]>(raw, INITIAL_PROVIDER_KEYS);
  } catch {
    return INITIAL_PROVIDER_KEYS;
  }
}

export function saveProviderKeys(keys: ProviderGatewayKey[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROVIDER_KEYS, JSON.stringify(keys));
    window.dispatchEvent(new Event('edh_provider_api_keys_changed'));
  } catch (err) {
    console.error('Failed to save provider keys', err);
  }
}

let cachedResellerKeys: ResellerApiKey[] = INITIAL_RESELLER_KEYS;
let lastRawResellerKeys: string | null = null;

function subscribeResellerKeys(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('edh_reseller_api_keys_changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('edh_reseller_api_keys_changed', callback);
    window.removeEventListener('storage', callback);
  };
}

function getResellerKeysSnapshot(): ResellerApiKey[] {
  if (typeof window === 'undefined') return INITIAL_RESELLER_KEYS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RESELLER_KEYS);
    if (raw !== lastRawResellerKeys) {
      lastRawResellerKeys = raw;
      cachedResellerKeys = safeParseJson<ResellerApiKey[]>(raw, INITIAL_RESELLER_KEYS);
    }
    return cachedResellerKeys;
  } catch {
    return INITIAL_RESELLER_KEYS;
  }
}

export function useResellerApiKeys(): ResellerApiKey[] {
  return useSyncExternalStore(subscribeResellerKeys, getResellerKeysSnapshot, () => INITIAL_RESELLER_KEYS);
}

let cachedProviderKeys: ProviderGatewayKey[] = INITIAL_PROVIDER_KEYS;
let lastRawProviderKeys: string | null = null;

function subscribeProviderKeys(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('edh_provider_api_keys_changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('edh_provider_api_keys_changed', callback);
    window.removeEventListener('storage', callback);
  };
}

function getProviderKeysSnapshot(): ProviderGatewayKey[] {
  if (typeof window === 'undefined') return INITIAL_PROVIDER_KEYS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROVIDER_KEYS);
    if (raw !== lastRawProviderKeys) {
      lastRawProviderKeys = raw;
      cachedProviderKeys = safeParseJson<ProviderGatewayKey[]>(raw, INITIAL_PROVIDER_KEYS);
    }
    return cachedProviderKeys;
  } catch {
    return INITIAL_PROVIDER_KEYS;
  }
}

export function useProviderApiKeys(): ProviderGatewayKey[] {
  return useSyncExternalStore(subscribeProviderKeys, getProviderKeysSnapshot, () => INITIAL_PROVIDER_KEYS);
}

export function generateSecureApiKey(env: 'live' | 'sandbox' = 'live'): string {
  const prefix = env === 'live' ? 'edh_live_sk_' : 'edh_test_sk_';
  const chars = '0123456789abcdef';
  let rand = '';
  for (let i = 0; i < 32; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}${rand}`;
}
