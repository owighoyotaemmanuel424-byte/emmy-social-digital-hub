'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  Code,
  Key,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Send,
  Terminal,
  Play,
  Sparkles,
} from 'lucide-react';

export function ApiDocsHub() {
  const { config, updateConfig, wallet } = useReseller();
  const [copiedKey, setCopiedKey] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'curl' | 'js' | 'python' | 'php'>('curl');
  const [activeEndpoint, setActiveEndpoint] = useState<'balance' | 'data' | 'numbers' | 'sms' | 'logs'>('data');
  const [sandboxResponse, setSandboxResponse] = useState<string | null>(null);
  const [isCallingApi, setIsCallingApi] = useState(false);

  const sampleApiKey = config.api_token || 'jeje_live_89f41a8b92c4510e82c9e78201b';

  const copyApiKey = () => {
    navigator.clipboard.writeText(sampleApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const endpoints = [
    {
      id: 'balance',
      name: 'Check Wallet Balance',
      method: 'GET',
      path: '/api/v1/user/balance',
      description: 'Fetch your real-time available Naira balance, gift card balance, and reseller tier.',
      payload: null,
    },
    {
      id: 'data',
      name: 'Purchase VTU Data',
      method: 'POST',
      path: '/api/v1/data/purchase',
      description: 'Purchase SME or Corporate Gifting data bundle for an end-client phone number.',
      payload: {
        network: 'MTN',
        plan_id: 'mtn_sme_1gb',
        phone: '08140008920',
        bypass_validator: false,
      },
    },
    {
      id: 'numbers',
      name: 'Rent Virtual Number (OTP)',
      method: 'POST',
      path: '/api/v1/virtual-number/rent',
      description: 'Provision a physical/virtual USA or global phone number to receive SMS OTPs.',
      payload: {
        country: 'usa',
        service_code: 'whatsapp',
        server: 'server_1',
      },
    },
    {
      id: 'sms',
      name: 'Send Bulk SMS',
      method: 'POST',
      path: '/api/v1/sms/send',
      description: 'Dispatch branded SMS with custom alphanumeric sender ID and DND bypass.',
      payload: {
        sender_id: 'EMMY-TECH',
        recipients: ['08140008920', '08023456789'],
        message: 'Your order has been fulfilled. Thank you!',
        route: 'dnd_bypass',
      },
    },
    {
      id: 'logs',
      name: 'Order Social Media Log',
      method: 'POST',
      path: '/api/v1/logs/order',
      description: 'Purchase verified aged account credentials with instant 2FA and cookies.',
      payload: {
        platform: 'facebook',
        tier: 'fb_aged_market',
        quantity: 1,
      },
    },
  ];

  const currentEndpoint = endpoints.find((e) => e.id === activeEndpoint) || endpoints[0];

  const getCodeSnippet = () => {
    const baseUrl = 'https://jejelayegct.com.ng';
    const path = currentEndpoint.path;

    if (selectedLanguage === 'curl') {
      if (currentEndpoint.method === 'GET') {
        return `curl -X GET "${baseUrl}${path}" \\
  -H "Authorization: Bearer ${sampleApiKey}" \\
  -H "Accept: application/json"`;
      }
      return `curl -X POST "${baseUrl}${path}" \\
  -H "Authorization: Bearer ${sampleApiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(currentEndpoint.payload, null, 2)}'`;
    }

    if (selectedLanguage === 'js') {
      return `const axios = require('axios');

async function callJejeApi() {
  const response = await axios({
    method: '${currentEndpoint.method}',
    url: '${baseUrl}${path}',
    headers: {
      'Authorization': 'Bearer ${sampleApiKey}',
      'Content-Type': 'application/json'
    },
    ${currentEndpoint.payload ? `data: ${JSON.stringify(currentEndpoint.payload, null, 2)}` : ''}
  });

  console.log(response.data);
}

callJejeApi();`;
    }

    if (selectedLanguage === 'python') {
      return `import requests

url = "${baseUrl}${path}"
headers = {
    "Authorization": "Bearer ${sampleApiKey}",
    "Content-Type": "application/json"
}
${currentEndpoint.payload ? `payload = ${JSON.stringify(currentEndpoint.payload, null, 4)}` : ''}

response = requests.${currentEndpoint.method.toLowerCase()}(
    url, 
    headers=headers${currentEndpoint.payload ? ', json=payload' : ''}
)
print(response.json())`;
    }

    if (selectedLanguage === 'php') {
      return `<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "${baseUrl}${path}",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "${currentEndpoint.method}",
  ${currentEndpoint.payload ? `CURLOPT_POSTFIELDS => json_encode(${JSON.stringify(currentEndpoint.payload)}),` : ''}
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer ${sampleApiKey}",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
curl_close($curl);
echo $response;`;
    }

    return '';
  };

  const handleTestSandbox = () => {
    setIsCallingApi(true);
    setTimeout(() => {
      let mockRes = {};
      if (currentEndpoint.id === 'balance') {
        mockRes = {
          status: 'success',
          code: 200,
          data: {
            reseller_id: 'EDH-8924',
            business_name: 'Emmy Digital HUB Reseller',
            available_balance_ngn: wallet.balance,
            gift_card_balance_ngn: wallet.gift_card_balance,
            referral_bonus_ngn: wallet.referral_balance || 4800,
            account_tier: 'Enterprise Tier 3',
            live_mode: config.is_live_mode,
          },
        };
      } else if (currentEndpoint.id === 'data') {
        const randId = Math.floor(Math.random() * 899999 + 100000);
        mockRes = {
          status: 'success',
          code: 200,
          reference: `DATA-${randId}`,
          network: 'MTN',
          plan: 'MTN SME 1GB',
          recipient: '08140008920',
          amount_charged: 265.0,
          wallet_balance_after: wallet.balance - 265,
          timestamp: '2026-09-26T12:00:00.000Z',
        };
      } else if (currentEndpoint.id === 'numbers') {
        const randId = Math.floor(Math.random() * 899999 + 100000);
        mockRes = {
          status: 'success',
          code: 200,
          session_id: `VNUM-${randId}`,
          country: 'United States (+1)',
          phone_number: '+1 (415) 890-4821',
          expires_in_seconds: 1200,
          session_status: 'WAITING_FOR_OTP',
          webhook_url: 'https://your-webhook.domain/otp-listener',
        };
      } else if (currentEndpoint.id === 'sms') {
        const randId = Math.floor(Math.random() * 899999 + 100000);
        mockRes = {
          status: 'success',
          code: 200,
          message_id: `SMS-${randId}`,
          sender_id: 'EMMY-TECH',
          units_deducted: 2,
          cost_ngn: 8.4,
          delivery_status: 'DISPATCHED_TO_NCC_GATEWAY',
        };
      } else {
        const randId = Math.floor(Math.random() * 899999 + 100000);
        mockRes = {
          status: 'success',
          code: 200,
          order_id: `LOG-${randId}`,
          platform: 'Facebook Aged Marketplace',
          credentials: 'UID_1009849201|PASS_EmmyPro#991|2FA_JBSWY3DPEHPK3PXP|OGE_email@outlook.com',
          warranty_expires: '2026-09-27T12:00:00.000Z',
        };
      }

      setSandboxResponse(JSON.stringify(mockRes, null, 2));
      setIsCallingApi(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-neutral-900 text-white">
              <Terminal className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">
              Developer REST API Documentation (v1)
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Programmatically trigger VTU recharges, OTP virtual numbers, bulk SMS, and social logs from your own app or bot.
          </p>
        </div>

        {/* API Key Box */}
        <div className="flex items-center gap-2 bg-neutral-100 p-2 rounded-xl border border-neutral-200">
          <Key className="h-4 w-4 text-neutral-500 shrink-0" />
          <span className="font-mono text-xs text-neutral-800 font-bold truncate max-w-[180px]">
            {sampleApiKey}
          </span>
          <button
            onClick={copyApiKey}
            className="p-1 rounded bg-white hover:bg-neutral-200 text-neutral-700 shadow-xs"
            title="Copy API Token"
          >
            {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Grid: Endpoints + Code Runner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoints Sidebar: 4 cols */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-2 py-1">
            API Endpoints
          </div>
          {endpoints.map((ep) => (
            <button
              key={ep.id}
              onClick={() => {
                setActiveEndpoint(ep.id as any);
                setSandboxResponse(null);
              }}
              className={`w-full text-left p-3 rounded-xl transition flex flex-col gap-1 border ${
                activeEndpoint === ep.id
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                  : 'bg-white text-neutral-700 border-neutral-100 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{ep.name}</span>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    ep.method === 'GET' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {ep.method}
                </span>
              </div>
              <span
                className={`font-mono text-[10px] truncate ${
                  activeEndpoint === ep.id ? 'text-neutral-300' : 'text-neutral-400'
                }`}
              >
                {ep.path}
              </span>
            </button>
          ))}
        </div>

        {/* Code & Sandbox: 8 cols */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-neutral-950 text-white rounded-2xl p-5 shadow-lg border border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div>
                <span className="font-bold text-sm text-emerald-400">{currentEndpoint.name}</span>
                <p className="text-xs text-neutral-400 mt-0.5">{currentEndpoint.description}</p>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                {(['curl', 'js', 'python', 'php'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-2 py-1 text-[11px] font-bold rounded uppercase transition ${
                      selectedLanguage === lang ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="relative">
              <pre className="font-mono text-xs text-neutral-300 overflow-x-auto p-4 bg-neutral-900/90 rounded-xl border border-neutral-800 leading-relaxed">
                {getCodeSnippet()}
              </pre>
            </div>

            {/* Test in Sandbox Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-neutral-400">
                Simulated response using your live account credentials
              </span>
              <button
                onClick={handleTestSandbox}
                disabled={isCallingApi}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>{isCallingApi ? 'Calling API...' : 'Test Request'}</span>
              </button>
            </div>

            {/* Sandbox Live Response Output */}
            {sandboxResponse && (
              <div className="pt-3 border-t border-neutral-800 space-y-2 animate-fadeIn">
                <div className="text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                  <span>RESPONSE (200 OK):</span>
                  <span>Content-Type: application/json</span>
                </div>
                <pre className="font-mono text-xs text-emerald-400 bg-neutral-900 p-4 rounded-xl border border-emerald-950 overflow-x-auto">
                  {sandboxResponse}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
