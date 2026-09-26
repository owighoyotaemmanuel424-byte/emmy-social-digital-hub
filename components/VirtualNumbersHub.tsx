'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  PhoneCall,
  Mail,
  ShieldCheck,
  RefreshCw,
  XCircle,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  Smartphone,
} from 'lucide-react';

export function VirtualNumbersHub() {
  const {
    virtualSessions,
    rentVirtualNumber,
    cancelVirtualRental,
    requestAnotherOtp,
    wallet,
    config,
  } = useReseller();

  const [activeTab, setActiveTab] = useState<'numbers' | 'emails'>('numbers');

  // Virtual Numbers Form State
  const [routeCategory, setRouteCategory] = useState<'usa' | 'international'>('usa');
  const [serverKey, setServerKey] = useState('usa_server_1');
  const [selectedService, setSelectedService] = useState({ code: 'whatsapp', name: 'WhatsApp' });
  const [isRenting, setIsRenting] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Temporary Email Form State
  const [emailServiceCode, setEmailServiceCode] = useState('vk');
  const [emailDomain, setEmailDomain] = useState('mailburstx.com');
  const [rentedEmails, setRentedEmails] = useState<Array<{
    id: string;
    email: string;
    code?: string;
    status: 'waiting' | 'received';
    createdAt: string;
  }>>([
    {
      id: 'em_102',
      email: 'user_alex982@mailburstx.com',
      code: '849102',
      status: 'received',
      createdAt: '10 mins ago',
    },
  ]);
  const [isRentingEmail, setIsRentingEmail] = useState(false);

  const servicesList = [
    { code: 'whatsapp', name: 'WhatsApp', icon: '💬' },
    { code: 'telegram', name: 'Telegram', icon: '✈️' },
    { code: 'openai', name: 'ChatGPT / OpenAI', icon: '🤖' },
    { code: 'google', name: 'Google / Gmail', icon: '🌐' },
    { code: 'twitter', name: 'Twitter / X', icon: '🐦' },
    { code: 'tiktok', name: 'TikTok', icon: '🎵' },
    { code: 'tinder', name: 'Tinder', icon: '🔥' },
    { code: 'facebook', name: 'Facebook', icon: '📘' },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleRentNumber = async () => {
    setIsRenting(true);
    setActionFeedback(null);
    const res = await rentVirtualNumber(routeCategory, serverKey, selectedService.code, selectedService.name);
    setActionFeedback(res.message);
    setIsRenting(false);
  };

  const handleCancelRental = async (ref: string) => {
    const res = await cancelVirtualRental(ref);
    setActionFeedback(res.message);
  };

  const handleRequestAnotherSms = async (ref: string) => {
    const res = await requestAnotherOtp(ref);
    setActionFeedback(res.message);
  };

  // Rent Email
  const handleRentEmail = () => {
    setIsRentingEmail(true);
    const newId = `em_${Date.now()}`;
    const generatedEmail = `reg_${Math.random().toString(36).substring(2, 8)}@${emailDomain}`;
    setTimeout(() => {
      setRentedEmails([
        {
          id: newId,
          email: generatedEmail,
          status: 'waiting',
          createdAt: 'Just now',
        },
        ...rentedEmails,
      ]);
      setIsRentingEmail(false);
      setActionFeedback(`Rented temporary email: ${generatedEmail}`);

      // Auto-simulate code arrival after 5s
      setTimeout(() => {
        setRentedEmails((prev) =>
          prev.map((e) => (e.id === newId ? { ...e, status: 'received', code: `${Math.floor(100000 + Math.random() * 900000)}` } : e))
        );
      }, 5000);
    }, 600);
  };

  const baseCost = routeCategory === 'usa' ? 950 : 1150;
  const markupPercent = config.virtual_number_markup_percent || 20;
  const resellerSellPrice = Math.round(baseCost * (1 + markupPercent / 100));

  return (
    <div className="w-full space-y-6">
      {/* Top Selector: Numbers vs Emails */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('numbers')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'numbers' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            Virtual Numbers (Receive OTP)
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'emails' ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Mail className="h-4 w-4" />
            Temporary Emails
          </button>
        </div>

        <span className="text-xs text-neutral-500 hidden sm:inline">
          Active Sessions: <strong className="font-mono text-neutral-900">{virtualSessions.length}</strong>
        </span>
      </div>

      {actionFeedback && (
        <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs text-neutral-800 animate-fadeIn">
          <span>{actionFeedback}</span>
          <button onClick={() => setActionFeedback(null)} className="text-neutral-500 hover:text-neutral-900">
            ✕
          </button>
        </div>
      )}

      {activeTab === 'numbers' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Rent Form */}
          <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Rent a Number for OTP</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Receive verification SMS for WhatsApp, Telegram, or any platform.</p>
            </div>

            {/* Route Category Selection */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Route Group</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRouteCategory('usa');
                    setServerKey('usa_server_1');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg border ${
                    routeCategory === 'usa' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 bg-white text-neutral-700'
                  }`}
                >
                  🇺🇸 USA Numbers
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRouteCategory('international');
                    setServerKey('international_server_1');
                  }}
                  className={`py-2 text-xs font-bold rounded-lg border ${
                    routeCategory === 'international' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 bg-white text-neutral-700'
                  }`}
                >
                  🌍 All Countries
                </button>
              </div>
            </div>

            {/* Specific Server Route */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Server Line</label>
              <select
                value={serverKey}
                onChange={(e) => setServerKey(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none"
              >
                {routeCategory === 'usa' ? (
                  <>
                    <option value="usa_server_1">USA Server 1 (Recommended)</option>
                    <option value="usa_server_2">USA Server 2 (Backup Route)</option>
                  </>
                ) : (
                  <>
                    <option value="international_server_1">All Countries Route 1 (Instant OTP)</option>
                    <option value="international_server_2">All Countries Route 2 (Backup Route)</option>
                  </>
                )}
              </select>
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Verification Service</label>
              <div className="grid grid-cols-2 gap-2">
                {servicesList.map((svc) => (
                  <button
                    key={svc.code}
                    type="button"
                    onClick={() => setSelectedService({ code: svc.code, name: svc.name })}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                      selectedService.code === svc.code ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold' : 'border-neutral-200 bg-white text-neutral-700'
                    }`}
                  >
                    <span>{svc.icon}</span>
                    <span className="text-xs truncate">{svc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="rounded-lg bg-neutral-50 p-3 border border-neutral-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Wholesale Cost</span>
                <span className="font-mono tabular-nums text-neutral-900">₦{baseCost}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Reseller Markup ({markupPercent}%)</span>
                <span className="font-mono tabular-nums text-emerald-700 font-semibold">+₦{resellerSellPrice - baseCost}</span>
              </div>
              <div className="pt-1.5 border-t border-neutral-200 flex justify-between font-bold text-neutral-900">
                <span>Client Resale Price</span>
                <span className="font-mono tabular-nums text-emerald-800">₦{resellerSellPrice}</span>
              </div>
            </div>

            {/* Rent Button */}
            <button
              onClick={handleRentNumber}
              disabled={isRenting || wallet.balance < baseCost}
              className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
            >
              {isRenting ? 'Reserving Line...' : `Rent ${selectedService.name} Number (₦${baseCost})`}
            </button>
          </div>

          {/* Active Sessions Panel */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600">Active Rented Numbers & OTP Feed</h3>
              <span className="text-[11px] text-neutral-500">Auto-polls every 5s</span>
            </div>

            {virtualSessions.length === 0 ? (
              <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center text-xs text-neutral-500">
                No active rented numbers yet. Select a service on the left and click &quot;Rent Number&quot;.
              </div>
            ) : (
              <div className="space-y-3">
                {virtualSessions.map((session) => (
                  <div
                    key={session.reference}
                    className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs space-y-3 transition hover:border-neutral-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900">{session.service_name}</span>
                        <span className="text-[11px] text-neutral-400">·</span>
                        <span className="font-mono text-xs text-neutral-500">{session.server_key}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.status === 'waiting_for_otp' && (
                          <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                            <Clock className="h-3 w-3 animate-spin" />
                            Waiting for OTP
                          </span>
                        )}
                        {session.status === 'completed' && (
                          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            OTP Received
                          </span>
                        )}
                        {session.status === 'cancelled' && (
                          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                            Cancelled & Refunded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Number & OTP display */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-neutral-50 p-3 border border-neutral-100">
                      <div>
                        <div className="text-[10px] text-neutral-500 uppercase tracking-wider">Assigned Phone Number</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-sm font-bold text-neutral-900">{session.phone_number}</span>
                          <button
                            onClick={() => copyToClipboard(session.phone_number, `ph_${session.reference}`)}
                            className="text-neutral-400 hover:text-neutral-800"
                          >
                            {copiedText === `ph_${session.reference}` ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>

                      {session.otp ? (
                        <div className="flex items-center gap-2 bg-emerald-100/70 border border-emerald-200 px-3 py-1.5 rounded-lg">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-emerald-800">Verification Code</div>
                            <div className="font-mono text-base font-bold text-emerald-950 tracking-widest">{session.otp}</div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(session.otp!, `otp_${session.reference}`)}
                            className="p-1 rounded bg-white text-emerald-800 hover:bg-emerald-50"
                          >
                            {copiedText === `otp_${session.reference}` ? <Check className="h-3.5 w-3.5 text-emerald-700" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-500 italic">Waiting for incoming SMS message...</div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[11px] text-neutral-400 font-mono">Ref: {session.reference}</span>
                      <div className="flex items-center gap-2">
                        {session.status === 'waiting_for_otp' && (
                          <button
                            onClick={() => handleCancelRental(session.reference)}
                            className="flex items-center gap-1 text-rose-600 hover:text-rose-800 text-[11px] font-semibold"
                          >
                            <XCircle className="h-3 w-3" />
                            Cancel & Refund ₦{session.cost}
                          </button>
                        )}
                        {session.status === 'completed' && session.category === 'international' && (
                          <button
                            onClick={() => handleRequestAnotherSms(session.reference)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-[11px] font-semibold"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Request 2nd SMS
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TEMPORARY EMAILS SUBTAB */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Rent Temporary Email (Sign-ups)</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Rent disposable email addresses to receive confirmation links and verification codes.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Select Domain</label>
              <select
                value={emailDomain}
                onChange={(e) => setEmailDomain(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none"
              >
                <option value="mailburstx.com">@mailburstx.com (Primary)</option>
                <option value="inboxtemp.org">@inboxtemp.org (Fast Inbox)</option>
                <option value="verifiednode.net">@verifiednode.net (Enterprise)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Target Service Code</label>
              <input
                type="text"
                value={emailServiceCode}
                onChange={(e) => setEmailServiceCode(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none"
              />
            </div>

            <button
              onClick={handleRentEmail}
              disabled={isRentingEmail}
              className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
            >
              {isRentingEmail ? 'Generating Address...' : 'Rent Temporary Email (₦250)'}
            </button>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600">Active Disposable Inboxes</h3>
            {rentedEmails.map((item) => (
              <div key={item.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-neutral-900">{item.email}</span>
                  <span className="text-[11px] text-neutral-500">{item.createdAt}</span>
                </div>
                <div className="flex items-center justify-between bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                  <span className="text-xs text-neutral-600">
                    {item.code ? `Verification Code: ${item.code}` : 'Waiting for incoming verification email...'}
                  </span>
                  {item.code && (
                    <button
                      onClick={() => copyToClipboard(item.code!, `em_${item.id}`)}
                      className="p-1 rounded text-neutral-500 hover:text-neutral-900"
                    >
                      {copiedText === `em_${item.id}` ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
