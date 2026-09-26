'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useReseller } from '@/context/ResellerContext';
import { NotificationCenterModal } from '@/components/NotificationCenterModal';
import { useAdminSession } from '@/lib/admin-auth';
import {
  Wallet,
  Settings,
  PlusCircle,
  HelpCircle,
  Bell,
  Menu,
  X,
  ChevronRight,
  Wifi,
  Zap,
  MessageSquare,
  Smartphone,
  MailCheck,
  Globe,
  Gift,
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Send,
  BookOpen,
  Users,
  User,
  LogOut,
  ExternalLink,
  MessageCircle,
  Layers,
  CreditCard,
  Building2,
  History,
  Lock,
} from 'lucide-react';

interface HeaderProps {
  onOpenFund: () => void;
  onOpenWithdraw?: () => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
}

export function Header({ onOpenFund, onOpenWithdraw, onOpenSettings, onOpenSupport }: HeaderProps) {
  const { wallet, activeTab, setActiveTab, config } = useReseller();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const adminUser = useAdminSession();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const navCategories = [
    {
      group: 'Quick Actions & Utilities',
      items: [
        { id: 'services', label: 'Buy Data & Airtime', icon: Wifi, desc: 'MTN, Airtel, Glo SME' },
        { id: 'services', label: 'Pay Bills (Electric & TV)', icon: Zap, desc: 'IKEDC, DSTV, WAEC' },
      ],
    },
    {
      group: 'Digital & Market Services',
      items: [
        { id: 'bulk_sms', label: 'Bulk SMS', icon: MessageSquare, desc: 'Custom Sender ID' },
        { id: 'virtual_numbers', label: 'Virtual Numbers (OTP)', icon: Smartphone, desc: 'USA & Global' },
        { id: 'email_verification', label: 'Email Verification', icon: MailCheck, desc: 'Clean emails & temp inbox' },
        { id: 'esim', label: 'Global eSIM', icon: Globe, desc: '160+ Countries' },
        { id: 'gift_cards', label: 'Trade Gift Cards', icon: Gift, desc: 'Highest Naira Rates' },
        { id: 'buy_logs', label: 'Premium Logs', icon: ShieldCheck, desc: 'FB, IG, X, Gmail' },
        { id: 'social_boost', label: 'Social Boost (SMM)', icon: TrendingUp, desc: 'Followers & Views' },
        { id: 'marketplace', label: 'Logs Marketplace', icon: ShoppingBag, desc: 'Aged Accounts' },
        { id: 'send_gift', label: 'Send Gift (P2P)', icon: Send, desc: 'Free Wallet Voucher' },
      ],
    },
    {
      group: 'Support & Developer Tools',
      items: [
        { id: 'tutorials', label: 'Tutorials & Guides', icon: BookOpen, desc: 'Step-by-step videos' },
        { id: 'support', label: 'Help Center & Desk', icon: HelpCircle, desc: '24/7 Ticketing' },
        { id: 'api_docs', label: 'API Documentation', icon: Settings, desc: 'v1 Endpoints & Keys' },
      ],
    },
    {
      group: 'Account Management',
      items: [
        { id: 'overview', label: 'Wallet Overview', icon: Wallet, desc: 'Balances & Stats' },
        { id: 'transactions', label: 'Transaction History', icon: History, desc: 'All Orders' },
        { id: 'checkout', label: 'Payment Gateway', icon: CreditCard, desc: 'Customer Invoices' },
        { id: 'payouts', label: 'Bank Payouts', icon: Building2, desc: 'Direct NIP Transfer' },
        { id: 'refer_earn', label: 'Refer & Earn', icon: Users, desc: 'Earn ₦1,000 + 2%' },
        { id: 'profile_settings', label: 'Profile Settings', icon: User, desc: 'Security & PIN' },
      ],
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* LEFT ZONE: Brand Logo & Identifier */}
          <div className="flex items-center gap-3">
            {/* Hamburger Trigger (Mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Navigation Drawer"
              className="md:hidden p-2 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Brand Logo: Emmy Digital HUB */}
            <button
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-amber-500 text-white flex items-center justify-center font-black text-sm tracking-tight shadow-xs group-hover:scale-105 transition-transform">
                <span>EDH</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-neutral-900 group-hover:text-emerald-700 transition-colors">
                    Emmy Digital HUB
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Jejelaye GCT
                  </span>
                </div>
                <div className="text-[10px] font-medium text-neutral-400 -mt-0.5 hidden xs:block">
                  Reseller & Digital Marketplace
                </div>
              </div>
            </button>
          </div>

          {/* CENTER ZONE: Primary Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'services'
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Buy Data
            </button>
            <button
              onClick={() => setActiveTab('buy_logs')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'buy_logs'
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Premium Logs
            </button>
            <button
              onClick={() => setActiveTab('virtual_numbers')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'virtual_numbers'
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Virtual Numbers
            </button>
            <button
              onClick={() => setActiveTab('social_boost')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'social_boost'
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Social Boost
            </button>
            <button
              onClick={() => setActiveTab('gift_cards')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'gift_cards'
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Gift Cards
            </button>
          </nav>

          {/* RIGHT ZONE: Quick Actions, Notifications & Wallet */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Wallet Pill */}
            <button
              onClick={onOpenFund}
              className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50/80 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-neutral-800 transition hover:bg-neutral-100 hover:border-neutral-300"
              title="Click to Fund Wallet"
            >
              <Wallet className="h-3.5 w-3.5 text-emerald-600" />
              <span
                suppressHydrationWarning
                className="font-mono tabular-nums font-bold text-neutral-900 text-xs sm:text-sm"
              >
                ₦{wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <PlusCircle className="h-3.5 w-3.5 text-emerald-600 hidden sm:block" />
            </button>

            {/* Notification Bell Indicator */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              aria-label="Notifications"
              className="relative p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition"
              title="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* API Config Modal Trigger */}
            <button
              onClick={onOpenSettings}
              aria-label="API Config"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition"
              title="API Configuration"
            >
              <Settings className="h-3.5 w-3.5 text-neutral-500" />
              <span className="hidden md:inline">API</span>
            </button>

            {/* Admin Portal Shortcut */}
            {adminUser ? (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-800 px-2.5 py-1.5 text-xs font-bold hover:bg-amber-500/25 transition shadow-xs"
                title={`Super Admin: ${adminUser.email}`}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition"
                title="Super Admin Login"
              >
                <Lock className="h-3.5 w-3.5 text-neutral-500" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            )}

            {/* Profile Avatar / Settings Shortcut */}
            <button
              onClick={() => setActiveTab('profile_settings')}
              aria-label="Profile Settings"
              className="flex items-center gap-1.5 rounded-xl bg-neutral-900 text-white p-1.5 sm:px-2.5 sm:py-1.5 hover:bg-neutral-800 transition"
              title="Emmanuel Owighoyota (Emmy Digital HUB Reseller)"
            >
              <div className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                EO
              </div>
              <span className="text-xs font-semibold hidden md:inline">Emmy</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FULL DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Body */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 text-white flex items-center justify-center font-bold text-xs tracking-tight">
                  EDH
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight">Emmy Digital HUB</div>
                  <div className="text-[10px] text-emerald-400">Jejelaye GCT Platform</div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Wallet Overview Strip in Drawer */}
            <div className="p-4 bg-emerald-50/60 border-b border-emerald-100">
              <div className="text-[10px] uppercase font-bold text-emerald-800">Available Wallet</div>
              <div className="font-mono text-xl font-black text-neutral-900 mt-0.5">
                ₦{wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex gap-2 mt-2.5">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenFund();
                  }}
                  className="flex-1 rounded-lg bg-emerald-700 py-1.5 text-xs font-bold text-white text-center hover:bg-emerald-800"
                >
                  + Fund Wallet
                </button>
                {onOpenWithdraw && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenWithdraw();
                    }}
                    className="flex-1 rounded-lg border border-neutral-300 bg-white py-1.5 text-xs font-semibold text-neutral-700 text-center"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Categories */}
            <div className="p-3 space-y-4 flex-1">
              {navCategories.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {group.group}
                  </div>
                  {group.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={itemIdx}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors ${
                          isActive
                            ? 'bg-neutral-900 text-white font-bold'
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
                          <div className="truncate">
                            <div>{item.label}</div>
                            <div className={`text-[10px] ${isActive ? 'text-neutral-300' : 'text-neutral-400'}`}>
                              {item.desc}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              ))}

              {/* External Communities */}
              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Staff & Administrative
                </div>
                <Link
                  href={adminUser ? '/admin' : '/admin/login'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 text-amber-950 text-xs font-semibold hover:bg-amber-100 transition border border-amber-200/60"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-amber-600" />
                    <span>{adminUser ? 'Super Admin Console' : 'Admin Portal Login'}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-amber-600" />
                </Link>

                <div className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  External Communities
                </div>
                <a
                  href="https://t.me/jejelayegct_community"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50 text-sky-950 text-xs font-semibold hover:bg-sky-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-sky-600" />
                    <span>Telegram Group (24.5k+)</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-sky-600" />
                </a>
                <a
                  href="https://wa.me/2348140008920"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 text-emerald-950 text-xs font-semibold hover:bg-emerald-100 transition"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    <span>WhatsApp VIP Desk</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-emerald-600" />
                </a>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 text-center text-[11px] text-neutral-500">
              Emmy Digital HUB • Jejelaye GCT v1.4.0
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer Modal */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsNotificationsOpen(false);
        }}
      />
    </>
  );
}
