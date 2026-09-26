'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import { NIGERIAN_BANKS } from '@/lib/mock-data';
import {
  Gift,
  ArrowRight,
  Upload,
  CheckCircle2,
  AlertCircle,
  Building2,
  DollarSign,
  TrendingUp,
  CreditCard,
  Check,
} from 'lucide-react';

interface GiftCardsHubProps {
  onOpenWithdraw: () => void;
}

export function GiftCardsHub({ onOpenWithdraw }: GiftCardsHubProps) {
  const {
    giftCardRates,
    giftCardTrades,
    wallet,
    submitGiftCardTrade,
    transferGiftCardToMain,
  } = useReseller();

  const [selectedBrandSlug, setSelectedBrandSlug] = useState('steam');
  const [currency, setCurrency] = useState('USD');
  const [cardCountry, setCardCountry] = useState('US');
  const [cardType, setCardType] = useState<'physical' | 'ecode'>('physical');
  const [cardAmount, setCardAmount] = useState<number>(100);
  const [ecodeText, setEcodeText] = useState('');
  const [isSubmittingTrade, setIsSubmittingTrade] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isTransferringToMain, setIsTransferringToMain] = useState(false);

  const currentCard = giftCardRates.find((c) => c.slug === selectedBrandSlug) || giftCardRates[0];
  const currentRate = cardType === 'physical' ? currentCard.physical_rate : currentCard.ecode_rate;
  const estimatedPayout = cardAmount * currentRate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cardAmount <= 0) return;
    setIsSubmittingTrade(true);
    setFeedback(null);

    const res = await submitGiftCardTrade(
      currentCard.name,
      currency,
      cardCountry,
      cardType,
      Number(cardAmount),
      cardType === 'ecode' ? ecodeText : undefined
    );

    setFeedback(res.message);
    setIsSubmittingTrade(false);
    if (res.success) {
      setEcodeText('');
    }
  };

  const handleTransferAllToMain = async () => {
    if (wallet.gift_card_balance <= 0) return;
    setIsTransferringToMain(true);
    const res = await transferGiftCardToMain(wallet.gift_card_balance);
    setFeedback(res.message);
    setIsTransferringToMain(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Trade Gift Cards for Instant Cash</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Sell Amazon, Steam, Apple, Google Play and Razer Gold cards at top Nigerian market rates.
          </p>
        </div>

        {/* Gift Card Wallet Quick Stats */}
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs text-amber-900">
            <span className="text-[10px] text-amber-700 uppercase block font-semibold">Gift Card Wallet</span>
            <span className="font-mono text-sm font-bold">₦{wallet.gift_card_balance.toLocaleString()}</span>
          </div>
          <button
            onClick={onOpenWithdraw}
            className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
          >
            Withdraw to Bank
          </button>
          <button
            onClick={handleTransferAllToMain}
            disabled={wallet.gift_card_balance <= 0 || isTransferringToMain}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
          >
            Move to Main Wallet
          </button>
        </div>
      </div>

      {feedback && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-900 flex items-center justify-between animate-fadeIn">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Main Trade Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form on Left */}
        <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
          <div className="border-b border-neutral-100 pb-3">
            <h3 className="text-sm font-bold text-neutral-900">Step 1: Select Brand & Card Specifications</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Brand Catalog Pills */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">Card Brand</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {giftCardRates.map((gc) => (
                  <button
                    key={gc.slug}
                    type="button"
                    onClick={() => setSelectedBrandSlug(gc.slug)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${
                      selectedBrandSlug === gc.slug ? 'border-amber-600 bg-amber-50/60 font-bold text-neutral-900' : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span className="text-base">{gc.icon}</span>
                    <span className="text-xs truncate">{gc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Currency & Country */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Country</label>
                <select
                  value={cardCountry}
                  onChange={(e) => setCardCountry(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none"
                >
                  <option value="US">United States (US)</option>
                  <option value="GB">United Kingdom (UK)</option>
                  <option value="DE">Germany / EU (DE)</option>
                  <option value="CA">Canada (CA)</option>
                  <option value="AU">Australia (AU)</option>
                </select>
              </div>
            </div>

            {/* Physical vs E-code */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Card Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCardType('physical')}
                  className={`py-2 text-xs font-bold rounded-lg border ${
                    cardType === 'physical' ? 'border-amber-600 bg-amber-50 text-amber-900' : 'border-neutral-200 bg-white text-neutral-700'
                  }`}
                >
                  Physical Card (₦{currentCard.physical_rate}/$)
                </button>
                <button
                  type="button"
                  onClick={() => setCardType('ecode')}
                  className={`py-2 text-xs font-bold rounded-lg border ${
                    cardType === 'ecode' ? 'border-amber-600 bg-amber-50 text-amber-900' : 'border-neutral-200 bg-white text-neutral-700'
                  }`}
                >
                  E-Code (₦{currentCard.ecode_rate}/$)
                </button>
              </div>
            </div>

            {/* Card Amount */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Card Face Value ({currency})</label>
              <input
                type="number"
                min={10}
                max={2000}
                value={cardAmount}
                onChange={(e) => setCardAmount(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-amber-500 outline-none"
              />
            </div>

            {/* If E-code: input code text. If physical: photo note */}
            {cardType === 'ecode' ? (
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">E-Code String / PIN</label>
                <input
                  type="text"
                  placeholder="e.g. AQ81-9201-LL20-8812"
                  value={ecodeText}
                  onChange={(e) => setEcodeText(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-amber-500 outline-none"
                />
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-neutral-200 p-4 text-center">
                <Upload className="mx-auto h-6 w-6 text-neutral-400" />
                <p className="text-xs font-semibold text-neutral-700 mt-1">Physical Card Photo Verified</p>
                <p className="text-[11px] text-neutral-400">Direct front and back snapshot review supported</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmittingTrade}
              className="w-full rounded-lg bg-amber-600 py-2.5 text-xs font-bold text-white transition hover:bg-amber-700 disabled:opacity-50"
            >
              {isSubmittingTrade ? 'Submitting Trade...' : `Submit Trade for ₦${estimatedPayout.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Live Quote & Rates on Right */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-amber-50/50 p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">Instant Trade Quote</h3>

            <div className="rounded-lg bg-white p-4 border border-amber-200 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Selected Card</span>
                <span className="font-bold text-neutral-900">{currentCard.name}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Rate per {currency}</span>
                <span className="font-mono tabular-nums text-neutral-900">₦{currentRate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Amount Submitted</span>
                <span className="font-mono tabular-nums text-neutral-900">
                  {cardAmount} {currency}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between font-bold text-neutral-900">
                <span>Estimated Cash Payout</span>
                <span className="font-mono text-base font-extrabold text-amber-800">₦{estimatedPayout.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-[11px] text-amber-800 space-y-1">
              <p>• Trades are validated by our gift card team within 5–15 minutes.</p>
              <p>• Payout is credited immediately to your Gift Card Wallet.</p>
              <p>• You can withdraw directly to any Nigerian commercial or microfinance bank.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trades History Table */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600">Recent Gift Card Submissions</h3>
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
              <tr>
                <th className="py-2.5 px-4">Trade Reference</th>
                <th className="py-2.5 px-4">Brand</th>
                <th className="py-2.5 px-4">Format</th>
                <th className="py-2.5 px-4">Amount</th>
                <th className="py-2.5 px-4">Total Payout</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-medium">
              {giftCardTrades.map((t) => (
                <tr key={t.reference} className="hover:bg-neutral-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-neutral-900">{t.reference}</td>
                  <td className="py-3 px-4 text-neutral-800">{t.brand}</td>
                  <td className="py-3 px-4 uppercase text-[11px] text-neutral-500">{t.card_type}</td>
                  <td className="py-3 px-4 font-mono tabular-nums text-neutral-900">
                    {t.card_amount} {t.currency}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800 tabular-nums">
                    ₦{t.total_payout.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {t.status === 'approved' ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                        Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                        Reviewing
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-neutral-500 text-[11px]">{t.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
