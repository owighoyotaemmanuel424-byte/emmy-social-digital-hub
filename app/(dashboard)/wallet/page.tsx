'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wallet,
  Building2,
  Copy,
  Check,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Zap,
  PlusCircle,
  X,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { BRAND } from '@/lib/branding';

interface VirtualAccountInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export default function WalletPage() {
  const [balanceNaira, setBalanceNaira] = useState<number>(0);
  const [formattedBalance, setFormattedBalance] = useState<string>('₦0.00');
  const [virtualAccount, setVirtualAccount] = useState<VirtualAccountInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Modal State
  const [fundModalOpen, setFundModalOpen] = useState<boolean>(false);
  const [fundTab, setFundTab] = useState<'bank' | 'card'>('bank');
  const [creatingVA, setCreatingVA] = useState<boolean>(false);

  // Card funding state
  const [cardAmount, setCardAmount] = useState<string>('1000');
  const [fundingLoading, setFundingLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchWallet = async () => {
    try {
      const res = await fetch('/api/wallet/balance');
      if (res.ok) {
        const data = await res.json();
        setBalanceNaira(data.balanceNaira);
        setFormattedBalance(data.formattedBalance);
        if (data.virtualAccount) {
          setVirtualAccount(data.virtualAccount);
        }
      }
    } catch (err) {
      console.error('Failed to load wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch('/api/wallet/balance');
        if (res.ok && isMounted) {
          const data = await res.json();
          setBalanceNaira(data.balanceNaira);
          setFormattedBalance(data.formattedBalance);
          if (data.virtualAccount) {
            setVirtualAccount(data.virtualAccount);
          }
        }
      } catch (err) {
        console.error('Failed to load wallet:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopy = () => {
    if (!virtualAccount?.accountNumber) return;
    navigator.clipboard.writeText(virtualAccount.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCreateVirtualAccount = async () => {
    setCreatingVA(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/wallet/virtual-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate virtual account');

      setVirtualAccount(data.virtualAccount);
      setStatusMessage({ type: 'success', text: 'Virtual account generated successfully!' });
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setCreatingVA(false);
    }
  };

  // Simulate Instant Direct Credit / Paystack Card Top-up
  const handleFundTest = async (amount: number) => {
    setFundingLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/wallet/virtual-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fund_test', amount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Funding request failed');

      setStatusMessage({
        type: 'success',
        text: data.message || `Successfully credited ₦${amount.toLocaleString()} to your wallet!`,
      });
      setBalanceNaira(data.newBalanceNaira);
      setFormattedBalance(data.formattedBalance);
      setFundModalOpen(false);
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
    } finally {
      setFundingLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Wallet & Funding
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Automated funding via dedicated bank transfer for instant service fulfillment.
          </p>
        </div>
        <button
          onClick={() => setFundModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition self-start sm:self-auto active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Fund Wallet</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Primary Balance & Virtual Account Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
              Current Balance
            </span>
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wallet className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {formattedBalance}
            </div>
            <p className="text-xs text-slate-400">
              Zero transaction fees on purchases
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
            <button
              onClick={() => setFundModalOpen(true)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition text-center shadow-md shadow-emerald-500/10"
            >
              Top Up Balance
            </button>
            <Link
              href="/airtime"
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
            >
              Buy Airtime
            </Link>
          </div>
        </div>

        {/* Dedicated Virtual Account */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Your Dedicated Virtual Account</h2>
                <p className="text-xs text-slate-400">Instant automated credit via any Nigerian bank</p>
              </div>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Zero Settlement Fee</span>
            </div>
          </div>

          {virtualAccount ? (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                    Bank Name
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white">
                    {virtualAccount.bankName}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                    Account Name
                  </span>
                  <span className="text-sm font-semibold text-slate-200 truncate block">
                    {virtualAccount.accountName}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
                    Account Number
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-wider font-mono">
                    {virtualAccount.accountNumber}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/80 border border-dashed border-slate-800 rounded-2xl p-6 text-center space-y-3">
              <p className="text-xs text-slate-400">
                You do not have a dedicated virtual bank account linked to your profile yet.
              </p>
              <button
                onClick={handleCreateVirtualAccount}
                disabled={creatingVA}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
              >
                {creatingVA ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Generating Account...</span>
                  </>
                ) : (
                  <>
                    <Building2 className="h-4 w-4" />
                    <span>Get Virtual Account</span>
                  </>
                )}
              </button>
            </div>
          )}

          <p className="text-xs text-slate-400 leading-relaxed">
            Transfer from OPay, PalmPay, Kuda, GTBank, Zenith, Access, or UBA directly to your virtual account. Your balance will update automatically in seconds.
          </p>
        </div>
      </div>

      {/* Fund Wallet Modal */}
      {fundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Fund Your Digital Wallet</h3>
                <p className="text-xs text-slate-400">Choose your preferred deposit method</p>
              </div>
              <button
                onClick={() => setFundModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Method Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800">
              <button
                onClick={() => setFundTab('bank')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  fundTab === 'bank'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>Bank Transfer</span>
              </button>
              <button
                onClick={() => setFundTab('card')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  fundTab === 'card'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Card Checkout</span>
              </button>
            </div>

            {fundTab === 'bank' ? (
              <div className="space-y-4">
                {virtualAccount ? (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Bank Name</span>
                      <span className="text-xs font-bold text-white">{virtualAccount.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Account Name</span>
                      <span className="text-xs font-bold text-white truncate max-w-[200px]">{virtualAccount.accountName}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black text-emerald-400">
                          {virtualAccount.accountNumber}
                        </span>
                        <button
                          onClick={handleCopy}
                          className="p-1 rounded text-emerald-400 hover:bg-emerald-500/10"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleCreateVirtualAccount}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
                  >
                    Generate Virtual Account
                  </button>
                )}

                {/* Instant Test Deposit Buttons */}
                <div className="pt-2 space-y-2 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Quick Simulation Deposit (Test Mode):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[500, 1000, 2000, 5000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => handleFundTest(amt)}
                        disabled={fundingLoading}
                        className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition"
                      >
                        + ₦{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Deposit Amount (₦)
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={cardAmount}
                    onChange={(e) => setCardAmount(e.target.value)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-base focus:outline-none focus:border-emerald-500"
                    placeholder="1000"
                  />
                </div>

                <button
                  onClick={() => handleFundTest(Number(cardAmount) || 1000)}
                  disabled={fundingLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Pay with Paystack (₦{Number(cardAmount || 0).toLocaleString()})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
