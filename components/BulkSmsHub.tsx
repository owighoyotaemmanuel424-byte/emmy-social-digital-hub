'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  MessageSquare,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Info,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

interface SmsLog {
  id: string;
  sender_id: string;
  recipients_count: number;
  sample_recipient: string;
  pages: number;
  cost: number;
  status: 'delivered' | 'processing' | 'failed';
  time: string;
}

export function BulkSmsHub() {
  const { wallet, sendBulkSms } = useReseller();
  const [senderId, setSenderId] = useState('EMMY-HUB');
  const [recipientsInput, setRecipientsInput] = useState('08140008920, 08023456789, 09012345678');
  const [message, setMessage] = useState(
    'Hello from Emmy Digital HUB / Jejelaye GCT! Your order has been dispatched successfully. Thank you for choosing us.'
  );
  const [route, setRoute] = useState<'standard' | 'dnd_bypass' | 'otp_flash'>('standard');
  const [isSending, setIsSending] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [history, setHistory] = useState<SmsLog[]>([
    {
      id: 'sms_1',
      sender_id: 'EMMY-TECH',
      recipients_count: 142,
      sample_recipient: '08140008920',
      pages: 1,
      cost: 497,
      status: 'delivered',
      time: 'Today, 11:30 AM',
    },
    {
      id: 'sms_2',
      sender_id: 'JEJE-OTP',
      recipients_count: 1,
      sample_recipient: '09055443322',
      pages: 1,
      cost: 5,
      status: 'delivered',
      time: 'Yesterday, 04:15 PM',
    },
  ]);

  // Parse phone numbers
  const parsedRecipients = recipientsInput
    .split(/[\n,;]+/)
    .map((r) => r.trim())
    .filter((r) => r.length >= 10);

  // SMS character length and page calculation
  const charLength = message.length;
  const charsPerPage = 160;
  const pages = Math.max(1, Math.ceil(charLength / charsPerPage));

  // Route rates per SMS page
  const routeRates = {
    standard: 3.5,
    dnd_bypass: 4.2,
    otp_flash: 5.0,
  };

  const unitRate = routeRates[route];
  const totalCost = parsedRecipients.length * pages * unitRate;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderId.trim()) {
      setAlert({ type: 'error', message: 'Please provide a valid Sender ID (e.g. EMMY-TECH)' });
      return;
    }
    if (parsedRecipients.length === 0) {
      setAlert({ type: 'error', message: 'Please enter at least one valid recipient phone number' });
      return;
    }
    if (!message.trim()) {
      setAlert({ type: 'error', message: 'Message content cannot be blank' });
      return;
    }
    if (wallet.balance < totalCost) {
      setAlert({
        type: 'error',
        message: `Insufficient wallet balance (₦${wallet.balance.toFixed(2)}). Need ₦${totalCost.toFixed(2)}`,
      });
      return;
    }

    setIsSending(true);
    setAlert(null);

    const res = await sendBulkSms(senderId, parsedRecipients, message);
    setIsSending(false);

    if (res.success) {
      setAlert({
        type: 'success',
        message: `Bulk SMS broadcast sent successfully to ${parsedRecipients.length} recipients! Reference: ${res.reference}`,
      });
      setHistory((prev) => [
        {
          id: `sms_${Math.floor(Math.random() * 899999 + 100000)}`,
          sender_id: senderId.toUpperCase(),
          recipients_count: parsedRecipients.length,
          sample_recipient: parsedRecipients[0],
          pages,
          cost: totalCost,
          status: 'delivered',
          time: 'Just now',
        },
        ...prev,
      ]);
    } else {
      setAlert({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-100 text-violet-800">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Bulk SMS Dispatch Portal</h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Deliver corporate SMS with custom Sender IDs, DND bypass, and instant delivery reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Rate from</span>
            <div className="font-mono text-sm font-bold text-violet-700">₦3.50 / SMS</div>
          </div>
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

      {/* Main Grid: Form + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <form onSubmit={handleSend} className="space-y-4">
            {/* Sender ID */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Custom Sender ID (Max 11 chars)
              </label>
              <input
                type="text"
                maxLength={11}
                value={senderId}
                onChange={(e) => setSenderId(e.target.value.toUpperCase())}
                placeholder="e.g. EMMY-TECH"
                className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-900 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
                required
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Alpha-numeric brand name shown to recipients (e.g. JEJELAYE, EMMY-PAY).
              </span>
            </div>

            {/* Route Selection */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Delivery Route & Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRoute('standard')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    route === 'standard'
                      ? 'border-violet-600 bg-violet-50 text-violet-950 font-bold'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <div className="font-bold">Standard</div>
                  <div className="text-[10px] text-neutral-500">₦3.50 • High Speed</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRoute('dnd_bypass')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    route === 'dnd_bypass'
                      ? 'border-violet-600 bg-violet-50 text-violet-950 font-bold'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <div className="font-bold">DND Bypass</div>
                  <div className="text-[10px] text-neutral-500">₦4.20 • 100% Reach</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRoute('otp_flash')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    route === 'otp_flash'
                      ? 'border-violet-600 bg-violet-50 text-violet-950 font-bold'
                      : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <div className="font-bold">OTP Flash</div>
                  <div className="text-[10px] text-neutral-500">₦5.00 • 3s Delivery</div>
                </button>
              </div>
            </div>

            {/* Recipients */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-neutral-700">
                  Recipient Numbers ({parsedRecipients.length} detected)
                </label>
                <span className="text-[10px] text-neutral-400">Separate by comma or new lines</span>
              </div>
              <textarea
                rows={3}
                value={recipientsInput}
                onChange={(e) => setRecipientsInput(e.target.value)}
                placeholder="08140008920, 08031234567, 09098765432"
                className="w-full rounded-xl border border-neutral-300 p-3 text-xs font-mono text-neutral-800 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
                required
              />
            </div>

            {/* Message Body */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-neutral-700">Message Content</label>
                <div className="text-[11px] font-mono text-neutral-500">
                  <span className={charLength > 160 ? 'text-amber-600 font-bold' : ''}>
                    {charLength} chars
                  </span>{' '}
                  / {pages} {pages === 1 ? 'page' : 'pages'}
                </div>
              </div>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full rounded-xl border border-neutral-300 p-3 text-xs text-neutral-800 focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSending || parsedRecipients.length === 0}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-700 hover:bg-violet-800 text-white py-3 text-xs font-bold transition disabled:opacity-50 shadow-xs"
            >
              {isSending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Dispatching Broadcast...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Broadcast (₦{totalCost.toLocaleString()})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Info: 5 cols */}
        <div className="lg:col-span-5 space-y-4">
          {/* Cost breakdown card */}
          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Live Billing Calculation
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Total Recipients:</span>
                <span className="font-mono font-bold text-neutral-900">{parsedRecipients.length}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Message Pages:</span>
                <span className="font-mono font-bold text-neutral-900">{pages}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Route Rate:</span>
                <span className="font-mono font-bold text-neutral-900">₦{unitRate.toFixed(2)}/sms</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-neutral-900">
                <span>Total Deducted:</span>
                <span className="font-mono text-violet-700 font-extrabold text-sm">
                  ₦{totalCost.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick tips */}
          <div className="bg-violet-50/60 p-4 rounded-2xl border border-violet-100 text-xs text-violet-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Info className="h-4 w-4 text-violet-700" />
              <span>Bulk SMS Compliance Guidelines</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-violet-900/80">
              <li>Corporate Sender IDs cannot contain offensive words or fake bank impersonations.</li>
              <li>DND Bypass guarantees delivery even if recipient has active NCC Do-Not-Disturb.</li>
              <li>Opt-out instructions (e.g. STOP to 32055) are automatically embedded when needed.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* History Ledger */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-neutral-900 mb-3">Recent SMS Broadcasts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-neutral-500 font-semibold border-b border-neutral-100">
              <tr>
                <th className="pb-2">Sender ID</th>
                <th className="pb-2">Recipients</th>
                <th className="pb-2">Pages</th>
                <th className="pb-2 text-right">Cost</th>
                <th className="pb-2 text-right">Status</th>
                <th className="pb-2 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-neutral-50">
                  <td className="py-2.5 font-mono font-bold text-neutral-900">{h.sender_id}</td>
                  <td className="py-2.5 text-neutral-700">
                    {h.recipients_count} numbers ({h.sample_recipient}...)
                  </td>
                  <td className="py-2.5 font-mono text-neutral-600">{h.pages}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-neutral-900">
                    ₦{h.cost.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="h-3 w-3" />
                      {h.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-neutral-400 text-[11px]">{h.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
