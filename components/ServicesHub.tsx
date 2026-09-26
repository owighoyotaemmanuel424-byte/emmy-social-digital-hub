'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import { ServiceItem } from '@/types/jejelaye';
import {
  Smartphone,
  Wifi,
  Zap,
  Tv,
  GraduationCap,
  Printer,
  MessageSquare,
  Package,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Search,
  Eye,
  ArrowRight,
} from 'lucide-react';

export function ServicesHub() {
  const {
    services,
    config,
    wallet,
    openCheckoutModal,
    purchaseAirtime,
    purchaseData,
    verifyElectricityMeter,
    payElectricity,
    payTv,
    buyExamPin,
    generateRechargeCards,
    sendBulkSms,
    buyLogs,
  } = useReseller();

  const [activeSubTab, setActiveSubTab] = useState<'airtime' | 'data' | 'electricity' | 'tv' | 'education' | 'recharge_card' | 'bulk_sms' | 'logs'>('data');

  // Airtime State
  const [airtimeNetwork, setAirtimeNetwork] = useState('MTN');
  const [airtimePhone, setAirtimePhone] = useState('');
  const [airtimeAmount, setAirtimeAmount] = useState<number>(500);
  const [isProcessingAirtime, setIsProcessingAirtime] = useState(false);
  const [airtimeFeedback, setAirtimeFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Data State
  const [dataNetwork, setDataNetwork] = useState('MTN');
  const [dataPhone, setDataPhone] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<number | string>(201);
  const [isProcessingData, setIsProcessingData] = useState(false);
  const [dataFeedback, setDataFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Electricity State
  const [electricityDiscoId, setElectricityDiscoId] = useState<number | string>(301);
  const [meterType, setMeterType] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [meterNumber, setMeterNumber] = useState('');
  const [electricityAmount, setElectricityAmount] = useState<number>(2000);
  const [electricityPhone, setElectricityPhone] = useState('');
  const [verifiedCustomer, setVerifiedCustomer] = useState<{ customer_name: string; address?: string } | null>(null);
  const [isVerifyingMeter, setIsVerifyingMeter] = useState(false);
  const [isPayingElectricity, setIsPayingElectricity] = useState(false);
  const [electricityFeedback, setElectricityFeedback] = useState<{ success: boolean; message: string; token?: string } | null>(null);

  // TV State
  const [tvProvider, setTvProvider] = useState<'DSTV' | 'GOtv' | 'Startimes'>('DSTV');
  const [selectedTvPlanId, setSelectedTvPlanId] = useState<number | string>(402);
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [isProcessingTv, setIsProcessingTv] = useState(false);
  const [tvFeedback, setTvFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Exam PIN State
  const [selectedExamId, setSelectedExamId] = useState<number | string>(501);
  const [examQuantity, setExamQuantity] = useState<number>(1);
  const [isProcessingExam, setIsProcessingExam] = useState(false);
  const [examFeedback, setExamFeedback] = useState<{ success: boolean; message: string; pins?: string[] } | null>(null);

  // Recharge Card State
  const [cardNetwork, setCardNetwork] = useState('MTN');
  const [cardDenomination, setCardDenomination] = useState<number>(100);
  const [cardQuantity, setCardQuantity] = useState<number>(10);
  const [isProcessingCards, setIsProcessingCards] = useState(false);
  const [cardsFeedback, setCardsFeedback] = useState<{ success: boolean; message: string; cards?: Array<{ pin: string; serial: string }> } | null>(null);

  // Bulk SMS State
  const [smsSenderId, setSmsSenderId] = useState('MyBusiness');
  const [smsRecipients, setSmsRecipients] = useState('');
  const [smsMessage, setSmsMessage] = useState('Special promotion: get 10% off your next data purchase today!');
  const [isProcessingSms, setIsProcessingSms] = useState(false);
  const [smsFeedback, setSmsFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Logs State
  const [selectedLogId, setSelectedLogId] = useState<number | string>(901);
  const [logQuantity, setLogQuantity] = useState<number>(1);
  const [isProcessingLog, setIsProcessingLog] = useState(false);
  const [logFeedback, setLogFeedback] = useState<{ success: boolean; message: string; credentials?: string } | null>(null);

  // Copy helper
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // Filter helpers
  const dataPlans = services.filter((s) => s.type === 'data' && s.provider === dataNetwork);
  const currentDataPlan = services.find((s) => s.id === Number(selectedPlanId)) || dataPlans[0];

  const discoServices = services.filter((s) => s.type === 'electricity');
  const currentDisco = services.find((s) => s.id === Number(electricityDiscoId)) || discoServices[0];

  const tvServices = services.filter((s) => s.type === 'tv' && s.provider === tvProvider);
  const currentTvPlan = services.find((s) => s.id === Number(selectedTvPlanId)) || tvServices[0];

  const examServices = services.filter((s) => s.type === 'education');
  const currentExam = services.find((s) => s.id === Number(selectedExamId)) || examServices[0];

  const printServices = services.filter((s) => s.type === 'print_card');
  const currentPrintService = printServices.find((s) => s.provider === cardNetwork) || printServices[0];

  const logServices = services.filter((s) => s.type === 'buy_logs');
  const currentLog = services.find((s) => s.id === Number(selectedLogId)) || logServices[0];

  // Airtime Submit
  const handleAirtimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingAirtime(true);
    setAirtimeFeedback(null);
    const res = await purchaseAirtime(airtimeNetwork, airtimePhone, Number(airtimeAmount));
    setAirtimeFeedback(res);
    setIsProcessingAirtime(false);
  };

  // Data Submit
  const handleDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDataPlan) return;
    setIsProcessingData(true);
    setDataFeedback(null);
    const res = await purchaseData(currentDataPlan, dataPhone);
    setDataFeedback(res);
    setIsProcessingData(false);
  };

  // Electricity Verify Meter
  const handleVerifyMeter = async () => {
    if (!meterNumber) return;
    setIsVerifyingMeter(true);
    setElectricityFeedback(null);
    const res = await verifyElectricityMeter(electricityDiscoId, meterNumber);
    if (res.success && res.customer_name) {
      setVerifiedCustomer({ customer_name: res.customer_name, address: res.address });
    } else {
      setElectricityFeedback({ success: false, message: res.error || 'Meter verification failed.' });
      setVerifiedCustomer(null);
    }
    setIsVerifyingMeter(false);
  };

  // Electricity Submit
  const handleElectricitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDisco) return;
    setIsPayingElectricity(true);
    setElectricityFeedback(null);
    const res = await payElectricity(currentDisco, meterNumber, Number(electricityAmount), meterType, electricityPhone);
    setElectricityFeedback(res);
    setIsPayingElectricity(false);
  };

  // TV Submit
  const handleTvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTvPlan) return;
    setIsProcessingTv(true);
    setTvFeedback(null);
    const res = await payTv(currentTvPlan, smartCardNumber);
    setTvFeedback(res);
    setIsProcessingTv(false);
  };

  // Exam Submit
  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentExam) return;
    setIsProcessingExam(true);
    setExamFeedback(null);
    const res = await buyExamPin(currentExam, Number(examQuantity));
    setExamFeedback(res);
    setIsProcessingExam(false);
  };

  // Recharge Card Submit
  const handleCardsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPrintService) return;
    setIsProcessingCards(true);
    setCardsFeedback(null);
    const res = await generateRechargeCards(currentPrintService, Number(cardQuantity), Number(cardDenomination));
    setCardsFeedback(res);
    setIsProcessingCards(false);
  };

  // Bulk SMS Submit
  const handleSmsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numbers = smsRecipients
      .split(/[\n,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length >= 10);
    setIsProcessingSms(true);
    setSmsFeedback(null);
    const res = await sendBulkSms(smsSenderId, numbers, smsMessage);
    setSmsFeedback(res);
    setIsProcessingSms(false);
  };

  // Logs Submit
  const handleLogsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLog) return;
    setIsProcessingLog(true);
    setLogFeedback(null);
    const res = await buyLogs(currentLog, Number(logQuantity));
    setLogFeedback(res);
    setIsProcessingLog(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Category Segmented Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-100/80 p-1.5 scrollbar-none">
        {[
          { id: 'data', label: 'Data Bundles', icon: Wifi },
          { id: 'airtime', label: 'Airtime VTU', icon: Smartphone },
          { id: 'electricity', label: 'Electricity Bills', icon: Zap },
          { id: 'tv', label: 'Cable TV', icon: Tv },
          { id: 'education', label: 'Exam PINs', icon: GraduationCap },
          { id: 'recharge_card', label: 'Print Vouchers', icon: Printer },
          { id: 'bulk_sms', label: 'Bulk SMS', icon: MessageSquare },
          { id: 'logs', label: 'Account Logs', icon: Package },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-700' : 'text-neutral-500'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: DATA BUNDLES */}
      {activeSubTab === 'data' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="border-b border-neutral-100 pb-4 mb-5">
              <h2 className="text-base font-bold text-neutral-900">Buy Data Bundle (Direct Wholesale)</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Instant delivery to all Nigerian GSM networks via Tier-1 SME and Corporate APIs.</p>
            </div>

            <form onSubmit={handleDataSubmit} className="space-y-4">
              {/* Network Selector */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">Select Network</label>
                <div className="grid grid-cols-4 gap-2">
                  {['MTN', 'Airtel', 'Glo', '9mobile'].map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => {
                        setDataNetwork(net);
                        const firstForNet = services.find((s) => s.type === 'data' && s.provider === net);
                        if (firstForNet) setSelectedPlanId(firstForNet.id);
                      }}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        dataNetwork === net
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plan Dropdown */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Select Data Plan</label>
                <select
                  value={selectedPlanId}
                  onChange={(e) => setSelectedPlanId(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                >
                  {dataPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} — Wholesale: ₦{plan.price} (Resale: ₦{plan.price + (config.data_markup_flat || 50)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Recipient Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 08031234567"
                  value={dataPhone}
                  onChange={(e) => setDataPhone(e.target.value)}
                  maxLength={11}
                  required
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none placeholder:text-neutral-400"
                />
              </div>

              {/* Feedback Alert */}
              {dataFeedback && (
                <div
                  className={`flex items-start gap-2.5 rounded-lg p-3 text-xs ${
                    dataFeedback.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {dataFeedback.success ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />}
                  <span>{dataFeedback.message}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessingData}
                className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
              >
                {isProcessingData ? 'Processing Purchase...' : `Purchase Data (Wholesale: ₦${currentDataPlan?.price || 0})`}
              </button>
            </form>
          </div>

          {/* Pricing & Profit Transparency Matrix */}
          <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Reseller Profit Breakdown</h3>
            <div className="rounded-lg bg-white p-4 border border-neutral-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Selected Plan</span>
                <span className="font-semibold text-neutral-900">{currentDataPlan?.name}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>JejeLaye Wholesale Price</span>
                <span className="font-mono tabular-nums text-neutral-900">₦{currentDataPlan?.price}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Your Reseller Markup</span>
                <span className="font-mono tabular-nums text-emerald-700 font-semibold">+₦{config.data_markup_flat || 50}</span>
              </div>
              <div className="pt-2 border-t border-neutral-100 flex justify-between font-bold text-neutral-900">
                <span>Your Client Sells At</span>
                <span className="font-mono tabular-nums text-emerald-800 text-sm">
                  ₦{(currentDataPlan?.price || 0) + (config.data_markup_flat || 50)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openCheckoutModal(currentDataPlan)}
              className="w-full rounded-lg border border-emerald-600 bg-emerald-50/50 py-2.5 text-xs font-bold text-emerald-900 transition hover:bg-emerald-100/70 flex items-center justify-center gap-1.5"
            >
              <span>Sell to Customer via Gateway (Card / Transfer / USSD)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Auto-Fulfillment & Immediate API Response
              </div>
              <p className="text-[11px] text-emerald-700">
                Data delivers in under 5 seconds. If any transaction fails, JejeLaye API auto-refunds your wallet balance immediately.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: AIRTIME VTU */}
      {activeSubTab === 'airtime' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="border-b border-neutral-100 pb-4 mb-5">
              <h2 className="text-base font-bold text-neutral-900">Airtime VTU Top-up</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Instant topup for all Nigerian mobile lines with reseller wholesale discounts.</p>
            </div>

            <form onSubmit={handleAirtimeSubmit} className="space-y-4">
              {/* Network */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">Network</label>
                <div className="grid grid-cols-4 gap-2">
                  {['MTN', 'Airtel', 'Glo', '9mobile'].map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setAirtimeNetwork(net)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        airtimeNetwork === net
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Presets */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Recharge Amount (₦)</label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {[100, 200, 500, 1000, 2000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAirtimeAmount(amt)}
                      className={`py-1.5 text-xs font-medium rounded-md border ${
                        airtimeAmount === amt
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      ₦{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min={50}
                  max={50000}
                  value={airtimeAmount}
                  onChange={(e) => setAirtimeAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-emerald-500 outline-none"
                  placeholder="Custom amount (min ₦50)"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  placeholder="08030000000"
                  value={airtimePhone}
                  onChange={(e) => setAirtimePhone(e.target.value)}
                  maxLength={11}
                  required
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-emerald-500 outline-none"
                />
              </div>

              {airtimeFeedback && (
                <div
                  className={`flex items-start gap-2.5 rounded-lg p-3 text-xs ${
                    airtimeFeedback.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {airtimeFeedback.success ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />}
                  <span>{airtimeFeedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingAirtime}
                className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
              >
                {isProcessingAirtime ? 'Recharging Airtime...' : `Send ₦${airtimeAmount.toLocaleString()} Airtime (Cost: ₦${(airtimeAmount * 0.98).toFixed(2)})`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Airtime Reseller Margin</h3>
            <div className="rounded-lg bg-white p-4 border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Face Value</span>
                <span className="font-mono tabular-nums text-neutral-900">₦{airtimeAmount}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>JejeLaye Wholesale (2% Discount)</span>
                <span className="font-mono tabular-nums text-neutral-900">₦{(airtimeAmount * 0.98).toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-neutral-100 flex justify-between font-bold text-emerald-700">
                <span>Your Reseller Profit</span>
                <span className="font-mono tabular-nums">₦{(airtimeAmount * 0.02).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ELECTRICITY BILLS */}
      {activeSubTab === 'electricity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="border-b border-neutral-100 pb-4 mb-5">
              <h2 className="text-base font-bold text-neutral-900">Electricity Bill Payment & Token Generator</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Always verify the meter number first (as defined in page 21 of the API doc) before paying.
              </p>
            </div>

            <form onSubmit={handleElectricitySubmit} className="space-y-4">
              {/* DISCO Selector */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Distribution Company (DISCO)</label>
                <select
                  value={electricityDiscoId}
                  onChange={(e) => {
                    setElectricityDiscoId(Number(e.target.value));
                    setVerifiedCustomer(null);
                  }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-emerald-500"
                >
                  {discoServices.map((disco) => (
                    <option key={disco.id} value={disco.id}>
                      {disco.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Meter Type */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Meter Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMeterType('prepaid')}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      meterType === 'prepaid' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 bg-white text-neutral-700'
                    }`}
                  >
                    Prepaid (Meter Token)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeterType('postpaid')}
                    className={`py-2 text-xs font-bold rounded-lg border ${
                      meterType === 'postpaid' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 bg-white text-neutral-700'
                    }`}
                  >
                    Postpaid (Monthly Bill)
                  </button>
                </div>
              </div>

              {/* Meter Number with Verify button */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Meter Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 11-digit meter number"
                    value={meterNumber}
                    onChange={(e) => {
                      setMeterNumber(e.target.value);
                      setVerifiedCustomer(null);
                    }}
                    required
                    className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-emerald-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyMeter}
                    disabled={isVerifyingMeter || meterNumber.length < 8}
                    className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50 whitespace-nowrap"
                  >
                    {isVerifyingMeter ? 'Verifying...' : 'Verify Meter'}
                  </button>
                </div>
              </div>

              {/* Verified Customer Card */}
              {verifiedCustomer && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Verified Customer: {verifiedCustomer.customer_name}
                  </div>
                  <div className="text-[11px] text-emerald-700">Address: {verifiedCustomer.address}</div>
                </div>
              )}

              {/* Amount & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Amount (₦)</label>
                  <input
                    type="number"
                    min={500}
                    value={electricityAmount}
                    onChange={(e) => setElectricityAmount(Number(e.target.value))}
                    required
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Customer Phone</label>
                  <input
                    type="tel"
                    placeholder="08030000000"
                    value={electricityPhone}
                    onChange={(e) => setElectricityPhone(e.target.value)}
                    required
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {electricityFeedback && (
                <div
                  className={`rounded-lg p-3 text-xs ${
                    electricityFeedback.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {electricityFeedback.success ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> : <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />}
                    <span>{electricityFeedback.message}</span>
                  </div>
                  {electricityFeedback.token && (
                    <div className="mt-2 pt-2 border-t border-emerald-200 flex items-center justify-between">
                      <span className="font-mono text-sm font-bold tracking-wider text-emerald-950">
                        TOKEN: {electricityFeedback.token}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(electricityFeedback.token!, 'elec_token')}
                        className="p-1 rounded text-emerald-700 hover:bg-emerald-100 transition-colors"
                      >
                        {copiedToken === 'elec_token' ? <Check className="h-4 w-4 text-emerald-700" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isPayingElectricity}
                className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
              >
                {isPayingElectricity ? 'Generating Token...' : `Pay Bill & Generate Token (₦${electricityAmount.toLocaleString()})`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Service Specifications</h3>
            <div className="rounded-lg bg-white p-4 border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Selected DISCO</span>
                <span className="font-semibold text-neutral-900">{currentDisco?.name}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Reseller Convenience Fee</span>
                <span className="font-mono tabular-nums text-emerald-700 font-semibold">+₦{config.electricity_markup_flat || 100}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Energy Units</span>
                <span className="font-mono tabular-nums text-neutral-900">~{(electricityAmount / 85.5).toFixed(1)} kWh</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: CABLE TV */}
      {activeSubTab === 'tv' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="border-b border-neutral-100 pb-4 mb-5">
              <h2 className="text-base font-bold text-neutral-900">Cable TV Subscription Renewal</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Renew DSTV, GOtv, and Startimes packages with instant transmission.</p>
            </div>

            <form onSubmit={handleTvSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-2">Provider</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['DSTV', 'GOtv', 'Startimes'] as const).map((prov) => (
                    <button
                      key={prov}
                      type="button"
                      onClick={() => {
                        setTvProvider(prov);
                        const first = services.find((s) => s.type === 'tv' && s.provider === prov);
                        if (first) setSelectedTvPlanId(first.id);
                      }}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        tvProvider === prov ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 bg-white text-neutral-700'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Package Bouquet</label>
                <select
                  value={selectedTvPlanId}
                  onChange={(e) => setSelectedTvPlanId(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none focus:border-emerald-500"
                >
                  {tvServices.map((tv) => (
                    <option key={tv.id} value={tv.id}>
                      {tv.name} — ₦{tv.price.toLocaleString()} ({tv.description})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">SmartCard / IUC Number</label>
                <input
                  type="text"
                  placeholder="Enter 10-11 digit IUC or Smartcard"
                  value={smartCardNumber}
                  onChange={(e) => setSmartCardNumber(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-emerald-500 outline-none"
                />
              </div>

              {tvFeedback && (
                <div
                  className={`flex items-start gap-2.5 rounded-lg p-3 text-xs ${
                    tvFeedback.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {tvFeedback.success ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />}
                  <span>{tvFeedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingTv}
                className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
              >
                {isProcessingTv ? 'Renewing...' : `Renew Subscription (₦${currentTvPlan?.price.toLocaleString()})`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Bouquet Summary</h3>
            <div className="rounded-lg bg-white p-4 border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Selected Bouquet</span>
                <span className="font-semibold text-neutral-900">{currentTvPlan?.name}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Wholesale Price</span>
                <span className="font-mono tabular-nums text-neutral-900">₦{currentTvPlan?.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Your Reseller Margin</span>
                <span className="font-mono tabular-nums text-emerald-700 font-semibold">+₦{config.cable_markup_flat || 150}</span>
              </div>
              <div className="pt-2 border-t border-neutral-100 flex justify-between font-bold text-neutral-900">
                <span>Customer Resale Price</span>
                <span className="font-mono tabular-nums text-emerald-800">
                  ₦{((currentTvPlan?.price || 0) + (config.cable_markup_flat || 150)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: EXAM PINS */}
      {activeSubTab === 'education' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="border-b border-neutral-100 pb-4 mb-5">
              <h2 className="text-base font-bold text-neutral-900">Exam Result Checker PINs & Tokens</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Instant generation of WAEC, NECO, JAMB, and NABTEB result check PINs.</p>
            </div>

            <form onSubmit={handleExamSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Select Examination Body</label>
                <div className="grid grid-cols-2 gap-2">
                  {examServices.map((exam) => (
                    <button
                      key={exam.id}
                      type="button"
                      onClick={() => setSelectedExamId(exam.id)}
                      className={`p-3 text-left rounded-lg border transition-all ${
                        selectedExamId === exam.id ? 'border-emerald-600 bg-emerald-50' : 'border-neutral-200 bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-neutral-900">{exam.name}</div>
                      <div className="text-[11px] font-mono text-neutral-500 mt-0.5">Wholesale: ₦{exam.price.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Quantity</label>
                <div className="flex gap-2">
                  {[1, 2, 5, 10].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setExamQuantity(qty)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg border ${
                        examQuantity === qty ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' : 'border-neutral-200 bg-white text-neutral-700'
                      }`}
                    >
                      {qty} PIN{qty > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {examFeedback && (
                <div
                  className={`rounded-lg p-3 text-xs ${
                    examFeedback.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {examFeedback.success ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> : <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />}
                    <span>{examFeedback.message}</span>
                  </div>
                  {examFeedback.pins && (
                    <div className="mt-3 space-y-1.5">
                      <div className="text-[11px] font-bold text-neutral-600 uppercase">Delivered Examination PINs:</div>
                      {examFeedback.pins.map((pin, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-2 rounded border border-emerald-100 font-mono text-xs">
                          <span>{pin}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(pin, `pin_${i}`)}
                            className="p-1 rounded text-neutral-500 hover:text-neutral-900"
                          >
                            {copiedToken === `pin_${i}` ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingExam}
                className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
              >
                {isProcessingExam ? 'Generating PINs...' : `Generate ${examQuantity} PIN(s) · ₦${((currentExam?.price || 0) * examQuantity).toLocaleString()}`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Candidate Instructions</h3>
            <div className="text-xs text-neutral-600 space-y-2">
              <p>1. Candidates can use these PINs directly on official portals (e.g. waecdirect.org, result.neco.gov.ng).</p>
              <p>2. Each PIN allows up to 5 result checks for one exam registration number.</p>
              <p>3. Reseller margin per PIN: <strong className="text-emerald-700 font-mono">+₦{config.exam_markup_flat || 250}</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 6: RECHARGE CARD PRINTING */}
      {activeSubTab === 'recharge_card' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="border-b border-neutral-100 pb-4 mb-5">
              <h2 className="text-base font-bold text-neutral-900">Recharge Card Printing (Wholesale Vouchers)</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Generate batch physical recharge card PINs with custom business name header.</p>
            </div>

            <form onSubmit={handleCardsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Network</label>
                <div className="grid grid-cols-3 gap-2">
                  {['MTN', 'Airtel', 'Glo'].map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setCardNetwork(net)}
                      className={`py-2 text-xs font-bold rounded-lg border ${
                        cardNetwork === net ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 bg-white text-neutral-700'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Denomination</label>
                  <select
                    value={cardDenomination}
                    onChange={(e) => setCardDenomination(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none"
                  >
                    {[100, 200, 500, 1000].map((d) => (
                      <option key={d} value={d}>
                        ₦{d} Voucher
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Batch Quantity</label>
                  <select
                    value={cardQuantity}
                    onChange={(e) => setCardQuantity(Number(e.target.value))}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none"
                  >
                    {[5, 10, 20, 50, 100].map((q) => (
                      <option key={q} value={q}>
                        {q} Cards
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {cardsFeedback && (
                <div className="rounded-lg p-3 text-xs bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{cardsFeedback.message}</span>
                  </div>
                  {cardsFeedback.cards && (
                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                      {cardsFeedback.cards.map((c, i) => (
                        <div key={i} className="rounded bg-white p-2.5 border border-emerald-100 flex items-center justify-between font-mono text-xs">
                          <div>
                            <div className="font-bold text-neutral-900">PIN: {c.pin}</div>
                            <div className="text-[10px] text-neutral-500">Serial: {c.serial} · Dial: *311*PIN#</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(c.pin, `c_${i}`)}
                            className="p-1 text-neutral-500 hover:text-neutral-900"
                          >
                            {copiedToken === `c_${i}` ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingCards}
                className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
              >
                {isProcessingCards
                  ? 'Printing Vouchers...'
                  : `Generate ${cardQuantity}x ₦${cardDenomination} Cards (Total Wholesale: ₦${Math.round(
                      (cardDenomination * cardQuantity * (currentPrintService?.price || 98)) / 100
                    ).toLocaleString()})`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Physical Print Margin</h3>
            <div className="rounded-lg bg-white p-4 border border-neutral-200 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Total Face Value</span>
                <span className="font-mono tabular-nums text-neutral-900">₦{(cardDenomination * cardQuantity).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Wholesale Cost ({currentPrintService?.price}%)</span>
                <span className="font-mono tabular-nums text-neutral-900">
                  ₦{Math.round((cardDenomination * cardQuantity * (currentPrintService?.price || 98)) / 100).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-100 flex justify-between font-bold text-emerald-700">
                <span>Your Net Margin</span>
                <span className="font-mono tabular-nums">
                  ₦{Math.round(
                    cardDenomination * cardQuantity -
                      (cardDenomination * cardQuantity * (currentPrintService?.price || 98)) / 100
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 7: BULK SMS */}
      {activeSubTab === 'bulk_sms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="border-b border-neutral-100 pb-4 mb-5">
              <h2 className="text-base font-bold text-neutral-900">Bulk SMS Dispatch (Corporate Route)</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Deliver SMS to DND and non-DND numbers with custom Sender ID.</p>
            </div>

            <form onSubmit={handleSmsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Sender ID (Max 11 chars)</label>
                <input
                  type="text"
                  maxLength={11}
                  value={smsSenderId}
                  onChange={(e) => setSmsSenderId(e.target.value)}
                  required
                  placeholder="e.g. MyBrand"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Recipients (Comma or line separated)</label>
                <textarea
                  rows={3}
                  value={smsRecipients}
                  onChange={(e) => setSmsRecipients(e.target.value)}
                  placeholder="08012345678, 08087654321..."
                  required
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-neutral-700">Message Content</label>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {smsMessage.length} chars · {Math.ceil(smsMessage.length / 160) || 1} page(s)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-emerald-500 outline-none"
                />
              </div>

              {smsFeedback && (
                <div
                  className={`flex items-start gap-2.5 rounded-lg p-3 text-xs ${
                    smsFeedback.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {smsFeedback.success ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />}
                  <span>{smsFeedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingSms}
                className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
              >
                {isProcessingSms ? 'Dispatching SMS...' : 'Send Bulk SMS (₦3.50 per page/recipient)'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">SMS Routing Info</h3>
            <div className="text-xs text-neutral-600 space-y-2">
              <p>• Standard route delivers to active lines across MTN, Airtel, Glo, and 9mobile.</p>
              <p>• Auto-refund on invalid numbers.</p>
              <p>• 1 page = 160 standard characters.</p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 8: DIGITAL LOGS */}
      {activeSubTab === 'logs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
            <div className="border-b border-neutral-100 pb-4 mb-5">
              <h2 className="text-base font-bold text-neutral-900">Buy Social & Developer Account Logs</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Aged and PVA accounts with credentials delivered instantly upon purchase.</p>
            </div>

            <form onSubmit={handleLogsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Select Account Product</label>
                <div className="space-y-2">
                  {logServices.map((log) => (
                    <button
                      key={log.id}
                      type="button"
                      onClick={() => setSelectedLogId(log.id)}
                      className={`w-full p-3 text-left rounded-lg border transition-all ${
                        selectedLogId === log.id ? 'border-emerald-600 bg-emerald-50' : 'border-neutral-200 bg-white hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-neutral-900">{log.name}</span>
                        <span className="font-mono text-xs font-bold text-emerald-800">₦{log.price.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-1">{log.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={logQuantity}
                  onChange={(e) => setLogQuantity(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-emerald-500 outline-none"
                />
              </div>

              {logFeedback && (
                <div className="rounded-lg p-3 text-xs bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{logFeedback.message}</span>
                  </div>
                  {logFeedback.credentials && (
                    <div className="mt-2 p-2 bg-white rounded border border-emerald-100 font-mono text-xs break-all flex justify-between items-center">
                      <span>{logFeedback.credentials}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(logFeedback.credentials!, 'log_cred')}
                        className="p-1 ml-2 text-neutral-500 hover:text-neutral-900 shrink-0"
                      >
                        {copiedToken === 'log_cred' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessingLog}
                className="w-full rounded-lg bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800 disabled:opacity-50"
              >
                {isProcessingLog ? 'Fulfilling Order...' : `Buy Credentials (₦${((currentLog?.price || 0) * logQuantity).toLocaleString()})`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-neutral-200 bg-neutral-50/70 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Security & Storage Policy</h3>
            <div className="text-xs text-neutral-600 space-y-2">
              <p>• All credentials, cookies, and 2FA keys are backed up in your Transaction Ledger under `api_response`.</p>
              <p>• 24-hour replacement guarantee if login fails immediately upon delivery.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
