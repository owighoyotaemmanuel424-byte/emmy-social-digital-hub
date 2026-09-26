'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import { ServiceItem } from '@/types/jejelaye';
import {
  CreditCard,
  Building2,
  PhoneCall,
  QrCode,
  ShieldCheck,
  Plus,
  Copy,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Send,
  Zap,
} from 'lucide-react';
import { CustomerCheckoutModal } from './CustomerCheckoutModal';

export function CustomerPaymentLinks() {
  const {
    services,
    paymentTransactions,
    calculateResellerPrice,
    openCheckoutModal,
    isCheckoutModalOpen,
    closeCheckoutModal,
    checkoutService,
    setActivePaymentReceipt,
  } = useReseller();

  const [selectedServiceId, setSelectedServiceId] = useState<string | number>(services[0]?.id || 101);
  const [customCustomerPhone, setCustomCustomerPhone] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentService = services.find((s) => String(s.id) === String(selectedServiceId)) || services[0];
  const retailPrice = currentService ? calculateResellerPrice(currentService) : 1000;
  const wholesalePrice = currentService ? currentService.price : 900;
  const margin = Math.max(0, retailPrice - wholesalePrice);

  const checkoutUrl = `https://jejelaye.reseller.app/pay?service=${currentService?.id || 101}&ref=RES_${currentService?.id || 101}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(checkoutUrl).catch(() => {});
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const filteredPayments = paymentTransactions.filter((p) => {
    return (
      p.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.service_title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalGatewayVolume = paymentTransactions
    .filter((p) => p.status === 'successful')
    .reduce((acc, p) => acc + p.total_amount, 0);

  const totalMarginEarned = paymentTransactions
    .filter((p) => p.status === 'successful')
    .reduce((acc, p) => acc + p.reseller_margin, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Customer Payment Gateway & Checkout
            </h1>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
              Instant Auto-Fulfillment
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Accept online customer payments via Card, Virtual Dynamic Transfer, USSD, and QR. Wholesale cost is deducted and your profit is credited instantly.
          </p>
        </div>

        <button
          onClick={() => openCheckoutModal(currentService)}
          className="rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-800 flex items-center gap-1.5"
        >
          <Zap className="h-4 w-4" />
          Test Checkout Gateway
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="text-xs text-neutral-500">Total Customer Volume Processed</div>
          <div className="mt-2 font-mono text-2xl font-bold text-neutral-900 tabular-nums">
            ₦{totalGatewayVolume.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            {paymentTransactions.filter((p) => p.status === 'successful').length} successful customer payments
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="text-xs text-neutral-500">Reseller Profit Earned from Gateway</div>
          <div className="mt-2 font-mono text-2xl font-bold text-emerald-700 tabular-nums">
            ₦{totalMarginEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-medium">
            Credited directly to wallet upon payment
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
          <div className="text-xs text-neutral-500">Supported Payment Channels</div>
          <div className="mt-3 flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-bold text-neutral-800 bg-neutral-100 px-2 py-1 rounded">
              <CreditCard className="h-3 w-3 text-emerald-600" /> Card
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-neutral-800 bg-neutral-100 px-2 py-1 rounded">
              <Building2 className="h-3 w-3 text-blue-600" /> Transfer
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-neutral-800 bg-neutral-100 px-2 py-1 rounded">
              <PhoneCall className="h-3 w-3 text-amber-600" /> USSD
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-neutral-800 bg-neutral-100 px-2 py-1 rounded">
              <QrCode className="h-3 w-3 text-purple-600" /> QR
            </span>
          </div>
        </div>
      </div>

      {/* Customer Link Generator Card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-neutral-900">
              Generate Customer Payment Link & Invoice
            </h2>
            <p className="text-xs text-neutral-500">
              Select any telecom bundle, utility, or virtual number to create a direct payment checkout link.
            </p>
          </div>
          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            256-bit SSL Protected
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Select Service */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Select Product to Sell
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 outline-none"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.provider})
                </option>
              ))}
            </select>
          </div>

          {/* Pricing Info */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Pricing Breakdown
            </label>
            <div className="rounded-lg bg-neutral-50 p-2 border border-neutral-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-neutral-500">Retail: </span>
                <strong className="text-neutral-900">₦{retailPrice.toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-neutral-500">Wholesale: </span>
                <span className="font-mono">₦{wholesalePrice.toLocaleString()}</span>
              </div>
              <div className="text-emerald-700 font-bold">
                +₦{margin.toLocaleString()} Profit
              </div>
            </div>
          </div>

          {/* Optional Customer Phone */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Pre-fill Customer Phone (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 08023456789"
              value={customCustomerPhone}
              onChange={(e) => setCustomCustomerPhone(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 outline-none"
            />
          </div>
        </div>

        {/* Link Output Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2 rounded-xl bg-neutral-50 p-3 border border-neutral-200">
          <input
            type="text"
            readOnly
            value={checkoutUrl}
            className="flex-1 bg-transparent text-xs font-mono text-neutral-700 outline-none select-all truncate"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-none rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 flex items-center justify-center gap-1.5"
            >
              <Copy className="h-3.5 w-3.5" />
              {copiedLink ? 'Link Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={() => openCheckoutModal(currentService)}
              className="flex-1 sm:flex-none rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 flex items-center justify-center gap-1.5"
            >
              <Zap className="h-3.5 w-3.5" />
              Open Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Customer Payment History Table */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-neutral-100 p-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search customer, reference, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 pl-8 pr-3 py-1.5 text-xs text-neutral-900 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="text-xs text-neutral-500">
            Showing <strong>{filteredPayments.length}</strong> customer payments
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Reference & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product Purchased</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Amount & Fee</th>
                <th className="py-3 px-4">Your Profit</th>
                <th className="py-3 px-4">Fulfillment</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-neutral-400">
                    No customer payments found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-semibold text-neutral-900">{payment.reference}</div>
                      <div className="text-[11px] text-neutral-400">{payment.created_at}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-800">{payment.customer_name}</div>
                      <div className="text-[11px] text-neutral-400">{payment.customer_email}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-800">{payment.service_title}</div>
                      {payment.service_recipient && (
                        <div className="font-mono text-[11px] text-neutral-500">
                          To: {payment.service_recipient}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="capitalize font-mono text-[11px] text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                        {payment.channel}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono tabular-nums font-bold text-neutral-900">
                        ₦{payment.total_amount.toLocaleString()}
                      </div>
                      <div className="font-mono text-[10px] text-neutral-400">
                        Fee: ₦{payment.gateway_fee}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-700 tabular-nums">
                      +₦{payment.reseller_margin.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Fulfilled
                      </div>
                      {payment.fulfillment_token && (
                        <div className="font-mono text-[10px] text-neutral-500 truncate max-w-[120px]">
                          {payment.fulfillment_token}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActivePaymentReceipt(payment)}
                        className="rounded-lg border border-neutral-200 px-2 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-neutral-100 transition"
                      >
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Checkout Modal */}
      <CustomerCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={closeCheckoutModal}
        service={checkoutService}
      />
    </div>
  );
}
