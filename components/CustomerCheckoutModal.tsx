'use client';

import React, { useState, useEffect } from 'react';
import { useReseller } from '@/context/ResellerContext';
import { ServiceItem, PaymentChannel, ServiceType } from '@/types/jejelaye';
import {
  X,
  CreditCard,
  Building2,
  PhoneCall,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
  ExternalLink,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface CustomerCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: ServiceItem | null;
}

export function CustomerCheckoutModal({ isOpen, onClose, service }: CustomerCheckoutModalProps) {
  const {
    services,
    calculateResellerPrice,
    initiateCustomerPayment,
    verifyCustomerPayment,
    isLoading,
  } = useReseller();

  // Selected Service
  const [selectedServiceId, setSelectedServiceId] = useState<string | number>(
    service?.id || services[0]?.id || 101
  );
  const currentService =
    (service && String(service.id) === String(selectedServiceId) ? service : null) ||
    services.find((s) => String(s.id) === String(selectedServiceId)) ||
    service ||
    services[0];

  // Customer Input Fields
  const [customerName, setCustomerName] = useState('Chidi Okonkwo');
  const [customerEmail, setCustomerEmail] = useState('chidi.o@gmail.com');
  const [customerPhone, setCustomerPhone] = useState('08023456789');
  const [serviceRecipient, setServiceRecipient] = useState('08023456789');

  // Channel Tabs
  const [activeChannel, setActiveChannel] = useState<PaymentChannel>('card');

  // Checkout Session State
  const [session, setSession] = useState<{
    reference: string;
    subtotal: number;
    reseller_margin: number;
    gateway_fee: number;
    total_amount: number;
    virtual_account?: {
      bank_name: string;
      account_number: string;
      account_name: string;
    };
    ussd?: {
      code: string;
    };
  } | null>(null);

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('5399 4112 8910 2049');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('781');
  const [cardholderName, setCardholderName] = useState('CHIDI OKONKWO');

  // 3DS OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  // Transfer Timer
  const [countdownSeconds, setCountdownSeconds] = useState(1800); // 30 mins
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedUssd, setCopiedUssd] = useState(false);

  // Status & Feedback
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string; fulfillment_token?: string } | null>(null);

  // Dynamic pricing calculation
  const wholesalePrice = currentService ? currentService.price : 1000;
  const retailPrice = currentService ? calculateResellerPrice(currentService) : 1100;
  const resellerMargin = Math.max(0, retailPrice - wholesalePrice);
  const gatewayFee = Math.min(2000, Math.round(retailPrice * 0.015));
  const totalCharge = retailPrice + gatewayFee;

  // Countdown timer for bank transfer
  useEffect(() => {
    if (!isOpen || activeChannel !== 'bank_transfer') return;
    const interval = setInterval(() => {
      setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, activeChannel]);

  if (!isOpen) return null;

  const handleModalClose = () => {
    setFeedback(null);
    setShowOtpModal(false);
    setOtpCode('');
    onClose();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStartPayment = async () => {
    setIsProcessing(true);
    setFeedback(null);

    const initRes = await initiateCustomerPayment({
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      service_title: currentService?.name || 'Digital telecom product',
      service_type: (currentService?.type || 'data') as ServiceType,
      service_recipient: serviceRecipient,
      subtotal: retailPrice,
      reseller_margin: resellerMargin,
    });

    setIsProcessing(false);

    if (initRes.success && initRes.data) {
      setSession(initRes.data);
      if (activeChannel === 'card') {
        setShowOtpModal(true);
      }
    } else {
      setFeedback({ success: false, message: initRes.message || 'Payment initialization failed.' });
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length < 4) {
      setOtpError('Please enter a valid 4-6 digit OTP code.');
      return;
    }
    setOtpError('');
    setIsProcessing(true);

    const verifyRes = await verifyCustomerPayment({
      reference: session?.reference || 'JEJE_PAY_DEMO_CARD_REF',
      channel: 'card',
      card_details: {
        last4: cardNumber.replace(/\s+/g, '').slice(-4) || '2049',
        brand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      },
      service_type: (currentService?.type || 'data') as ServiceType,
      service_recipient: serviceRecipient,
      subtotal: retailPrice,
      reseller_margin: resellerMargin,
      gateway_fee: gatewayFee,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      service_title: currentService?.name || 'Customer Purchase',
    });

    setIsProcessing(false);
    setShowOtpModal(false);

    if (verifyRes.success && verifyRes.data) {
      setFeedback({
        success: true,
        message: 'Payment confirmed! Service delivered successfully.',
        fulfillment_token: verifyRes.data.fulfillment_token,
      });
    } else {
      setFeedback({ success: false, message: verifyRes.message });
    }
  };

  const handleSimulateBankTransfer = async () => {
    setIsProcessing(true);
    setFeedback(null);

    // If session doesn't exist yet, initialize it
    let ref = session?.reference;
    if (!ref) {
      const initRes = await initiateCustomerPayment({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        service_title: currentService?.name || 'Digital telecom product',
        service_type: (currentService?.type || 'data') as ServiceType,
        service_recipient: serviceRecipient,
        subtotal: retailPrice,
        reseller_margin: resellerMargin,
      });
      if (initRes.success && initRes.data) {
        setSession(initRes.data);
        ref = initRes.data.reference;
      }
    }

    // Call verify
    const verifyRes = await verifyCustomerPayment({
      reference: ref || 'JEJE_PAY_DEMO_TRANSFER_REF',
      channel: 'bank_transfer',
      service_type: (currentService?.type || 'data') as ServiceType,
      service_recipient: serviceRecipient,
      subtotal: retailPrice,
      reseller_margin: resellerMargin,
      gateway_fee: gatewayFee,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      service_title: currentService?.name || 'Customer Purchase',
    });

    setIsProcessing(false);
    if (verifyRes.success && verifyRes.data) {
      setFeedback({
        success: true,
        message: 'Bank transfer received and credited! Order delivered.',
        fulfillment_token: verifyRes.data.fulfillment_token,
      });
    } else {
      setFeedback({ success: false, message: verifyRes.message });
    }
  };

  const handleCopyAccount = (acct: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(acct).catch(() => {});
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  const handleCopyUssd = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
      setCopiedUssd(true);
      setTimeout(() => setCopiedUssd(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl space-y-4 animate-scaleUp">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-100 bg-white/95 px-6 py-4 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-900">JejePay Secure Gateway</h3>
                <span className="text-[10px] text-emerald-700 font-medium">· 256-Bit Encrypted</span>
              </div>
              <p className="text-xs text-neutral-500">Customer checkout & instant automated fulfillment</p>
            </div>
          </div>
          <button
            onClick={handleModalClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Order Summary Card */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  Purchasing Item
                </label>
                <div className="text-sm font-bold text-neutral-900">{currentService?.name}</div>
                <div className="text-xs text-neutral-500">
                  {currentService?.description || currentService?.provider}
                </div>
              </div>

              {/* Service switcher dropdown if reseller is testing checkout */}
              <select
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  setSession(null);
                  setFeedback(null);
                }}
                className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 outline-none"
              >
                {services.slice(0, 15).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (₦{calculateResellerPrice(s).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-neutral-200/60 pt-2.5 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Item Retail Price</span>
                <span className="font-mono tabular-nums">₦{retailPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Reseller Profit Margin</span>
                <span className="font-mono tabular-nums">+₦{resellerMargin.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Payment Processing Fee (1.5%)</span>
                <span className="font-mono tabular-nums">₦{gatewayFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1 border-t border-neutral-200">
                <span>Total Amount Due</span>
                <span className="font-mono tabular-nums text-emerald-700">
                  ₦{totalCharge.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`rounded-xl p-4 text-xs space-y-2 ${
                feedback.success
                  ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                  : 'bg-rose-50 text-rose-950 border border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {feedback.success ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>

              {feedback.fulfillment_token && (
                <div className="rounded-lg bg-white p-2.5 font-mono text-xs border border-emerald-300 text-emerald-900 flex items-center justify-between">
                  <span>{feedback.fulfillment_token}</span>
                  <button
                    onClick={() => handleCopyAccount(feedback.fulfillment_token || '')}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Customer Details Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Customer Full Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Customer Email</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Customer Phone Number</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Service Recipient (Phone/Meter)</label>
              <input
                type="text"
                value={serviceRecipient}
                onChange={(e) => setServiceRecipient(e.target.value)}
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setActiveChannel('card')}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-xs font-medium transition ${
                  activeChannel === 'card'
                    ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 font-bold'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <CreditCard className="h-4 w-4 mb-1" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveChannel('bank_transfer')}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-xs font-medium transition ${
                  activeChannel === 'bank_transfer'
                    ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 font-bold'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <Building2 className="h-4 w-4 mb-1" />
                <span>Bank Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveChannel('ussd')}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-xs font-medium transition ${
                  activeChannel === 'ussd'
                    ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 font-bold'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <PhoneCall className="h-4 w-4 mb-1" />
                <span>USSD</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveChannel('qr')}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-xs font-medium transition ${
                  activeChannel === 'qr'
                    ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900 font-bold'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                }`}
              >
                <QrCode className="h-4 w-4 mb-1" />
                <span>Scan QR</span>
              </button>
            </div>
          </div>

          {/* CHANNEL 1: CARD PAYMENT */}
          {activeChannel === 'card' && (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-600">
                <span className="font-semibold text-neutral-800">Card Payment Details</span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-neutral-500">
                  <Lock className="h-3 w-3 text-emerald-600" /> 3D Secure Protected
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Card Number</label>
                <input
                  type="text"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="5399 0000 0000 0000"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Name on Card</label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 uppercase outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={handleStartPayment}
                disabled={isProcessing || !cardNumber || !cardExpiry}
                className="w-full rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Connecting to Card Switch...' : `Pay ₦${totalCharge.toLocaleString()} with Card`}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* CHANNEL 2: DYNAMIC BANK TRANSFER */}
          {activeChannel === 'bank_transfer' && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <span className="text-xs font-semibold text-neutral-900">
                  Dedicated Dynamic Virtual Account
                </span>
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Expires in {formatTime(countdownSeconds)}</span>
                </div>
              </div>

              <div className="rounded-xl bg-neutral-50 p-4 border border-neutral-200 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500">Bank Name</span>
                  <span className="font-bold text-neutral-900">
                    {session?.virtual_account?.bank_name || 'Wema Bank / Titan Trust'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-neutral-900 tracking-wider">
                      {session?.virtual_account?.account_number || '9910284910'}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyAccount(session?.virtual_account?.account_number || '9910284910')
                      }
                      className="rounded p-1 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800"
                      title="Copy Account Number"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {copiedAccount && (
                  <div className="text-right text-[11px] font-bold text-emerald-600">
                    Account number copied!
                  </div>
                )}

                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500">Account Name</span>
                  <span className="font-semibold text-neutral-800">
                    {session?.virtual_account?.account_name || `JejePay / ${customerName.toUpperCase()}`}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs pt-2 border-t border-neutral-200">
                  <span className="text-neutral-500">Amount to Transfer</span>
                  <span className="font-mono text-sm font-bold text-emerald-700">
                    ₦{totalCharge.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Make a bank transfer of <strong>₦{totalCharge.toLocaleString()}</strong> from any Nigerian mobile banking app (GTBank, Access, Zenith, OPay, Moniepoint, etc.) to the account above. Payment confirms automatically.
              </p>

              <button
                type="button"
                onClick={handleSimulateBankTransfer}
                disabled={isProcessing}
                className="w-full rounded-xl bg-neutral-900 py-3 text-xs font-bold text-white shadow-xs transition hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Verifying Inter-Bank Transfer...' : 'I Have Transferred / Confirm Payment'}
              </button>
            </div>
          )}

          {/* CHANNEL 3: USSD PAYMENT */}
          {activeChannel === 'ussd' && (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 space-y-4">
              <div className="text-xs font-semibold text-neutral-800">
                USSD Quick Payment Code
              </div>

              <div className="rounded-xl bg-white p-4 border border-neutral-200 text-center space-y-2">
                <div className="text-xs text-neutral-500">Dial from your registered mobile phone</div>
                <div className="font-mono text-lg font-bold text-neutral-900 tracking-wider">
                  *737*2*{totalCharge}*3819#
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyUssd(`*737*2*${totalCharge}*3819#`)}
                  className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedUssd ? 'Copied to Clipboard' : 'Copy USSD String'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSimulateBankTransfer}
                disabled={isProcessing}
                className="w-full rounded-xl bg-emerald-700 py-3 text-xs font-bold text-white transition hover:bg-emerald-800"
              >
                {isProcessing ? 'Validating USSD Session...' : 'Confirm USSD Payment'}
              </button>
            </div>
          )}

          {/* CHANNEL 4: QR CODE */}
          {activeChannel === 'qr' && (
            <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center space-y-4">
              <div className="text-xs font-semibold text-neutral-900">
                Scan NIBSS QR with your Banking App
              </div>
              <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-xl bg-neutral-100 border border-neutral-200 p-2">
                <QrCode className="h-28 w-28 text-neutral-800" />
              </div>
              <p className="text-[11px] text-neutral-500">
                Open your bank app (Access, GTCO, Zenith, Kuda, Moniepoint) and scan the QR code to complete payment of <strong>₦{totalCharge.toLocaleString()}</strong>.
              </p>
              <button
                type="button"
                onClick={handleSimulateBankTransfer}
                disabled={isProcessing}
                className="w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800"
              >
                {isProcessing ? 'Verifying QR Payment...' : 'I Have Scanned and Paid'}
              </button>
            </div>
          )}
        </div>

        {/* 3DS OTP Simulation Modal */}
        {showOtpModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold text-neutral-900">3D Secure OTP Verification</span>
                </div>
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="rounded-full p-1 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-neutral-600">
                  A one-time passcode has been dispatched to your bank-registered mobile number ending in <strong>***289</strong>.
                </p>
                <div className="rounded-lg bg-neutral-50 p-2.5 text-[11px] text-neutral-500">
                  Demo Quick Fill: Enter <strong>123456</strong> or click autofill below.
                </div>
              </div>

              {otpError && (
                <div className="text-xs text-rose-600 font-medium">{otpError}</div>
              )}

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full text-center tracking-widest text-lg font-mono font-bold rounded-lg border border-neutral-300 py-2 text-neutral-900 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpCode('123456')}
                  className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
                >
                  Autofill 123456
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isProcessing}
                  className="flex-1 rounded-lg bg-emerald-700 py-2 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {isProcessing ? 'Authorizing...' : 'Authorize'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
