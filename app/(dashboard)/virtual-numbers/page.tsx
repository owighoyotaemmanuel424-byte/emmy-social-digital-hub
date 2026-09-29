'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Wallet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Globe,
  Clock,
  Sparkles,
} from 'lucide-react';
import { BRAND } from '@/lib/branding';

interface ServiceOption {
  id: string;
  name: string;
  price: number;
}

const SERVICES: ServiceOption[] = [
  { id: 'whatsapp', name: 'WhatsApp', price: 950 },
  { id: 'telegram', name: 'Telegram', price: 850 },
  { id: 'openai', name: 'OpenAI / ChatGPT', price: 750 },
  { id: 'google', name: 'Google / Gmail', price: 700 },
  { id: 'twitter', name: 'Twitter / X', price: 800 },
  { id: 'tiktok', name: 'TikTok', price: 650 },
  { id: 'facebook', name: 'Facebook', price: 700 },
  { id: 'instagram', name: 'Instagram', price: 700 },
];

export default function VirtualNumbersPage() {
  const router = useRouter();

  const [selectedService, setSelectedService] = useState<ServiceOption>(SERVICES[0]);
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; code: string }>({
    name: 'Nigeria',
    code: '234',
  });

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

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (walletBalanceNaira < selectedService.price) {
      setError(`Insufficient wallet balance (${formattedBalance}). Leasing this virtual number requires ₦${selectedService.price.toLocaleString()}. Please fund your wallet.`);
      return;
    }

    setLoading(true);

    try {
      const idempotencyKey = `vnum_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const res = await fetch('/api/virtual-numbers/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: selectedService.name,
          country: selectedCountry.name,
          countryCode: selectedCountry.code,
          price: selectedService.price,
          idempotency_key: idempotencyKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to order virtual number.');

      setSuccess(`Virtual number leased! Loading your verification inbox...`);
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
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Disposable SMS & OTP Numbers</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Virtual Numbers (OTP Verification)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Temporary phone numbers for instant SMS verification codes across social, crypto, and messaging apps.
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

        <form onSubmit={handleOrder} className="space-y-6">
          {/* Target Service App */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Application for Verification
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SERVICES.map((srv) => {
                const isSelected = selectedService.id === srv.id;
                return (
                  <button
                    type="button"
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-20 ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-black text-white">{srv.name}</span>
                    <span className="text-xs font-black text-emerald-400">
                      ₦{srv.price.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Country Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Phone Number Country
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Nigeria', code: '234', flag: '🇳🇬' },
                { name: 'United States', code: '1', flag: '🇺🇸' },
                { name: 'United Kingdom', code: '44', flag: '🇬🇧' },
              ].map((c) => {
                const isSelected = selectedCountry.code === c.code;
                return (
                  <button
                    type="button"
                    key={c.code}
                    onClick={() => setSelectedCountry({ name: c.name, code: c.code })}
                    className={`py-2.5 px-3 rounded-xl border text-center text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Guarantee Info */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span>20-Minute OTP Waiting Window</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              You will be assigned an active temporary number. Once you input it into your app, the incoming SMS verification code will arrive on your receipt page automatically.
            </p>
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
                <span>Leasing Number...</span>
              </>
            ) : (
              <>
                <span>Lease Virtual Number ₦{selectedService.price.toLocaleString()}</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs text-center pt-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Real-time webhook listener active for instant code retrieval</span>
        </div>
      </div>
    </div>
  );
}
