/**
 * Emmy Social Digital Hub — Global Branding & Identity Constants
 * 
 * WHY: Centralizing brand tokens ensures consistent presentation across
 * browser tabs, emails, receipts, transaction notices, and webhook payloads.
 * Eliminates hardcoded duplicate brand strings across the codebase.
 */

export const BRAND = {
  name: 'Emmy Social Digital Hub',
  shortName: 'Emmy Hub',
  tagline: 'Your One-Stop Digital Service Hub',
  supportEmail: 'support@emmydigitalhub.com',
  domain: 'emmydigitalhub.com',
  colors: {
    primary: '#10b981', // emerald-500
    primaryDark: '#059669', // emerald-600
    accent: '#06b6d4', // cyan-500
    accentDark: '#0891b2', // cyan-600
    neutralDark: '#020617', // slate-950
  },
  socials: {
    whatsapp: '+2348140008920',
    telegram: 'https://t.me/emmydigitalhub',
    twitter: '@emmydigitalhub',
  },
  currency: {
    symbol: '₦',
    code: 'NGN',
  },
} as const;

export type BrandConfig = typeof BRAND;
