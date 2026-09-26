'use client';

import React, { useState } from 'react';
import { Send, MessageCircle, X, ChevronUp, ExternalLink, ShieldCheck } from 'lucide-react';

export function FloatingSupportWidgets() {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello Emmy Digital HUB / Jejelaye GCT Support! I need assistance with my reseller dashboard account.");
    window.open(`https://wa.me/2348140008920?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const openTelegram = () => {
    window.open('https://t.me/jejelayegct_community', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 z-40 flex flex-col items-end gap-2.5">
      {/* Expanded Dial Panel */}
      {isOpen && (
        <div className="bg-white rounded-2xl p-3.5 shadow-2xl border border-neutral-200 w-72 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-100">
            <div>
              <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <span>Official Live Helpdesk</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-neutral-500">24/7 Agent & Community Access</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {/* Telegram Community */}
            <button
              onClick={openTelegram}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-sky-100 bg-sky-50/70 hover:bg-sky-100/80 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Send className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-sky-950 group-hover:text-sky-800 flex items-center gap-1">
                    Telegram Group
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </div>
                  <div className="text-[10px] text-sky-700">24,500+ Resellers Community</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-sky-200/80 text-sky-900 px-2 py-0.5 rounded-full">
                Join
              </span>
            </button>

            {/* WhatsApp Support */}
            <button
              onClick={openWhatsApp}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/70 hover:bg-emerald-100/80 transition-colors text-left group"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950 group-hover:text-emerald-800 flex items-center gap-1">
                    WhatsApp Chat
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </div>
                  <div className="text-[10px] text-emerald-700">Instant VIP 1-on-1 Support</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                Chat
              </span>
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              Verified Jejelaye Desk
            </span>
            <span>Avg response: 1m</span>
          </div>
        </div>
      )}

      {/* Floating Toggle Buttons Row */}
      <div className="flex items-center gap-2">
        {/* Quick WhatsApp Pill */}
        <button
          onClick={openWhatsApp}
          className="hidden sm:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-full shadow-lg hover:shadow-emerald-600/30 transition-all text-xs font-semibold"
          title="Chat with WhatsApp Support"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp Chat</span>
        </button>

        {/* Quick Telegram Pill */}
        <button
          onClick={openTelegram}
          className="hidden sm:flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded-full shadow-lg hover:shadow-sky-500/30 transition-all text-xs font-semibold"
          title="Join Telegram Group"
        >
          <Send className="h-4 w-4" />
          <span>Telegram Group</span>
        </button>

        {/* Master floating icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-12 w-12 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-xl hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95"
          aria-label="Floating Support Menu"
        >
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
