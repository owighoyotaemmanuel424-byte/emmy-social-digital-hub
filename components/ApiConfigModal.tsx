'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  X,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Wifi,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiConfigModal({ isOpen, onClose }: ApiConfigModalProps) {
  const { config, updateConfig, testApiConnection } = useReseller();
  const [tokenInput, setTokenInput] = useState(config.api_token);
  const [isLiveMode, setIsLiveMode] = useState(config.is_live_mode);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      api_token: tokenInput.trim(),
      is_live_mode: isLiveMode,
    });
    onClose();
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    updateConfig({ api_token: tokenInput.trim() });
    const res = await testApiConnection();
    setTestResult(res);
    setTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-scaleUp">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-neutral-900">JejeLaye API v1 Connection</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Live vs Sandbox Mode Switcher */}
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-3.5">
          <div>
            <div className="text-xs font-bold text-neutral-900">
              {isLiveMode ? 'Live Production Mode' : 'Sandbox Simulator Mode'}
            </div>
            <div className="text-[11px] text-neutral-500">
              {isLiveMode
                ? 'Requests call https://jejelayegct.com.ng/api/v1 with your Bearer token.'
                : 'Simulates instant delivery, tokens, OTPs, and balance deductions with zero risk.'}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsLiveMode(!isLiveMode)}
            className="text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            {isLiveMode ? (
              <ToggleRight className="h-7 w-7 text-emerald-600" />
            ) : (
              <ToggleLeft className="h-7 w-7 text-neutral-400" />
            )}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              JejeLaye Secret API Token (Bearer)
            </label>
            <input
              type="password"
              placeholder="Paste your token from /auth/login response..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-mono text-neutral-900 focus:border-emerald-500 outline-none"
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Stored securely in your local environment. Proxied server-side to avoid browser CORS blocks.
            </p>
          </div>

          {testResult && (
            <div
              className={`flex items-start gap-2 rounded-lg p-3 text-xs ${
                testResult.success ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}
            >
              {testResult.success ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !tokenInput}
              className="flex-1 rounded-lg border border-neutral-300 bg-white py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors disabled:opacity-50"
            >
              {testing ? 'Testing Endpoint...' : 'Test Connection'}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-emerald-700 py-2 text-xs font-bold text-white transition hover:bg-emerald-800"
            >
              Save Configuration
            </button>
          </div>
        </form>

        {/* Quick Instructions from API doc */}
        <div className="rounded-lg bg-neutral-50 p-3 border border-neutral-100 space-y-1.5 text-[11px] text-neutral-600">
          <div className="font-bold text-neutral-900 text-xs">Quick Setup (from API doc):</div>
          <p>1. Register on JejeLaye or call `POST /api/v1/auth/login`.</p>
          <p>2. Copy the long token string returned in the JSON response.</p>
          <p>3. Paste it above and click Save. That&apos;s all you need to start transacting!</p>
        </div>
      </div>
    </div>
  );
}
