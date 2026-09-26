'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import { EsimPackage } from '@/types/jejelaye';
import {
  Globe,
  QrCode,
  Mail,
  PauseCircle,
  PlayCircle,
  Check,
  Copy,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Smartphone,
} from 'lucide-react';

export function EsimHub() {
  const { esimPackages, esimSessions, buyEsim, manageEsimSession, config, wallet } = useReseller();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'country' | 'regional' | 'global'>('all');
  const [selectedPkg, setSelectedPkg] = useState<EsimPackage>(esimPackages[0]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [qrModalSession, setQrModalSession] = useState<(typeof esimSessions)[0] | null>(null);

  const filteredPackages = esimPackages.filter((pkg) => {
    if (selectedFilter === 'all') return true;
    return pkg.category === selectedFilter;
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPurchasing(true);
    setFeedback(null);
    const res = await buyEsim(selectedPkg, recipientEmail);
    if (res.success && res.session) {
      setFeedback(res.message);
      setQrModalSession(res.session);
    } else {
      setFeedback(res.message);
    }
    setIsPurchasing(false);
  };

  const markupPct = config.esim_markup_percent || 15;
  const wholesalePrice = selectedPkg.price;
  const resalePrice = Math.round(wholesalePrice * (1 + markupPct / 100));

  return (
    <div className="w-full space-y-6">
      {/* Top Banner & Filter Segment */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900">International Travel eSIMs</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Instant digital mobile roaming data across 140+ countries. Zero physical SIM card required.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
          {(['all', 'country', 'regional', 'global'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${
                selectedFilter === filter ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900 flex items-center justify-between animate-fadeIn">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Catalog on left, Purchase preview on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredPackages.map((pkg) => {
              const isSelected = selectedPkg.package_code === pkg.package_code;
              const cardResale = Math.round(pkg.price * (1 + markupPct / 100));
              return (
                <div
                  key={pkg.package_code}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected ? 'border-emerald-600 bg-emerald-50/60 shadow-xs' : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{pkg.flag}</span>
                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-mono text-neutral-600 uppercase">
                      {pkg.duration}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs font-bold text-neutral-900">{pkg.country}</div>
                    <div className="text-sm font-extrabold text-neutral-900 mt-0.5">{pkg.data_amount} High-Speed</div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Wholesale</span>
                      <span className="font-mono font-bold text-neutral-900">₦{pkg.price.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-700 block">Your Resale</span>
                      <span className="font-mono font-bold text-emerald-800">₦{cardResale.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Form & Reseller Margin Calculator */}
        <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Order eSIM Package</h3>

          <div className="rounded-lg bg-neutral-50 p-4 border border-neutral-200 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Selected Destination</span>
              <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                <span>{selectedPkg.flag}</span>
                {selectedPkg.country}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Data Volume & Validity</span>
              <span className="font-semibold text-neutral-900">
                {selectedPkg.data_amount} · {selectedPkg.duration}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Wholesale Cost</span>
              <span className="font-mono tabular-nums text-neutral-900">₦{wholesalePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-700 font-semibold">
              <span>Your Profit Margin ({markupPct}%)</span>
              <span className="font-mono tabular-nums">+₦{(resalePrice - wholesalePrice).toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-neutral-900">
              <span>Client Resale Price</span>
              <span className="font-mono tabular-nums text-emerald-800 text-sm">₦{resalePrice.toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={handlePurchase} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Client / Forwarding Email (Optional)
              </label>
              <input
                type="email"
                placeholder="traveller@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-emerald-500 outline-none"
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                QR code and setup instructions can be forwarded directly to this email.
              </p>
            </div>

            <button
              type="submit"
              disabled={isPurchasing || wallet.balance < wholesalePrice}
              className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
            >
              {isPurchasing ? 'Issuing eSIM...' : `Buy eSIM Now (₦${wholesalePrice.toLocaleString()})`}
            </button>
          </form>
        </div>
      </div>

      {/* Active eSIM Lines Table */}
      <div className="space-y-3 pt-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600">Active eSIM Lines & Subscriptions</h3>
        {esimSessions.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-xs text-neutral-500">
            No active travel eSIMs currently deployed.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Line Name & Reference</th>
                  <th className="py-2.5 px-4">Country</th>
                  <th className="py-2.5 px-4">Data Usage</th>
                  <th className="py-2.5 px-4">Expiry</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {esimSessions.map((session) => (
                  <tr key={session.reference} className="hover:bg-neutral-50/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900">{session.nickname || session.package_code}</div>
                      <div className="font-mono text-[11px] text-neutral-400">{session.reference}</div>
                    </td>
                    <td className="py-3 px-4 text-neutral-800">{session.country}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-neutral-700">
                      {session.data_used} used / {session.data_remaining} left
                    </td>
                    <td className="py-3 px-4 font-mono text-neutral-600">{session.expiry_date}</td>
                    <td className="py-3 px-4">
                      {session.status === 'active' ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                          {session.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setQrModalSession(session)}
                        className="rounded bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-800 hover:bg-neutral-200"
                      >
                        View QR
                      </button>
                      {session.status === 'active' ? (
                        <button
                          onClick={() => manageEsimSession(session.reference, 'suspend')}
                          className="rounded bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-800 hover:bg-neutral-200"
                        >
                          Pause
                        </button>
                      ) : (
                        <button
                          onClick={() => manageEsimSession(session.reference, 'unsuspend')}
                          className="rounded bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-800 hover:bg-neutral-200"
                        >
                          Resume
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* QR Code Payload Modal */}
      {qrModalSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h4 className="text-sm font-bold text-neutral-900">eSIM QR Code & Activation</h4>
              <button onClick={() => setQrModalSession(null)} className="text-neutral-400 hover:text-neutral-800 text-sm">
                ✕
              </button>
            </div>

            {/* Stylized QR placeholder container with zero broken image risk */}
            <div className="flex flex-col items-center justify-center rounded-xl bg-neutral-50 p-6 border border-neutral-200">
              <div className="rounded-xl bg-white p-4 shadow-sm border border-neutral-200">
                <QrCode className="h-36 w-36 text-neutral-900" />
              </div>
              <p className="text-xs font-semibold text-neutral-700 mt-3 text-center">
                Scan with smartphone camera to install eSIM profile
              </p>
              <span className="text-[11px] text-neutral-400 font-mono mt-0.5">iOS: Settings &gt; Cellular &gt; Add eSIM</span>
            </div>

            {/* LPA string */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-neutral-500">LPA Activation String</label>
              <div className="flex items-center justify-between rounded-lg bg-neutral-100 p-2.5 font-mono text-xs text-neutral-800 break-all">
                <span>{qrModalSession.qr_code_payload}</span>
                <button
                  onClick={() => copyToClipboard(qrModalSession.qr_code_payload, 'lpa_copy')}
                  className="ml-2 p-1 text-neutral-500 hover:text-neutral-900 shrink-0"
                >
                  {copiedCode === 'lpa_copy' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={() => setQrModalSession(null)}
              className="w-full rounded-lg bg-neutral-900 py-2 text-xs font-semibold text-white hover:bg-neutral-800"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
