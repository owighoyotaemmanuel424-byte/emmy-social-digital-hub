'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AdminUser,
  useAdminSession,
  clearStoredAdminSession,
  OFFICIAL_ADMIN_CREDENTIALS,
} from '@/lib/admin-auth';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  ShieldCheck,
  Sliders,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Smartphone,
  Server,
  Zap,
  ShoppingBag,
  Clock,
  Filter,
  KeyRound,
  Key,
} from 'lucide-react';
import { AdminApiKeysManager } from '@/components/admin/AdminApiKeysManager';

interface MockResellerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Enterprise' | 'Reseller Pro' | 'Standard';
  walletBalance: number;
  giftCardBalance: number;
  status: 'active' | 'suspended';
  totalSpent: number;
  registeredAt: string;
}

interface MockSystemOrder {
  id: string;
  userEmail: string;
  service: string;
  category: string;
  amount: number;
  providerStatus: 'completed' | 'processing' | 'failed';
  timestamp: string;
  reference: string;
}

interface MockLogStock {
  id: string;
  platform: string;
  tier: string;
  unitCost: number;
  retailPrice: number;
  inStock: number;
  soldCount: number;
  warranty: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const adminUser = useAdminSession();
  const [activeTab, setActiveTab] = useState<'overview' | 'resellers' | 'api_keys' | 'reserves' | 'orders' | 'logs' | 'settings'>('overview');

  // Stats & Floats
  const [systemReserves, setSystemReserves] = useState({
    jejelayeFloat: 2450000,
    moniepointReserve: 8120400,
    wemaFloat: 4279890,
  });

  // Resellers state
  const [resellers, setResellers] = useState<MockResellerUser[]>([
    {
      id: 'RES-001',
      name: 'Emmanuel Owighoyota',
      email: 'emmanuelowighoyota9@gmail.com',
      phone: '08140008920',
      tier: 'Enterprise',
      walletBalance: 254800,
      giftCardBalance: 65000,
      status: 'active',
      totalSpent: 1845000,
      registeredAt: '2024-01-15',
    },
    {
      id: 'RES-002',
      name: 'Adebayo Ogunlesi',
      email: 'adebayo.reseller@gmail.com',
      phone: '08023456789',
      tier: 'Reseller Pro',
      walletBalance: 42300,
      giftCardBalance: 12000,
      status: 'active',
      totalSpent: 620000,
      registeredAt: '2024-03-22',
    },
    {
      id: 'RES-003',
      name: 'Chinedu Eze',
      email: 'chinedu.vtu@yahoo.com',
      phone: '09012345678',
      tier: 'Standard',
      walletBalance: 8500,
      giftCardBalance: 0,
      status: 'active',
      totalSpent: 145000,
      registeredAt: '2024-05-10',
    },
    {
      id: 'RES-004',
      name: 'Grace Michael',
      email: 'grace.logs@outlook.com',
      phone: '07089123456',
      tier: 'Reseller Pro',
      walletBalance: 112000,
      giftCardBalance: 34000,
      status: 'active',
      totalSpent: 980000,
      registeredAt: '2024-02-18',
    },
    {
      id: 'RES-005',
      name: 'Femi Alabi',
      email: 'femi.telecoms@gmail.com',
      phone: '08134567890',
      tier: 'Standard',
      walletBalance: 0,
      giftCardBalance: 0,
      status: 'suspended',
      totalSpent: 45000,
      registeredAt: '2024-06-01',
    },
  ]);

