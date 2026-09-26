'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  CheckCircle2,
  Printer,
  Copy,
  Check,
  X,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export function PayoutReceiptModal() {
  const { activePayoutReceipt, setActivePayoutReceipt, config } = useReseller();
  const [copiedSession, setCopiedSession] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  if (!activePayoutReceipt) return null;

  const copyText = (text: string, isRef = false) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
      if (isRef) {
        setCopiedRef(true);
        setTimeout(() => setCopiedRef(false), 2000);
      } else {
        setCopiedSession(true);
        setTimeout(() => setCopiedSession(false), 2000);
      }
    }
  };

  const handlePrint = () => {
    try {
      if (typeof window !== 'undefined') {
        window.print();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-700" />
            <span className="font-bold text-sm text-neutral-900">Proof of Bank Transfer</span>
          </div>
          <button
            onClick={() => setActivePayoutReceipt(null)}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex flex-col items-center justify-center py-2 text-center">
          <div className="rounded-full bg-emerald-100 p-2.5 text-emerald-700">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 mt-2">
            NIP Transfer Disbursed
          </span>
          <div className="mt-1 font-mono text-2xl font-bold text-neutral-900">
            ₦{activePayoutReceipt.net_payout.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-500">Gross: ₦{activePayoutReceipt.amount.toLocaleString()} (₦25 NIP network charge)</span>
        </div>

        {/* NIP Session ID Box */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600 uppercase">
            <span>Central Bank NIP Session ID</span>
            <button
              onClick={() => copyText(activePayoutReceipt.nip_session_id, false)}
              className="flex items-center gap-1 text-emerald-700 hover:underline"
            >
              {copiedSession ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copiedSession ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="font-mono text-xs font-semibold text-neutral-800 break-all select-all">
            {activePayoutReceipt.nip_session_id}
          </div>
        </div>

        {/* Receipt Details Breakdown */}
        <div className="rounded-xl bg-white p-4 border border-neutral-200 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-neutral-500">Beneficiary Name</span>
            <span className="font-bold text-neutral-900">{activePayoutReceipt.account_name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-500">Beneficiary Bank</span>
            <span className="font-semibold text-neutral-800">{activePayoutReceipt.bank_name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-500">Account Number</span>
            <span className="font-mono font-semibold text-neutral-800">
              {activePayoutReceipt.account_number}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-500">Payout Source</span>
            <span className="capitalize font-mono text-neutral-700">
              {activePayoutReceipt.source.replace('_', ' ')}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-neutral-500">Settlement Mode</span>
            <span className="font-mono capitalize text-neutral-700">
              {activePayoutReceipt.settlement_mode.replace('_', ' ')}
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/80 pt-2">
            <span className="text-neutral-500">Payout Reference</span>
            <div className="flex items-center gap-1 font-mono text-[11px] text-neutral-700">
              <span>{activePayoutReceipt.reference}</span>
              <button
                onClick={() => copyText(activePayoutReceipt.reference, true)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                {copiedRef ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between text-neutral-500 text-[11px]">
            <span>Settled Timestamp</span>
            <span>{activePayoutReceipt.settled_at || activePayoutReceipt.created_at}</span>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Verified by NIBSS Nigerian Inter-Bank Settlement System</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 rounded-xl border border-neutral-300 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center justify-center gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" /> Print Receipt
          </button>
          <button
            onClick={() => setActivePayoutReceipt(null)}
            className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-xs font-bold text-white hover:bg-neutral-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
