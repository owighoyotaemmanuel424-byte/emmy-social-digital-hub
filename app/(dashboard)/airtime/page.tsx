'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Smartphone,
  Wallet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { BRAND } from '@/lib/branding';

interface NetworkOption {
  id: string;
  name: string;
  code: string;
  color: string;
  discountPercent: number;
}

const NETWORKS: NetworkOption[] = [
  { id: '101', name: 'MTN Nigeria', code: 'MTN', color: 'from-amber-400 to-yellow-500', discountPercent: 2 },
  { id: '102', name: 'Airtel Nigeria', code: 'AIRTEL', color: 'from-rose-500 to-red-600', discountPercent: 2 },
  { id: '103', name: 'Glo Mobile', code: 'GLO', color: 'from-emerald-500 to-green-600', discountPercent: 3 },
  { id: '104', name: '9mobile', code: '9MOBILE', color: 'from-lime-500 to-emerald-600', discountPercent: 2 },
];

const PRESET_AMOUNTS = [50, 100, 200, 500, 1000];

export default function AirtimePurchasePage() {
  const router = useRouter();

  const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption>(NETWORKS[0]);
  const [phone, setPhone] = useState<string>('');
  const [amount, setAmount] = useState<number>(50);
  const [walletBalanceNaira, setWalletBalanceNaira] = useState<number>(0);
  const [formattedBalance, setFormattedBalance] = useState<string>('₦0.00');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto-detect network from phone prefix
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setPhone(raw);

    if (raw.length >= 4) {
      const prefix = raw.substring(0, 4);
      if (['0803', '0806', '0703', '0706', '0813', '0816', '0810', '0814', '0903', '0906', '0913', '0916'].includes(prefix)) {
        setSelectedNetwork(NETWORKS[0]); // MTN
      } else if (['0802', '0808', '0708', '0812', '0701', '0902', '0901', '0904', '0907', '0912'].includes(prefix)) {
        setSelectedNetwork(NETWORKS[1]); // Airtel
      } else if (['0805', '0807', '0705', '0815', '0811', '0905', '0915'].includes(prefix)) {
        setSelectedNetwork(NETWORKS[2]); // Glo
      } else if (['0809', '0817', '0818', '0909', '0908'].includes(prefix)) {
        setSelectedNetwork(NETWORKS[3]); // 9mobile
      }
    }
  };

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

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      setError('Please enter a valid 11-digit Nigerian phone number.');
      return;
    }

    if (amount < 50 || amount > 50000) {
      setError('Amount must be between ₦50 and ₦50,000.');
      return;
    }

    if (walletBalanceNaira < amount) {
      setError(`Insufficient wallet balance (${formattedBalance}). Please fund your wallet to proceed.`);
      return;
    }

    setLoading(true);

    try {
      const idempotencyKey = `airtime_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const res = await fetch('/api/airtime/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedNetwork.id,
          phone: cleanPhone,
          amount,
          idempotency_key: idempotencyKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete airtime recharge.');
      }

      setSuccess(`Airtime recharge of ₦${amount.toLocaleString()} queued successfully!`);
      const ref = data.reference || data.transactionId || data.transaction?.id;

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
          <Sparkles className="h-3.5 w-3.5" />
          <span>Automated VTU Recharge</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Buy Instant Airtime
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Fast airtime delivery for MTN, Airtel, Glo, and 9mobile with zero service charge.
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
            <span>{success} Loading receipt...</span>
          </div>
        )}

        <form onSubmit={handlePurchase} className="space-y-6">
          {/* Network Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Network Provider
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {NETWORKS.map((net) => {
                const isSelected = selectedNetwork.id === net.id;
                return (
                  <button
                    type="button"
                    key={net.id}
                    onClick={() => setSelectedNetwork(net)}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between h-20 ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-white">{net.code}</span>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isSelected ? 'bg-emerald-400' : 'bg-slate-700'
                        }`}
                      />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold">
                      {net.discountPercent}% Off Retail
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Recipient Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                maxLength={11}
                placeholder="08140008920"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full py-3 pl-4 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-base placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
              <Smartphone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Amount Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                3. Amount (₦)
              </label>
              <span className="text-[11px] text-slate-400">Min ₦50 · Max ₦50,000</span>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-black text-lg">
                ₦
              </span>
              <input
                type="number"
                min={50}
                max={50000}
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full py-3 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-white font-black text-lg focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`py-1 px-3 rounded-lg text-xs font-bold transition ${
                    amount === amt
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  ₦{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing summary */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">You Pay:</span>
            <span className="text-base font-black text-emerald-400">
              ₦{amount.toLocaleString()}
            </span>
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
                <span>Processing Recharge...</span>
              </>
            ) : (
              <>
                <span>Buy Airtime ₦{amount.toLocaleString()}</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs text-center pt-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Protected by Emmy Social Digital Hub Idempotency Safeguard</span>
        </div>
      </div>
    </div>
  );
}
