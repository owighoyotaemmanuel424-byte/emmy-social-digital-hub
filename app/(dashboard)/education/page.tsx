'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Wallet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Plus,
  Minus,
} from 'lucide-react';
import { BRAND } from '@/lib/branding';

interface ExamItem {
  id: string;
  code: string;
  name: string;
  price: number;
  description: string;
}

const EXAM_ITEMS: ExamItem[] = [
  {
    id: 'waec',
    code: 'WAEC',
    name: 'WAEC Result Checker PIN',
    price: 3450,
    description: 'Check WAEC May/June or Nov/Dec results online with instant card serial & PIN.',
  },
  {
    id: 'neco',
    code: 'NECO',
    name: 'NECO Token (5 Result Checks)',
    price: 1200,
    description: 'Official NECO token usable for checking 5 candidate exam results on the portal.',
  },
  {
    id: 'jamb',
    code: 'JAMB',
    name: 'JAMB UTME e-PIN (With Mock)',
    price: 7700,
    description: 'Official JAMB UTME registration profile PIN for candidate registration.',
  },
  {
    id: 'nabteb',
    code: 'NABTEB',
    name: 'NABTEB Result Checker PIN',
    price: 1100,
    description: 'Verify NABTEB May/June or Nov/Dec result certificates online.',
  },
];

export default function EducationPage() {
  const router = useRouter();

  const [selectedExam, setSelectedExam] = useState<ExamItem>(EXAM_ITEMS[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [phone, setPhone] = useState<string>('');

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

  const totalCost = selectedExam.price * quantity;

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (walletBalanceNaira < totalCost) {
      setError(`Insufficient wallet balance (${formattedBalance}). This order requires ₦${totalCost.toLocaleString()}. Please fund your wallet.`);
      return;
    }

    setLoading(true);

    try {
      const idempotencyKey = `edu_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      const res = await fetch('/api/education/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examBoard: selectedExam.code,
          examName: selectedExam.name,
          quantity,
          unitPrice: selectedExam.price,
          phone,
          idempotency_key: idempotencyKey,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to complete exam PIN purchase.');

      setSuccess(`Exam PIN generated! Retrieving your PIN & Serial...`);
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
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Official Educational Vouchers</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Exam Scratch Cards & PINs
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Instant delivery of WAEC, NECO, JAMB, and NABTEB result checker PINs and registration tokens.
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
          {/* Exam Board Picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Select Examination Board
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXAM_ITEMS.map((exam) => {
                const isSelected = selectedExam.id === exam.id;
                return (
                  <button
                    type="button"
                    key={exam.id}
                    onClick={() => setSelectedExam(exam)}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white">{exam.code}</span>
                        <span className="text-sm font-black text-emerald-400">
                          ₦{exam.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-semibold mt-1">{exam.name}</p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{exam.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Quantity of Cards / Tokens
            </label>
            <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-2xl border border-slate-800 max-w-[200px]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex-1 text-center font-black text-white text-base">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Phone for SMS receipt */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              3. Phone Number (Optional SMS Delivery)
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

          {/* Total Calculation */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block">Order Total:</span>
              <span className="text-white font-bold text-sm">
                {quantity}x {selectedExam.name}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Total Due:</span>
              <span className="text-xl font-black text-emerald-400">
                ₦{totalCost.toLocaleString()}
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
                <span>Generating Scratch PINs...</span>
              </>
            ) : (
              <>
                <span>Buy Scratch Card ₦{totalCost.toLocaleString()}</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs text-center pt-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>PIN & Serial numbers display instantly on your printable receipt</span>
        </div>
      </div>
    </div>
  );
}
