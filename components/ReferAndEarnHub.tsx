'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  Users,
  Copy,
  Check,
  Share2,
  TrendingUp,
  Gift,
  ArrowRight,
  Sparkles,
  QrCode,
  DollarSign,
  MessageCircle,
  Send,
} from 'lucide-react';

export function ReferAndEarnHub() {
  const { wallet, transferReferral } = useReseller();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferMessage, setTransferMessage] = useState<string | null>(null);

  const referralCode = 'EMMY892';
  const referralLink = `https://jejelayegct.com.ng/register?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleClaim = async () => {
    if (!wallet.referral_balance || wallet.referral_balance <= 0) return;
    setIsTransferring(true);
    const res = await transferReferral(wallet.referral_balance);
    setTransferMessage(res.message);
    setIsTransferring(false);
    setTimeout(() => setTransferMessage(null), 3500);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Join Emmy Digital HUB / Jejelaye GCT Reseller platform! Buy cheap MTN/Airtel SME data, aged social media logs, and rent virtual numbers for OTP. Sign up with my link: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareTelegram = () => {
    const text = encodeURIComponent(
      `Join Emmy Digital HUB / Jejelaye GCT Reseller platform! Buy cheap MTN/Airtel SME data, aged social media logs, and rent virtual numbers for OTP. Sign up with my link: ${referralLink}`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Refer & Earn Program</h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Invite fellow resellers and earn ₦1,000 on their first wallet deposit + 2% lifetime passive commission.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>Lifetime Passive Royalty</span>
        </div>
      </div>

      {transferMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <span>{transferMessage}</span>
          <button onClick={() => setTransferMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Available Referral Bonus
          </span>
          <div className="font-mono text-2xl font-black text-neutral-900 mt-1">
            ₦{(wallet.referral_balance || 4800).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <button
            onClick={handleClaim}
            disabled={isTransferring || !wallet.referral_balance || wallet.referral_balance <= 0}
            className="mt-3 w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-2 text-xs font-bold transition disabled:opacity-50"
          >
            {isTransferring ? 'Transferring...' : 'Transfer to Main Balance'}
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Total Resellers Referred
          </span>
          <div className="font-mono text-2xl font-black text-neutral-900 mt-1">18 Partners</div>
          <p className="text-[11px] text-neutral-500 mt-2">14 active transactions today</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Lifetime Commission Paid
          </span>
          <div className="font-mono text-2xl font-black text-emerald-700 mt-1">₦34,500.00</div>
          <p className="text-[11px] text-neutral-500 mt-2">Paid out to bank & wallet</p>
        </div>
      </div>

      {/* Referral Link & Sharing Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-neutral-900">Your Exclusive Invitation Link</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Share this link across WhatsApp groups, Telegram channels, and forums.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
            <span className="font-mono text-xs text-neutral-900 font-bold truncate flex-1 pl-2">
              {referralLink}
            </span>
            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition active:scale-95 shrink-0"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Social Share Buttons */}
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-2">Instant Social Share:</label>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={shareWhatsApp}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Share on WhatsApp</span>
              </button>
              <button
                onClick={shareTelegram}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
              >
                <Send className="h-4 w-4" />
                <span>Share on Telegram</span>
              </button>
            </div>
          </div>
        </div>

        {/* How it works info: 4 cols */}
        <div className="lg:col-span-4 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 text-xs text-emerald-950 space-y-3">
          <h4 className="font-bold text-emerald-900 text-sm">Commission Breakdown</h4>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2">
              <span className="h-5 w-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                1
              </span>
              <div>
                <div className="font-bold">₦1,000 First Deposit Bonus</div>
                <div className="text-[11px] text-emerald-900/80">
                  Credited as soon as your referral funds their wallet with ₦5,000+.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="h-5 w-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                2
              </span>
              <div>
                <div className="font-bold">2% Lifetime Volume Rebate</div>
                <div className="text-[11px] text-emerald-900/80">
                  Every time they buy data bundles, virtual numbers, or logs, 2% goes to you forever.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
