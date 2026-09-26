'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  WalletBalance,
  ServiceItem,
  TransactionRecord,
  VirtualNumberSession,
  EsimPackage,
  EsimSession,
  GiftCardRate,
  GiftCardTrade,
  SupportTicket,
  ResellerConfig,
  ServiceType,
  PaymentChannel,
  PaymentTransaction,
  PayoutRecord,
  PayoutSecuritySettings,
} from '@/types/jejelaye';
import {
  INITIAL_WALLET,
  INITIAL_SERVICES,
  INITIAL_TRANSACTIONS,
  INITIAL_ESIM_PACKAGES,
  INITIAL_GIFT_CARDS,
  INITIAL_GIFT_CARD_TRADES,
  INITIAL_VIRTUAL_SESSIONS,
  INITIAL_TICKETS,
  INITIAL_PAYOUTS,
  INITIAL_PAYOUT_SETTINGS,
  INITIAL_PAYMENT_TRANSACTIONS,
} from '@/lib/mock-data';

interface ResellerContextType {
  config: ResellerConfig;
  updateConfig: (partial: Partial<ResellerConfig>) => void;
  wallet: WalletBalance;
  services: ServiceItem[];
  transactions: TransactionRecord[];
  virtualSessions: VirtualNumberSession[];
  esimPackages: EsimPackage[];
  esimSessions: EsimSession[];
  giftCardRates: GiftCardRate[];
  giftCardTrades: GiftCardTrade[];
  tickets: SupportTicket[];
  paymentTransactions: PaymentTransaction[];
  payoutRecords: PayoutRecord[];
  payoutSettings: PayoutSecuritySettings;
  isCheckoutModalOpen: boolean;
  checkoutService: ServiceItem | null;
  activePaymentReceipt: PaymentTransaction | null;
  activePayoutReceipt: PayoutRecord | null;
  openCheckoutModal: (service?: ServiceItem) => void;
  closeCheckoutModal: () => void;
  setActivePaymentReceipt: (payment: PaymentTransaction | null) => void;
  setActivePayoutReceipt: (payout: PayoutRecord | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  activeReceipt: TransactionRecord | null;
  setActiveReceipt: (tx: TransactionRecord | null) => void;

  // Payment Gateway & Payouts
  initiateCustomerPayment: (params: {
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    service_title: string;
    service_type: ServiceType;
    service_recipient?: string;
    subtotal: number;
    reseller_margin: number;
  }) => Promise<{ success: boolean; data?: any; message?: string }>;
  verifyCustomerPayment: (params: {
    reference: string;
    channel: PaymentChannel;
    card_details?: { last4: string; brand: string };
    service_type: ServiceType;
    service_recipient?: string;
    subtotal: number;
    reseller_margin: number;
    gateway_fee: number;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    service_title: string;
  }) => Promise<{ success: boolean; data?: any; message: string }>;
  disbursePayout: (params: {
    amount: number;
    source: 'main_balance' | 'gift_card' | 'margins';
    bank_code: string;
    bank_name: string;
    account_number: string;
    account_name: string;
    pin: string;
    settlement_mode?: 'instant' | 'daily_batch' | 'weekly';
  }) => Promise<{ success: boolean; payout?: PayoutRecord; message: string }>;
  updatePayoutSettings: (partial: Partial<PayoutSecuritySettings>) => void;

  // Actions
  calculateResellerPrice: (item: ServiceItem) => number;
  fundWallet: (amount: number) => Promise<{ success: boolean; payment_url?: string; message: string }>;
  transferReferral: (amount: number) => Promise<{ success: boolean; message: string }>;
  transferGiftCardToMain: (amount: number) => Promise<{ success: boolean; message: string }>;
  withdrawGiftCardToBank: (amount: number, bankCode: string, accountNum: string, accountName: string) => Promise<{ success: boolean; message: string }>;
  verifyElectricityMeter: (discoId: string | number, meterNumber: string) => Promise<{ success: boolean; customer_name?: string; address?: string; error?: string }>;

  // Purchases
  purchaseAirtime: (provider: string, phone: string, amount: number) => Promise<{ success: boolean; reference?: string; message: string }>;
  purchaseData: (plan: ServiceItem, phone: string) => Promise<{ success: boolean; reference?: string; message: string }>;
  payElectricity: (disco: ServiceItem, meterNumber: string, amount: number, meterType: string, phone: string) => Promise<{ success: boolean; token?: string; reference?: string; message: string }>;
  payTv: (service: ServiceItem, smartCard: string, phone?: string) => Promise<{ success: boolean; reference?: string; message: string }>;
  buyExamPin: (service: ServiceItem, quantity: number) => Promise<{ success: boolean; pins?: string[]; reference?: string; message: string }>;
  generateRechargeCards: (service: ServiceItem, quantity: number, denomination: number) => Promise<{ success: boolean; cards?: Array<{ pin: string; serial: string }>; reference?: string; message: string }>;
  sendBulkSms: (senderId: string, recipients: string[], message: string) => Promise<{ success: boolean; reference?: string; message: string }>;
  buySocialBoost: (service: ServiceItem, link: string, quantity: number) => Promise<{ success: boolean; reference?: string; message: string }>;
  buyLogs: (service: ServiceItem, quantity: number) => Promise<{ success: boolean; credentials?: string; reference?: string; message: string }>;

  // Virtual Numbers & eSIM
  rentVirtualNumber: (category: 'usa' | 'international', server_key: string, service_code: string, service_name: string) => Promise<{ success: boolean; session?: VirtualNumberSession; message: string }>;
  cancelVirtualRental: (reference: string) => Promise<{ success: boolean; message: string }>;
  requestAnotherOtp: (reference: string) => Promise<{ success: boolean; message: string }>;
  buyEsim: (pkg: EsimPackage, email: string) => Promise<{ success: boolean; session?: EsimSession; message: string }>;
  manageEsimSession: (reference: string, action: 'suspend' | 'unsuspend' | 'cancel') => Promise<{ success: boolean; message: string }>;

  // Giftcards
  submitGiftCardTrade: (brand: string, currency: string, card_country: string, card_type: 'physical' | 'ecode', card_amount: number, ecode?: string) => Promise<{ success: boolean; trade?: GiftCardTrade; message: string }>;
  resolveBankName: (bankCode: string, accountNum: string) => Promise<{ success: boolean; account_name?: string; message?: string }>;

  // Tickets & Lookup
  createTicket: (subject: string, message: string, txRef?: string) => Promise<{ success: boolean; ticket?: SupportTicket; message: string }>;
  replyTicket: (ticketId: string, replyMessage: string) => Promise<{ success: boolean; message: string }>;
  lookupTransaction: (reference: string) => Promise<TransactionRecord | null>;
  testApiConnection: () => Promise<{ success: boolean; message: string; balance?: number }>;
}

const DEFAULT_CONFIG: ResellerConfig = {
  api_token: '',
  is_live_mode: false,
  business_name: 'FastVTU Reseller Network',
  airtime_markup_percent: 2.5,
  data_markup_flat: 50,
  cable_markup_flat: 150,
  electricity_markup_flat: 100,
  exam_markup_flat: 250,
  virtual_number_markup_percent: 20,
  esim_markup_percent: 15,
};

const ResellerContext = createContext<ResellerContextType | undefined>(undefined);

async function parseJsonResponse<T = Record<string, any>>(res: Response): Promise<{ ok: boolean; data: T }> {
  try {
    const text = await res.text();
    if (!text || !text.trim()) {
      return { ok: res.ok, data: {} as T };
    }
    const data = JSON.parse(text);
    return { ok: res.ok, data: data as T };
  } catch {
    return { ok: false, data: {} as T };
  }
}

export function ResellerProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ResellerConfig>(DEFAULT_CONFIG);
  const [wallet, setWallet] = useState<WalletBalance>(INITIAL_WALLET);
  const [services] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(INITIAL_PAYMENT_TRANSACTIONS);
  const [payoutRecords, setPayoutRecords] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);
  const [payoutSettings, setPayoutSettings] = useState<PayoutSecuritySettings>(INITIAL_PAYOUT_SETTINGS);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [checkoutService, setCheckoutService] = useState<ServiceItem | null>(null);
  const [activePaymentReceipt, setActivePaymentReceipt] = useState<PaymentTransaction | null>(null);
  const [activePayoutReceipt, setActivePayoutReceipt] = useState<PayoutRecord | null>(null);

  // Synchronize with localStorage after mount on the client to avoid SSR hydration mismatches
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const storedConfig = localStorage.getItem('jeje_reseller_config');
        if (storedConfig) {
          const parsed = JSON.parse(storedConfig);
          if (parsed && typeof parsed === 'object') {
            setConfig((prev) => ({ ...prev, ...parsed }));
          }
        }
      } catch {
        // ignore
      }

      try {
        const storedWallet = localStorage.getItem('jeje_reseller_wallet');
        if (storedWallet) {
          const parsed = JSON.parse(storedWallet);
          if (parsed && typeof parsed === 'object' && typeof parsed.balance === 'number') {
            setWallet(parsed);
          }
        }
      } catch {
        // ignore
      }

      try {
        const storedTx = localStorage.getItem('jeje_reseller_tx');
        if (storedTx) {
          const parsed = JSON.parse(storedTx);
          if (Array.isArray(parsed)) {
            setTransactions(parsed);
          }
        }
      } catch {
        // ignore
      }

      try {
        const storedPayments = localStorage.getItem('jeje_reseller_payments');
        if (storedPayments) {
          const parsed = JSON.parse(storedPayments);
          if (Array.isArray(parsed)) {
            setPaymentTransactions(parsed);
          }
        }
      } catch {
        // ignore
      }

      try {
        const storedPayouts = localStorage.getItem('jeje_reseller_payouts');
        if (storedPayouts) {
          const parsed = JSON.parse(storedPayouts);
          if (Array.isArray(parsed)) {
            setPayoutRecords(parsed);
          }
        }
      } catch {
        // ignore
      }

      try {
        const storedPayoutSettings = localStorage.getItem('jeje_reseller_payout_settings');
        if (storedPayoutSettings) {
          const parsed = JSON.parse(storedPayoutSettings);
          if (parsed && typeof parsed === 'object') {
            setPayoutSettings((prev) => ({ ...prev, ...parsed }));
          }
        }
      } catch {
        // ignore
      }
    });
  }, []);

  const [virtualSessions, setVirtualSessions] = useState<VirtualNumberSession[]>(INITIAL_VIRTUAL_SESSIONS);
  const [esimPackages] = useState<EsimPackage[]>(INITIAL_ESIM_PACKAGES);
  const [esimSessions, setEsimSessions] = useState<EsimSession[]>([
    {
      reference: 'ESIM-2026-081',
      package_code: 'US-3GB-30D',
      country: 'United States',
      qr_code_payload: 'LPA:1$smdp.jejelaye.com$9A82D01938F2019',
      activation_code: 'SM-DP+ Address: smdp.jejelaye.com | Code: 9A82D01938F2019',
      nickname: 'US Business Trip',
      status: 'active',
      data_used: '1.2 GB',
      data_remaining: '1.8 GB',
      expiry_date: '2026-10-22',
      price: 6800,
      created_at: '2026-09-22 03:15 PM',
    },
  ]);
  const [giftCardRates] = useState<GiftCardRate[]>(INITIAL_GIFT_CARDS);
  const [giftCardTrades, setGiftCardTrades] = useState<GiftCardTrade[]>(INITIAL_GIFT_CARD_TRADES);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [activeTab, setActiveTab] = useState<string>('services');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeReceipt, setActiveReceipt] = useState<TransactionRecord | null>(null);

  const updateConfig = (partial: Partial<ResellerConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...partial };
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('jeje_reseller_config', JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  };

  const saveWallet = (newWallet: WalletBalance) => {
    setWallet(newWallet);
    try {
      localStorage.setItem('jeje_reseller_wallet', JSON.stringify(newWallet));
    } catch {
      // ignore
    }
  };

  const saveTransactions = (txList: TransactionRecord[]) => {
    setTransactions(txList);
    try {
      localStorage.setItem('jeje_reseller_tx', JSON.stringify(txList));
    } catch {
      // ignore
    }
  };

  // Reseller price calculation
  const calculateResellerPrice = useCallback((item: ServiceItem): number => {
    const wholesale = item.price;
    if (item.type === 'airtime') {
      // Wholesale gets standard 1-2% discount, reseller sells at face value or custom
      return wholesale;
    }
    if (item.type === 'data') {
      return wholesale + (config.data_markup_flat || 50);
    }
    if (item.type === 'tv') {
      return wholesale + (config.cable_markup_flat || 150);
    }
    if (item.type === 'electricity') {
      return wholesale + (config.electricity_markup_flat || 100);
    }
    if (item.type === 'education') {
      return wholesale + (config.exam_markup_flat || 250);
    }
    if (item.type === 'virtual_number') {
      const pct = (config.virtual_number_markup_percent || 20) / 100;
      return Math.round(wholesale * (1 + pct));
    }
    if (item.type === 'esim') {
      const pct = (config.esim_markup_percent || 15) / 100;
      return Math.round(wholesale * (1 + pct));
    }
    return wholesale + 50;
  }, [config]);

  // Test live API connection
  const testApiConnection = async (): Promise<{ success: boolean; message: string; balance?: number }> => {
    if (!config.api_token) {
      return { success: false, message: 'Please enter your JejeLaye API token first.' };
    }
    try {
      setIsLoading(true);
      const res = await fetch('/api/jejelaye/wallet', {
        headers: {
          'Authorization': `Bearer ${config.api_token}`,
        },
      });
      const { ok, data } = await parseJsonResponse<any>(res);
      if (ok) {
        const liveBal = data.balance ?? data.data?.balance ?? 0;
        return {
          success: true,
          message: `Connected successfully to JejeLaye API! Live Wallet Balance: ₦${Number(liveBal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          balance: Number(liveBal),
        };
      } else {
        return {
          success: false,
          message: data.message || data.error || 'Failed to authenticate with JejeLaye API. Ensure token is valid.',
        };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error';
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Fund Wallet
  const fundWallet = async (amount: number): Promise<{ success: boolean; payment_url?: string; message: string }> => {
    if (amount <= 0) return { success: false, message: 'Amount must be greater than zero.' };

    if (config.is_live_mode && config.api_token) {
      try {
        const res = await fetch('/api/jejelaye/wallet/fund', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.api_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount }),
        });
        const { ok, data } = await parseJsonResponse<any>(res);
        if (ok && data.payment_url) {
          return { success: true, payment_url: data.payment_url, message: 'Payment gateway link generated successfully.' };
        }
      } catch {
        // fallback to sandbox simulation
      }
    }

    // Sandbox simulated credit
    const updated: WalletBalance = {
      ...wallet,
      balance: wallet.balance + amount,
    };
    saveWallet(updated);

    const ref = `FUND-${Date.now().toString().slice(-6)}`;
    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: ref,
      type: 'wallet_funding',
      title: 'Wallet Direct Funding',
      recipient: 'Primary Balance',
      details: 'Instant Bank Virtual Transfer credit',
      amount: amount,
      reseller_amount: amount,
      profit: 0,
      status: 'successful',
      wallet_balance_before: wallet.balance,
      wallet_balance_after: updated.balance,
      created_at: new Date().toLocaleString(),
      api_response: `Funded ₦${amount.toLocaleString()} to wallet. Reference: ${ref}`,
    };
    saveTransactions([tx, ...transactions]);

    return { success: true, message: `Successfully funded ₦${amount.toLocaleString()} into your wallet!` };
  };

  // Move referral earnings
  const transferReferral = async (amount: number): Promise<{ success: boolean; message: string }> => {
    if (amount > (wallet.referral_balance || 0)) {
      return { success: false, message: 'Insufficient referral balance.' };
    }
    const updated: WalletBalance = {
      ...wallet,
      referral_balance: (wallet.referral_balance || 0) - amount,
      balance: wallet.balance + amount,
    };
    saveWallet(updated);
    return { success: true, message: `Moved ₦${amount.toLocaleString()} referral earnings to main wallet.` };
  };

  // Transfer Gift Card balance to main wallet
  const transferGiftCardToMain = async (amount: number): Promise<{ success: boolean; message: string }> => {
    if (amount > wallet.gift_card_balance) {
      return { success: false, message: 'Insufficient gift card balance.' };
    }
    const updated: WalletBalance = {
      ...wallet,
      gift_card_balance: wallet.gift_card_balance - amount,
      balance: wallet.balance + amount,
    };
    saveWallet(updated);
    return { success: true, message: `Transferred ₦${amount.toLocaleString()} from Gift Card balance to Main Wallet!` };
  };

  // Withdraw gift card money to bank
  const withdrawGiftCardToBank = async (amount: number, bankCode: string, accountNum: string, accountName: string) => {
    if (amount > wallet.gift_card_balance) {
      return { success: false, message: 'Insufficient gift card balance for withdrawal.' };
    }
    const updated: WalletBalance = {
      ...wallet,
      gift_card_balance: wallet.gift_card_balance - amount,
    };
    saveWallet(updated);

    const ref = `WDR-${Date.now().toString().slice(-6)}`;
    const tx: TransactionRecord = {
      id: `wdr_${Date.now()}`,
      reference: ref,
      type: 'gift_card',
      title: 'Gift Card Bank Payout',
      recipient: `${accountName} (${accountNum})`,
      details: `Bank: ${bankCode} · ₦${amount.toLocaleString()}`,
      amount: amount,
      reseller_amount: amount,
      profit: 0,
      status: 'successful',
      wallet_balance_before: wallet.gift_card_balance,
      wallet_balance_after: updated.gift_card_balance,
      created_at: new Date().toLocaleString(),
      api_response: `Transfer dispatched to ${accountName} (${accountNum}). Reference: ${ref}`,
    };
    saveTransactions([tx, ...transactions]);

    return { success: true, message: `Withdrawal of ₦${amount.toLocaleString()} initiated to ${accountName} (${accountNum})!` };
  };

  // Verify Electricity meter
  const verifyElectricityMeter = async (discoId: string | number, meterNumber: string) => {
    if (!meterNumber || meterNumber.length < 8) {
      return { success: false, error: 'Please enter a valid meter number (minimum 8-11 digits).' };
    }

    if (config.is_live_mode && config.api_token) {
      try {
        const res = await fetch(`/api/jejelaye/services/${discoId}/verify`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.api_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ meter_number: meterNumber }),
        });
        const { ok, data } = await parseJsonResponse<any>(res);
        if (ok && data.customer_name) {
          return { success: true, customer_name: data.customer_name, address: data.address };
        }
      } catch {
        // fallback
      }
    }

    // Realistic simulation
    const names = [
      'CHUKWUDI EMMANUEL OBI',
      'DR. OLUMIDE ADEYEMI',
      'FATIMA ALIYU MOHAMMED',
      'BABATUNDE RASHEED BELLO',
      'NGOZI BLESSING OKORO',
    ];
    const pseudoName = names[Math.abs(meterNumber.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % names.length];
    return {
      success: true,
      customer_name: pseudoName,
      address: 'Plot 14, Commercial District, Mainland Central',
    };
  };

  // Purchase Airtime
  const purchaseAirtime = async (provider: string, phone: string, amount: number) => {
    if (amount <= 50) return { success: false, message: 'Minimum airtime amount is ₦50.' };
    if (!phone || phone.length < 11) return { success: false, message: 'Please enter a valid 11-digit phone number.' };

    const wholesaleDiscount = amount * 0.02; // 2% discount from wholesale
    const wholesaleCost = amount - wholesaleDiscount;
    const resellerSellPrice = amount; // Sold at nominal value
    const profit = resellerSellPrice - wholesaleCost;

    if (wallet.balance < wholesaleCost) {
      return { success: false, message: `Insufficient wallet balance. You need ₦${wholesaleCost.toFixed(2)} to complete this airtime recharge.` };
    }

    const updatedWallet: WalletBalance = {
      ...wallet,
      balance: wallet.balance - wholesaleCost,
    };
    saveWallet(updatedWallet);

    const ref = `AIR-${Date.now().toString().slice(-6)}`;
    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: ref,
      type: 'airtime',
      title: `${provider} ₦${amount.toLocaleString()} Airtime`,
      recipient: phone,
      details: `${provider} VTU Instant Topup`,
      amount: wholesaleCost,
      reseller_amount: resellerSellPrice,
      profit: Math.round(profit),
      status: 'successful',
      wallet_balance_before: wallet.balance,
      wallet_balance_after: updatedWallet.balance,
      created_at: new Date().toLocaleString(),
      api_response: `Airtime successfully credited to ${phone}. Network Ref: ${provider.toUpperCase()}-${Date.now().toString().slice(-5)}`,
    };

    saveTransactions([tx, ...transactions]);
    setActiveReceipt(tx);
    return { success: true, reference: ref, message: `₦${amount} Airtime successfully sent to ${phone}!` };
  };

  // Purchase Data
  const purchaseData = async (plan: ServiceItem, phone: string) => {
    if (!phone || phone.length < 11) return { success: false, message: 'Please enter a valid 11-digit Nigerian phone number.' };

    const wholesaleCost = plan.price;
    const markup = config.data_markup_flat || 50;
    const resellerSellPrice = wholesaleCost + markup;
    const profit = markup;

    if (wallet.balance < wholesaleCost) {
      return { success: false, message: `Insufficient balance. Wholesale price is ₦${wholesaleCost.toLocaleString()}, wallet balance is ₦${wallet.balance.toLocaleString()}.` };
    }

    const updatedWallet: WalletBalance = {
      ...wallet,
      balance: wallet.balance - wholesaleCost,
    };
    saveWallet(updatedWallet);

    const ref = `DAT-${Date.now().toString().slice(-6)}`;
    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: ref,
      type: 'data',
      title: plan.name,
      recipient: phone,
      details: `${plan.provider} · ${plan.volume || ''} · ${plan.validity || '30 Days'}`,
      amount: wholesaleCost,
      reseller_amount: resellerSellPrice,
      profit: profit,
      status: 'successful',
      wallet_balance_before: wallet.balance,
      wallet_balance_after: updatedWallet.balance,
      created_at: new Date().toLocaleString(),
      api_response: `Data bundle ${plan.volume || ''} activated successfully for ${phone}.`,
    };

    saveTransactions([tx, ...transactions]);
    setActiveReceipt(tx);
    return { success: true, reference: ref, message: `${plan.name} sent to ${phone} successfully!` };
  };

  // Pay Electricity Bill
  const payElectricity = async (disco: ServiceItem, meterNumber: string, amount: number, meterType: string, phone: string) => {
    if (amount < 500) return { success: false, message: 'Minimum electricity purchase is ₦500.' };

    const markup = config.electricity_markup_flat || 100;
    const wholesaleCost = amount;
    const resellerSellPrice = amount + markup;

    if (wallet.balance < wholesaleCost) {
      return { success: false, message: `Insufficient balance. Need ₦${wholesaleCost.toLocaleString()}.` };
    }

    const updatedWallet: WalletBalance = {
      ...wallet,
      balance: wallet.balance - wholesaleCost,
    };
    saveWallet(updatedWallet);

    // Generate realistic 20-digit token (e.g. 4 groups of 4 digits or 5 groups of 4 digits)
    const randomDigits = () => Math.floor(1000 + Math.random() * 9000).toString();
    const token = `${randomDigits()}-${randomDigits()}-${randomDigits()}-${randomDigits()}-${randomDigits()}`;
    const units = (amount / 85.5).toFixed(1);

    const ref = `ELEC-${Date.now().toString().slice(-6)}`;
    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: ref,
      type: 'electricity',
      title: `${disco.provider || disco.name} Token`,
      recipient: meterNumber,
      details: `Type: ${meterType.toUpperCase()} · Phone: ${phone}`,
      amount: wholesaleCost,
      reseller_amount: resellerSellPrice,
      profit: markup,
      status: 'successful',
      token: token,
      wallet_balance_before: wallet.balance,
      wallet_balance_after: updatedWallet.balance,
      created_at: new Date().toLocaleString(),
      api_response: `Token: ${token} | Units: ${units} kWh | Meter: ${meterNumber}`,
    };

    saveTransactions([tx, ...transactions]);
    setActiveReceipt(tx);
    return { success: true, token, reference: ref, message: `Electricity paid! Token: ${token}` };
  };

  // Pay Cable TV
  const payTv = async (service: ServiceItem, smartCard: string, phone?: string) => {
    if (!smartCard || smartCard.length < 9) return { success: false, message: 'Please enter a valid SmartCard or IUC number.' };

    const wholesaleCost = service.price;
    const markup = config.cable_markup_flat || 150;
    const resellerSellPrice = wholesaleCost + markup;

    if (wallet.balance < wholesaleCost) {
      return { success: false, message: `Insufficient balance. Need ₦${wholesaleCost.toLocaleString()}.` };
    }

    const updatedWallet: WalletBalance = {
      ...wallet,
      balance: wallet.balance - wholesaleCost,
    };
    saveWallet(updatedWallet);

    const ref = `TV-${Date.now().toString().slice(-6)}`;
    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: ref,
      type: 'tv',
      title: service.name,
      recipient: smartCard,
      details: `IUC/Smartcard: ${smartCard} ${phone ? `· ${phone}` : ''}`,
      amount: wholesaleCost,
      reseller_amount: resellerSellPrice,
      profit: markup,
      status: 'successful',
      wallet_balance_before: wallet.balance,
      wallet_balance_after: updatedWallet.balance,
      created_at: new Date().toLocaleString(),
      api_response: `Subscription renewed for ${service.name}. IUC: ${smartCard}. Active for 30 days.`,
    };

    saveTransactions([tx, ...transactions]);
    setActiveReceipt(tx);
    return { success: true, reference: ref, message: `${service.name} renewed successfully!` };
  };

  // Buy Exam PIN
  const buyExamPin = async (service: ServiceItem, quantity: number) => {
    const wholesaleCost = service.price * quantity;
    const markup = (config.exam_markup_flat || 250) * quantity;
    const resellerSellPrice = wholesaleCost + markup;

    if (wallet.balance < wholesaleCost) {
      return { success: false, message: `Insufficient balance. Need ₦${wholesaleCost.toLocaleString()}.` };
    }

    const updatedWallet: WalletBalance = {
      ...wallet,
      balance: wallet.balance - wholesaleCost,
    };
    saveWallet(updatedWallet);

    const generatedPins: string[] = [];
    const prefix = service.provider === 'WAEC' ? 'WAC' : service.provider === 'NECO' ? 'NEC' : 'JMB';
    for (let i = 0; i < quantity; i++) {
      generatedPins.push(`${prefix}-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    }

    const ref = `EXAM-${Date.now().toString().slice(-6)}`;
    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: ref,
      type: 'education',
      title: `${service.name} (Qty: ${quantity})`,
      recipient: 'Client Slip',
      details: `PIN: ${generatedPins[0]} ${quantity > 1 ? `(+${quantity - 1} more)` : ''}`,
      amount: wholesaleCost,
      reseller_amount: resellerSellPrice,
      profit: markup,
      status: 'successful',
      token: generatedPins.join(', '),
      serial: `SER-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      wallet_balance_before: wallet.balance,
      wallet_balance_after: updatedWallet.balance,
      created_at: new Date().toLocaleString(),
      api_response: `Generated ${quantity} ${service.provider} PINs: ${generatedPins.join(', ')}`,
    };

    saveTransactions([tx, ...transactions]);
    setActiveReceipt(tx);
    return { success: true, pins: generatedPins, reference: ref, message: `Generated ${quantity} ${service.name} successfully!` };
  };

  // Generate Recharge Cards
  const generateRechargeCards = async (service: ServiceItem, quantity: number, denomination: number) => {
    const costPerCard = (denomination * service.price) / 100;
    const wholesaleCost = costPerCard * quantity;
    const resellerSellPrice = denomination * quantity; // Reseller sells cards at face value
    const profit = Math.round(resellerSellPrice - wholesaleCost);

    if (wallet.balance < wholesaleCost) {
      return { success: false, message: `Insufficient balance. Need ₦${wholesaleCost.toLocaleString()}.` };
    }

    const updatedWallet: WalletBalance = {
      ...wallet,
      balance: wallet.balance - wholesaleCost,
    };
    saveWallet(updatedWallet);

    const cards = Array.from({ length: quantity }, (_, i) => ({
      pin: `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      serial: `${service.provider?.slice(0, 3).toUpperCase()}-2026-${(1000 + i + Math.floor(Math.random() * 5000)).toString()}`,
    }));

    const ref = `CARD-${Date.now().toString().slice(-6)}`;
    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: ref,
      type: 'print_card',
      title: `${quantity}x ${service.provider} ₦${denomination} Vouchers`,
      recipient: 'Physical Voucher Batch',
      details: `Batch of ${quantity} ${service.provider} vouchers · Denomination ₦${denomination}`,
      amount: wholesaleCost,
      reseller_amount: resellerSellPrice,
      profit: profit,
      status: 'successful',
      token: cards[0]?.pin,
      serial: cards[0]?.serial,
      wallet_balance_before: wallet.balance,
      wallet_balance_after: updatedWallet.balance,
      created_at: new Date().toLocaleString(),
      api_response: `Generated batch of ${quantity} printable cards. Ready for print slip.`,
    };

    saveTransactions([tx, ...transactions]);
    setActiveReceipt(tx);
    return { success: true, cards, reference: ref, message: `Batch of ${quantity} vouchers generated successfully!` };
  };

  // Bulk SMS
  const sendBulkSms = async (senderId: string, recipients: string[], message: string) => {
    if (!senderId) return { success: false, message: 'Sender ID is required (up to 11 alphanumeric characters).' };
    if (!recipients.length) return { success: false, message: 'At least one recipient phone number is required.' };
    if (!message) return { success: false, message: 'Message body cannot be empty.' };

    const pageCount = Math.ceil(message.length / 160) || 1;
    const unitPrice = 3.5;
    const wholesaleCost = unitPrice * recipients.length * pageCount;
    const resellerSellPrice = Math.round(wholesaleCost * 1.3); // 30% margin
    const profit = resellerSellPrice - wholesaleCost;

    if (wallet.balance < wholesaleCost) {
      return { success: false, message: `Insufficient balance. Need ₦${wholesaleCost.toFixed(2)} for ${recipients.length} messages.` };
    }

    const updatedWallet: WalletBalance = {
      ...wallet,
      balance: wallet.balance - wholesaleCost,
    };
    saveWallet(updatedWallet);

    const ref = `SMS-${Date.now().toString().slice(-6)}`;
    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: ref,
      type: 'bulk_sms',
      title: `Bulk SMS (${recipients.length} recipients)`,
      recipient: senderId,
      details: `Pages: ${pageCount} · Total Delivered: ${recipients.length}`,
      amount: wholesaleCost,
      reseller_amount: resellerSellPrice,
      profit: Math.round(profit),
      status: 'successful',
      wallet_balance_before: wallet.balance,
      wallet_balance_after: updatedWallet.balance,
      created_at: new Date().toLocaleString(),
      api_response: `SMS dispatched via Tier-1 DND route with Sender ID "${senderId}".`,
    };

    saveTransactions([tx, ...transactions]);
    setActiveReceipt(tx);
    return { success: true, reference: ref, message: `Bulk SMS successfully sent to ${recipients.length} numbers!` };
  };

  // Buy Social Boost
  const buySocialBoost = async (service: ServiceItem, link: string, quantity: number) => {
    if (!link) return { success: false, message: 'Social profile or post URL is required.' };
    const units = quantity / 1000;
    const wholesaleCost = Math.round(service.price * units);
    const resellerSellPrice = Math.round(wholesaleCost * 1.25);
    const profit = resellerSellPrice - wholesaleCost;

    if (wallet.balance < wholesaleCost) {
      return { success: false, message: `Insufficient balance. Need ₦${wholesaleCost.toLocaleString()}.` };
    }

    const updatedWallet: WalletBalance = {
      ...wallet,
      balance: wallet.balance - wholesaleCost,
    };
    saveWallet(updatedWallet);

    const ref = `BST-${Date.now().toString().slice(-6)}`;
    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: ref,
      type: 'social_boost',
      title: `${service.name} (${quantity})`,
      recipient: link,
      details: `Target: ${link} · Qty: ${quantity}`,
      amount: wholesaleCost,
      reseller_amount: resellerSellPrice,
      profit: profit,
      status: 'processing',
      wallet_balance_before: wallet.balance,
      wallet_balance_after: updatedWallet.balance,
      created_at: new Date().toLocaleString(),
      api_response: `Boost order queued. Delivery starts within 15 minutes.`,
    };

    saveTransactions([tx, ...transactions]);
    setActiveReceipt(tx);
    return { success: true, reference: ref, message: 'Social boost order queued for delivery!' };
  };

  // Buy Logs
  const buyLogs = async (service: ServiceItem, quantity: number) => {
    const wholesaleCost = service.price * quantity;
    const resellerSellPrice = Math.round(wholesaleCost * 1.3);
    const profit = resellerSellPrice - wholesaleCost;

    if (wallet.balance < wholesaleCost) {
      return { success: false, message: `Insufficient balance. Need ₦${wholesaleCost.toLocaleString()}.` };
    }

    const updatedWallet: WalletBalance = {
      ...wallet,
      balance: wallet.balance - wholesaleCost,
    };
    saveWallet(updatedWallet);

    const creds = `username_${Date.now().toString().slice(-4)}@mail.com : Pass#${Math.floor(1000 + Math.random() * 9000)} : 2FA_KEY_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    const ref = `LOG-${Date.now().toString().slice(-6)}`;
    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: ref,
      type: 'buy_logs',
      title: service.name,
      recipient: 'Client Instant Access',
      details: `Credentials: ${creds}`,
      amount: wholesaleCost,
      reseller_amount: resellerSellPrice,
      profit: profit,
      status: 'successful',
      token: creds,
      wallet_balance_before: wallet.balance,
      wallet_balance_after: updatedWallet.balance,
      created_at: new Date().toLocaleString(),
      api_response: creds,
    };

    saveTransactions([tx, ...transactions]);
    setActiveReceipt(tx);
    return { success: true, credentials: creds, reference: ref, message: 'Account credentials delivered instantly!' };
  };

  // Rent Virtual Number
  const rentVirtualNumber = async (category: 'usa' | 'international', server_key: string, service_code: string, service_name: string) => {
    const cost = category === 'usa' ? 950 : 1150;
    const pct = (config.virtual_number_markup_percent || 20) / 100;
    const resellerCost = Math.round(cost * (1 + pct));

    if (wallet.balance < cost) {
      return { success: false, message: `Insufficient balance. Rental fee is ₦${cost}.` };
    }

    const updatedWallet: WalletBalance = {
      ...wallet,
      balance: wallet.balance - cost,
    };
    saveWallet(updatedWallet);

    const ref = `VNS-${Date.now().toString().slice(-7)}`;
    const generatedPhone =
      category === 'usa'
        ? `+1 (${Math.floor(200 + Math.random() * 700)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`
        : `+44 7${Math.floor(100000000 + Math.random() * 900000000)}`;

    const session: VirtualNumberSession = {
      reference: ref,
      category,
      server_key,
      service_name,
      service_code,
      phone_number: generatedPhone,
      status: 'waiting_for_otp',
      cost,
      reseller_cost: resellerCost,
      created_at: new Date().toLocaleTimeString(),
      expires_at: Date.now() + 15 * 60 * 1000,
    };

    setVirtualSessions([session, ...virtualSessions]);

    // Simulated background OTP delivery after 6 seconds for delightful testing
    setTimeout(() => {
      const generatedOtp = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
      setVirtualSessions((current) =>
        current.map((s) => (s.reference === ref && s.status === 'waiting_for_otp' ? { ...s, status: 'completed', otp: generatedOtp } : s))
      );
    }, 6000);

    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: ref,
      type: 'virtual_number',
      title: `${service_name} Virtual Number Rental`,
      recipient: generatedPhone,
      details: `Route: ${server_key} · Category: ${category.toUpperCase()}`,
      amount: cost,
      reseller_amount: resellerCost,
      profit: resellerCost - cost,
      status: 'processing',
      wallet_balance_before: wallet.balance,
      wallet_balance_after: updatedWallet.balance,
      created_at: new Date().toLocaleString(),
      api_response: `Number ${generatedPhone} reserved for ${service_name}. Waiting for SMS code.`,
    };

    saveTransactions([tx, ...transactions]);
    return { success: true, session, message: `Rented ${generatedPhone} for ${service_name}! Waiting for OTP...` };
  };

  // Cancel Virtual Number Rental & Refund
  const cancelVirtualRental = async (reference: string) => {
    const session = virtualSessions.find((s) => s.reference === reference);
    if (!session) return { success: false, message: 'Session not found.' };
    if (session.status === 'completed') {
      return { success: false, message: 'Cannot cancel: OTP has already been received.' };
    }

    // Refund
    const updatedWallet: WalletBalance = {
      ...wallet,
      balance: wallet.balance + session.cost,
    };
    saveWallet(updatedWallet);

    setVirtualSessions((prev) =>
      prev.map((s) => (s.reference === reference ? { ...s, status: 'cancelled' } : s))
    );

    const ref = `REFUND-${Date.now().toString().slice(-5)}`;
    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: ref,
      type: 'virtual_number',
      title: `Refund: ${session.service_name} Number Cancelled`,
      recipient: session.phone_number,
      details: `User cancelled rental before OTP arrival · Refunded ₦${session.cost}`,
      amount: -session.cost,
      reseller_amount: -session.reseller_cost,
      profit: 0,
      status: 'successful',
      wallet_balance_before: wallet.balance,
      wallet_balance_after: updatedWallet.balance,
      created_at: new Date().toLocaleString(),
      api_response: `Rental cancelled. ₦${session.cost} refunded to wallet.`,
    };
    saveTransactions([tx, ...transactions]);

    return { success: true, message: `Rental cancelled. ₦${session.cost} auto-refunded to your wallet.` };
  };

  // Request another SMS
  const requestAnotherOtp = async (reference: string) => {
    const session = virtualSessions.find((s) => s.reference === reference);
    if (!session) return { success: false, message: 'Session not found.' };
    if (session.category === 'usa') {
      return { success: false, message: 'USA routes do not support second SMS. Please rent a fresh number.' };
    }

    setTimeout(() => {
      const newOtp = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
      setVirtualSessions((prev) =>
        prev.map((s) => (s.reference === reference ? { ...s, status: 'completed', otp: newOtp } : s))
      );
    }, 4000);

    return { success: true, message: 'Second SMS requested from carrier. Please wait 10-20 seconds.' };
  };

  // Buy eSIM
  const buyEsim = async (pkg: EsimPackage, email: string) => {
    const wholesale = pkg.price;
    const pct = (config.esim_markup_percent || 15) / 100;
    const resellerCost = Math.round(wholesale * (1 + pct));
    const profit = resellerCost - wholesale;

    if (wallet.balance < wholesale) {
      return { success: false, message: `Insufficient balance. eSIM package cost is ₦${wholesale.toLocaleString()}.` };
    }

    const updatedWallet: WalletBalance = {
      ...wallet,
      balance: wallet.balance - wholesale,
    };
    saveWallet(updatedWallet);

    const ref = `ESIM-${Date.now().toString().slice(-6)}`;
    const session: EsimSession = {
      reference: ref,
      package_code: pkg.package_code,
      country: pkg.country,
      qr_code_payload: `LPA:1$smdp.jejelaye.com$${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
      activation_code: `SM-DP+: smdp.jejelaye.com | Matching ID: ${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      nickname: `${pkg.country} Travel Line`,
      status: 'active',
      data_used: '0.0 GB',
      data_remaining: pkg.data_amount,
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: wholesale,
      created_at: new Date().toLocaleString(),
    };

    setEsimSessions([session, ...esimSessions]);

    const tx: TransactionRecord = {
      id: `tx_${Date.now()}`,
      reference: ref,
      type: 'esim',
      title: `${pkg.title} eSIM`,
      recipient: email || 'Direct QR Scan',
      details: `${pkg.country} · ${pkg.data_amount} · ${pkg.duration}`,
      amount: wholesale,
      reseller_amount: resellerCost,
      profit: profit,
      status: 'completed',
      token: session.qr_code_payload,
      wallet_balance_before: wallet.balance,
      wallet_balance_after: updatedWallet.balance,
      created_at: new Date().toLocaleString(),
      api_response: `eSIM issued. QR Code ready. Activation details sent to ${email || 'customer'}.`,
    };

    saveTransactions([tx, ...transactions]);
    setActiveReceipt(tx);
    return { success: true, session, message: `eSIM for ${pkg.country} purchased successfully!` };
  };

  // Manage eSIM
  const manageEsimSession = async (reference: string, action: 'suspend' | 'unsuspend' | 'cancel') => {
    setEsimSessions((prev) =>
      prev.map((s) => {
        if (s.reference !== reference) return s;
        if (action === 'suspend') return { ...s, status: 'suspended' };
        if (action === 'unsuspend') return { ...s, status: 'active' };
        if (action === 'cancel') return { ...s, status: 'completed' };
        return s;
      })
    );
    return { success: true, message: `eSIM line status updated to ${action}.` };
  };

  // Submit Gift Card Trade
  const submitGiftCardTrade = async (
    brand: string,
    currency: string,
    card_country: string,
    card_type: 'physical' | 'ecode',
    card_amount: number,
    ecode?: string
  ) => {
    const card = giftCardRates.find((c) => c.name === brand || c.slug === brand.toLowerCase());
    const rate = card ? (card_type === 'physical' ? card.physical_rate : card.ecode_rate) : 1250;
    const payout = Math.round(card_amount * rate);

    const ref = `GC-${Date.now().toString().slice(-6)}`;
    const trade: GiftCardTrade = {
      reference: ref,
      brand,
      currency,
      card_country,
      card_type,
      card_amount,
      total_payout: payout,
      reseller_payout: Math.round(payout * 1.02),
      status: 'reviewing',
      ecode: ecode || undefined,
      images_count: card_type === 'physical' ? 1 : 0,
      created_at: new Date().toLocaleString(),
    };

    setGiftCardTrades([trade, ...giftCardTrades]);

    // Simulated auto-approval after 8 seconds
    setTimeout(() => {
      setGiftCardTrades((prev) =>
        prev.map((t) => (t.reference === ref ? { ...t, status: 'approved' } : t))
      );
      setWallet((w) => {
        const next = { ...w, gift_card_balance: w.gift_card_balance + payout };
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('jeje_reseller_wallet', JSON.stringify(next));
          }
        } catch {
          // ignore
        }
        return next;
      });
    }, 8000);

    return {
      success: true,
      trade,
      message: `Gift card submitted! Payout of ₦${payout.toLocaleString()} will credit to your Gift Card balance upon verification.`,
    };
  };

  // Resolve bank account name
  const resolveBankName = async (bankCode: string, accountNum: string) => {
    if (accountNum.length !== 10) return { success: false, message: 'Account number must be exactly 10 digits.' };

    const demoNames = [
      'EMMANUEL OBI TRADING ENTERPRISE',
      'ADEBISI KUNLE VENTURES',
      'PRECIOUS CHINONSO ENTERPRISES',
      'IBRAHIM DANLAMI SERVICES',
    ];
    const name = demoNames[Math.abs(Number(accountNum) % demoNames.length)];
    return { success: true, account_name: name };
  };

  // Support Tickets
  const createTicket = async (subject: string, message: string, txRef?: string) => {
    if (!subject || !message) return { success: false, message: 'Subject and message are required.' };
    const id = `TCK-${Date.now().toString().slice(-5)}`;
    const ticket: SupportTicket = {
      id,
      subject,
      message,
      transaction_reference: txRef,
      status: 'open',
      created_at: new Date().toLocaleString(),
      replies: [],
    };
    setTickets([ticket, ...tickets]);
    return { success: true, ticket, message: `Support ticket ${id} created. The desk will respond shortly.` };
  };

  const replyTicket = async (ticketId: string, replyMessage: string) => {
    if (!replyMessage) return { success: false, message: 'Reply message cannot be empty.' };
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'answered',
          replies: [
            ...t.replies,
            { sender: 'user', message: replyMessage, time: new Date().toLocaleTimeString() },
          ],
        };
      })
    );
    return { success: true, message: 'Reply sent.' };
  };

  // Lookup single transaction
  const lookupTransaction = async (reference: string) => {
    const found = transactions.find((t) => t.reference.toLowerCase() === reference.trim().toLowerCase());
    return found || null;
  };

  // Payment Gateway: Open / Close Modal
  const openCheckoutModal = (service?: ServiceItem) => {
    if (service) setCheckoutService(service);
    setIsCheckoutModalOpen(true);
  };

  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
    setCheckoutService(null);
  };

  // Payment Gateway: Initialize checkout session
  const initiateCustomerPayment = async (params: {
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    service_title: string;
    service_type: ServiceType;
    service_recipient?: string;
    subtotal: number;
    reseller_margin: number;
  }) => {
    try {
      const res = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const { ok, data } = await parseJsonResponse<any>(res);
      if (ok && data.data) {
        return { success: true, data: data.data };
      }
      return { success: false, message: data.message || 'Failed to initialize payment session' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error connecting to payment gateway';
      return { success: false, message: msg };
    }
  };

  // Payment Gateway: Verify and fulfill customer order
  const verifyCustomerPayment = async (params: {
    reference: string;
    channel: PaymentChannel;
    card_details?: { last4: string; brand: string };
    service_type: ServiceType;
    service_recipient?: string;
    subtotal: number;
    reseller_margin: number;
    gateway_fee: number;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    service_title: string;
  }): Promise<{ success: boolean; data?: any; message: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const { ok, data } = await parseJsonResponse<any>(res);
      if (ok && data.data) {
        const verifiedData = data.data;
        const newPayment: PaymentTransaction = {
          id: `PAY-${Date.now().toString().slice(-6)}`,
          reference: params.reference,
          customer_name: params.customer_name,
          customer_email: params.customer_email,
          customer_phone: params.customer_phone,
          service_title: params.service_title,
          service_type: params.service_type,
          service_recipient: params.service_recipient,
          subtotal: params.subtotal,
          reseller_margin: params.reseller_margin,
          gateway_fee: params.gateway_fee,
          total_amount: params.subtotal + params.gateway_fee,
          channel: params.channel,
          status: 'successful',
          payment_details: verifiedData.payment_details,
          fulfillment_status: 'fulfilled',
          fulfillment_token: verifiedData.fulfillment_token,
          created_at: verifiedData.settled_at || new Date().toLocaleString(),
        };

        // Reseller receives their profit margin directly into wallet balance
        if (params.reseller_margin > 0) {
          const updatedWallet = {
            ...wallet,
            balance: wallet.balance + params.reseller_margin,
          };
          saveWallet(updatedWallet);
        }

        // Record in transaction ledger
        const newTx: TransactionRecord = {
          id: `TXN-${Date.now()}`,
          reference: params.reference,
          type: params.service_type,
          title: `Customer Sale: ${params.service_title}`,
          recipient: params.service_recipient || params.customer_name,
          details: `Gateway Channel: ${params.channel.toUpperCase()} · Customer: ${params.customer_name}`,
          amount: params.subtotal - params.reseller_margin,
          reseller_amount: params.subtotal,
          profit: params.reseller_margin,
          status: 'successful',
          token: verifiedData.fulfillment_token,
          created_at: new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        };
        saveTransactions([newTx, ...transactions]);

        const updatedPayments = [newPayment, ...paymentTransactions];
        setPaymentTransactions(updatedPayments);
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('jeje_reseller_payments', JSON.stringify(updatedPayments));
          }
        } catch {
          // ignore
        }

        setActivePaymentReceipt(newPayment);
        return { success: true, data: newPayment, message: 'Payment successfully processed and fulfilled!' };
      }
      return { success: false, message: data.message || 'Payment verification failed' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error verifying payment';
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // Reseller Payouts: Safe disbursement
  const disbursePayout = async (params: {
    amount: number;
    source: 'main_balance' | 'gift_card' | 'margins';
    bank_code: string;
    bank_name: string;
    account_number: string;
    account_name: string;
    pin: string;
    settlement_mode?: 'instant' | 'daily_batch' | 'weekly';
  }): Promise<{ success: boolean; payout?: PayoutRecord; message: string }> => {
    const { amount, source, bank_code, bank_name, account_number, account_name, pin, settlement_mode = 'instant' } = params;

    // Balance checks
    if (source === 'gift_card' && wallet.gift_card_balance < amount) {
      return { success: false, message: `Insufficient gift card balance (₦${wallet.gift_card_balance.toLocaleString()})` };
    }
    if ((source === 'main_balance' || source === 'margins') && wallet.balance < amount) {
      return { success: false, message: `Insufficient wallet balance (₦${wallet.balance.toLocaleString()})` };
    }

    // Daily limit check
    if (payoutSettings.daily_withdrawn + amount > payoutSettings.daily_limit) {
      const remainingQuota = Math.max(0, payoutSettings.daily_limit - payoutSettings.daily_withdrawn);
      return {
        success: false,
        message: `Exceeds daily payout limit of ₦${payoutSettings.daily_limit.toLocaleString()}. Remaining today: ₦${remainingQuota.toLocaleString()}`,
      };
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/payout/disburse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          source,
          bank_code,
          bank_name,
          account_number,
          account_name,
          pin,
          settlement_mode,
        }),
      });
      const { ok, data } = await parseJsonResponse<any>(res);
      if (ok && data.payout) {
        const payoutRecord: PayoutRecord = data.payout;

        // Deduct from wallet
        const updatedWallet = { ...wallet };
        if (source === 'gift_card') {
          updatedWallet.gift_card_balance = Math.max(0, wallet.gift_card_balance - amount);
        } else {
          updatedWallet.balance = Math.max(0, wallet.balance - amount);
        }
        saveWallet(updatedWallet);

        // Update daily withdrawn
        const updatedSettings: PayoutSecuritySettings = {
          ...payoutSettings,
          daily_withdrawn: payoutSettings.daily_withdrawn + amount,
        };
        setPayoutSettings(updatedSettings);
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('jeje_reseller_payout_settings', JSON.stringify(updatedSettings));
          }
        } catch {
          // ignore
        }

        // Add payout record
        const updatedPayouts = [payoutRecord, ...payoutRecords];
        setPayoutRecords(updatedPayouts);
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('jeje_reseller_payouts', JSON.stringify(updatedPayouts));
          }
        } catch {
          // ignore
        }

        // Record in transaction ledger
        const newTx: TransactionRecord = {
          id: `TXN-PO-${Date.now()}`,
          reference: payoutRecord.reference,
          type: 'wallet_funding',
          title: `Bank Payout: ${bank_name}`,
          recipient: `${account_number} · ${account_name}`,
          details: `NIP Session ID: ${payoutRecord.nip_session_id} · Net Disbursed: ₦${payoutRecord.net_payout.toLocaleString()}`,
          amount: -amount,
          reseller_amount: -amount,
          profit: 0,
          status: 'completed',
          created_at: payoutRecord.created_at,
        };
        saveTransactions([newTx, ...transactions]);

        setActivePayoutReceipt(payoutRecord);
        return { success: true, payout: payoutRecord, message: data.message };
      }
      return { success: false, message: data.message || 'Payout failed to disburse.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error executing payout';
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePayoutSettings = (partial: Partial<PayoutSecuritySettings>) => {
    setPayoutSettings((prev) => {
      const next = { ...prev, ...partial };
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('jeje_reseller_payout_settings', JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <ResellerContext.Provider
      value={{
        config,
        updateConfig,
        wallet,
        services,
        transactions,
        virtualSessions,
        esimPackages,
        esimSessions,
        giftCardRates,
        giftCardTrades,
        tickets,
        paymentTransactions,
        payoutRecords,
        payoutSettings,
        isCheckoutModalOpen,
        checkoutService,
        activePaymentReceipt,
        activePayoutReceipt,
        openCheckoutModal,
        closeCheckoutModal,
        setActivePaymentReceipt,
        setActivePayoutReceipt,
        initiateCustomerPayment,
        verifyCustomerPayment,
        disbursePayout,
        updatePayoutSettings,
        activeTab,
        setActiveTab,
        isLoading,
        activeReceipt,
        setActiveReceipt,
        calculateResellerPrice,
        fundWallet,
        transferReferral,
        transferGiftCardToMain,
        withdrawGiftCardToBank,
        verifyElectricityMeter,
        purchaseAirtime,
        purchaseData,
        payElectricity,
        payTv,
        buyExamPin,
        generateRechargeCards,
        sendBulkSms,
        buySocialBoost,
        buyLogs,
        rentVirtualNumber,
        cancelVirtualRental,
        requestAnotherOtp,
        buyEsim,
        manageEsimSession,
        submitGiftCardTrade,
        resolveBankName,
        createTicket,
        replyTicket,
        lookupTransaction,
        testApiConnection,
      }}
    >
      {children}
    </ResellerContext.Provider>
  );
}

export function useReseller() {
  const context = useContext(ResellerContext);
  if (!context) {
    throw new Error('useReseller must be used within a ResellerProvider');
  }
  return context;
}
