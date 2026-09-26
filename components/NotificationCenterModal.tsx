'use client';

import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  ShieldCheck,
  Wallet,
  Sparkles,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'wallet' | 'service' | 'security' | 'promo';
  read: boolean;
  linkText?: string;
  targetTab?: string;
}

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export function NotificationCenterModal({
  isOpen,
  onClose,
  onNavigateTab,
}: NotificationCenterModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Wallet Funded Successfully',
      message: '₦50,000 was credited to your main balance via Moniepoint NIBSS transfer.',
      time: '12 mins ago',
      type: 'wallet',
      read: false,
      targetTab: 'transactions',
    },
    {
      id: 'n2',
      title: 'Fresh Aged Facebook & IG Logs Restocked',
      message: '500+ Verified 2012-2021 Facebook Marketplace and IG accounts have just been added.',
      time: '1 hour ago',
      type: 'service',
      read: false,
      linkText: 'Browse Logs',
      targetTab: 'buy_logs',
    },
    {
      id: 'n3',
      title: 'MTN SME Price Reduction',
      message: 'MTN SME 1GB wholesale rate reduced to ₦265. Check your reseller margin settings.',
      time: '4 hours ago',
      type: 'promo',
      read: false,
      linkText: 'Adjust Margins',
      targetTab: 'margins',
    },
    {
      id: 'n4',
      title: 'Security Alert: New IP Login',
      message: 'Successful session established from Chrome / Android (Lagos, Nigeria).',
      time: 'Yesterday',
      type: 'security',
      read: true,
      targetTab: 'profile_settings',
    },
  ]);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-neutral-200 mt-14 overflow-hidden animate-in slide-in-from-top-4 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500">Live operational & security alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 p-1.5 rounded hover:bg-emerald-50"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-neutral-100 max-h-[380px] overflow-y-auto">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 transition-colors ${item.read ? 'bg-white' : 'bg-emerald-50/20'}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {item.type === 'wallet' && (
                    <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Wallet className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {item.type === 'service' && (
                    <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {item.type === 'promo' && (
                    <div className="h-7 w-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                  )}
                  {item.type === 'security' && (
                    <div className="h-7 w-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 truncate">{item.title}</span>
                    <span className="text-[10px] text-neutral-400 shrink-0 ml-2">{item.time}</span>
                  </div>
                  <p className="text-xs text-neutral-600 mt-0.5 leading-snug">{item.message}</p>

                  {item.targetTab && (
                    <button
                      onClick={() => {
                        onNavigateTab(item.targetTab!);
                        onClose();
                      }}
                      className="mt-2 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <span>{item.linkText || 'View Details'}</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-50 text-center border-t border-neutral-100">
          <span className="text-[11px] text-neutral-500">
            Push notifications enabled for Emmy Digital HUB • Reseller Node #EDH-8924
          </span>
        </div>
      </div>
    </div>
  );
}
