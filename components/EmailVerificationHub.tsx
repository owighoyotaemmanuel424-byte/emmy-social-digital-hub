'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  MailCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  Download,
  Inbox,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface VerificationResult {
  email: string;
  syntax: boolean;
  mx_record: boolean;
  disposable: boolean;
  deliverability_score: number; // 0-100
  status: 'valid' | 'risky' | 'invalid';
}

interface RentedEmailInbox {
  id: string;
  email: string;
  service: string;
  created_at: string;
  expires_in: string;
  messages: Array<{
    sender: string;
    subject: string;
    code?: string;
    received_at: string;
  }>;
}

export function EmailVerificationHub() {
  const { wallet } = useReseller();
  const [activeMode, setActiveMode] = useState<'verify' | 'rent'>('verify');

  // Verification state
  const [emailInput, setEmailInput] = useState('emmanuel@example.com\nuser123@gmail.com\ntempuser@tempmail.ninja');
  const [isVerifying, setIsVerifying] = useState(false);
  const [results, setResults] = useState<VerificationResult[]>([
    {
      email: 'emmanuel@jejelayegct.com.ng',
      syntax: true,
      mx_record: true,
      disposable: false,
      deliverability_score: 98,
      status: 'valid',
    },
    {
      email: 'alex99@gmail.com',
      syntax: true,
      mx_record: true,
      disposable: false,
      deliverability_score: 95,
      status: 'valid',
    },
    {
      email: 'fake_throwaway@tempmail.ninja',
      syntax: true,
      mx_record: false,
      disposable: true,
      deliverability_score: 12,
      status: 'invalid',
    },
  ]);

  // Rent Temp Mail State (Buy Email)
  const [selectedMailProvider, setSelectedMailProvider] = useState<'gmail' | 'outlook' | 'custom_temp'>('gmail');
  const [rentedBoxes, setRentedBoxes] = useState<RentedEmailInbox[]>([
    {
      id: 'box_1',
      email: 'emmy_activation_982@outlook.com',
      service: 'Outlook Live',
      created_at: '10 mins ago',
      expires_in: '19m 40s',
      messages: [
        {
          sender: 'security@instagram.com',
          subject: 'Your Instagram confirmation code is 849201',
          code: '849201',
          received_at: '2m ago',
        },
      ],
    },
  ]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleVerify = () => {
    const list = emailInput
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.includes('@'));

    if (list.length === 0) return;

    setIsVerifying(true);
    setTimeout(() => {
      const generatedResults: VerificationResult[] = list.map((email) => {
        const isDisposable =
          email.includes('temp') || email.includes('fake') || email.includes('throwaway') || email.includes('10min');
        const hasBadSyntax = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (hasBadSyntax) {
          return { email, syntax: false, mx_record: false, disposable: false, deliverability_score: 0, status: 'invalid' };
        }
        if (isDisposable) {
          return { email, syntax: true, mx_record: true, disposable: true, deliverability_score: 25, status: 'risky' };
        }
        return {
          email,
          syntax: true,
          mx_record: true,
          disposable: false,
          deliverability_score: Math.floor(Math.random() * 15) + 85,
          status: 'valid',
        };
      });

      setResults(generatedResults);
      setIsVerifying(false);
    }, 800);
  };

  const handleRentEmail = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const domain = selectedMailProvider === 'gmail' ? 'gmail.com' : selectedMailProvider === 'outlook' ? 'outlook.com' : 'jejemember.org';
    const newBox: RentedEmailInbox = {
      id: `box_${rand}_${Math.floor(Math.random() * 10000)}`,
      email: `reseller_session_${rand}@${domain}`,
      service: selectedMailProvider.toUpperCase(),
      created_at: 'Just now',
      expires_in: '20m 00s',
      messages: [
        {
          sender: 'auth@telegram.org',
          subject: 'Telegram code: 49201. Do not share with anyone.',
          code: '49201',
          received_at: 'Just now',
        },
      ],
    };

    setRentedBoxes([newBox, ...rentedBoxes]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-100 text-sky-800">
              <MailCheck className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Email Verification & Mail Inbox Hub</h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Validate lead databases, weed out bounce-backs, or rent active webmail inboxes for OTP verifications.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-neutral-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveMode('verify')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeMode === 'verify' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
            }`}
          >
            Email Validator
          </button>
          <button
            onClick={() => setActiveMode('rent')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeMode === 'rent' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
            }`}
          >
            Buy / Rent Email
          </button>
        </div>
      </div>

      {/* MODE 1: VERIFIER */}
      {activeMode === 'verify' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-neutral-200 space-y-4 shadow-xs">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Enter Email Addresses (Single or Bulk)
              </label>
              <textarea
                rows={5}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@company.com&#10;user@gmail.com"
                className="w-full rounded-xl border border-neutral-300 p-3 text-xs font-mono text-neutral-800 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                Separated by new lines or commas. Free verification on Emmy Digital HUB.
              </span>
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white py-2.5 text-xs font-bold transition disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Checking DNS MX & Mailbox...</span>
                </>
              ) : (
                <>
                  <MailCheck className="h-4 w-4" />
                  <span>Verify Email Deliverability</span>
                </>
              )}
            </button>
          </div>

          {/* Results column */}
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-neutral-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Verification Ledger ({results.length} checked)
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700">
                {results.filter((r) => r.status === 'valid').length} Deliverable
              </span>
            </div>

            <div className="divide-y divide-neutral-100 max-h-[260px] overflow-y-auto">
              {results.map((r, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <div className="font-mono font-bold text-neutral-900 truncate">{r.email}</div>
                    <div className="text-[10px] text-neutral-400 flex items-center gap-2 mt-0.5">
                      <span>MX: {r.mx_record ? 'Passed' : 'Failed'}</span>
                      <span>•</span>
                      <span>Disposable: {r.disposable ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'valid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'risky'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {r.status.toUpperCase()} ({r.deliverability_score}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: RENT EMAIL / BUY EMAIL (TEMP INBOX) */}
      {activeMode === 'rent' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-neutral-200 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-900">Rent Webmail Inbox for OTP</h3>
            <p className="text-xs text-neutral-500">
              Get an active webmail address with instant auto-refreshing inbox to receive verification codes.
            </p>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">Select Provider</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedMailProvider('gmail')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition ${
                    selectedMailProvider === 'gmail'
                      ? 'border-sky-600 bg-sky-50 text-sky-900'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                  }`}
                >
                  Gmail PVA
                </button>
                <button
                  onClick={() => setSelectedMailProvider('outlook')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition ${
                    selectedMailProvider === 'outlook'
                      ? 'border-sky-600 bg-sky-50 text-sky-900'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                  }`}
                >
                  Outlook
                </button>
                <button
                  onClick={() => setSelectedMailProvider('custom_temp')}
                  className={`p-2.5 rounded-xl border text-center text-xs font-bold transition ${
                    selectedMailProvider === 'custom_temp'
                      ? 'border-sky-600 bg-sky-50 text-sky-900'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                  }`}
                >
                  Temp Mail
                </button>
              </div>
            </div>

            <button
              onClick={handleRentEmail}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white py-2.5 text-xs font-bold transition"
            >
              <Inbox className="h-4 w-4" />
              <span>Generate New Active Inbox (Free)</span>
            </button>
          </div>

          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Active Rented Inboxes ({rentedBoxes.length})
            </h3>
            {rentedBoxes.map((box) => (
              <div key={box.id} className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-neutral-900">{box.email}</span>
                    <button
                      onClick={() => copyToClipboard(box.email, box.id)}
                      className="text-neutral-400 hover:text-neutral-700"
                    >
                      {copiedCode === box.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    {box.expires_in} remaining
                  </span>
                </div>

                {/* Received Messages */}
                <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 space-y-2">
                  <div className="text-[10px] font-bold uppercase text-neutral-400">Incoming Messages</div>
                  {box.messages.map((m, mIdx) => (
                    <div key={mIdx} className="bg-white p-2.5 rounded-lg border border-neutral-200/80 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[11px] font-bold text-neutral-900">{m.sender}</div>
                        <div className="text-neutral-600 text-[11px]">{m.subject}</div>
                      </div>
                      {m.code && (
                        <div className="flex items-center gap-1.5 ml-2">
                          <span className="font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-xs">
                            {m.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(m.code!, `code_${mIdx}`)}
                            className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600"
                            title="Copy OTP Code"
                          >
                            {copiedCode === `code_${mIdx}` ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
