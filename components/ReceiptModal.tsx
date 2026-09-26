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
  ArrowRight,
} from 'lucide-react';

export function ReceiptModal() {
  const { activeReceipt, setActiveReceipt, config } = useReseller();
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  if (!activeReceipt) return null;

  const copyText = (text: string, isRef = false) => {
    navigator.clipboard.writeText(text);
    if (isRef) {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-neutral-900">{config.business_name}</span>
            <span className="text-[11px] text-neutral-400">· Official Receipt</span>
          </div>
          <button
            onClick={() => setActiveReceipt(null)}
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
            Transaction Successful
          </span>
          <div className="text-2xl font-bold font-mono text-neutral-900 mt-1 tabular-nums">
            ₦{Math.abs(activeReceipt.reseller_amount).toLocaleString()}
          </div>
        </div>

        {/* Receipt Details Box */}
        <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200 space-y-2.5 text-xs">
          <div className="flex justify-between items-center text-neutral-600">
            <span>Reference</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-neutral-900">
              <span>{activeReceipt.reference}</span>
              <button
                onClick={() => copyText(activeReceipt.reference, true)}
                className="text-neutral-400 hover:text-neutral-800"
              >
                {copiedRef ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-neutral-600">
            <span>Service</span>
            <span className="font-bold text-neutral-900">{activeReceipt.title}</span>
          </div>

          {activeReceipt.recipient && (
            <div className="flex justify-between items-center text-neutral-600">
              <span>Recipient / Number</span>
              <span className="font-mono font-bold text-neutral-900">{activeReceipt.recipient}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-neutral-600">
            <span>Date & Time</span>
            <span className="text-neutral-700">{activeReceipt.created_at}</span>
          </div>

          {/* Token / PIN / Code if delivered */}
          {activeReceipt.token && (
            <div className="pt-2 border-t border-neutral-200">
              <span className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">
                Delivered Token / PIN / Key
              </span>
              <div className="flex items-center justify-between rounded-lg bg-emerald-100/60 p-2 font-mono text-xs font-bold text-emerald-950 break-all">
                <span>{activeReceipt.token}</span>
                <button
                  onClick={() => copyText(activeReceipt.token!)}
                  className="ml-2 p-1 text-emerald-800 hover:bg-emerald-200/50 rounded shrink-0"
                >
                  {copiedToken ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Audit Balances */}
          {(activeReceipt.wallet_balance_before !== undefined && activeReceipt.wallet_balance_after !== undefined) && (
            <div className="pt-2 border-t border-neutral-200 text-[11px] text-neutral-500 flex justify-between">
              <span>Wallet Before: ₦{activeReceipt.wallet_balance_before.toLocaleString()}</span>
              <span>Wallet After: ₦{activeReceipt.wallet_balance_after.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-neutral-300 bg-white py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Receipt
          </button>
          <button
            onClick={() => setActiveReceipt(null)}
            className="flex-1 rounded-lg bg-neutral-900 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
