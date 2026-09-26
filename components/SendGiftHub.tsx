'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  Send,
  Gift,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Heart,
  Share2,
  Download,
} from 'lucide-react';

interface GiftVoucher {
  id: string;
  voucher_code: string;
  recipient: string;
  amount: number;
  theme: string;
  note: string;
  created_at: string;
  claimed: boolean;
}

export function SendGiftHub() {
  const { wallet } = useReseller();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(5000);
  const [theme, setTheme] = useState<'business' | 'birthday' | 'thank_you' | 'congrats'>('business');
  const [note, setNote] = useState('Enjoy this digital wallet gift on Emmy Digital HUB!');
  const [isSending, setIsSending] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [generatedVoucher, setGeneratedVoucher] = useState<GiftVoucher | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const [vouchers, setVouchers] = useState<GiftVoucher[]>([
    {
      id: 'GIFT-9821',
      voucher_code: 'JEJE-GIFT-894-K92L',
      recipient: 'adebayo.reseller@gmail.com',
      amount: 10000,
      theme: 'Business Partner Bonus',
      note: 'Thanks for hitting the monthly VTU reseller target!',
      created_at: '2 days ago',
      claimed: true,
    },
  ]);

  const themes = [
    { id: 'business', label: 'Business Bonus', color: 'from-emerald-700 to-teal-900', icon: Sparkles },
    { id: 'birthday', label: 'Happy Birthday', color: 'from-purple-700 to-indigo-900', icon: Gift },
    { id: 'thank_you', label: 'Appreciation', color: 'from-rose-600 to-amber-700', icon: Heart },
    { id: 'congrats', label: 'Congratulations', color: 'from-amber-600 to-orange-800', icon: Sparkles },
  ] as const;

  const handleSendGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) {
      setAlert({ type: 'error', message: 'Please enter recipient email, Emmy Digital HUB ID, or phone number' });
      return;
    }
    if (amount <= 0) {
      setAlert({ type: 'error', message: 'Gift amount must be greater than ₦0' });
      return;
    }
    if (wallet.balance < amount) {
      setAlert({
        type: 'error',
        message: `Insufficient wallet balance. You have ₦${wallet.balance.toFixed(2)}, need ₦${amount.toLocaleString()}`,
      });
      return;
    }

    setIsSending(true);
    setAlert(null);

    setTimeout(() => {
      const code = `JEJE-GIFT-${Math.floor(100 + Math.random() * 900)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const newVoucher: GiftVoucher = {
        id: `GIFT-${Math.floor(Math.random() * 899999 + 100000)}`,
        voucher_code: code,
        recipient,
        amount,
        theme: themes.find((t) => t.id === theme)?.label || 'Gift',
        note,
        created_at: 'Just now',
        claimed: false,
      };

      setGeneratedVoucher(newVoucher);
      setVouchers([newVoucher, ...vouchers]);
      setIsSending(false);
      setAlert({
        type: 'success',
        message: `Gift voucher of ₦${amount.toLocaleString()} generated for ${recipient}!`,
      });
    }, 800);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <Gift className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Send Gift & P2P Wallet Vouchers</h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Send instant peer-to-peer wallet balances with branded greeting cards and redemption codes.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl">
          <Sparkles className="h-4 w-4" />
          <span>Zero Transfer Fees (100% Free)</span>
        </div>
      </div>

      {alert && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn ${
            alert.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600" />
            )}
            <span>{alert.message}</span>
          </div>
          <button onClick={() => setAlert(null)} className="opacity-60 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Form + Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form: 7 cols */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <form onSubmit={handleSendGift} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Recipient (Emmy Digital HUB ID, Email, or Phone)
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. partner@jejelayegct.com.ng or 08023456789"
                className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Gift Amount (₦)</label>
              <input
                type="number"
                min={500}
                step={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs font-mono font-bold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
                required
              />
              <div className="flex gap-2 mt-2">
                {[1000, 2500, 5000, 10000, 20000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className="px-2.5 py-1 text-[11px] rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">Card Theme</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition ${
                      theme === t.id
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Greeting Note</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Personal message..."
                className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white py-3 text-xs font-bold transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>Generate & Dispatch Gift (₦{amount.toLocaleString()})</span>
            </button>
          </form>
        </div>

        {/* Card Live Preview: 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Live Voucher Preview</div>
          <div
            className={`rounded-2xl p-6 text-white bg-gradient-to-br ${
              themes.find((t) => t.id === theme)?.color || 'from-neutral-900 to-purple-950'
            } shadow-lg relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded">
                Emmy Digital HUB Voucher
              </span>
              <Gift className="h-5 w-5 text-amber-300" />
            </div>

            <div className="font-mono text-3xl font-extrabold tracking-tight">
              ₦{amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-white/80 mt-1">To: {recipient || 'Valued Partner'}</div>

            <div className="mt-4 pt-3 border-t border-white/20 text-xs italic text-white/90">
              &quot;{note || 'Best regards from Emmy Digital HUB'}&quot;
            </div>

            <div className="mt-4 text-[10px] font-mono tracking-widest text-amber-200">
              CODE: {generatedVoucher?.voucher_code || 'JEJE-GIFT-••••-••••'}
            </div>
          </div>

          {generatedVoucher && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950">Voucher Ready to Share</span>
                <button
                  onClick={() => copyCode(generatedVoucher.voucher_code)}
                  className="flex items-center gap-1 text-emerald-800 font-bold hover:underline"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <div className="font-mono text-sm font-extrabold text-neutral-900 bg-white p-2 rounded-xl border border-emerald-200 text-center">
                {generatedVoucher.voucher_code}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
