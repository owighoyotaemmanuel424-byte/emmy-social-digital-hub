'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  BookOpen,
  Play,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Smartphone,
  ShieldCheck,
  Gift,
  Wallet,
  Settings,
  X,
  MessageCircle,
  Send,
} from 'lucide-react';

interface GuideItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  icon: any;
  summary: string;
  steps: string[];
}

export function TutorialsHub() {
  const { setActiveTab } = useReseller();
  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null);

  const guides: GuideItem[] = [
    {
      id: 'g1',
      title: 'How to Fund Your Wallet Instantly via NIBSS Virtual Account',
      category: 'Wallet & Payments',
      duration: '2 mins read',
      icon: Wallet,
      summary: 'Learn how to credit your wallet in seconds using Moniepoint/Wema dynamic account numbers.',
      steps: [
        'Open your banking mobile app (Opay, PalmPay, Kuda, GTBank, Zenith, etc.).',
        'Copy your dedicated NIBSS account number displayed on your Emmy Digital HUB dashboard.',
        'Transfer your desired amount. No deposit charges apply.',
        'Your dashboard wallet will automatically refresh and credit within 5-10 seconds.',
      ],
    },
    {
      id: 'g2',
      title: 'Complete Guide to Buying & Securing Facebook and IG Logs',
      category: 'Social Logs',
      duration: '4 mins read',
      icon: ShieldCheck,
      summary: 'Best practices for logging into aged accounts with 2FA, anti-detect cookies, and avoiding checkpoints.',
      steps: [
        'Select the aged account tier you need (e.g., 2012-2019 Facebook with Marketplace).',
        'Click "Buy Instant". Your credentials will appear in the format: UID|PASS|2FA_KEY|COOKIE.',
        'Use an anti-detect browser (such as AdsPower or Dolphin) or clean incognito browser with a matching residential proxy.',
        'Input the 2FA secret into 2fa.live or Google Authenticator to generate your 6-digit login token.',
        'Verify full functionality. You have a 24-hour instant replacement guarantee.',
      ],
    },
    {
      id: 'g3',
      title: 'Renting USA & Global Virtual Numbers for OTP Activations',
      category: 'Virtual Numbers',
      duration: '3 mins read',
      icon: Smartphone,
      summary: 'How to receive SMS OTP codes for WhatsApp, Telegram, PayPal, Google, and TikTok instantly.',
      steps: [
        'Navigate to the "Virtual Numbers" tab on the sidebar.',
        'Select country (USA, UK, Canada, Netherlands, etc.) and targeted platform (WhatsApp, Telegram, Google).',
        'Click "Rent Number". A dedicated temporary number is provisioned for 20 minutes.',
        'Request the SMS verification on the external app.',
        'Watch your live inbox on the dashboard—the SMS OTP code pops up automatically in 3-10 seconds.',
      ],
    },
    {
      id: 'g4',
      title: 'Scaling Your Reseller Business with Margins & Payment Gateway',
      category: 'Business Growth',
      duration: '5 mins read',
      icon: Settings,
      summary: 'Set automated retail markups and generate customer payment links to receive card and transfer payments.',
      steps: [
        'Go to "Reseller Margins" to define your flat and percentage profits for data, airtime, and logs.',
        'Use the "Payment Gateway" tab to generate branded checkout links for your end-clients.',
        'Clients pay with Nigerian cards or USSD; wholesale costs are fulfilled automatically, and profits drop directly into your bank balance.',
      ],
    },
    {
      id: 'g5',
      title: 'Trading Gift Cards for Instant Naira Bank Settlements',
      category: 'Gift Cards',
      duration: '3 mins read',
      icon: Gift,
      summary: 'Trade Steam, Apple, Razer Gold, Vanilla, and Amex at the highest live market rates in Nigeria.',
      steps: [
        'Navigate to "Trade Gift Cards".',
        'Select card brand, currency ($/£/€), and upload physical receipt or type e-code.',
        'View the live guaranteed payout rate before submission.',
        'Once approved by automated desk (avg 3-5 minutes), funds land in your Gift Card wallet for instant withdrawal.',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Tutorials & Operational Guides</h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Master every aspect of the Emmy Digital HUB & Jejelaye GCT ecosystem with clear step-by-step walkthroughs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://t.me/jejelayegct_community"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-sky-900 border border-sky-200 text-xs font-semibold hover:bg-sky-100 transition"
          >
            <Send className="h-3.5 w-3.5 text-sky-600" />
            <span>Community Tips</span>
          </a>
        </div>
      </div>

      {/* Grid of Tutorial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((g) => {
          const Icon = g.icon;
          return (
            <div
              key={g.id}
              onClick={() => setSelectedGuide(g)}
              className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-neutral-100 text-neutral-700 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400">{g.duration}</span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {g.category}
                </span>

                <h3 className="text-sm font-bold text-neutral-900 mt-2 group-hover:text-emerald-700 transition leading-snug">
                  {g.title}
                </h3>

                <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2">{g.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
                <span>Read Step-by-Step Guide</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 relative animate-in zoom-in-95">
            <button
              onClick={() => setSelectedGuide(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 p-1"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {selectedGuide.category}
            </span>

            <h3 className="text-base font-bold text-neutral-900 mt-2">{selectedGuide.title}</h3>
            <p className="text-xs text-neutral-500 mt-1">{selectedGuide.summary}</p>

            <div className="my-5 space-y-3">
              <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                Execution Steps:
              </div>
              {selectedGuide.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                  <span className="h-5 w-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedGuide(null)}
              className="w-full rounded-xl bg-neutral-900 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition"
            >
              Done Reading
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
