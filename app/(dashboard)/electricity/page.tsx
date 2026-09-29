'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap,
  Wallet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Building2,
  Check,
} from 'lucide-react';
import { BRAND } from '@/lib/branding';

interface DisCo {
  id: string;
  name: string;
  code: string;
  state: string;
}

const DISCOS: DisCo[] = [
  { id: '301', name: 'Ikeja Electric (IKEDC)', code: 'IKEDC', state: 'Lagos Mainland' },
  { id: '302', name: 'Eko Electric (EKEDC)', code: 'EKEDC', state: 'Lagos Island' },
  { id: '303', name: 'Abuja Electric (AEDC)', code: 'AEDC', state: 'FCT / Niger / Kogi' },
  { id: '304', name: 'Ibadan Electric (IBEDC)', code: 'IBEDC', state: 'Oyo / Ogun / Osun' },
  { id: '305', name: 'Enugu Electric (EEDC)', code: 'EEDC', state: 'South East' },
  { id: '306', name: 'Port Harcourt (PHED)', code: 'PHED', state: 'Rivers / Bayelsa / Akwa Ibom' },
  { id: '307', name: 'Kano Electric (KEDCO)', code: 'KEDCO', state: 'Kano / Katsina / Jigawa' },
  { id: '308', name: 'Benin Electric (BEDC)', code: 'BEDC', state: 'Edo / Delta / Ondo' },
];

export default function ElectricityPage() {
  const router = useRouter();

  const [selectedDisco, setSelectedDisco] = useState<DisCo>(DISCOS[0]);
  const [meterType, setMeterType] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [meterNumber, setMeterNumber] = useState<string>('');
  const [amount, setAmount] = useState<number>(2000);
  const [phone, setPhone] = useState<string>('');

  // Meter verification state
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifiedCustomer, setVerifiedCustomer] = useState<{
    name: string;
    address: string;
    meterNumber: string;
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

  const handleVerifyMeter = async () => {
    const cleanMeter = meterNumber.replace(/[^0-9]/g, '');
    if (!cleanMeter || cleanMeter.length < 9) {
      setError('Please enter a valid meter number before verification.');
      return;
    }

    setError(null);
    setVerifying(true);
    setVerifiedCustomer(null);

    try {
      const res = await fetch('/api/bills/verify-meter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disco: selectedDisco.code,
          meterNumber: cleanMeter,
          meterType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Meter verification failed');

      setVerifiedCustomer({
        name: data.customerName,
        address: data.address,
        meterNumber: cleanMeter,
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

    const cleanMeter = meterNumber.replace(/[^0-9]/g, '');
    if (!cleanMeter || cleanMeter.length < 9) {
      setError('Please enter a valid meter number.');
      return;
    }

    if (amount < 500 || amount > 100000) {
      setError('Amount must be between ₦500 and ₦100,000.');
      return;
    }

    if (walletBalanceNaira < amount) {
      setError(`Insufficient wallet balance (${formattedBalance}). Please top up your wallet.`);
      return;
    }

    setLoading(true);

    try {
      const idempotencyKey = `meter_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const res = await fetch('/api/electricity/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disco: selectedDisco.code,
          discoName: selectedDisco.name,
          meterNumber: cleanMeter,
          meterType,
          customerName: verifiedCustomer?.name || 'Verified Customer',
          phone,
          amount,
          idempotency_key: idempotencyKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process electricity payment.');

      setSuccess(`Electricity payment queued! Generating ${meterType} token...`);
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
          <Zap className="h-3.5 w-3.5" />
          <span>Instant Token Generation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Pay Electricity Bills
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Prepaid meter tokens & postpaid bill clearance across all Nigerian electricity distribution companies.
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
          {/* DisCo Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Distribution Company (DisCo)
            </label>
            <select
              value={selectedDisco.id}
              onChange={(e) => {
                const found = DISCOS.find((d) => d.id === e.target.value);
                if (found) {
                  setSelectedDisco(found);
                  setVerifiedCustomer(null);
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
            >
              {DISCOS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.state}
                </option>
              ))}
            </select>
          </div>

          {/* Meter Type Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Meter Type
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setMeterType('prepaid')}
                className={`py-2.5 text-xs font-bold rounded-xl transition ${
                  meterType === 'prepaid'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Prepaid (Generates Token)
              </button>
              <button
                type="button"
                onClick={() => setMeterType('postpaid')}
                className={`py-2.5 text-xs font-bold rounded-xl transition ${
                  meterType === 'postpaid'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Postpaid (Bill Clearance)
              </button>
            </div>
          </div>

          {/* Meter Number Input + Verification */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                3. Meter Number
              </label>
              <span className="text-[11px] text-slate-400">9 to 13 digits</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                required
                maxLength={13}
                placeholder="01011508219"
                value={meterNumber}
                onChange={(e) => {
                  setMeterNumber(e.target.value.replace(/[^0-9]/g, ''));
                  setVerifiedCustomer(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-base placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={handleVerifyMeter}
                disabled={verifying || meterNumber.length < 9}
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

          {/* Verified Customer Card */}
          {verifiedCustomer && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Check className="h-4 w-4" />
                <span>Meter Verified Successfully</span>
              </div>
              <p className="text-white font-black text-sm">{verifiedCustomer.name}</p>
              <p className="text-xs text-slate-400">{verifiedCustomer.address}</p>
            </div>
          )}

          {/* Amount Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                4. Amount (₦)
              </label>
              <span className="text-[11px] text-slate-400">Min ₦500 · Max ₦100,000</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-black text-lg">
                ₦
              </span>
              <input
                type="number"
                min={500}
                max={100000}
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value) || 0)}
                className="w-full py-3 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-white font-black text-lg focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[1000, 2000, 5000, 10000, 20000].map((amt) => (
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
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Phone for SMS receipt */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              5. Phone Number (Optional SMS Delivery)
            </label>
            <input
              type="tel"
              maxLength={11}
              placeholder="08140008920"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
            />
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
                <span>Pay Electricity Bill ₦{amount.toLocaleString()}</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs text-center pt-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Prepaid tokens generated automatically and saved to your receipt</span>
        </div>
      </div>
    </div>
  );
}
