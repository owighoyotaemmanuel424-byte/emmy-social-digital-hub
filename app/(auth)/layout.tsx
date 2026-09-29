import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BRAND } from '@/lib/branding';

export const metadata: Metadata = {
  title: 'Sign in — Emmy Social Digital Hub',
  description: 'Access your Emmy Social Digital Hub customer portal for VTU, bills, and wallet management.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background radial ambient glow (emerald → cyan) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-cyan-500/15 blur-[130px] rounded-full pointer-events-none" />

      {/* Centered branding & content */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              E
            </div>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {BRAND.name}
            </h1>
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              {BRAND.tagline}
            </p>
          </div>
        </div>

        {children}

        <div className="text-center text-[11px] text-slate-500">
          &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </div>
      </div>
    </div>
  );
}
