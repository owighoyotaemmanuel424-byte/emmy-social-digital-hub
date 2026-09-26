'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  Wallet,
  ArrowUpRight,
  TrendingUp,
  Gift,
  Users,
  Copy,
  Check,
  Building2,
  RefreshCw,
  Eye,
  EyeOff,
  History,
  ShieldCheck,
  PlusCircle,
  ArrowDownLeft,
} from 'lucide-react';

interface WalletCardProps {
  onOpenFund: () => void;
  onOpenWithdraw: () => void;
}

export function WalletCard({ onOpenFund, onOpenWithdraw }: WalletCardProps) {
  const { wallet, transactions, transferReferral, transferGiftCardToMain, setActiveTab } = useReseller();
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [isTransferringReferral, setIsTransferringReferral] = useState(false);
  const [isTransferringGC, setIsTransferringGC] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  // Reseller profit metrics
  const totalProfitEarned = transactions.reduce(
    (acc, curr) => acc + (curr.profit > 0 ? curr.profit : 0),
    0
  );

  const copyVirtualAccount = () => {
    if (wallet.virtual_account?.account_number) {
      navigator.clipboard.writeText(wallet.virtual_account.account_number);
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const handleClaimReferral = async () => {
    if (!wallet.referral_balance || wallet.referral_balance <= 0) return;
    setIsTransferringReferral(true);
    const res = await transferReferral(wallet.referral_balance);
    setActionMessage(res.message);
    setIsTransferringReferral(false);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleTransferGiftCard = async () => {
    if (wallet.gift_card_balance <= 0) return;
    setIsTransferringGC(true);
    const res = await transferGiftCardToMain(wallet.gift_card_balance);
    setActionMessage(res.message);
    setIsTransferringGC(false);
    setTimeout(() => setActionMessage(null), 3500);
  };

  return (
    <div className="w-full space-y-4">
      {/* Toast Alert Message if any */}
      {actionMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 animate-fadeIn">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Hero Balance & Supporting Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* HERO WALLET CARD (Spans 7 cols on LG) */}
        <div className="lg:col-span-7 rounded-2xl border border-neutral-200 bg-gradient-to-br from-neutral-900 via-neutral-900 to-emerald-950 p-6 text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 h-48 w-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top row */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Wallet className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    Available Balance
                  </span>
                  <p className="text-[11px] text-neutral-400">Emmy Digital HUB Primary Naira Wallet</p>
                </div>
              </div>

              {/* Eye Toggle & Status */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
                <button
                  onClick={() => setIsBalanceHidden(!isBalanceHidden)}
                  className="text-neutral-400 hover:text-white p-1 rounded-md transition"
                  title={isBalanceHidden ? 'Show balance' : 'Hide balance'}
                >
                  {isBalanceHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Prominent Balance Display */}
            <div className="mt-4">
              <div
                suppressHydrationWarning
                className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-white tabular-nums"
              >
                {isBalanceHidden
                  ? '₦ ••••••••'
                  : `₦ ${wallet.balance.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-neutral-300">
                <span>Total Accumulated Reseller Profit:</span>
                <span className="font-bold font-mono text-emerald-400 tabular-nums">
                  +₦{totalProfitEarned.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Action Buttons (Matches specification exactly: + Fund Wallet, Withdraw, Transaction History) */}
          <div className="mt-6 pt-5 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Action 1: + Fund Wallet (Primary) */}
            <button
              onClick={onOpenFund}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 py-2.5 px-4 text-xs font-bold text-white transition shadow-sm shadow-emerald-900/30"
            >
              <PlusCircle className="h-4 w-4" />
              <span>+ Fund Wallet</span>
            </button>

            {/* Action 2: Withdraw */}
            <button
              onClick={onOpenWithdraw}
              className="flex items-center justify-center gap-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 py-2.5 px-4 text-xs font-semibold text-neutral-100 transition border border-neutral-700/80"
            >
              <ArrowDownLeft className="h-4 w-4 text-neutral-300" />
              <span>Withdraw</span>
            </button>

            {/* Action 3: Transaction History */}
            <button
              onClick={() => setActiveTab('transactions')}
              className="flex items-center justify-center gap-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 py-2.5 px-4 text-xs font-semibold text-neutral-100 transition border border-neutral-700/80"
            >
              <History className="h-4 w-4 text-neutral-300" />
              <span>Transaction History</span>
            </button>
          </div>
        </div>

        {/* SECONDARY WALLET & INSTANT FUNDING (Spans 5 cols on LG) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 2: Gift Card Balance */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-amber-50 p-2 text-amber-700">
                  <Gift className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Gift Card Balance
                  </span>
                  <div className="text-[11px] text-neutral-500">Secondary Trade Wallet</div>
                </div>
              </div>

              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                Instant Cashout
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <div
                suppressHydrationWarning
                className="font-mono text-2xl font-bold tracking-tight text-neutral-900 tabular-nums"
              >
                {isBalanceHidden
                  ? '₦ ••••••'
                  : `₦ ${wallet.gift_card_balance.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleTransferGiftCard}
                  disabled={isTransferringGC || wallet.gift_card_balance <= 0}
                  className="rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-800 transition disabled:opacity-50"
                  title="Move earnings into main wallet for VTU"
                >
                  {isTransferringGC ? 'Moving...' : 'To Main'}
                </button>
                <button
                  onClick={() => setActiveTab('gift_cards')}
                  className="rounded-lg bg-amber-600 hover:bg-amber-700 px-2.5 py-1 text-xs font-medium text-white transition"
                >
                  Trade
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Instant Virtual Dedicated Bank Account */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-emerald-700" />
                <span className="text-xs font-bold text-emerald-950">Dedicated NIBSS Account</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                Instant Auto-Credit
              </span>
            </div>

            <div className="mt-2.5 flex items-center justify-between bg-white rounded-xl p-2.5 border border-emerald-200/60">
              <div>
                <div className="text-[10px] uppercase font-bold text-neutral-400">
                  {wallet.virtual_account?.bank_name || 'Wema / Moniepoint'}
                </div>
                <div className="font-mono text-sm font-extrabold text-neutral-900 tracking-wider">
                  {wallet.virtual_account?.account_number || '7829104821'}
                </div>
                <div className="text-[10px] text-neutral-500 truncate max-w-[180px]">
                  {wallet.virtual_account?.account_name || 'JejePay - Emmanuel Reseller'}
                </div>
              </div>

              <button
                onClick={copyVirtualAccount}
                className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 shrink-0"
              >
                {copiedAccount ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[10px] text-emerald-800/80 mt-1.5">
              Transfer funds from any Nigerian banking app. Your wallet is credited instantly in 5 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
