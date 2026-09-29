'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  Printer,
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  Zap,
  GraduationCap,
  MessageSquare,
  Key,
} from 'lucide-react';
import { BRAND } from '@/lib/branding';

interface TransactionDetails {
  id: string;
  reference: string;
  jejelayReference?: string | null;
  serviceType: string;
  target: string;
  amountChargedNaira: number;
  formattedAmount: string;
  status: 'pending' | 'processing' | 'successful' | 'completed' | 'failed' | 'awaiting_fulfillment';
  createdAt: string;
  updatedAt: string;
  metadata?: any;
  providerResponse?: any;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function TransactionReceiptPage() {
  const params = useParams();
  const ref = params?.ref as string;

  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedRef, setCopiedRef] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);
  const [copiedPin, setCopiedPin] = useState<boolean>(false);
  const [copiedOtp, setCopiedOtp] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    let pollTimer: NodeJS.Timeout | null = null;
    let elapsedSeconds = 0;
    const maxPollSeconds = 120; // Max 2 minutes

    async function fetchReceipt() {
      if (!ref) return;
      try {
        const res = await fetch(`/api/transactions/${ref}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Transaction record not found.');
        }
        const data = await res.json();
        if (isMounted) {
          setTransaction(data.transaction);

          const isOngoing =
            data.transaction?.status === 'pending' ||
            data.transaction?.status === 'processing';

          if (isOngoing && elapsedSeconds < maxPollSeconds) {
            elapsedSeconds += 3;
            pollTimer = setTimeout(fetchReceipt, 3000);
          }
        }
      } catch (err: unknown) {
        if (isMounted) setError((err as Error).message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchReceipt();

    return () => {
      isMounted = false;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [ref]);

  const handleCopy = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-400" />
        <p className="text-xs text-slate-400 font-medium">Retrieving transaction receipt...</p>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <XCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Receipt Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'Unable to locate this transaction reference.'}</p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const isSuccess = transaction.status === 'successful' || transaction.status === 'completed';
  const isPending = transaction.status === 'pending';
  const isProcessing = transaction.status === 'processing';
  const isFailed = transaction.status === 'failed';

  // Artifact extraction
  const token = transaction.providerResponse?.token || transaction.metadata?.token;
  const units = transaction.providerResponse?.units || transaction.metadata?.units;
  const examPin = transaction.providerResponse?.pin || transaction.metadata?.pin;
  const examSerial = transaction.providerResponse?.serial_number || transaction.metadata?.serial_number;
  const virtualNumber = transaction.providerResponse?.phone_number || transaction.metadata?.phone_number;
  const otpCode = transaction.providerResponse?.otp || transaction.metadata?.otp;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Printable Receipt Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        {/* Emmy Hub Header */}
        <div className="text-center space-y-3 pb-6 border-b border-slate-800/80">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto">
            {isSuccess && <CheckCircle2 className="h-6 w-6 text-emerald-400" />}
            {isPending && <Clock className="h-6 w-6 text-amber-400 animate-pulse" />}
            {isProcessing && <RefreshCw className="h-6 w-6 text-sky-400 animate-spin" />}
            {isFailed && <XCircle className="h-6 w-6 text-rose-400" />}
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
              {BRAND.name}
            </span>
            <h1 className="text-2xl font-black text-white">Transaction Receipt</h1>
            <p className="text-xs text-slate-400">
              {new Date(transaction.createdAt).toLocaleString('en-NG', {
                dateStyle: 'medium',
                timeStyle: 'medium',
              })}
            </p>
          </div>

          {/* Status Badge */}
          <div className="pt-1">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isSuccess
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : isPending
                  ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                  : isProcessing
                  ? 'bg-sky-500/10 border border-sky-500/30 text-sky-400'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isSuccess
                    ? 'bg-emerald-400'
                    : isPending
                    ? 'bg-amber-400 animate-ping'
                    : isProcessing
                    ? 'bg-sky-400 animate-ping'
                    : 'bg-rose-400'
                }`}
              />
              {transaction.status}
            </span>
          </div>

          {(isPending || isProcessing) && (
            <p className="text-[11px] text-amber-400/90 font-medium">
              Awaiting provider fulfillment... updates automatically.
            </p>
          )}
        </div>

        {/* Highlighted Delivery Artifacts (Electricity Token, Scratch Card PIN, or OTP) */}
        {token && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-950 to-slate-950 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="h-4 w-4" />
                <span>Prepaid Meter Token</span>
              </span>
              {units && <span className="text-xs font-bold text-slate-300">{units}</span>}
            </div>
            <div className="flex items-center justify-between bg-slate-900/90 p-3.5 rounded-xl border border-amber-500/20">
              <span className="font-mono text-xl sm:text-2xl font-black text-white tracking-widest">
                {token}
              </span>
              <button
                onClick={() => handleCopy(token, setCopiedToken)}
                className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition"
                title="Copy token"
              >
                {copiedToken ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Key in these 20 digits into your meter keypad and press Enter/Blue button.
            </p>
          </div>
        )}

        {examPin && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/15 via-slate-950 to-slate-950 border border-indigo-500/30 space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" />
              <span>Exam Scratch Card PIN</span>
            </span>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-indigo-500/20">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-medium">PIN</span>
                  <span className="font-mono text-lg font-black text-white tracking-wider">{examPin}</span>
                </div>
                <button
                  onClick={() => handleCopy(examPin, setCopiedPin)}
                  className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 transition"
                >
                  {copiedPin ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
              {examSerial && (
                <div className="flex items-center justify-between bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-medium">Serial No</span>
                    <span className="font-mono text-sm font-bold text-slate-300">{examSerial}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {virtualNumber && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/15 via-slate-950 to-slate-950 border border-purple-500/30 space-y-3">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              <span>Leased Virtual Number</span>
            </span>
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-purple-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Assigned Number:</span>
                <span className="font-mono text-base font-bold text-white">{virtualNumber}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">Incoming Verification Code:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-black text-emerald-400">
                    {otpCode || 'Waiting for SMS...'}
                  </span>
                  {otpCode && (
                    <button
                      onClick={() => handleCopy(otpCode, setCopiedOtp)}
                      className="p-1 text-emerald-400 hover:text-emerald-300"
                    >
                      {copiedOtp ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Big Amount */}
        <div className="text-center py-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-1">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Amount Charged
          </span>
          <div className="text-3xl sm:text-4xl font-black text-white">
            {transaction.formattedAmount}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold">
            Zero Service Surcharge
          </span>
        </div>

        {/* Breakdown Items */}
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
            <span className="text-slate-400 font-medium">Service Type</span>
            <span className="text-white font-bold capitalize">
              {transaction.serviceType.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
            <span className="text-slate-400 font-medium">Recipient / Target</span>
            <span className="text-white font-mono font-bold">{transaction.target}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
            <span className="text-slate-400 font-medium">Transaction Reference</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-200">
              <span>{transaction.reference.substring(0, 16)}...</span>
              <button
                onClick={() => handleCopy(transaction.reference, setCopiedRef)}
                className="p-1 hover:text-emerald-400 transition"
                title="Copy reference"
              >
                {copiedRef ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {transaction.jejelayReference && (
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Provider Reference</span>
              <span className="text-slate-300 font-mono">{transaction.jejelayReference}</span>
            </div>
          )}

          {transaction.customer && (
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400 font-medium">Customer</span>
              <span className="text-slate-200 font-semibold">{transaction.customer.name}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs text-center shadow-lg shadow-emerald-500/20 transition"
          >
            Dashboard
          </Link>
          {isFailed ? (
            <a
              href="https://wa.me/2348140008920"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs text-center border border-rose-500/30 transition flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Contact Support</span>
            </a>
          ) : (
            <Link
              href="/transactions"
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs text-center border border-slate-700 transition"
            >
              All Transactions
            </Link>
          )}
        </div>

        <div className="pt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Officially verified by {BRAND.name}</span>
        </div>
      </div>
    </div>
  );
}
