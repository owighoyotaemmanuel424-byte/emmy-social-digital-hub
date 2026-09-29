'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tv,
  Wallet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Check,
} from 'lucide-react';
import { BRAND } from '@/lib/branding';

interface TvProvider {
  id: string;
  name: string;
  code: string;
}

interface TvPackage {
  id: string;
  provider: string;
  name: string;
  price: number;
  channels: string;
}

const TV_PROVIDERS: TvProvider[] = [
  { id: 'dstv', name: 'DStv', code: 'DSTV' },
  { id: 'gotv', name: 'GOtv', code: 'GOTV' },
  { id: 'startimes', name: 'StarTimes', code: 'STARTIMES' },
  { id: 'showmax', name: 'Showmax', code: 'SHOWMAX' },
];

const TV_PACKAGES: TvPackage[] = [
  // DStv
  { id: 'dstv_padi', provider: 'DSTV', name: 'DStv Padi Bouquet', price: 3600, channels: '45+ Channels' },
  { id: 'dstv_yanga', provider: 'DSTV', name: 'DStv Yanga Bouquet', price: 5100, channels: '85+ Channels' },
  { id: 'dstv_confam', provider: 'DSTV', name: 'DStv Confam Bouquet', price: 9300, channels: '105+ Channels' },
  { id: 'dstv_compact', provider: 'DSTV', name: 'DStv Compact Bouquet', price: 15700, channels: '130+ Premier League' },
  { id: 'dstv_compact_plus', provider: 'DSTV', name: 'DStv Compact Plus', price: 25000, channels: '145+ UCL & La Liga' },

  // GOtv
  { id: 'gotv_smallie', provider: 'GOTV', name: 'GOtv Smallie Monthly', price: 1575, channels: '35+ Basic Channels' },
  { id: 'gotv_jinja', provider: 'GOTV', name: 'GOtv Jinja Bouquet', price: 3300, channels: '45+ Channels' },
  { id: 'gotv_jolli', provider: 'GOTV', name: 'GOtv Jolli Bouquet', price: 4850, channels: '65+ Channels' },
  { id: 'gotv_max', provider: 'GOTV', name: 'GOtv Max Bouquet', price: 7200, channels: 'La Liga, Serie A & WWE' },
  { id: 'gotv_supa', provider: 'GOTV', name: 'GOtv Supa Bouquet', price: 9600, channels: 'All Entertainment & Kids' },

  // StarTimes
  { id: 'startimes_nova', provider: 'STARTIMES', name: 'StarTimes Nova Monthly', price: 1700, channels: '30+ Channels' },
  { id: 'startimes_basic', provider: 'STARTIMES', name: 'StarTimes Basic Antenna', price: 3000, channels: 'Basic Antenna Channels' },
  { id: 'startimes_classic', provider: 'STARTIMES', name: 'StarTimes Classic Dish', price: 5000, channels: 'Classic All-Channel Dish' },

  // Showmax
  { id: 'showmax_mobile', provider: 'SHOWMAX', name: 'Showmax Mobile Monthly', price: 1450, channels: 'Mobile Movies & Series' },
  { id: 'showmax_pl', provider: 'SHOWMAX', name: 'Showmax Premier League Mobile', price: 2900, channels: 'All 380 EPL Live Matches' },
];

