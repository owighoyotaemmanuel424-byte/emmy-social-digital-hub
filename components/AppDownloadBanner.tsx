'use client';

import React, { useState } from 'react';
import { Smartphone, Download, Star, ShieldCheck, BellRing, QrCode, CheckCircle2, X } from 'lucide-react';

export function AppDownloadBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-950 via-neutral-900 to-emerald-950 p-5 sm:p-6 text-white shadow-md">
      {/* Background ambient pattern */}
      <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute right-1/4 -bottom-10 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      {/* Dismiss button */}
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition"
        title="Dismiss banner"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile App Available • iOS & Android</span>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Download Emmy Digital HUB Mobile App
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 leading-relaxed">
              Resell VTU data, buy verified social media logs, and receive instant SMS/OTP notifications with 1-tap biometric security on the go.
            </p>
          </div>

          {/* Value props */}
          <div className="flex flex-wrap gap-y-1.5 gap-x-4 text-[11px] sm:text-xs text-neutral-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Instant Push OTPs
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Fingerprint & FaceID Login
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Offline PIN Generation
            </span>
          </div>
        </div>

        {/* Action Badges */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* App Store Badge Button */}
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-3 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 px-4 py-2.5 rounded-xl transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="h-7 w-7 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
              <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.93.04-2.07.63-2.73 1.4-.58.67-1.09 1.77-.96 2.83 1.04.08 2.12-.53 2.75-1.3z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Download on the</div>
              <div className="text-sm font-bold text-white tracking-tight -mt-0.5">App Store</div>
            </div>
          </button>

          {/* Google Play Badge Button */}
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-3 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 px-4 py-2.5 rounded-xl transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="h-7 w-7 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
              <svg className="h-5 w-5 fill-white" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186c-.365-.328-.61-.83-.61-1.428V3.242c0-.598.245-1.1.609-1.428zm11.235 11.238l2.368 2.368-11.83 6.828 9.462-9.196zm2.368-2.052l-2.368 2.368-9.462-9.196 11.83 6.828zm1.097.947l3.203 1.849c.677.391.677 1.027 0 1.418l-3.203 1.85-2.078-2.559 2.078-2.558z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Get it on</div>
              <div className="text-sm font-bold text-white tracking-tight -mt-0.5">Google Play</div>
            </div>
          </button>

          {/* QR Code Quick Scan Trigger */}
          <button
            onClick={() => setShowQrModal(true)}
            className="hidden xl:flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-3 py-2 text-xs font-medium text-white transition border border-white/10"
            title="Scan QR Code to install"
          >
            <QrCode className="h-4 w-4 text-emerald-400" />
            <span>Scan QR</span>
          </button>
        </div>
      </div>

      {/* QR Code / Install modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white text-neutral-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 text-center relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="h-6 w-6" />
            </div>

            <h4 className="text-base font-bold text-neutral-900">Scan to Install Emmy Digital HUB</h4>
            <p className="text-xs text-neutral-500 mt-1">
              Point your smartphone camera at the QR code below to download the official APK or iOS TestFlight build.
            </p>

            <div className="my-5 flex justify-center">
              <div className="p-3 bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-xl inline-block shadow-inner">
                {/* SVG QR Code Simulation */}
                <svg className="h-40 w-40" viewBox="0 0 120 120" fill="currentColor">
                  {/* Outer corner squares */}
                  <rect x="10" y="10" width="30" height="30" fill="#047857" rx="4" />
                  <rect x="16" y="16" width="18" height="18" fill="white" rx="2" />
                  <rect x="20" y="20" width="10" height="10" fill="#047857" />

                  <rect x="80" y="10" width="30" height="30" fill="#047857" rx="4" />
                  <rect x="86" y="16" width="18" height="18" fill="white" rx="2" />
                  <rect x="90" y="20" width="10" height="10" fill="#047857" />

                  <rect x="10" y="80" width="30" height="30" fill="#047857" rx="4" />
                  <rect x="16" y="86" width="18" height="18" fill="white" rx="2" />
                  <rect x="20" y="90" width="10" height="10" fill="#047857" />

                  {/* Inner pixel matrix */}
                  <rect x="48" y="14" width="8" height="8" fill="#1e293b" />
                  <rect x="62" y="14" width="8" height="8" fill="#1e293b" />
                  <rect x="48" y="28" width="8" height="8" fill="#1e293b" />
                  <rect x="62" y="28" width="8" height="8" fill="#1e293b" />
                  <rect x="14" y="48" width="8" height="8" fill="#1e293b" />
                  <rect x="28" y="48" width="8" height="8" fill="#1e293b" />
                  <rect x="48" y="48" width="12" height="12" fill="#047857" rx="2" />
                  <rect x="68" y="48" width="8" height="8" fill="#1e293b" />
                  <rect x="84" y="48" width="8" height="8" fill="#1e293b" />
                  <rect x="98" y="48" width="8" height="8" fill="#1e293b" />
                  <rect x="48" y="68" width="8" height="8" fill="#1e293b" />
                  <rect x="62" y="68" width="8" height="8" fill="#1e293b" />
                  <rect x="84" y="68" width="8" height="8" fill="#1e293b" />
                  <rect x="48" y="84" width="8" height="8" fill="#1e293b" />
                  <rect x="68" y="84" width="8" height="8" fill="#1e293b" />
                  <rect x="84" y="84" width="8" height="8" fill="#1e293b" />
                  <rect x="98" y="84" width="8" height="8" fill="#1e293b" />
                  <rect x="62" y="98" width="8" height="8" fill="#1e293b" />
                  <rect x="84" y="98" width="8" height="8" fill="#1e293b" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-700">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 / 5.0 (14,200+ Verified Resellers)</span>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="mt-5 w-full rounded-xl bg-neutral-900 py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
