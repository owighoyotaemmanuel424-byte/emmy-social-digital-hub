'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import { PayoutRecord } from '@/types/jejelaye';
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Search,
  CheckCircle2,
  Clock,
  Lock,
  Wallet,
  Calendar,
  Download,
  AlertCircle,
  Settings,
} from 'lucide-react';
import { PayoutModal } from './PayoutModal';

export function PayoutsHub() {
  const {
    wallet,
    payoutRecords,
    payoutSettings,
    updatePayoutSettings,
    transactions,
    setActivePayoutReceipt,
  } = useReseller();

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState<'main_balance' | 'gift_card' | 'margins'>('main_balance');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'settled' | 'processing'>('all');

  // Profit Margins from transaction history
  const totalProfitEarned = transactions
    .filter((t) => (t.status === 'successful' || t.status === 'completed') && t.profit > 0)
    .reduce((acc, t) => acc + t.profit, 0);

  // Total Settled
  const totalSettledAmount = payoutRecords
    .filter((p) => p.status === 'settled')
    .reduce((acc, p) => acc + p.net_payout, 0);

  // Filtered Payouts
  const filteredPayouts = payoutRecords.filter((p) => {
    const matchesSearch =
      p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.account_number.includes(searchQuery) ||
      p.nip_session_id.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openWithdrawModal = (src: 'main_balance' | 'gift_card' | 'margins') => {
    setModalSource(src);
    setIsPayoutModalOpen(true);
  };

  const handleScheduleChange = (schedule: 'instant' | 'daily_6pm' | 'weekly_friday') => {
    updatePayoutSettings({ settlement_schedule: schedule });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Headline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Reseller Payouts & Settlements
            </h1>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              NIP Switch Automated
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Safely disburse earned retail profits, gift card balances, and wallet funds directly to your verified Nigerian bank accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openWithdrawModal('main_balance')}
            className="rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800 flex items-center gap-1.5"
          >
            <ArrowUpRight className="h-4 w-4" />
            Request Payout
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Main Balance */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Main Wallet Balance</span>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </div>
          <div
            suppressHydrationWarning
            className="mt-2 text-2xl font-mono font-bold text-neutral-900 tabular-nums"
          >
            ₦{wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex justify-between items-center text-xs">
            <span className="text-neutral-500">Available to withdraw</span>
            <button
              onClick={() => openWithdrawModal('main_balance')}
              className="text-emerald-700 font-bold hover:underline"
            >
              Withdraw →
            </button>
          </div>
        </div>

        {/* Card 2: Gift Card Balance */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Gift Card Trading Balance</span>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </div>
          <div
            suppressHydrationWarning
            className="mt-2 text-2xl font-mono font-bold text-neutral-900 tabular-nums"
          >
            ₦{wallet.gift_card_balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex justify-between items-center text-xs">
            <span className="text-neutral-500">Approved card trades</span>
            <button
              onClick={() => openWithdrawModal('gift_card')}
              className="text-amber-700 font-bold hover:underline"
            >
              Withdraw →
            </button>
          </div>
        </div>

        {/* Card 3: Total Settled */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Total Settled to Bank</span>
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>
          <div
            suppressHydrationWarning
            className="mt-2 text-2xl font-mono font-bold text-neutral-900 tabular-nums"
          >
            ₦{totalSettledAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-100 flex justify-between items-center text-xs text-neutral-500">
            <span>Disbursed Payouts</span>
            <span className="font-mono font-semibold text-neutral-800">
              {payoutRecords.filter((p) => p.status === 'settled').length} batches
            </span>
          </div>
        </div>

        {/* Card 4: Daily Limit */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Daily Settlement Quota</span>
            <ShieldCheck className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-mono font-bold text-neutral-900">
              ₦{(payoutSettings.daily_limit - payoutSettings.daily_withdrawn).toLocaleString()}
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              / ₦{payoutSettings.daily_limit.toLocaleString()}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  (payoutSettings.daily_withdrawn / payoutSettings.daily_limit) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Safety Controls & Settings Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Preferred Bank Account */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
            <span>Default Payout Bank Account</span>
            <span className="text-[10px] text-emerald-700 font-mono">NUBAN Verified</span>
          </div>
          <div className="rounded-lg bg-neutral-50 p-2.5 border border-neutral-100 space-y-1">
            <div className="text-xs font-bold text-neutral-900">
              {payoutSettings.preferred_bank?.account_name || 'EMMANUEL RESELLER TECH'}
            </div>
            <div className="flex justify-between text-xs text-neutral-600 font-mono">
              <span>{payoutSettings.preferred_bank?.bank_name || 'GTBank'}</span>
              <span>{payoutSettings.preferred_bank?.account_number || '0124892184'}</span>
            </div>
          </div>
        </div>

        {/* Settlement Schedule */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
            <span>Automated Settlement Schedule</span>
            <Calendar className="h-3.5 w-3.5 text-neutral-400" />
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              onClick={() => handleScheduleChange('instant')}
              className={`rounded-lg py-1.5 text-[11px] font-bold transition text-center ${
                payoutSettings.settlement_schedule === 'instant'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Instant NIP
            </button>
            <button
              onClick={() => handleScheduleChange('daily_6pm')}
              className={`rounded-lg py-1.5 text-[11px] font-bold transition text-center ${
                payoutSettings.settlement_schedule === 'daily_6pm'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Daily 6 PM
            </button>
            <button
              onClick={() => handleScheduleChange('weekly_friday')}
              className={`rounded-lg py-1.5 text-[11px] font-bold transition text-center ${
                payoutSettings.settlement_schedule === 'weekly_friday'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Weekly
            </button>
          </div>
        </div>

        {/* Security & 2FA Status */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
            <span>Security & Fraud Shield</span>
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="rounded-lg bg-emerald-50/60 p-2.5 border border-emerald-100 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>4-Digit Transaction PIN Active</span>
            </div>
            <div className="text-[11px] text-emerald-800">
              Disbursements require PIN authorization & CBN NIP verification.
            </div>
          </div>
        </div>
      </div>

      {/* Payout History Ledger */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
        {/* Table Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-100 p-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search reference, bank, NIP session..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 pl-8 pr-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'settled' | 'processing')}
              className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="settled">Settled</option>
              <option value="processing">Processing</option>
            </select>
          </div>

          <div className="text-xs text-neutral-500">
            Showing <strong>{filteredPayouts.length}</strong> disbursements
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Payout Ref & Date</th>
                <th className="py-3 px-4">Beneficiary Bank & NUBAN</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Gross & Fee</th>
                <th className="py-3 px-4">Net Disbursed</th>
                <th className="py-3 px-4">NIP Session ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredPayouts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-neutral-400">
                    No payout records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-neutral-900">{payout.reference}</div>
                      <div className="text-[11px] text-neutral-400">{payout.created_at}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-800">{payout.account_name}</div>
                      <div className="font-mono text-[11px] text-neutral-500">
                        {payout.bank_name} · {payout.account_number}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="capitalize font-medium text-neutral-700">
                        {payout.source.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono tabular-nums text-neutral-900">
                        ₦{payout.amount.toLocaleString()}
                      </div>
                      <div className="font-mono text-[10px] text-neutral-400">
                        Fee: ₦{payout.fee.toLocaleString()}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-700 tabular-nums">
                      ₦{payout.net_payout.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-600 max-w-[140px] truncate" title={payout.nip_session_id}>
                      {payout.nip_session_id}
                    </td>

                    <td className="py-3 px-4">
                      {payout.status === 'settled' ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Settled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                          <Clock className="h-3.5 w-3.5" /> Processing
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActivePayoutReceipt(payout)}
                        className="rounded-lg border border-neutral-200 px-2 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-100 transition"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Modal */}
      <PayoutModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        defaultSource={modalSource}
      />
    </div>
  );
}
