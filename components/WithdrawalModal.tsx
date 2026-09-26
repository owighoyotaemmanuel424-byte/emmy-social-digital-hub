'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import { NIGERIAN_BANKS } from '@/lib/mock-data';
import {
  X,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WithdrawalModal({ isOpen, onClose }: WithdrawalModalProps) {
  const { wallet, resolveBankName, disbursePayout, transactions } = useReseller();
  const [source, setSource] = useState<'gift_card' | 'main_balance'>('gift_card');
  const [bankCode, setBankCode] = useState(NIGERIAN_BANKS[6].code); // GTBank
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(5000);
  const [pin, setPin] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const currentAvailable = source === 'gift_card' ? wallet.gift_card_balance : wallet.balance;

  const handleResolveAccount = async () => {
    if (accountNumber.length !== 10) return;
    setIsResolving(true);
    setAccountName(null);
    setFeedback(null);
    const res = await resolveBankName(bankCode, accountNumber);
    if (res.success && res.account_name) {
      setAccountName(res.account_name);
    } else {
      setFeedback({ success: false, message: 'Could not resolve account name. Please verify bank and account number.' });
    }
    setIsResolving(false);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !accountName) return;
    if (pin.length !== 4) {
      setFeedback({ success: false, message: 'Please enter your 4-digit Transaction Security PIN (e.g. 1234).' });
      return;
    }
    setIsSubmitting(true);
    setFeedback(null);
    const selectedBank = NIGERIAN_BANKS.find((b) => b.code === bankCode)?.name || bankCode;
    const res = await disbursePayout({
      amount,
      source,
      bank_code: bankCode,
      bank_name: selectedBank,
      account_number: accountNumber,
      account_name: accountName,
      pin,
      settlement_mode: 'instant',
    });
    setFeedback(res);
    setIsSubmitting(false);
    if (res.success) {
      setTimeout(() => {
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scaleUp">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Withdraw to Bank Account</h3>
              <p className="text-xs text-neutral-500">Secure automated disbursement to any Nigerian bank</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Source Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSource('gift_card')}
            className={`rounded-xl border p-2.5 text-left text-xs transition ${
              source === 'gift_card'
                ? 'border-emerald-600 bg-emerald-50/60 font-bold text-emerald-950'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
            }`}
          >
            <div className="text-[10px] text-neutral-500">Gift Card Wallet</div>
            <div className="font-mono text-xs">₦{wallet.gift_card_balance.toLocaleString()}</div>
          </button>
          <button
            type="button"
            onClick={() => setSource('main_balance')}
            className={`rounded-xl border p-2.5 text-left text-xs transition ${
              source === 'main_balance'
                ? 'border-emerald-600 bg-emerald-50/60 font-bold text-emerald-950'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
            }`}
          >
            <div className="text-[10px] text-neutral-500">Main Wallet Balance</div>
            <div className="font-mono text-xs">₦{wallet.balance.toLocaleString()}</div>
          </button>
        </div>

        {feedback && (
          <div
            className={`flex items-start gap-2.5 rounded-lg p-3 text-xs ${
              feedback.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            {feedback.success ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleWithdraw} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Select Bank</label>
            <select
              value={bankCode}
              onChange={(e) => {
                setBankCode(e.target.value);
                setAccountName(null);
              }}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none"
            >
              {NIGERIAN_BANKS.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Account Number (10 Digits)</label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={10}
                placeholder="0123456789"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                  setAccountName(null);
                }}
                className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleResolveAccount}
                disabled={accountNumber.length !== 10 || isResolving}
                className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
              >
                {isResolving ? 'Checking...' : 'Verify'}
              </button>
            </div>
          </div>

          {accountName && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-700">Account Verified</div>
                  <div className="font-bold">{accountName}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-800">NIBSS Verified</span>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <label className="font-medium text-neutral-700">Withdrawal Amount (₦)</label>
              <span className="text-[11px] text-neutral-500">NIP Fee: ₦25</span>
            </div>
            <input
              type="number"
              min={500}
              max={currentAvailable}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-neutral-700">4-Digit Security PIN</label>
              <span className="text-[10px] text-neutral-400">Demo PIN: <strong>1234</strong></span>
            </div>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-center text-sm font-mono tracking-widest text-neutral-900 outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !accountName || amount > currentAvailable || amount <= 0 || pin.length !== 4}
            className="w-full rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? 'Authorizing Payout...' : `Disburse ₦${Math.max(0, amount - 25).toLocaleString()} to Bank`}
          </button>
        </form>
      </div>
    </div>
  );
}
