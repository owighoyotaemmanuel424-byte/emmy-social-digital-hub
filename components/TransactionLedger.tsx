'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import { TransactionRecord } from '@/types/jejelaye';
import {
  Search,
  Filter,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  Copy,
  Check,
} from 'lucide-react';

export function TransactionLedger() {
  const { transactions, setActiveReceipt, lookupTransaction } = useReseller();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refQuery, setRefQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<TransactionRecord | null>(null);
  const [lookupSearched, setLookupSearched] = useState(false);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const copyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refQuery) return;
    setLookupSearched(true);
    const found = await lookupTransaction(refQuery);
    setLookupResult(found);
  };

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.recipient && tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Fast Reference Lookup Form (Golden Rule step 3 from API doc) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Transaction Ledger & Receipts</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit all telecom, utility, and digital voucher transactions with before/after wallet balances.
          </p>
        </div>

        {/* Single Reference Direct Checker */}
        <form onSubmit={handleLookup} className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reference (e.g. TXN-2026...)"
              value={refQuery}
              onChange={(e) => {
                setRefQuery(e.target.value);
                setLookupSearched(false);
              }}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 pl-8 text-xs font-mono text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-emerald-500 w-64"
            />
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-400" />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            Check Ref
          </button>
        </form>
      </div>

      {/* Lookup Card if search performed */}
      {lookupSearched && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 animate-fadeIn">
          {lookupResult ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-emerald-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800">{lookupResult.reference}</span>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 uppercase">
                    {lookupResult.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-neutral-900 mt-1">{lookupResult.title}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Recipient: {lookupResult.recipient || 'N/A'} · Amount: ₦{lookupResult.amount.toLocaleString()}
                </div>
                {lookupResult.token && (
                  <div className="mt-2 text-xs font-mono font-bold text-emerald-900 bg-emerald-50 px-2 py-1 rounded inline-block">
                    Delivered Token/PIN: {lookupResult.token}
                  </div>
                )}
              </div>
              <button
                onClick={() => setActiveReceipt(lookupResult)}
                className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 shrink-0"
              >
                View Full Receipt
              </button>
            </div>
          ) : (
            <div className="text-xs text-neutral-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span>No transaction found with reference &quot;{refQuery}&quot;. Please verify the reference string.</span>
            </div>
          )}
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Keyword Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by description or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 pl-8 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none w-56"
            />
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-neutral-400" />
          </div>

          {/* Type Dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 outline-none"
          >
            <option value="all">All Service Types</option>
            <option value="data">Data Bundles</option>
            <option value="airtime">Airtime</option>
            <option value="electricity">Electricity</option>
            <option value="tv">Cable TV</option>
            <option value="education">Exam PINs</option>
            <option value="print_card">Print Vouchers</option>
            <option value="virtual_number">Virtual Numbers</option>
            <option value="esim">eSIM</option>
            <option value="gift_card">Gift Cards</option>
            <option value="wallet_funding">Wallet Funding</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="successful">Successful</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <span className="text-xs text-neutral-500">
          Showing <strong className="font-mono text-neutral-900">{filtered.length}</strong> transactions
        </span>
      </div>

      {/* Main High-Density Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
            <tr>
              <th className="py-2.5 px-4">Reference & Date</th>
              <th className="py-2.5 px-4">Service Description</th>
              <th className="py-2.5 px-4">Recipient</th>
              <th className="py-2.5 px-4 text-right">Wholesale Cost</th>
              <th className="py-2.5 px-4 text-right">Resale Price</th>
              <th className="py-2.5 px-4 text-right">Your Profit</th>
              <th className="py-2.5 px-4 text-center">Status</th>
              <th className="py-2.5 px-4 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-neutral-500">
                  No matching transactions found.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-neutral-900">{tx.reference}</span>
                      <button
                        onClick={() => copyRef(tx.reference)}
                        className="text-neutral-400 hover:text-neutral-700"
                        title="Copy Reference"
                      >
                        {copiedRef === tx.reference ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                    <div className="text-[11px] text-neutral-400">{tx.created_at}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-neutral-900">{tx.title}</div>
                    <div className="text-[11px] text-neutral-500 truncate max-w-xs">{tx.details || 'Instant topup'}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-800">{tx.recipient || '—'}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-700">
                    ₦{Math.abs(tx.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-900 font-semibold">
                    ₦{Math.abs(tx.reseller_amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-700">
                    {tx.profit > 0 ? `+₦${tx.profit.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {tx.status === 'successful' || tx.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                        Done
                      </span>
                    ) : tx.status === 'processing' || tx.status === 'pending' ? (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                        Processing
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-800">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveReceipt(tx)}
                      className="rounded bg-neutral-100 p-1.5 text-neutral-700 hover:bg-neutral-200 transition-colors"
                      title="View Receipt"
                    >
                      <Receipt className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
