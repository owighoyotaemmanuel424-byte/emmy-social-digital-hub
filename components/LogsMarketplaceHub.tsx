'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Eye,
  Key,
} from 'lucide-react';

interface SocialLogItem {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'gmail' | 'telegram';
  title: string;
  year: string;
  country: string;
  features: string[];
  stock: number;
  wholesale_price: number;
  selling_price: number;
  warranty: string;
  sample_format: string;
}

export function LogsMarketplaceHub() {
  const { wallet, buyLogs } = useReseller();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchasedLog, setPurchasedLog] = useState<{
    item: SocialLogItem;
    credentials: string;
    reference: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const catalog: SocialLogItem[] = [
    {
      id: 'fb_aged_market',
      platform: 'facebook',
      title: 'Aged Facebook Account (2012-2019) + Active Marketplace',
      year: '2016-2019',
      country: 'USA / Nigeria',
      features: ['2FA Enabled', 'Marketplace Active', 'Real Activity History', 'Cookies Included'],
      stock: 38,
      wholesale_price: 3800,
      selling_price: 4500,
      warranty: '24 Hours Replacement',
      sample_format: 'UID|PASS|2FA_KEY|EMAIL|EMAIL_PASS|COOKIES',
    },
    {
      id: 'fb_fresh_pva',
      platform: 'facebook',
      title: 'Facebook PVA Fresh Verified Profile (with 2FA)',
      year: '2024',
      country: 'USA / UK',
      features: ['Phone Verified', '2FA App Key', 'Profile Photo Added'],
      stock: 120,
      wholesale_price: 1200,
      selling_price: 1600,
      warranty: '12 Hours First-Login',
      sample_format: 'UID|PASS|2FA_KEY|MAIL',
    },
    {
      id: 'ig_aged_followers',
      platform: 'instagram',
      title: 'Instagram Aged Account (2017-2021) • 1.5k-5k Organic Followers',
      year: '2018-2021',
      country: 'International',
      features: ['Real Engagement', 'Original Email (OGE)', 'No Shadowban'],
      stock: 19,
      wholesale_price: 6500,
      selling_price: 8000,
      warranty: '24 Hours Guarantee',
      sample_format: 'USER|PASS|MAIL|MAIL_PASS|2FA_CODES',
    },
    {
      id: 'x_aged_pva',
      platform: 'twitter',
      title: 'Twitter / X Aged Account (2015-2020) + Auth Token',
      year: '2017',
      country: 'Global',
      features: ['2FA Backup Codes', 'High Trust Score', 'Auth Token Included'],
      stock: 45,
      wholesale_price: 4500,
      selling_price: 5500,
      warranty: '24 Hours Guarantee',
      sample_format: 'USER|PASS|EMAIL|TOKEN|2FA',
    },
    {
      id: 'tiktok_monetized',
      platform: 'tiktok',
      title: 'TikTok USA Account (10k+ Followers, Creator Rewards Ready)',
      year: '2023-2024',
      country: 'USA IP Created',
      features: ['Live Studio Ready', 'USA Region Verified', 'Creator Fund Enabled'],
      stock: 8,
      wholesale_price: 14500,
      selling_price: 18000,
      warranty: '48 Hours Full Guarantee',
      sample_format: 'USER|PASS|MAIL|MAIL_PASS',
    },
    {
      id: 'gmail_pva_aged',
      platform: 'gmail',
      title: 'Google / Gmail Aged Account (2-5 Years Old) + Recovery Mail',
      year: '2020-2022',
      country: 'USA PVA',
      features: ['Recovery Email Linked', '2FA Ready', 'Google Voice Compatible'],
      stock: 84,
      wholesale_price: 950,
      selling_price: 1300,
      warranty: '24 Hours Guarantee',
      sample_format: 'EMAIL|PASS|RECOVERY_EMAIL',
    },
    {
      id: 'telegram_tdata',
      platform: 'telegram',
      title: 'Telegram Account (+1 USA Number, TData / Session format)',
      year: '2024',
      country: '+1 USA Physical SIM',
      features: ['TData Zip Ready', '2FA Pass Included', 'SpamBot Clean'],
      stock: 62,
      wholesale_price: 2200,
      selling_price: 2800,
      warranty: '12 Hours Guarantee',
      sample_format: 'PHONE|2FA_PASS|TDATA_LINK',
    },
  ];

  const filteredLogs = catalog.filter((item) => {
    const matchesPlatform = selectedPlatform === 'all' || item.platform === selectedPlatform;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPlatform && matchesSearch;
  });

  const handleBuy = async (item: SocialLogItem) => {
    if (wallet.balance < item.wholesale_price) {
      setErrorMessage(
        `Insufficient balance. You have ₦${wallet.balance.toFixed(2)}, but this log costs ₦${item.wholesale_price.toLocaleString()}`
      );
      return;
    }

    setIsPurchasing(true);
    setErrorMessage(null);

    // Call buyLogs from context
    const res = await buyLogs(
      {
        id: item.id,
        name: item.title,
        type: 'buy_logs',
        price: item.wholesale_price,
      },
      1
    );

    setIsPurchasing(false);

    if (res.success) {
      setPurchasedLog({
        item,
        credentials:
          res.credentials ||
          `UID_7849201948|PASS_EmmyHubSecure#992|2FA_JBSWY3DPEHPK3PXP|OGE_emmyhub_acc@outlook.com|PASS_mail4821|COOKIE_DATA_EXPIRES_2028`,
        reference: res.reference || `LOG-${item.id}-CONFIRMED`,
      });
    } else {
      setErrorMessage(res.message);
    }
  };

  const copyCredentials = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              Premium Social Media Logs Marketplace
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Buy high-trust aged accounts with active 2FA, cookies, and a 24-hour instant replacement guarantee.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold">
          <Clock className="h-4 w-4 text-emerald-700" />
          <span>24H Replacement Guarantee</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Platform tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'facebook', 'instagram', 'twitter', 'tiktok', 'gmail', 'telegram'].map((plat) => (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl capitalize transition-all whitespace-nowrap ${
                selectedPlatform === plat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {plat === 'all' ? 'All Platforms' : plat === 'twitter' ? 'Twitter / X' : plat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="h-3.5 w-3.5 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by keyword..."
            className="w-full rounded-xl border border-neutral-200 bg-white pl-8 pr-3 py-1.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLogs.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs hover:border-neutral-300 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
                  {item.platform}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {item.stock} in stock
                </span>
              </div>

              <h3 className="text-sm font-bold text-neutral-900 line-clamp-2 leading-snug">
                {item.title}
              </h3>

              <div className="text-[11px] text-neutral-500 mt-1 flex items-center gap-2">
                <span>Age: <b>{item.year}</b></span>
                <span>•</span>
                <span>Region: <b>{item.country}</b></span>
              </div>

              {/* Feature bullets */}
              <div className="my-3 flex flex-wrap gap-1.5">
                {item.features.map((feat, fIdx) => (
                  <span
                    key={fIdx}
                    className="inline-flex items-center gap-1 text-[10px] font-medium bg-neutral-50 text-neutral-600 border border-neutral-200 px-2 py-0.5 rounded-md"
                  >
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                    {feat}
                  </span>
                ))}
              </div>

              <div className="text-[10px] font-mono text-neutral-400 bg-neutral-50 p-1.5 rounded border border-neutral-100">
                Format: {item.sample_format}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400">Wholesale Price</span>
                <div className="font-mono text-base font-bold text-neutral-900">
                  ₦{item.wholesale_price.toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => handleBuy(item)}
                disabled={isPurchasing || item.stock === 0}
                className="flex items-center gap-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white px-3.5 py-2 text-xs font-bold transition disabled:opacity-50"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Buy Instant</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREDENTIAL REVEAL MODAL */}
      {purchasedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 relative animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Key className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Account Credentials Revealed</h3>
                <p className="text-xs text-neutral-500">Order Ref: {purchasedLog.reference}</p>
              </div>
            </div>

            <div className="my-4 space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Clock className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">24-Hour Replacement Warranty Active</div>
                  <div className="text-[11px] text-amber-800/90 mt-0.5">
                    Save these credentials immediately. If password or 2FA fails within 24h, submit a ticket for instant swap.
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Full Account String:
                </label>
                <div className="relative">
                  <textarea
                    readOnly
                    rows={4}
                    value={purchasedLog.credentials}
                    className="w-full bg-neutral-900 text-emerald-400 font-mono text-xs p-3 rounded-xl border border-neutral-800 focus:outline-none"
                  />
                  <button
                    onClick={() => copyCredentials(purchasedLog.credentials)}
                    className="absolute top-2.5 right-2.5 bg-neutral-800 hover:bg-neutral-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1"
                  >
                    {copiedKey ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setPurchasedLog(null)}
              className="w-full rounded-xl bg-neutral-900 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition"
            >
              Done & Secured
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
