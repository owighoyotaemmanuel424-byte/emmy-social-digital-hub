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
  ExternalLink,
  ChevronRight,
  CreditCard,
  Lock,
  Headphones,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  const serviceCategories = [
    {
      icon: Smartphone,
      title: 'VTU Airtime Top-Up',
      desc: 'Instant automated recharge for MTN, Airtel, Glo, and 9mobile with up to 3% discount.',
      badge: 'Instant 0.2s',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    },
    {
      icon: Wifi,
      title: 'SME & Corporate Data',
      desc: 'Low-cost high-speed data bundles with 30-day validity delivered in seconds.',
      badge: 'From ₦250/GB',
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
    },
    {
      icon: Zap,
      title: 'Electricity Token Bills',
      desc: 'Pay prepaid & postpaid DISCO bills (IKEDC, EKEDC, AEDC, etc.) and generate instant tokens.',
      badge: 'Zero Convenience Fee',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    },
    {
      icon: Tv,
      title: 'Cable TV Subscriptions',
      desc: 'Instant renewal for DStv, GOtv, and StarTimes with smart card verification.',
      badge: 'Instant Reconnection',
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-400',
    },
    {
      icon: PhoneCall,
      title: 'Virtual Numbers (OTP)',
      desc: 'Rent disposable USA & International phone numbers to receive verification SMS on WhatsApp & Telegram.',
      badge: 'USA 1 & 2 Routes',
      color: 'from-sky-500/20 to-cyan-500/20 border-sky-500/30 text-sky-400',
    },
    {
      icon: Globe2,
      title: 'Global Travel eSIM',
      desc: 'Instant high-speed international roaming data in over 150+ countries via QR code.',
      badge: 'No Physical SIM',
      color: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30 text-teal-400',
    },
    {
      icon: Gift,
      title: 'Sell Gift Cards for Cash',
      desc: 'Trade Amazon, Steam, Apple, Razer Gold, and Amex at the highest market payout rates in Naira.',
      badge: 'Fast Bank Payout',
      color: 'from-rose-500/20 to-pink-500/20 border-rose-500/30 text-rose-400',
    },
    {
      icon: GraduationCap,
      title: 'Exam Result Checker PINs',
      desc: 'Original result checker tokens and scratch cards for WAEC, NECO, and JAMB UTME.',
      badge: 'Instant PIN Display',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
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
            <a href="#services" className="hover:text-emerald-400 transition-colors">
              Services
            </a>
            <a href="#rates" className="hover:text-emerald-400 transition-colors">
              Live Rates
            </a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              Why Emmy Hub
            </a>
            <Link href="/admin" className="hover:text-amber-400 transition-colors">
              Admin Portal
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition"
            >
              Sign In
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-md shadow-emerald-500/20 transition active:scale-95 flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
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
            <span>Powering Nigerian Telecom & Digital Essentials</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Your One-Stop{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Digital Service Hub
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Buy instant airtime, cheapest SME data bundles, pay electricity bills, trade gift cards, rent disposable OTP phone numbers, and activate global travel eSIMs — all seamlessly powered by the JejeLaye v1 engine.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/admin"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-sm font-extrabold shadow-xl shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Explore Reseller Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/admin/api-keys"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm font-bold transition flex items-center justify-center gap-2"
            >
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>Reseller API Keys</span>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">99.98% Uptime</div>
                <div className="text-[10px] text-slate-400">Automated QStash</div>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <Zap className="h-6 w-6 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">&lt; 0.5s Dispatch</div>
                <div className="text-[10px] text-slate-400">Instant Delivery</div>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-teal-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Virtual Accounts</div>
                <div className="text-[10px] text-slate-400">Auto-Credit NIBSS</div>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <Headphones className="h-6 w-6 text-purple-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">24/7 Support</div>
                <div className="text-[10px] text-slate-400">WhatsApp & Tickets</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Complete Digital Suite
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Every Digital Service You Need in One Place
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Backed by reliable direct telecom interconnects and high-speed settlement gateways.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {serviceCategories.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="group relative p-5 rounded-3xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${service.color} border`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs font-bold text-emerald-400">
                  <span>Order Now</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950/90 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-sm">
              E
            </div>
            <div>
              <span className="font-bold text-white block">{BRAND.name}</span>
              <span className="text-[11px] text-slate-500">© 2026 {BRAND.name}. All rights reserved.</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/admin/login" className="hover:text-emerald-400 transition">
              Staff & Admin Login
            </Link>
            <Link href="/admin/api-keys" className="hover:text-emerald-400 transition">
              Developer API Keys
            </Link>
            <a href={`mailto:${BRAND.supportEmail}`} className="hover:text-emerald-400 transition">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