export default function CableTvPage() {
  const router = useRouter();

  const [selectedProvider, setSelectedProvider] = useState<TvProvider>(TV_PROVIDERS[0]);
  const [smartcard, setSmartcard] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<TvPackage>(TV_PACKAGES[0]);
  const [phone, setPhone] = useState<string>('');

  // Verification state
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifiedSubscriber, setVerifiedSubscriber] = useState<{
    name: string;
    smartcard: string;
    currentBouquet?: string;
  } | null>(null);

  const [walletBalanceNaira, setWalletBalanceNaira] = useState<number>(0);
  const [formattedBalance, setFormattedBalance] = useState<string>('₦0.00');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadWallet() {
      try {
        const res = await fetch('/api/wallet/balance');
        if (res.ok) {
          const data = await res.json();
          setWalletBalanceNaira(data.balanceNaira);
          setFormattedBalance(data.formattedBalance);
        }
      } catch (err) {
        console.error('Failed to load wallet:', err);
      }
    }
    loadWallet();
  }, []);

  // Filter packages by provider
  const availablePackages = TV_PACKAGES.filter((p) => p.provider === selectedProvider.code);

  const handleProviderSelect = (prov: TvProvider) => {
    setSelectedProvider(prov);
    setVerifiedSubscriber(null);
    const available = TV_PACKAGES.filter((p) => p.provider === prov.code);
    if (available.length > 0) {
      setSelectedPackage(available[0]);
    }
  };

  const handleVerify = async () => {
    const cleanCard = smartcard.replace(/[^0-9]/g, '');
    if (!cleanCard || cleanCard.length < 8) {
      setError('Please enter a valid Smartcard / IUC number before verifying.');
      return;
    }

    setError(null);
    setVerifying(true);
    setVerifiedSubscriber(null);

    try {
      const res = await fetch('/api/bills/verify-smartcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider.code,
          smartcardNumber: cleanCard,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Smartcard verification failed');

      setVerifiedSubscriber({
        name: data.customerName,
        smartcard: cleanCard,
        currentBouquet: data.currentBouquet,
      });
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setVerifying(false);
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanCard = smartcard.replace(/[^0-9]/g, '');
    if (!cleanCard || cleanCard.length < 8) {
      setError('Please enter a valid smartcard number.');
      return;
    }

    if (walletBalanceNaira < selectedPackage.price) {
      setError(`Insufficient wallet balance (${formattedBalance}). This subscription requires ₦${selectedPackage.price.toLocaleString()}. Please fund your wallet.`);
      return;
    }

    setLoading(true);

    try {
      const idempotencyKey = `cable_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const res = await fetch('/api/cable/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider.code,
          smartcardNumber: cleanCard,
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          customerName: verifiedSubscriber?.name || 'Subscriber',
          amount: selectedPackage.price,
          phone,
          idempotency_key: idempotencyKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to complete subscription.');

      setSuccess(`Subscription renewed! Activating ${selectedPackage.name}...`);
      const ref = data.reference || data.transactionId;

      setTimeout(() => {
        router.push(`/transactions/${ref}`);
      }, 700);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Tv className="h-3.5 w-3.5" />
          <span>Automated Decoder Activation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Cable TV Subscriptions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Instant bouquet renewal for DStv, GOtv, StarTimes, and Showmax with zero surcharge.
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Wallet Balance Display */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">
                Wallet Balance
              </span>
              <span className="text-base sm:text-lg font-bold text-white">
                {formattedBalance}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push('/wallet')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
          >
            Fund Wallet &rarr;
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handlePurchase} className="space-y-6">
          {/* Provider Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Cable TV Provider
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TV_PROVIDERS.map((prov) => {
                const isSelected = selectedProvider.id === prov.id;
                return (
                  <button
                    type="button"
                    key={prov.id}
                    onClick={() => handleProviderSelect(prov)}
                    className={`py-3 px-4 rounded-2xl border text-center font-bold text-xs transition ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {prov.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smartcard / IUC Input + Verify */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                2. Smartcard / IUC / Account Number
              </label>
              <span className="text-[11px] text-slate-400">10 or 11 digits</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                required
                maxLength={12}
                placeholder="1029384756"
                value={smartcard}
                onChange={(e) => {
                  setSmartcard(e.target.value.replace(/[^0-9]/g, ''));
                  setVerifiedSubscriber(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-base placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying || smartcard.length < 8}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition flex items-center gap-1.5 disabled:opacity-40"
              >
                {verifying ? (
                  <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
                ) : (
                  <Search className="h-4 w-4 text-emerald-400" />
                )}
                <span>Verify</span>
              </button>
            </div>
          </div>

          {/* Verified Subscriber Card */}
          {verifiedSubscriber && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Check className="h-4 w-4" />
                <span>Subscriber Verified</span>
              </div>
              <p className="text-white font-black text-sm">{verifiedSubscriber.name}</p>
              {verifiedSubscriber.currentBouquet && (
                <p className="text-xs text-slate-400">Package: {verifiedSubscriber.currentBouquet}</p>
              )}
            </div>
          )}

          {/* Bouquet Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              3. Choose Bouquet Package
            </label>
            <select
              value={selectedPackage.id}
              onChange={(e) => {
                const found = availablePackages.find((p) => p.id === e.target.value);
                if (found) setSelectedPackage(found);
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
            >
              {availablePackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} — ₦{pkg.price.toLocaleString()} ({pkg.channels})
                </option>
              ))}
            </select>
          </div>

          {/* Pricing summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">Subscription:</span>
              <span className="text-white font-bold text-sm">{selectedPackage.name}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Total Due:</span>
              <span className="text-xl font-black text-emerald-400">
                ₦{selectedPackage.price.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.99] text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Renewing Bouquet...</span>
              </>
            ) : (
              <>
                <span>Renew Subscription ₦{selectedPackage.price.toLocaleString()}</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs text-center pt-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Instant automatic activation within 5 minutes</span>
        </div>
      </div>
    </div>
  );
}
