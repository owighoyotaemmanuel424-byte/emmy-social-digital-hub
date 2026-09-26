'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Clock,
  Layers,
  Zap,
} from 'lucide-react';

interface BoostOrder {
  id: string;
  service_name: string;
  target_link: string;
  quantity: number;
  cost: number;
  status: 'processing' | 'in_progress' | 'completed';
  progress: number;
  time: string;
}

export function SocialBoostHub() {
  const { wallet, buySocialBoost } = useReseller();
  const [platform, setPlatform] = useState<'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'telegram' | 'facebook'>('instagram');
  const [serviceId, setServiceId] = useState('ig_followers');
  const [targetLink, setTargetLink] = useState('https://instagram.com/emmy_tech_reseller');
  const [quantity, setQuantity] = useState(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const boostServices = [
    // Instagram
    {
      id: 'ig_followers',
      platform: 'instagram',
      name: 'Instagram Real Followers (Non-Drop 30D Refill)',
      rate_per_1000: 1800,
      min: 100,
      max: 50000,
      speed: '5,000 / day',
    },
    {
      id: 'ig_likes',
      platform: 'instagram',
      name: 'Instagram High Quality Likes (Instant Start)',
      rate_per_1000: 450,
      min: 50,
      max: 20000,
      speed: 'Instant (10m)',
    },
    {
      id: 'ig_views',
      platform: 'instagram',
      name: 'Instagram Reels Viral Views + Impression Boost',
      rate_per_1000: 250,
      min: 500,
      max: 1000000,
      speed: '50,000 / day',
    },
    // TikTok
    {
      id: 'tiktok_followers',
      platform: 'tiktok',
      name: 'TikTok Active Followers (Live Stream Enabled)',
      rate_per_1000: 2400,
      min: 100,
      max: 25000,
      speed: '3,000 / day',
    },
    {
      id: 'tiktok_views',
      platform: 'tiktok',
      name: 'TikTok High-Retention Algorithmic Views',
      rate_per_1000: 150,
      min: 1000,
      max: 500000,
      speed: 'Super Fast',
    },
    // YouTube
    {
      id: 'yt_subscribers',
      platform: 'youtube',
      name: 'YouTube Organic Subscribers (Monetizable)',
      rate_per_1000: 6800,
      min: 100,
      max: 10000,
      speed: '500 / day',
    },
    {
      id: 'yt_watchtime',
      platform: 'youtube',
      name: 'YouTube Watch Hours (For 4,000h Monetization)',
      rate_per_1000: 4200,
      min: 500,
      max: 4000,
      speed: 'Stable 400h/day',
    },
    // Twitter / X
    {
      id: 'x_followers',
      platform: 'twitter',
      name: 'Twitter / X High Quality NFT/Crypto Followers',
      rate_per_1000: 3200,
      min: 100,
      max: 20000,
      speed: '2,000 / day',
    },
    // Telegram
    {
      id: 'tg_members',
      platform: 'telegram',
      name: 'Telegram Channel / Group Members (Zero Drop)',
      rate_per_1000: 1600,
      min: 100,
      max: 50000,
      speed: 'Instant Start',
    },
  ];

  const currentServices = boostServices.filter((s) => s.platform === platform);
  const activeService = boostServices.find((s) => s.id === serviceId) || currentServices[0];

  const cost = activeService ? (quantity / 1000) * activeService.rate_per_1000 : 0;

  const [orders, setOrders] = useState<BoostOrder[]>([
    {
      id: 'ORD-8921',
      service_name: 'Instagram Real Followers',
      target_link: 'https://instagram.com/emmy_business',
      quantity: 2500,
      cost: 4500,
      status: 'in_progress',
      progress: 68,
      time: '2 hours ago',
    },
    {
      id: 'ORD-8919',
      service_name: 'TikTok Algorithmic Views',
      target_link: 'https://tiktok.com/@reseller/video/7210',
      quantity: 10000,
      cost: 1500,
      status: 'completed',
      progress: 100,
      time: 'Yesterday',
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetLink.trim()) {
      setAlert({ type: 'error', message: 'Target profile or post URL is required' });
      return;
    }
    if (wallet.balance < cost) {
      setAlert({
        type: 'error',
        message: `Insufficient wallet balance. You have ₦${wallet.balance.toFixed(2)}, need ₦${cost.toLocaleString()}`,
      });
      return;
    }

    setIsSubmitting(true);
    setAlert(null);

    const res = await buySocialBoost(
      {
        id: activeService.id,
        name: activeService.name,
        type: 'social_boost',
        price: activeService.rate_per_1000,
      },
      targetLink,
      quantity
    );

    setIsSubmitting(false);

    if (res.success) {
      setAlert({
        type: 'success',
        message: `Social boost order placed successfully! Reference: ${res.reference}. Processing will start automatically.`,
      });
      setOrders([
        {
          id: res.reference || `ORD-${activeService.id}-PENDING`,
          service_name: activeService.name,
          target_link: targetLink,
          quantity,
          cost,
          status: 'processing',
          progress: 5,
          time: 'Just now',
        },
        ...orders,
      ]);
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-100 text-pink-800">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Social Media Growth & SMM Panel</h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Instant algorithmic delivery for Instagram, TikTok, YouTube, X, and Telegram channels.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-pink-700 bg-pink-50 border border-pink-200 px-3 py-1.5 rounded-xl">
          <Zap className="h-4 w-4" />
          <span>Automated Server API Dispatch</span>
        </div>
      </div>

      {alert && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn ${
            alert.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600" />
            )}
            <span>{alert.message}</span>
          </div>
          <button onClick={() => setAlert(null)} className="opacity-60 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Order Form + Order History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form: 7 cols */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          {/* Platform Tabs */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-2">Select Platform</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(['instagram', 'tiktok', 'youtube', 'twitter', 'telegram', 'facebook'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPlatform(p);
                    const matching = boostServices.filter((s) => s.platform === p);
                    if (matching[0]) setServiceId(matching[0].id);
                  }}
                  className={`p-2 rounded-xl border text-center text-xs font-bold capitalize transition ${
                    platform === p
                      ? 'border-pink-600 bg-pink-50 text-pink-900 shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {p === 'twitter' ? 'Twitter/X' : p}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service selector */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Service Package</label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-pink-600"
              >
                {currentServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — ₦{s.rate_per_1000.toLocaleString()}/1k ({s.speed})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Link */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Target Profile or Post Link
              </label>
              <input
                type="url"
                value={targetLink}
                onChange={(e) => setTargetLink(e.target.value)}
                placeholder="https://instagram.com/your_profile"
                className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-pink-600"
                required
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Account must be set to PUBLIC before submitting.
              </span>
            </div>

            {/* Quantity */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-neutral-700">Order Quantity</label>
                <span className="text-[11px] text-neutral-500 font-mono">
                  Min: {activeService?.min} • Max: {activeService?.max.toLocaleString()}
                </span>
              </div>
              <input
                type="number"
                min={activeService?.min || 100}
                max={activeService?.max || 50000}
                step={50}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs font-mono font-bold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-pink-600"
                required
              />
            </div>

            {/* Price Preview Card */}
            <div className="p-4 rounded-xl bg-pink-50/60 border border-pink-100 flex items-center justify-between text-xs">
              <div>
                <div className="text-pink-900 font-bold">Estimated Total Cost</div>
                <div className="text-[11px] text-pink-700">Deducted from available wallet</div>
              </div>
              <div className="font-mono text-lg font-black text-pink-900">
                ₦{cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || quantity < (activeService?.min || 100)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white py-3 text-xs font-bold transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Placing Boost Order...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 text-pink-400" />
                  <span>Submit Order (₦{cost.toLocaleString()})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Tracker: 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
              Active Growth Campaigns
            </h3>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.id} className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-neutral-900 truncate max-w-[200px]">
                      {ord.service_name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        ord.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-neutral-500 truncate">
                    {ord.target_link}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                      <span>Progress: {ord.progress}%</span>
                      <span>{ord.quantity.toLocaleString()} units</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${ord.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