  // Adjust balance modal
  const [selectedReseller, setSelectedReseller] = useState<MockResellerUser | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(5000);
  const [adjustType, setAdjustType] = useState<'credit' | 'debit'>('credit');
  const [adjustNote, setAdjustNote] = useState('');
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Orders State
  const [orders, setOrders] = useState<MockSystemOrder[]>([
    {
      id: 'ORD-98214',
      userEmail: 'emmanuelowighoyota9@gmail.com',
      service: 'MTN SME 5GB Data Bundle',
      category: 'Data',
      amount: 1475,
      providerStatus: 'completed',
      timestamp: 'Just now',
      reference: 'JEJE-DATA-894109',
    },
    {
      id: 'ORD-98213',
      userEmail: 'adebayo.reseller@gmail.com',
      service: 'Facebook Aged Account (2014-2018 Marketplace)',
      category: 'Logs',
      amount: 6500,
      providerStatus: 'completed',
      timestamp: '3 mins ago',
      reference: 'JEJE-LOG-781902',
    },
    {
      id: 'ORD-98212',
      userEmail: 'grace.logs@outlook.com',
      service: 'USA Virtual OTP Number (WhatsApp)',
      category: 'Virtual Number',
      amount: 1850,
      providerStatus: 'completed',
      timestamp: '8 mins ago',
      reference: 'JEJE-NUM-554109',
    },
    {
      id: 'ORD-98211',
      userEmail: 'chinedu.vtu@yahoo.com',
      service: 'IKEDC Electric Bill Prepaid (Token)',
      category: 'Bills',
      amount: 10000,
      providerStatus: 'completed',
      timestamp: '15 mins ago',
      reference: 'JEJE-BILL-228941',
    },
    {
      id: 'ORD-98210',
      userEmail: 'femi.telecoms@gmail.com',
      service: 'Airtel Corporate Gifting 10GB',
      category: 'Data',
      amount: 2950,
      providerStatus: 'failed',
      timestamp: '42 mins ago',
      reference: 'JEJE-DATA-110948',
    },
  ]);

  // Social Logs Stock
  const [logsStock, setLogsStock] = useState<MockLogStock[]>([
    {
      id: 'LOG-FB-AGED',
      platform: 'Facebook',
      tier: '2012-2019 Aged Marketplace Active (2FA + Cookies)',
      unitCost: 4500,
      retailPrice: 6500,
      inStock: 124,
      soldCount: 1420,
      warranty: '24 Hours',
    },
    {
      id: 'LOG-IG-AGED',
      platform: 'Instagram',
      tier: '2015-2019 Clean Aged with Active Organic Feed',
      unitCost: 3200,
      retailPrice: 4800,
      inStock: 88,
      soldCount: 950,
      warranty: '24 Hours',
    },
    {
      id: 'LOG-TT-FUND',
      platform: 'TikTok',
      tier: 'USA Creator Rewards Beta Enabled (10k+ Followers)',
      unitCost: 12000,
      retailPrice: 18500,
      inStock: 32,
      soldCount: 310,
      warranty: '48 Hours',
    },
    {
      id: 'LOG-GOOGLE-PVA',
      platform: 'Google / Gmail',
      tier: 'Fresh PVA with Real USA Recovery SMS & App Password',
      unitCost: 650,
      retailPrice: 1200,
      inStock: 240,
      soldCount: 5600,
      warranty: 'Instant',
    },
    {
      id: 'LOG-TW-X',
      platform: 'Twitter / X',
      tier: '2017 Aged Profile (Ads Qualified with Clean Karma)',
      unitCost: 2800,
      retailPrice: 4200,
      inStock: 56,
      soldCount: 430,
      warranty: '24 Hours',
    },
  ]);

  // New stock batch modal
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [newStockPlatform, setNewStockPlatform] = useState('Facebook');
  const [newStockTier, setNewStockTier] = useState('2020 Clean Account');
  const [newStockQuantity, setNewStockQuantity] = useState(50);
  const [newStockCost, setNewStockCost] = useState(3500);
  const [newStockRetail, setNewStockRetail] = useState(5000);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Check auth session
  useEffect(() => {
    if (!adminUser) {
      router.push('/admin/login');
    }
  }, [adminUser, router]);

  const handleLogout = () => {
    clearStoredAdminSession();
    router.push('/admin/login');
  };

