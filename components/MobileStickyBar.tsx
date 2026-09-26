'use client';

import React from 'react';
import { useReseller } from '@/context/ResellerContext';
import { ShieldCheck, Smartphone, MailCheck, TrendingUp, Users } from 'lucide-react';

interface StickyItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export function MobileStickyBar() {
  const { activeTab, setActiveTab } = useReseller();

  const items: StickyItem[] = [
    {
      id: 'buy_logs',
      label: 'Buy Logs',
      icon: ShieldCheck,
      badge: 'Hot',
    },
    {
      id: 'virtual_numbers',
      label: 'Buy Number',
      icon: Smartphone,
    },
    {
      id: 'email_verification',
      label: 'Buy Email',
      icon: MailCheck,
    },
    {
      id: 'social_boost',
      label: 'Boosting',
      icon: TrendingUp,
      badge: 'SMM',
    },
    {
      id: 'refer_earn',
      label: 'Refer & Earn',
      icon: Users,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200 px-2 py-1.5 shadow-lg safe-bottom">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 active:scale-95'
              }`}
            >
              {item.badge && (
                <span className="absolute -top-1 right-2 bg-emerald-600 text-[9px] font-bold text-white px-1.5 py-0.2 rounded-full leading-tight shadow-xs">
                  {item.badge}
                </span>
              )}
              <Icon className={`h-4.5 w-4.5 mb-1 transition-transform ${isActive ? 'scale-110 text-emerald-700' : 'text-neutral-500'}`} />
              <span className="text-[10px] tracking-tight truncate max-w-full text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
