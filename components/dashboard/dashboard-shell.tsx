'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Smartphone,
  Wifi,
  Zap,
  Tv,
  GraduationCap,
  MessageSquare,
  Wallet,
  Receipt,
  HelpCircle,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { BRAND } from '@/lib/branding';

interface DashboardShellProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    walletBalanceKobo: string;
    formattedBalance: string;
  };
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('emmy_auth_token');
        localStorage.removeItem('emmy_user');
      } catch {}
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/login';
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home, disabled: false },
    { href: '/airtime', label: 'Airtime', icon: Smartphone, disabled: false },
    { href: '/data', label: 'Data Bundles', icon: Wifi, disabled: false },
    { href: '/electricity', label: 'Electricity Bills', icon: Zap, disabled: false },
    { href: '/cable', label: 'Cable TV', icon: Tv, disabled: false },
    { href: '/education', label: 'Exam PINs', icon: GraduationCap, disabled: false },
    { href: '/virtual-numbers', label: 'Virtual Numbers', icon: MessageSquare, disabled: false },
    { href: '/wallet', label: 'Wallet & VA', icon: Wallet, disabled: false },
    { href: '/transactions', label: 'Transactions', icon: Receipt, disabled: false },
    { href: 'https://wa.me/2348140008920', label: 'Support', icon: HelpCircle, disabled: false, external: true },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                E
              </div>
              <div className="hidden sm:block">
                <span className="font-extrabold text-base tracking-tight text-white block leading-none">
                  {BRAND.name}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">
                  Customer Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Right Header: Wallet Balance Chip + User Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/wallet"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-bold transition"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>{user.formattedBalance}</span>
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline max-w-[120px] truncate">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-800/80">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/wallet"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
                    >
                      <Building2 className="h-4 w-4 text-cyan-400" />
                      <span>Dedicated Bank Account</span>
                    </Link>
                    <Link
                      href="/transactions"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
                    >
                      <Receipt className="h-4 w-4 text-emerald-400" />
                      <span>Order History</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full py-6 flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <nav className="space-y-1 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-3 shadow-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              if (item.external) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-emerald-400" />
                      <span>{item.label}</span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                  </a>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content Body */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-6">{children}</main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 max-w-sm mx-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-extrabold text-white text-base">{BRAND.name}</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition ${
                      isActive ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 flex items-center justify-around">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/dashboard' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
        <Link
          href="/airtime"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/airtime' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Smartphone className="h-4 w-4" />
          <span>Airtime</span>
        </Link>
        <Link
          href="/data"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/data' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Wifi className="h-4 w-4" />
          <span>Data</span>
        </Link>
        <Link
          href="/electricity"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/electricity' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>Power</span>
        </Link>
        <Link
          href="/wallet"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/wallet' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Wallet className="h-4 w-4" />
          <span>Wallet</span>
        </Link>
      </div>
    </div>
  );
}
