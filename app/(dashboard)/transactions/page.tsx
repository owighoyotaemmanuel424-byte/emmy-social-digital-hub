'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Receipt,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Smartphone,
  Wifi,
  Zap,
  Tv,
  GraduationCap,
  MessageSquare,
  Wallet,
  RefreshCw,
} from 'lucide-react';
import { formatNaira } from '@/lib/money';

interface TransactionItem {
  id: string;
  reference?: string;
  serviceType: string;
  target: string;
  amountChargedKobo: string;
  status: 'pending' | 'processing' | 'successful' | 'completed' | 'failed' | 'awaiting_fulfillment';
  createdAt: string;
  metadata?: any;
}

export default function TransactionsHistoryPage() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await fetch('/api/transactions');
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.transactions || []);
        }
      } catch (err) {
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const getServiceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'airtime':
        return <Smartphone className="h-4 w-4 text-emerald-400" />;
      case 'data':
        return <Wifi className="h-4 w-4 text-teal-400" />;
      case 'electricity':
        return <Zap className="h-4 w-4 text-amber-400" />;
      case 'cable_tv':
      case 'tv':
        return <Tv className="h-4 w-4 text-cyan-400" />;
      case 'education':
        return <GraduationCap className="h-4 w-4 text-indigo-400" />;
      case 'virtual_number':
        return <MessageSquare className="h-4 w-4 text-purple-400" />;
      case 'wallet_funding':
        return <Wallet className="h-4 w-4 text-emerald-400" />;
      default:
        return <Receipt className="h-4 w-4 text-slate-400" />;
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter =
      selectedFilter === 'all' ||
      tx.serviceType.toLowerCase().includes(selectedFilter.toLowerCase());

    const matchesSearch =
      !searchQuery ||
      tx.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.serviceType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Transaction History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time audit log of all your VTU recharges, bill payments, and scratch card orders.
          </p>
        </div>
        <Link
          href="/airtime"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md shadow-emerald-500/10 self-start sm:self-auto"
        >
          <span>New Recharge</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Service Type Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'airtime', label: 'Airtime' },
            { id: 'data', label: 'Data' },
            { id: 'electricity', label: 'Electricity' },
            { id: 'cable', label: 'Cable TV' },
            { id: 'education', label: 'Exam PINs' },
            { id: 'virtual_number', label: 'Virtual Nos' },
          ].map((tab) => {
            const isSelected = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-slate-800 border border-emerald-500/40 text-emerald-400 shadow-md'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search phone, meter, or ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 pl-9 pr-4 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="h-7 w-7 animate-spin text-emerald-400" />
          <p className="text-xs text-slate-400">Loading your transactions...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center space-y-3 bg-slate-900/30">
          <div className="h-12 w-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
            <Receipt className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-white">No transactions found</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery
              ? `No transactions match "${searchQuery}". Try clearing your search.`
              : 'You have not placed any orders under this category yet.'}
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-2xl">
          <div className="divide-y divide-slate-800/80">
            {filteredTransactions.map((tx) => {
              const isSuccess = tx.status === 'successful' || tx.status === 'completed';
              const isPending = tx.status === 'pending' || tx.status === 'processing';
              const isFailed = tx.status === 'failed';

              return (
                <Link
                  key={tx.id}
                  href={`/transactions/${tx.id}`}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-800/50 transition group block"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="h-11 w-11 rounded-2xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shrink-0">
                      {getServiceIcon(tx.serviceType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white capitalize group-hover:text-emerald-400 transition-colors">
                          {tx.serviceType.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isSuccess
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Target: <span className="text-slate-300 font-semibold">{tx.target}</span> · Ref: {tx.id.substring(0, 16)}...
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm sm:text-base font-black text-white block">
                      {formatNaira(BigInt(tx.amountChargedKobo))}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString('en-NG', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
