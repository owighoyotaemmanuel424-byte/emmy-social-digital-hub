'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import { NIGERIAN_BANKS } from '@/lib/mock-data';
import {
  X,
  Building2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSource?: 'main_balance' | 'gift_card' | 'margins';
}

export function PayoutModal({ isOpen, onClose, defaultSource = 'main_balance' }: PayoutModalProps) {
  const {
    wallet,
    payoutSettings,
    resolveBankName,
    disbursePayout,
    transactions,
  } = useReseller();

  const [source, setSource] = useState<'main_balance' | 'gift_card' | 'margins'>(defaultSource);
  const [bankCode, setBankCode] = useState(payoutSettings.preferred_bank?.bank_code || NIGERIAN_BANKS[6].code);
  const [accountNumber, setAccountNumber] = useState(payoutSettings.preferred_bank?.account_number || '');
  const [accountName, setAccountName] = useState<string | null>(payoutSettings.preferred_bank?.account_name || null);
  const [amount, setAmount] = useState<number>(10000);
  const [pin, setPin] = useState('');
  const [settlementMode, setSettlementMode] = useState<'instant' | 'daily_batch'>('instant');

  const [isResolving, setIsResolving] = useState(false);
  const [isDisbursing, setIsDisbursing] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  // Compute available balance based on selected source
  const totalProfitEarned = transactions
    .filter((t) => (t.status === 'successful' || t.status === 'completed') && t.profit > 0)
    .reduce((acc, t) => acc + t.profit, 0);

  const availableBalance =
    source === 'gift_card'
      ? wallet.gift_card_balance
      : source === 'margins'
      ? Math.min(wallet.balance, totalProfitEarned)
      : wallet.balance;

  const fee = 25;
  const netPayout = Math.max(0, amount - fee);
  const remainingDailyLimit = Math.max(0, payoutSettings.daily_limit - payoutSettings.daily_withdrawn);

  const handleResolveAccount = async () => {
    if (accountNumber.length !== 10) return;
    setIsResolving(true);
    setAccountName(null);
    setFeedback(null);
    const res = await resolveBankName(bankCode, accountNumber);
    if (res.success && res.account_name) {
      setAccountName(res.account_name);
    } else {
      setFeedback({ success: false, message: 'Could not resolve account name. Please verify bank and number.' });
    }
    setIsResolving(false);
  };

  const handleDisburse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !accountName) return;
    if (pin.length !== 4) {
      setFeedback({ success: false, message: 'Please enter your 4-digit Transaction Security PIN.' });
      return;
    }

    setIsDisbursing(true);
    setFeedback(null);

    const selectedBankName = NIGERIAN_BANKS.find((b) => b.code === bankCode)?.name || 'Commercial Bank';

    const res = await disbursePayout({
      amount,
      source,
      bank_code: bankCode,
      bank_name: selectedBankName,
      account_number: accountNumber,
      account_name: accountName,
      pin,
      settlement_mode: settlementMode,
    });

    setIsDisbursing(false);
    setFeedback(res);

    if (res.success) {
      setTimeout(() => {
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Reseller Bank Payout</h3>
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

        {/* Source Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
            Select Withdrawal Source
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSource('main_balance')}
              className={`rounded-xl border p-2.5 text-left transition ${
                source === 'main_balance'
                  ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
              }`}
            >
              <div className="text-[11px] text-neutral-500">Main Balance</div>
              <div className="text-xs font-mono font-bold text-neutral-900">
                ₦{wallet.balance.toLocaleString()}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSource('gift_card')}
              className={`rounded-xl border p-2.5 text-left transition ${
                source === 'gift_card'
                  ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
              }`}
            >
              <div className="text-[11px] text-neutral-500">Gift Card Wallet</div>
              <div className="text-xs font-mono font-bold text-neutral-900">
                ₦{wallet.gift_card_balance.toLocaleString()}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSource('margins')}
              className={`rounded-xl border p-2.5 text-left transition ${
                source === 'margins'
                  ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 font-bold'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
              }`}
            >
              <div className="text-[11px] text-neutral-500">Profit Margins</div>
              <div className="text-xs font-mono font-bold text-neutral-900">
                ₦{totalProfitEarned.toLocaleString()}
              </div>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`flex items-start gap-2.5 rounded-lg p-3 text-xs ${
              feedback.success
                ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                : 'bg-rose-50 text-rose-950 border border-rose-200'
            }`}
          >
            {feedback.success ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <form onSubmit={handleDisburse} className="space-y-4">
          {/* Destination Bank & NUBAN */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Destination Bank</label>
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
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Account Number (10 Digits)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={10}
                placeholder="0124892184"
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
                  <div className="text-[10px] uppercase font-bold text-emerald-700">Verified Recipient</div>
                  <div className="font-bold">{accountName}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-800">NIBSS Verified</span>
            </div>
          )}

          {/* Amount & Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Payout Amount (₦)
              </label>
              <input
                type="number"
                min={500}
                max={availableBalance}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-emerald-500"
              />
              <div className="mt-1 text-[11px] text-neutral-500">
                Avail: ₦{availableBalance.toLocaleString()} · Quota left: ₦{remainingDailyLimit.toLocaleString()}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Settlement Speed</label>
              <select
                value={settlementMode}
                onChange={(e) => setSettlementMode(e.target.value as 'instant' | 'daily_batch')}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none"
              >
                <option value="instant">Instant NIP (Within 15 seconds)</option>
                <option value="daily_batch">Daily Batch at 6:00 PM (Zero network rush)</option>
              </select>
            </div>
          </div>

          {/* Fee & Net Breakdown */}
          <div className="rounded-lg bg-neutral-50 p-3 border border-neutral-200 text-xs space-y-1">
            <div className="flex justify-between text-neutral-500">
              <span>NIP Network Transfer Fee</span>
              <span className="font-mono">₦{fee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-neutral-900 pt-1 border-t border-neutral-200">
              <span>Net Credit to Bank</span>
              <span className="font-mono text-emerald-700">₦{netPayout.toLocaleString()}</span>
            </div>
          </div>

          {/* Security PIN Challenge */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-800 flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-600" />
                4-Digit Security PIN
              </label>
              <span className="text-[11px] text-neutral-500">Demo PIN: <strong>1234</strong></span>
            </div>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-center text-lg font-mono tracking-widest text-neutral-900 outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={
              isDisbursing ||
              !accountName ||
              amount <= 0 ||
              amount > availableBalance ||
              amount > remainingDailyLimit ||
              pin.length !== 4
            }
            className="w-full rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDisbursing ? 'Disbursing via NIP Switch...' : `Authorize & Disburse ₦${netPayout.toLocaleString()}`}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
