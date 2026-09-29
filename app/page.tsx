'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND } from '@/lib/branding';
import {
  Smartphone,
  Wifi,
  Zap,
  Tv,
  GraduationCap,
  Gift,
  PhoneCall,
  Globe2,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Sparkles,
  Wallet,
  Building2,
} from 'lucide-react';

export default function LandingPage() {
  const serviceCategories = [
    {
      icon: Smartphone,
      title: 'VTU Airtime Top-Up',
      desc: 'Instant automated recharge for MTN, Airtel, Glo, and 9mobile with zero service surcharge.',
      badge: 'Live in 0.2s',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
      href: '/airtime',
    },
    {
      icon: Wifi,
      title: 'SME & Corporate Data',
      desc: 'Low-cost high-speed data bundles with 30-day validity delivered in seconds.',
      badge: 'From ₦250/GB',
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
      href: '/dashboard',
    },
    {
      icon: Zap,
      title: 'Electricity Token Bills',
      desc: 'Pay prepaid & postpaid DISCO bills (IKEDC, EKEDC, AEDC, etc.) and generate instant tokens.',
      badge: 'Zero Convenience Fee',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
      href: '/dashboard',
    },
    {
      icon: Tv,
      title: 'Cable TV Subscriptions',
      desc: 'Instant renewal for DStv, GOtv, and StarTimes with smart card verification.',
      badge: 'Instant Reconnection',
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
      href: '/dashboard',
    },
    {
      icon: PhoneCall,
      title: 'Virtual Numbers (OTP)',
      desc: 'Rent disposable USA & International phone numbers to receive verification SMS on WhatsApp & Telegram.',
      badge: 'USA 1 & 2 Routes',
      color: 'from-sky-500/20 to-cyan-500/20 border-sky-500/30 text-sky-400',
      href: '/dashboard',
    },
    {
      icon: Globe2,
      title: 'Global Travel eSIM',
      desc: 'Instant high-speed international roaming data in over 150+ countries via QR code.',
      badge: 'No Physical SIM',
      color: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30 text-teal-400',
      href: '/dashboard',
    },
    {
      icon: Gift,
      title: 'Sell Gift Cards for Cash',
      desc: 'Trade Amazon, Steam, Apple, Razer Gold, and Amex at the highest market payout rates in Naira.',
      badge: 'Fast Bank Payout',
      color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400',
      href: '/dashboard',
    },
    {
      icon: GraduationCap,
      title: 'Exam Result Checker PINs',
      desc: 'Original result checker tokens and scratch cards for WAEC, NECO, and JAMB UTME.',
      badge: 'Instant PIN Display',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
      href: '/dashboard',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              E
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white block">
                {BRAND.name}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider block">
                {BRAND.tagline}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <Link href="/airtime" className="hover:text-emerald-400 transition-colors">
              Buy Airtime
            </Link>
            <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">
              Customer Dashboard
            </Link>
            <Link href="/wallet" className="hover:text-emerald-400 transition-colors">
              Digital Wallet
            </Link>
            <a href="#services" className="hover:text-emerald-400 transition-colors">
              All Services
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5"
            >
              <span>Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/15 to-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Customer App Live · Instant Airtime & Digital Wallet</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Your One-Stop{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Digital Service Hub
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Instant Nigerian mobile VTU airtime, affordable data bundles, electricity bill tokens, virtual OTP numbers, and dedicated bank account wallet funding in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-sm font-black shadow-xl shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Go to Customer Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/airtime"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-bold transition flex items-center justify-center gap-2"
            >
              <Smartphone className="h-4 w-4 text-emerald-400" />
              <span>Buy Airtime (From ₦50)</span>
            </Link>
            <Link
              href="/wallet"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-bold transition flex items-center justify-center gap-2"
            >
              <Wallet className="h-4 w-4 text-cyan-400" />
              <span>Digital Wallet</span>
            </Link>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Dedicated Virtual Accounts (Moniepoint / Wema)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Zero-Fee Wallet Top-Up</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Sub-second VTU Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            Complete Digital Catalog
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Every Essential Telecom & Utility Service
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Built with strict BigInt integer Kobo precision and resilient queuing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCategories.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <Link
                key={idx}
                href={srv.href}
                className="group p-6 rounded-3xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${srv.color} border flex items-center justify-center`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {srv.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Recharge Now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-slate-300 transition">
              Customer Sign In
            </Link>
            <Link href="/register" className="hover:text-slate-300 transition">
              Register
            </Link>
            <Link href="/airtime" className="hover:text-slate-300 transition">
              Airtime
            </Link>
            <Link href="/wallet" className="hover:text-slate-300 transition">
              Wallet
            </Link>
            <Link href="/admin/login" className="hover:text-amber-400 transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
