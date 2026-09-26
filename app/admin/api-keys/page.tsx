'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminSession, OFFICIAL_ADMIN_CREDENTIALS, clearStoredAdminSession } from '@/lib/admin-auth';
import { AdminApiKeysManager } from '@/components/admin/AdminApiKeysManager';
import {
  ShieldCheck,
  ChevronLeft,
  ExternalLink,
  LogOut,
  CheckCircle2,
  KeyRound,
  LayoutDashboard,
} from 'lucide-react';

export default function AdminApiKeysPage() {
  const router = useRouter();
  const adminUser = useAdminSession();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!adminUser) {
      router.push('/admin/login');
    }
  }, [adminUser, router]);

  const handleLogout = () => {
    clearStoredAdminSession();
    router.push('/admin/login');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-neutral-400">Verifying Super Admin Authorization...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-16">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-white transition flex items-center gap-1 text-xs"
              title="Return to Main Admin Console"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Console</span>
            </Link>

            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 text-white flex items-center justify-center font-black text-sm tracking-tight shadow-md">
              EDH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Reseller API Keys Hub
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-amber-400" />
                  Admin Control
                </span>
              </div>
              <div className="text-[10px] text-neutral-400">Developer & Partner Program Access</div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 text-xs font-semibold text-neutral-300 hover:text-white transition"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-neutral-400" />
              <span>Admin Dashboard</span>
            </Link>

            <Link
              href="/"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 text-xs font-semibold text-neutral-300 hover:text-white transition"
            >
              <span>Client Dashboard</span>
              <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
            </Link>

            {/* Admin Profile pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                {adminUser.avatar || 'EO'}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white truncate max-w-[140px]">
                  {adminUser.name || OFFICIAL_ADMIN_CREDENTIALS.name}
                </div>
                <div className="text-[10px] text-emerald-400 truncate max-w-[140px]">
                  {adminUser.email}
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition flex items-center gap-1.5 text-xs font-semibold"
              title="Sign Out of Admin Console"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex-1">
        <AdminApiKeysManager onNotify={showToast} />
      </main>
    </div>
  );
}
