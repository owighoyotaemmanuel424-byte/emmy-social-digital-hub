'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  Wifi,
  Zap,
  Tv,
  GraduationCap,
  MessageSquare,
  Smartphone,
  Globe,
  Gift,
  MailCheck,
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Send,
  Wallet,
  Users,
  BookOpen,
  LifeBuoy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface QuickActionsGridProps {
  onOpenFund: () => void;
  onOpenWithdraw: () => void;
}

export function QuickActionsGrid({ onOpenFund, onOpenWithdraw }: QuickActionsGridProps) {
  const { setActiveTab } = useReseller();
  const [activeFilter, setActiveFilter] = useState<'all' | 'utilities' | 'digital' | 'account'>('all');

  const categories = [
    { id: 'all', label: 'All Operations' },
    { id: 'utilities', label: 'Utilities & Telecom' },
    { id: 'digital', label: 'Digital & Growth' },
    { id: 'account', label: 'Account & Support' },
  ] as const;

  const utilityActions = [
    {
      id: 'buy_data',
      title: 'Buy Data',
      desc: 'MTN, Airtel, Glo & 9mobile SME/CG',
      icon: Wifi,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      badge: 'Instant',
      target: 'services',
    },
    {
      id: 'pay_electric',
      title: 'Pay Electric Bills',
      desc: 'IKEDC, EKEDC, AEDC, IBEDC & more',
      icon: Zap,
      color: 'bg-amber-50 text-amber-700 border-amber-200/60',
      badge: '0% Surcharge',
      target: 'services',
    },
    {
      id: 'tv_subscription',
      title: 'TV Subscription',
      desc: 'DSTV, GOtv, Startimes & Showmax',
      icon: Tv,
      color: 'bg-blue-50 text-blue-700 border-blue-200/60',
      badge: 'Auto-Renew',
      target: 'services',
    },
    {
      id: 'education_payment',
      title: 'Education Payment',
      desc: 'WAEC, NECO & JAMB UTME Pins',
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
      badge: 'Verified',
      target: 'services',
    },
    {
      id: 'bulk_sms',
      title: 'Bulk SMS',
      desc: 'Custom Sender ID & DND delivery',
      icon: MessageSquare,
      color: 'bg-violet-50 text-violet-700 border-violet-200/60',
      badge: '₦3.50/sms',
      target: 'bulk_sms',
    },
    {
      id: 'buy_number',
      title: 'Buy Number',
      desc: 'USA & Global numbers for OTP verification',
      icon: Smartphone,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200/60',
      badge: 'Real SIM',
      target: 'virtual_numbers',
    },
    {
      id: 'buy_esim',
      title: 'Buy eSIM',
      desc: 'Global roaming eSIM in 160+ countries',
      icon: Globe,
      color: 'bg-teal-50 text-teal-700 border-teal-200/60',
      badge: 'Instant QR',
      target: 'esim',
    },
  ];

  const digitalActions = [
    {
      id: 'trade_giftcards',
      title: 'Trade Gift Cards',
      desc: 'Steam, Apple, Razer, Amex & Vanilla',
      icon: Gift,
      color: 'bg-rose-50 text-rose-700 border-rose-200/60',
      badge: 'Highest Rate',
      target: 'gift_cards',
    },
    {
      id: 'email_verification',
      title: 'Email Verification',
      desc: 'Clean email lists & check validity',
      icon: MailCheck,
      color: 'bg-sky-50 text-sky-700 border-sky-200/60',
      badge: 'Real-Time',
      target: 'email_verification',
    },
    {
      id: 'buy_logs',
      title: 'Buy Logs',
      desc: 'Facebook, IG, Twitter, Gmail & TikTok logs',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-300/80',
      badge: '24h Replace',
      target: 'buy_logs',
    },
    {
      id: 'social_boost',
      title: 'Boost Social Media',
      desc: 'Followers, views, likes & retweets',
      icon: TrendingUp,
      color: 'bg-pink-50 text-pink-700 border-pink-200/60',
      badge: 'SMM Panel',
      target: 'social_boost',
    },
    {
      id: 'marketplace',
      title: 'Logs Marketplace',
      desc: 'Browse verified social media accounts',
      icon: ShoppingBag,
      color: 'bg-orange-50 text-orange-700 border-orange-200/60',
      badge: 'Aged 2012+',
      target: 'marketplace',
    },
    {
      id: 'send_gift',
      title: 'Send Gift',
      desc: 'Instant P2P wallet vouchers to peers',
      icon: Send,
      color: 'bg-purple-50 text-purple-700 border-purple-200/60',
      badge: 'Free Transfer',
      target: 'send_gift',
    },
  ];

  const accountActions = [
    {
      id: 'wallet_summary',
      title: 'Wallet Summary',
      desc: 'Manage funding, withdrawals & balances',
      icon: Wallet,
      color: 'bg-neutral-100 text-neutral-800 border-neutral-300',
      badge: 'Active',
      action: onOpenFund,
    },
    {
      id: 'refer_earn',
      title: 'Refer & Earn',
      desc: 'Earn ₦1,000 + 2% lifetime cashback',
      icon: Users,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badge: '₦34.5k Earned',
      target: 'refer_earn',
    },
    {
      id: 'tutorials',
      title: 'Tutorials',
      desc: 'Video guides & setup walk-throughs',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: 'Guides',
      target: 'tutorials',
    },
    {
      id: 'support',
      title: 'Support Desk',
      desc: 'Create tickets, WhatsApp & Telegram help',
      icon: LifeBuoy,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: '24/7 Live',
      target: 'support',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Category Pills Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-neutral-900">Quick Actions Grid</h2>
          <p className="text-xs text-neutral-500">Rapid access to high-frequency telecom, logs, and digital services</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeFilter === cat.id
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Group 1: Utilities & Telecom */}
      {(activeFilter === 'all' || activeFilter === 'utilities') && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Utilities & Telecom
            </span>
            <button
              onClick={() => setActiveTab('services')}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
            >
              View VTU Hub <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {utilityActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.target)}
                  className="flex flex-col items-start p-3.5 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50/80 hover:border-neutral-300 hover:shadow-xs transition-all text-left group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between w-full mb-2.5">
                    <div className={`p-2 rounded-lg border ${item.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700 transition">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Group 2: Digital Services & Growth */}
      {(activeFilter === 'all' || activeFilter === 'digital') && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Digital Services & Growth
            </span>
            <button
              onClick={() => setActiveTab('buy_logs')}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
            >
              Logs & Boosting <ChevronRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {digitalActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.target)}
                  className="flex flex-col items-start p-3.5 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50/80 hover:border-neutral-300 hover:shadow-xs transition-all text-left group"
                >
                  <div className="flex items-center justify-between w-full mb-2.5">
                    <div className={`p-2 rounded-lg border ${item.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700 transition">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Group 3: Account & Support */}
      {(activeFilter === 'all' || activeFilter === 'account') && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Account & Support
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {accountActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else if (item.target) {
                      setActiveTab(item.target);
                    }
                  }}
                  className="flex flex-col items-start p-3.5 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50/80 hover:border-neutral-300 hover:shadow-xs transition-all text-left group"
                >
                  <div className="flex items-center justify-between w-full mb-2.5">
                    <div className={`p-2 rounded-lg border ${item.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 transition">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700 transition">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                    {item.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
