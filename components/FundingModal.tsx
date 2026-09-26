'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  X,
  Building2,
  CreditCard,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface FundingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FundingModal({ isOpen, onClose }: FundingModalProps) {
  const { wallet, fundWallet } = useReseller();
  const [fundingMethod, setFundingMethod] = useState<'bank' | 'online'>('bank');
  const [customAmount, setCustomAmount] = useState<number>(5000);
  const [copiedAcct, setCopiedAcct] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyAcctNumber = () => {
    if (wallet.virtual_account?.account_number && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(wallet.virtual_account.account_number).catch(() => {});
      setCopiedAcct(true);
      setTimeout(() => setCopiedAcct(false), 2000);
    }
  };

  const handleFundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customAmount <= 0) return;
    setIsFunding(true);
    setMessage(null);
    setPaymentUrl(null);
    const res = await fundWallet(customAmount);
    setMessage(res.message);
    if (res.payment_url) {
      setPaymentUrl(res.payment_url);
    }
    setIsFunding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Fund Your Reseller Wallet</h3>
            <p className="text-xs text-neutral-500">Add funds to purchase airtime, data, bills, and virtual numbers</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFundingMethod('bank')}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg border transition-all ${
              fundingMethod === 'bank'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Building2 className="h-4 w-4" />
            Dedicated Bank Transfer
          </button>
          <button
            type="button"
            onClick={() => setFundingMethod('online')}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg border transition-all ${
              fundingMethod === 'online'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Online Card / USSD
          </button>
        </div>

        {message && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {fundingMethod === 'bank' ? (
          /* METHOD 1: DEDICATED VIRTUAL ACCOUNT */
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-3 text-xs">
            <div className="text-center pb-2 border-b border-neutral-200">
              <span className="text-[11px] uppercase font-bold text-neutral-500">Your Permanent Funding Account</span>
              <p className="text-[11px] text-neutral-400">Transfer from any Nigerian banking app or USSD (*737#, *894#, etc.)</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-neutral-600">
                <span>Bank Name</span>
                <span className="font-bold text-neutral-900">{wallet.virtual_account?.bank_name || 'Wema Bank'}</span>
              </div>

              <div className="flex justify-between items-center text-neutral-600">
                <span>Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-emerald-800 tracking-wider">
                    {wallet.virtual_account?.account_number || '7829104821'}
                  </span>
                  <button
                    onClick={copyAcctNumber}
                    className="p-1 rounded bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900"
                  >
                    {copiedAcct ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-neutral-600">
                <span>Account Name</span>
                <span className="font-medium text-neutral-800">{wallet.virtual_account?.account_name || 'JejePay - Emmanuel'}</span>
              </div>
            </div>

            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-2.5 text-[11px] text-emerald-800">
              💡 Transfers land in your wallet automatically in 3–10 seconds. No manual confirmation required.
            </div>
          </div>
        ) : (
          /* METHOD 2: ONLINE FUNDING / GATEWAY */
          <form onSubmit={handleFundSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Preset Amount</label>
              <div className="grid grid-cols-4 gap-2">
                {[1000, 2000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCustomAmount(amt)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border ${
                      customAmount === amt ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 bg-white text-neutral-700'
                    }`}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Custom Amount (₦)</label>
              <input
                type="number"
                min={100}
                max={500000}
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-emerald-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isFunding || customAmount <= 0}
              className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
            >
              {isFunding ? 'Processing...' : `Fund ₦${customAmount.toLocaleString()} Now`}
            </button>

            {paymentUrl && (
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center rounded-lg bg-neutral-900 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition"
              >
                Proceed to Payment Gateway →
              </a>
            )}
          </form>
        )}

        <button
          onClick={onClose}
          className="w-full rounded-lg border border-neutral-200 bg-white py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
