'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wifi,
  Wallet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { BRAND } from '@/lib/branding';

interface DataPlan {
  id: string;
  name: string;
  network: 'MTN' | 'Airtel' | 'Glo' | '9mobile';
  type: 'SME' | 'Corporate' | 'Gifting';
  volume: string;
  validity: string;
  price: number;
}

const DATA_PLANS: DataPlan[] = [
  // MTN
  { id: '201', name: 'MTN SME 1.0GB', network: 'MTN', type: 'SME', volume: '1GB', validity: '30 Days', price: 265 },
  { id: '202', name: 'MTN SME 2.0GB', network: 'MTN', type: 'SME', volume: '2GB', validity: '30 Days', price: 530 },
  { id: '203', name: 'MTN SME 3.0GB', network: 'MTN', type: 'SME', volume: '3GB', validity: '30 Days', price: 795 },
  { id: '204', name: 'MTN SME 5.0GB', network: 'MTN', type: 'SME', volume: '5GB', validity: '30 Days', price: 1325 },
  { id: '205', name: 'MTN Corporate 10GB', network: 'MTN', type: 'Corporate', volume: '10GB', validity: '30 Days', price: 2750 },

  // AIRTEL
  { id: '206', name: 'Airtel CG 1.0GB', network: 'Airtel', type: 'Corporate', volume: '1GB', validity: '30 Days', price: 290 },
  { id: '207', name: 'Airtel CG 2.0GB', network: 'Airtel', type: 'Corporate', volume: '2GB', validity: '30 Days', price: 580 },
  { id: '208', name: 'Airtel CG 5.0GB', network: 'Airtel', type: 'Corporate', volume: '5GB', validity: '30 Days', price: 1450 },
  { id: '209', name: 'Airtel CG 10GB', network: 'Airtel', type: 'Corporate', volume: '10GB', validity: '30 Days', price: 2900 },

  // GLO
  { id: '210', name: 'Glo Corporate 1.0GB', network: 'Glo', type: 'Corporate', volume: '1GB', validity: '30 Days', price: 250 },
  { id: '211', name: 'Glo Corporate 2.0GB', network: 'Glo', type: 'Corporate', volume: '2GB', validity: '30 Days', price: 500 },
  { id: '212', name: 'Glo Corporate 5.0GB', network: 'Glo', type: 'Corporate', volume: '5GB', validity: '30 Days', price: 1250 },

  // 9MOBILE
  { id: '213', name: '9mobile SME 1.5GB', network: '9mobile', type: 'SME', volume: '1.5GB', validity: '30 Days', price: 320 },
  { id: '214', name: '9mobile SME 3.0GB', network: '9mobile', type: 'SME', volume: '3GB', validity: '30 Days', price: 640 },
];

export default function DataPurchasePage() {
  const router = useRouter();

  const [selectedNetwork, setSelectedNetwork] = useState<'MTN' | 'Airtel' | 'Glo' | '9mobile'>('MTN');
  const [selectedPlan, setSelectedPlan] = useState<DataPlan>(DATA_PLANS[0]);
  const [phone, setPhone] = useState<string>('');
  const [walletBalanceNaira, setWalletBalanceNaira] = useState<number>(0);
  const [formattedBalance, setFormattedBalance] = useState<string>('₦0.00');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Auto network detector
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setPhone(raw);

    if (raw.length >= 4) {
      const prefix = raw.substring(0, 4);
      if (['0803', '0806', '0703', '0706', '0813', '0816', '0810', '0814', '0903', '0906', '0913', '0916'].includes(prefix)) {
        handleNetworkSelect('MTN');
      } else if (['0802', '0808', '0708', '0812', '0701', '0902', '0901', '0904', '0907', '0912'].includes(prefix)) {
        handleNetworkSelect('Airtel');
      } else if (['0805', '0807', '0705', '0815', '0811', '0905', '0915'].includes(prefix)) {
        handleNetworkSelect('Glo');
      } else if (['0809', '0817', '0818', '0909', '0908'].includes(prefix)) {
        handleNetworkSelect('9mobile');
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

  const handleNetworkSelect = (net: 'MTN' | 'Airtel' | 'Glo' | '9mobile') => {
    setSelectedNetwork(net);
    const available = DATA_PLANS.filter((p) => p.network === net);
    if (available.length > 0) {
      setSelectedPlan(available[0]);
    }
  };

  const filteredPlans = DATA_PLANS.filter((p) => p.network === selectedNetwork);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      setError('Please enter a valid 11-digit Nigerian phone number.');
      return;
    }

    if (walletBalanceNaira < selectedPlan.price) {
      setError(`Insufficient wallet balance (${formattedBalance}). This plan costs ₦${selectedPlan.price.toLocaleString()}. Please fund your wallet.`);
      return;
    }

    setLoading(true);

    try {
      const idempotencyKey = `data_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const res = await fetch('/api/data/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedPlan.id,
          planName: selectedPlan.name,
          network: selectedPlan.network,
          phone: cleanPhone,
          amount: selectedPlan.price,
          idempotency_key: idempotencyKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch data bundle.');

      setSuccess(`Data plan (${selectedPlan.name}) queued for ${cleanPhone}!`);
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
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Zap className="h-3.5 w-3.5" />
          <span>High-Speed Direct Delivery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Buy Mobile Data Bundles
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          SME, Corporate Gifting & Direct data plans for MTN, Airtel, Glo, and 9mobile.
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
          {/* Network Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Network
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['MTN', 'Airtel', 'Glo', '9mobile'] as const).map((net) => {
                const isSelected = selectedNetwork === net;
                return (
                  <button
                    type="button"
                    key={net}
                    onClick={() => handleNetworkSelect(net)}
                    className={`py-3 px-4 rounded-2xl border text-center font-bold text-xs transition ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {net}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Choose Data Plan
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredPlans.map((plan) => {
                const isChosen = selectedPlan.id === plan.id;
                return (
                  <button
                    type="button"
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                      isChosen
                        ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">{plan.volume}</span>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-900 text-emerald-400 border border-slate-800">
                          {plan.type}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        Validity: {plan.validity}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-emerald-400 block">
                        ₦{plan.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500">Retail price</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phone Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              3. Recipient Phone Number
            </label>
            <input
              type="tel"
              required
              maxLength={11}
              placeholder="08140008920"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-base placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Order Summary */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">Selected Order:</span>
              <span className="text-white font-bold text-sm">
                {selectedNetwork} {selectedPlan.volume} ({selectedPlan.validity})
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Total Due:</span>
              <span className="text-xl font-black text-emerald-400">
                ₦{selectedPlan.price.toLocaleString()}
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
                <span>Activating Data Bundle...</span>
              </>
            ) : (
              <>
                <span>Buy Data ₦{selectedPlan.price.toLocaleString()}</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs text-center pt-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Automated direct dispatch via Emmy Social Digital Hub</span>
        </div>
      </div>
    </div>
  );
}
