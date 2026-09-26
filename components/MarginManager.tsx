'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  Sliders,
  DollarSign,
  TrendingUp,
  Percent,
  Check,
  Building,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export function MarginManager() {
  const { config, updateConfig, services } = useReseller();
  const [savedMessage, setSavedMessage] = useState(false);

  // Local draft state
  const [businessName, setBusinessName] = useState(config.business_name);
  const [airtimeMarkup, setAirtimeMarkup] = useState(config.airtime_markup_percent);
  const [dataMarkup, setDataMarkup] = useState(config.data_markup_flat);
  const [cableMarkup, setCableMarkup] = useState(config.cable_markup_flat);
  const [elecMarkup, setElecMarkup] = useState(config.electricity_markup_flat);
  const [examMarkup, setExamMarkup] = useState(config.exam_markup_flat);
  const [virtualMarkup, setVirtualMarkup] = useState(config.virtual_number_markup_percent);
  const [esimMarkup, setEsimMarkup] = useState(config.esim_markup_percent);

  // Profit simulator state
  const [simDataVolume, setSimDataVolume] = useState<number>(50); // 50 subscriptions/mo
  const [simAirtimeVolume, setSimAirtimeVolume] = useState<number>(100000); // 100k NGN/mo
  const [simExamVolume, setSimExamVolume] = useState<number>(20); // 20 pins/mo

  const estimatedMonthlyDataProfit = simDataVolume * dataMarkup;
  const estimatedMonthlyAirtimeProfit = simAirtimeVolume * (airtimeMarkup / 100);
  const estimatedMonthlyExamProfit = simExamVolume * examMarkup;
  const totalSimProfit = estimatedMonthlyDataProfit + estimatedMonthlyAirtimeProfit + estimatedMonthlyExamProfit;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      business_name: businessName,
      airtime_markup_percent: Number(airtimeMarkup),
      data_markup_flat: Number(dataMarkup),
      cable_markup_flat: Number(cableMarkup),
      electricity_markup_flat: Number(elecMarkup),
      exam_markup_flat: Number(examMarkup),
      virtual_number_markup_percent: Number(virtualMarkup),
      esim_markup_percent: Number(esimMarkup),
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="text-base font-bold text-neutral-900">Reseller Markup & Business Identity</h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure how much profit you earn on every sale. Resale prices update across your storefront and receipts instantly.
        </p>
      </div>

      {savedMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 animate-fadeIn">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Markup configuration saved! New prices are now active across the platform.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Form */}
        <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-5">
            {/* Business Brand Name */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Store / Reseller Brand Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 focus:border-emerald-500 outline-none"
                placeholder="e.g. FastVTU Enterprise"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Appears on customer recharge vouchers, receipts, and invoices.
              </p>
            </div>

            <div className="border-t border-neutral-100 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                Service Profit Markups
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Data Plan Flat Markup */}
                <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-800">Data Bundle Profit</label>
                    <span className="text-[11px] text-neutral-500">Flat per plan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-600">₦</span>
                    <input
                      type="number"
                      min={0}
                      max={1000}
                      value={dataMarkup}
                      onChange={(e) => setDataMarkup(Number(e.target.value))}
                      className="w-full rounded border border-neutral-300 bg-white px-2 py-1 text-xs font-mono font-bold text-neutral-900 outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400">e.g. +₦50 on 1GB/2GB bundles</span>
                </div>

                {/* Airtime Margin % */}
                <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-800">Airtime Wholesale Margin</label>
                    <span className="text-[11px] text-neutral-500">Percentage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={10}
                      value={airtimeMarkup}
                      onChange={(e) => setAirtimeMarkup(Number(e.target.value))}
                      className="w-full rounded border border-neutral-300 bg-white px-2 py-1 text-xs font-mono font-bold text-neutral-900 outline-none"
                    />
                    <span className="text-xs font-bold text-neutral-600">%</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">Wholesale gives 2% discount</span>
                </div>

                {/* Cable TV Flat Markup */}
                <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-800">Cable TV Fee</label>
                    <span className="text-[11px] text-neutral-500">Flat per bouquet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-600">₦</span>
                    <input
                      type="number"
                      min={0}
                      max={1000}
                      value={cableMarkup}
                      onChange={(e) => setCableMarkup(Number(e.target.value))}
                      className="w-full rounded border border-neutral-300 bg-white px-2 py-1 text-xs font-mono font-bold text-neutral-900 outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400">Added to DSTV / GOtv bouquet</span>
                </div>

                {/* Electricity Flat Markup */}
                <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-800">Electricity Convenience</label>
                    <span className="text-[11px] text-neutral-500">Flat fee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-600">₦</span>
                    <input
                      type="number"
                      min={0}
                      max={1000}
                      value={elecMarkup}
                      onChange={(e) => setElecMarkup(Number(e.target.value))}
                      className="w-full rounded border border-neutral-300 bg-white px-2 py-1 text-xs font-mono font-bold text-neutral-900 outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400">Added to meter token purchase</span>
                </div>

                {/* Exam PIN Flat Markup */}
                <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-800">Exam PIN Markup</label>
                    <span className="text-[11px] text-neutral-500">Flat per PIN</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-600">₦</span>
                    <input
                      type="number"
                      min={0}
                      max={2000}
                      value={examMarkup}
                      onChange={(e) => setExamMarkup(Number(e.target.value))}
                      className="w-full rounded border border-neutral-300 bg-white px-2 py-1 text-xs font-mono font-bold text-neutral-900 outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400">WAEC / NECO / JAMB tokens</span>
                </div>

                {/* Virtual Numbers Margin % */}
                <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-800">Virtual Number Markup</label>
                    <span className="text-[11px] text-neutral-500">Percentage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={virtualMarkup}
                      onChange={(e) => setVirtualMarkup(Number(e.target.value))}
                      className="w-full rounded border border-neutral-300 bg-white px-2 py-1 text-xs font-mono font-bold text-neutral-900 outline-none"
                    />
                    <span className="text-xs font-bold text-neutral-600">%</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">OTP rental resale margin</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800"
            >
              Save Markup Configuration
            </button>
          </form>
        </div>

        {/* Profit Projection Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-emerald-50/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Monthly Profit Projection
              </h3>
              <Sparkles className="h-4 w-4 text-emerald-600" />
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-neutral-700 mb-1">
                  <span>Estimated Monthly Data Sales</span>
                  <span className="font-mono font-bold text-neutral-900">{simDataVolume} plans</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={500}
                  value={simDataVolume}
                  onChange={(e) => setSimDataVolume(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-neutral-700 mb-1">
                  <span>Monthly Airtime Top-ups (₦)</span>
                  <span className="font-mono font-bold text-neutral-900">₦{simAirtimeVolume.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={1000000}
                  step={10000}
                  value={simAirtimeVolume}
                  onChange={(e) => setSimAirtimeVolume(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-neutral-700 mb-1">
                  <span>Monthly Exam PIN Checks</span>
                  <span className="font-mono font-bold text-neutral-900">{simExamVolume} PINs</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={200}
                  value={simExamVolume}
                  onChange={(e) => setSimExamVolume(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Total Estimated Net Profit Card */}
            <div className="rounded-lg bg-white p-4 border border-emerald-200 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Data Bundle Profit</span>
                <span className="font-mono font-bold text-neutral-900">₦{estimatedMonthlyDataProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Airtime Profit</span>
                <span className="font-mono font-bold text-neutral-900">₦{estimatedMonthlyAirtimeProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Exam PINs Profit</span>
                <span className="font-mono font-bold text-neutral-900">₦{estimatedMonthlyExamProfit.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-neutral-100 flex justify-between font-bold text-neutral-900">
                <span>Total Monthly Income</span>
                <span className="font-mono text-base text-emerald-800">₦{totalSimProfit.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500">
              *Projections based on your configured margins. All profit is retained in your account balance in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
