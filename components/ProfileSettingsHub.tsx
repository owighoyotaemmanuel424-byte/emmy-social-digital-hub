'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  User,
  ShieldCheck,
  Lock,
  Building2,
  CheckCircle2,
  AlertCircle,
  Key,
  Smartphone,
  Save,
  LogOut,
  RefreshCw,
} from 'lucide-react';

export function ProfileSettingsHub() {
  const { wallet, payoutSettings, updatePayoutSettings } = useReseller();

  // Profile fields
  const [fullName, setFullName] = useState('Emmanuel Owighoyota');
  const [email, setEmail] = useState('emmanuelowighoyota9@gmail.com');
  const [phone, setPhone] = useState('08140008920');

  // Security PIN
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(payoutSettings.require_2fa_for_payout);

  // Settlement Bank
  const [bankName, setBankName] = useState(payoutSettings.preferred_bank?.bank_name || 'OPay Digital Services');
  const [accountNumber, setAccountNumber] = useState(payoutSettings.preferred_bank?.account_number || '8140008920');
  const [accountName, setAccountName] = useState(payoutSettings.preferred_bank?.account_name || 'Emmanuel Owighoyota');

  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountNumber.length !== 10) {
      setAlert({ type: 'error', message: 'Account number must be exactly 10 digits' });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      updatePayoutSettings({
        preferred_bank: {
          bank_name: bankName,
          bank_code: '999992',
          account_number: accountNumber,
          account_name: accountName,
          is_verified: true,
        },
      });
      setIsSaving(false);
      setAlert({ type: 'success', message: 'Settlement bank account updated successfully!' });
    }, 600);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      setAlert({ type: 'error', message: 'PIN must be exactly 4 digits' });
      return;
    }
    if (newPin !== confirmPin) {
      setAlert({ type: 'error', message: 'New PIN and confirm PIN do not match' });
      return;
    }

    updatePayoutSettings({ is_pin_set: true });
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setAlert({ type: 'success', message: '4-digit withdrawal PIN changed successfully!' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-neutral-900 text-white">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Reseller Profile & Security Settings</h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your personal credentials, transaction PIN, and default bank settlement account.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Tier 3 Enterprise Verified</span>
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

      {/* Grid: 3 Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: Account Profile Info (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
            <div className="h-12 w-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-lg font-black shadow-xs">
              EO
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">{fullName}</h3>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                ID: #JCT-8924
              </span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-400">Email Address</span>
              <div className="font-mono text-neutral-800 font-semibold mt-0.5">{email}</div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-400">Phone Number</span>
              <div className="font-mono text-neutral-800 font-semibold mt-0.5">{phone}</div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-400">Reseller Level</span>
              <div className="text-neutral-800 font-semibold mt-0.5">Tier 3 (Zero Commission Fee)</div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-neutral-400">KYC Status</span>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>BVN & NIN Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Settlement Bank Account (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Building2 className="h-4 w-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-neutral-900">Settlement Bank Account</h3>
          </div>
          <p className="text-xs text-neutral-500">
            Automated destination for wholesale margins and gift card cashouts.
          </p>

          <form onSubmit={handleSaveBank} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">Bank Name</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 p-2 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                <option value="OPay Digital Services">OPay (PayCom)</option>
                <option value="PalmPay Limited">PalmPay</option>
                <option value="Moniepoint Microfinance Bank">Moniepoint MFB</option>
                <option value="Kuda Bank">Kuda Bank</option>
                <option value="Guaranty Trust Bank (GTBank)">GTBank</option>
                <option value="Zenith Bank">Zenith Bank</option>
                <option value="Access Bank">Access Bank</option>
                <option value="United Bank for Africa (UBA)">UBA</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Account Number (10 Digits)
              </label>
              <input
                type="text"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-neutral-300 p-2 text-xs font-mono font-bold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 p-2 text-xs font-bold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white py-2 text-xs font-bold transition disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>Save Settlement Account</span>
            </button>
          </form>
        </div>

        {/* Card 3: Security & Withdrawal PIN (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Lock className="h-4 w-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-neutral-900">Security & PIN Settings</h3>
          </div>
          <p className="text-xs text-neutral-500">
            Set or update your 4-digit security PIN required for wallet payouts.
          </p>

          <form onSubmit={handleUpdatePin} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">New 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full rounded-xl border border-neutral-300 p-2 text-center text-sm font-mono tracking-widest text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                Confirm 4-Digit PIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full rounded-xl border border-neutral-300 p-2 text-center text-sm font-mono tracking-widest text-neutral-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                required
              />
            </div>

            {/* 2FA Toggle */}
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-neutral-900">Two-Factor Authentication</div>
                <div className="text-[10px] text-neutral-500">Require OTP code for payouts</div>
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => {
                  setTwoFactorEnabled(e.target.checked);
                  updatePayoutSettings({ require_2fa_for_payout: e.target.checked });
                }}
                className="h-4 w-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-2 text-xs font-bold transition"
            >
              Update Security PIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