  const handleApplyBalanceAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReseller) return;

    const diff = adjustType === 'credit' ? adjustAmount : -adjustAmount;
    setResellers((prev) =>
      prev.map((r) => {
        if (r.id === selectedReseller.id) {
          const newBal = Math.max(0, r.walletBalance + diff);
          return { ...r, walletBalance: newBal };
        }
        return r;
      })
    );

    setActionSuccessToast(
      `Successfully ${adjustType === 'credit' ? 'credited' : 'debited'} ₦${adjustAmount.toLocaleString()} to ${selectedReseller.name} (${selectedReseller.email})`
    );
    setSelectedReseller(null);
    setAdjustNote('');
    setTimeout(() => setActionSuccessToast(null), 4000);
  };

  const toggleResellerStatus = (id: string) => {
    setResellers((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextStatus = r.status === 'active' ? 'suspended' : 'active';
          setActionSuccessToast(`Reseller account ${r.name} status updated to: ${nextStatus.toUpperCase()}`);
          setTimeout(() => setActionSuccessToast(null), 3000);
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  const handleRetryOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return { ...o, providerStatus: 'completed' };
        }
        return o;
      })
    );
    setActionSuccessToast(`Order ${orderId} successfully re-dispatched and marked completed!`);
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  const handleAddStockBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: MockLogStock = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      platform: newStockPlatform,
      tier: newStockTier,
      unitCost: newStockCost,
      retailPrice: newStockRetail,
      inStock: newStockQuantity,
      soldCount: 0,
      warranty: '24 Hours',
    };
    setLogsStock((prev) => [newLog, ...prev]);
    setIsStockModalOpen(false);
    setActionSuccessToast(`Added batch of ${newStockQuantity} verified ${newStockPlatform} accounts to inventory!`);
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  const handleTopUpProviderFloat = (amount: number) => {
    setSystemReserves((prev) => ({
      ...prev,
      jejelayeFloat: prev.jejelayeFloat + amount,
    }));
    setActionSuccessToast(`Successfully injected ₦${amount.toLocaleString()} into JejeLaye API Provider Float!`);
    setTimeout(() => setActionSuccessToast(null), 3500);
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

  const totalResellerBalances = resellers.reduce((acc, r) => acc + r.walletBalance, 0);
  const totalResellerGiftBalances = resellers.reduce((acc, r) => acc + r.giftCardBalance, 0);
  const totalSystemReserves = systemReserves.jejelayeFloat + systemReserves.moniepointReserve + systemReserves.wemaFloat;
  const filteredResellers = resellers.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white pb-12">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 text-white flex items-center justify-center font-black text-sm tracking-tight shadow-md">
              EDH
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Emmy Digital HUB
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-amber-400" />
                  Super Admin
                </span>
              </div>
              <div className="text-[10px] text-neutral-400">Master Operations & Reserve Console</div>
            </div>
          </div>

          {/* Quick Actions & Profile */}
          <div className="flex items-center gap-3">
            {/* View Reseller Dashboard shortcut */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900/80 text-xs font-semibold text-neutral-300 hover:text-white transition"
            >
              <span>Reseller Dashboard</span>
              <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
            </Link>

            {/* Admin Profile pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                {adminUser?.avatar || 'EO'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-white truncate max-w-[140px]">
                  {adminUser?.name || OFFICIAL_ADMIN_CREDENTIALS.name}
                </div>
                <div className="text-[10px] text-emerald-400 truncate max-w-[140px]">
                  {adminUser?.email || OFFICIAL_ADMIN_CREDENTIALS.email}
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

      {/* Action Notification Toast */}
      {actionSuccessToast && (
        <div className="fixed top-16 right-4 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full space-y-6 flex-1">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-800 scrollbar-none">
          {[
            { id: 'overview', label: 'Master Overview', icon: LayoutDashboard },
            { id: 'resellers', label: `Resellers (${resellers.length})`, icon: Users },
            { id: 'api_keys', label: 'Reseller API Keys', icon: KeyRound },
            { id: 'reserves', label: 'System Float & Liquidity', icon: DollarSign },
            { id: 'orders', label: 'Orders & Audit Log', icon: Receipt },
            { id: 'logs', label: 'Social Logs Stock Vault', icon: ShoppingBag },
            { id: 'settings', label: 'Global Margins & API', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-neutral-800 text-white border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Liquidity */}
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
                  <span>Total System Reserves</span>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="font-mono text-2xl font-black text-white">
                  ₦{totalSystemReserves.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Backed across Moniepoint, Wema & JejeLaye</span>
                </div>
              </div>

              {/* Reseller Balances */}
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
                  <span>Customer Wallet Liabilities</span>
                  <Users className="h-4 w-4 text-sky-400" />
                </div>
                <div className="font-mono text-2xl font-black text-white">
                  ₦{totalResellerBalances.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-neutral-400">
                  Across {resellers.length} registered reseller nodes
                </div>
              </div>

              {/* 24h Transactions */}
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
                  <span>24h Order Turnover</span>
                  <TrendingUp className="h-4 w-4 text-amber-400" />
                </div>
                <div className="font-mono text-2xl font-black text-white">
                  ₦3,940,500.00
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+18.4% compared to yesterday</span>
                </div>
              </div>

              {/* Logs Stock Inventory */}
              <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold">
                  <span>Social Logs in Stock</span>
                  <ShoppingBag className="h-4 w-4 text-purple-400" />
                </div>
                <div className="font-mono text-2xl font-black text-white">
                  {logsStock.reduce((acc, l) => acc + l.inStock, 0)} Units
                </div>
                <div className="text-[11px] text-neutral-400">
                  Ready for instant automated API delivery
                </div>
              </div>
            </div>

            {/* Quick Action: Reseller API Keys Hub */}
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Reseller API Keys Hub</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                      REST v1 Engine
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Grant programmatic wallet debit & VTU ordering access to reseller websites, WooCommerce, and bots
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('api_keys')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Add Reseller API Key</span>
                </button>
                <Link
                  href="/admin/api-keys"
                  className="px-3 py-2 rounded-xl border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold hover:bg-neutral-800 transition flex items-center gap-1"
                >
                  <span>Dedicated View</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Two Column Layout: Quick Actions & Live Gateway Status */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Provider Health & Floats (7 cols) */}
              <div className="lg:col-span-7 bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white">System Gateway & Bank Liquidity</h3>
                    <p className="text-xs text-neutral-400">Live API provider connections and bank clearing pools</p>
                  </div>
                  <button
                    onClick={() => handleTopUpProviderFloat(500000)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Inject Float (+₦500k)</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* JejeLaye Float */}
                  <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <Server className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>JejeLaye Core API Provider v1</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                            99.98% OK
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400">Direct VTU, SME Data & OTP Gateway</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-white">
                        ₦{systemReserves.jejelayeFloat.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-neutral-500">Live Clearing Balance</div>
                    </div>
                  </div>

                  {/* Moniepoint Reserve */}
                  <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>Moniepoint NIBSS Dynamic Pool</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                            Instant Webhook
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400">Automated Wallet Credit Engine</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-white">
                        ₦{systemReserves.moniepointReserve.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-neutral-500">Reserved for Credits</div>
                    </div>
                  </div>

                  {/* Wema Reserve */}
                  <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>Wema Bank Settlement Vault</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                            Connected
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400">Reseller Outbound Payout Pool</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold text-white">
                        ₦{systemReserves.wemaFloat.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-neutral-500">Settlement Reserve</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Recent Orders & Alerts (5 cols) */}
              <div className="lg:col-span-5 bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Recent System Activity</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    View All Orders
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((order) => (
                    <div
                      key={order.id}
                      className="p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-white truncate">{order.service}</div>
                        <div className="text-[10px] text-neutral-400 truncate">
                          {order.userEmail} • {order.timestamp}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-white">
                          ₦{order.amount.toLocaleString()}
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                            order.providerStatus === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {order.providerStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESELLERS MANAGEMENT */}
        {activeTab === 'resellers' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="h-4 w-4 absolute left-3 top-3 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search reseller by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="text-xs text-neutral-400">
                Showing <strong className="text-white">{filteredResellers.length}</strong> registered resellers
              </div>
            </div>

            {/* Resellers Table */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950/70 border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-400">
                    <tr>
                      <th className="p-4 font-bold">Reseller User</th>
                      <th className="p-4 font-bold">Tier</th>
                      <th className="p-4 font-bold">Naira Wallet</th>
                      <th className="p-4 font-bold">Gift Card Bal.</th>
                      <th className="p-4 font-bold">Total Spent</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {filteredResellers.map((reseller) => (
                      <tr key={reseller.id} className="hover:bg-neutral-850/50 transition">
                        <td className="p-4">
                          <div className="font-bold text-white">{reseller.name}</div>
                          <div className="text-[11px] text-neutral-400">{reseller.email}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">{reseller.phone}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-neutral-800 border border-neutral-700 text-neutral-300">
                            {reseller.tier}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-400">
                          ₦{reseller.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 font-mono font-bold text-amber-300">
                          ₦{reseller.giftCardBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4 font-mono text-neutral-300">
                          ₦{reseller.totalSpent.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              reseller.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {reseller.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setActiveTab('api_keys')}
                              className="px-2 py-1 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-[11px] font-bold transition flex items-center gap-1"
                              title="Manage Reseller API Key"
                            >
                              <KeyRound className="h-3 w-3 text-emerald-400" />
                              <span>API Key</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedReseller(reseller);
                                setAdjustType('credit');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-[11px] font-bold transition"
                            >
                              Adjust Balance
                            </button>
                            <button
                              onClick={() => toggleResellerStatus(reseller.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                                reseller.status === 'active'
                                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                              }`}
                            >
                              {reseller.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: RESELLER API KEYS */}
        {activeTab === 'api_keys' && (
          <AdminApiKeysManager
            onNotify={(msg) => {
              setActionSuccessToast(msg);
              setTimeout(() => setActionSuccessToast(null), 3500);
            }}
          />
        )}

        {/* TAB 3: SYSTEM RESERVES & LIQUIDITY */}
        {activeTab === 'reserves' && (
          <div className="space-y-6">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Central Liquidity & Provider Floats</h3>
                <p className="text-xs text-neutral-400">
                  Ensure the API gateway maintains sufficient prepaid float to fulfill instant VTU and digital orders.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    JejeLaye Core Provider Float
                  </div>
                  <div className="font-mono text-2xl font-black text-emerald-400">
                    ₦{systemReserves.jejelayeFloat.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTopUpProviderFloat(200000)}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition"
                    >
                      +₦200,000
                    </button>
                    <button
                      onClick={() => handleTopUpProviderFloat(1000000)}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
                    >
                      +₦1,000,000
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    Moniepoint Dynamic Inflow Float
                  </div>
                  <div className="font-mono text-2xl font-black text-blue-400">
                    ₦{systemReserves.moniepointReserve.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Auto-sweeps to corporate treasury at 23:59 daily.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    Wema Settlement Liquidity
                  </div>
                  <div className="font-mono text-2xl font-black text-purple-400">
                    ₦{systemReserves.wemaFloat.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Sufficient for automated instant bank payouts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS AUDIT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">System Transactions Audit</h3>
                  <p className="text-[11px] text-neutral-400">All customer and API dispatches in chronological order</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950/70 border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-400">
                    <tr>
                      <th className="p-4 font-bold">Reference / ID</th>
                      <th className="p-4 font-bold">Reseller User</th>
                      <th className="p-4 font-bold">Service Ordered</th>
                      <th className="p-4 font-bold">Amount</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Time</th>
                      <th className="p-4 font-bold text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-850/50 transition">
                        <td className="p-4 font-mono font-bold text-neutral-300">
                          <div>{order.reference}</div>
                          <div className="text-[10px] text-neutral-500">{order.id}</div>
                        </td>
                        <td className="p-4 text-neutral-300 font-medium">{order.userEmail}</td>
                        <td className="p-4">
                          <span className="font-semibold text-white">{order.service}</span>
                          <span className="block text-[10px] text-neutral-400">{order.category}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-emerald-400">
                          ₦{order.amount.toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              order.providerStatus === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}
                          >
                            {order.providerStatus}
                          </span>
                        </td>
                        <td className="p-4 text-neutral-400 text-[11px]">{order.timestamp}</td>
                        <td className="p-4 text-right">
                          {order.providerStatus === 'failed' ? (
                            <button
                              onClick={() => handleRetryOrder(order.id)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 text-[11px] font-bold transition"
                            >
                              Retry & Complete
                            </button>
                          ) : (
                            <span className="text-[10px] text-neutral-500">Auto-Delivered</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SOCIAL LOGS VAULT */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Social Logs & Account Stock Vault</h3>
                <p className="text-xs text-neutral-400">
                  Manage inventory of aged Facebook, Instagram, Google PVA, and TikTok creator logs
                </p>
              </div>
              <button
                onClick={() => setIsStockModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Account Batch</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {logsStock.map((stock) => (
                <div key={stock.id} className="p-5 rounded-3xl bg-neutral-900/90 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-800 text-emerald-400 border border-neutral-700">
                      {stock.platform}
                    </span>
                    <span className="text-[11px] text-neutral-400">Warranty: {stock.warranty}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">{stock.tier}</h4>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Wholesale Cost</span>
                      <span className="font-mono font-bold text-neutral-300">₦{stock.unitCost.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">Retail Price</span>
                      <span className="font-mono font-bold text-emerald-400">₦{stock.retailPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400">Stock Available</span>
                      <div className="font-mono text-base font-black text-white">{stock.inStock} Accounts</div>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-semibold">
                      {stock.soldCount} Sold to Date
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: GLOBAL SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Platform Margins & Service Controls</h3>
              <p className="text-xs text-neutral-400">
                Adjust wholesale base pricing multipliers and operational safeguards
              </p>
            </div>

            <div className="space-y-4 max-w-2xl">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Maintenance Mode Safeguard</div>
                  <div className="text-[11px] text-neutral-400">Pause automated orders when provider undergoing maintenance</div>
                </div>
                <input type="checkbox" className="h-4 w-4 accent-emerald-500 rounded cursor-pointer" />
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Instant Reseller Registration Bonus</div>
                  <div className="text-[11px] text-neutral-400">Credit ₦1,000 on first wallet deposit &gt; ₦5,000</div>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-emerald-500 rounded cursor-pointer" />
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Default Reseller Base Profit Margin</div>
                  <div className="text-[11px] text-neutral-400">Default markup applied to VTU data and bill products</div>
                </div>
                <div className="font-mono text-sm font-bold text-emerald-400 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-700">
                  +5.00%
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ADJUST BALANCE MODAL */}
      {selectedReseller && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h4 className="text-base font-bold text-white mb-1">Adjust Wallet Balance</h4>
            <p className="text-xs text-neutral-400 mb-4">
              Modify balance for <strong className="text-white">{selectedReseller.name}</strong> ({selectedReseller.email})
            </p>

            <form onSubmit={handleApplyBalanceAdjustment} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustType('credit')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                    adjustType === 'credit'
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                  }`}
                >
                  + Credit (Deposit)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('debit')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                    adjustType === 'debit'
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                  }`}
                >
                  - Debit (Deduct)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Amount (₦)</label>
                <input
                  type="number"
                  min={100}
                  step={500}
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Admin Audit Note</label>
                <input
                  type="text"
                  placeholder="e.g. Manual bank transfer resolution"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReseller(null)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STOCK BATCH MODAL */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h4 className="text-base font-bold text-white mb-1">Add Account Batch to Vault</h4>
            <p className="text-xs text-neutral-400 mb-4">Stock verified accounts for instant reseller purchase</p>

            <form onSubmit={handleAddStockBatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Platform</label>
                <select
                  value={newStockPlatform}
                  onChange={(e) => setNewStockPlatform(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Google / Gmail">Google / Gmail</option>
                  <option value="Twitter / X">Twitter / X</option>
                  <option value="Telegram">Telegram</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Account Tier & Specifications</label>
                <input
                  type="text"
                  required
                  value={newStockTier}
                  onChange={(e) => setNewStockTier(e.target.value)}
                  placeholder="e.g. 2018 Aged with Marketplace Active"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={newStockQuantity}
                    onChange={(e) => setNewStockQuantity(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Cost (₦)</label>
                  <input
                    type="number"
                    min={100}
                    value={newStockCost}
                    onChange={(e) => setNewStockCost(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Retail (₦)</label>
                  <input
                    type="number"
                    min={100}
                    value={newStockRetail}
                    onChange={(e) => setNewStockRetail(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition"
                >
                  Add Accounts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
