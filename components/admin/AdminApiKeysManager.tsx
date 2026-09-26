'use client';

import React, { useState } from 'react';
import {
  ResellerApiKey,
  useResellerApiKeys,
  useProviderApiKeys,
  saveResellerKeys,
  saveProviderKeys,
  generateSecureApiKey,
  ProviderGatewayKey,
} from '@/lib/api-keys-store';
import {
  KeyRound,
  Key,
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Globe,
  Sliders,
  Code2,
  Terminal,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Activity,
  Lock,
  Search,
  Filter,
  Server,
  Zap,
  Radio,
  FileCode,
} from 'lucide-react';

interface AdminApiKeysManagerProps {
  onNotify?: (msg: string) => void;
}

export function AdminApiKeysManager({ onNotify }: AdminApiKeysManagerProps) {
  const resellerKeys = useResellerApiKeys();
  const providerKeys = useProviderApiKeys();

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEnv, setFilterEnv] = useState<'all' | 'live' | 'sandbox'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'revoked'>('all');

  // Key visibility toggles
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Add Key Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedResellerId, setSelectedResellerId] = useState('RES-001');
  const [customResellerName, setCustomResellerName] = useState('');
  const [customResellerEmail, setCustomResellerEmail] = useState('');
  const [keyLabel, setKeyLabel] = useState('');
  const [keyEnvironment, setKeyEnvironment] = useState<'live' | 'sandbox'>('live');
  const [generatedKey, setGeneratedKey] = useState('');
  const [ipWhitelist, setIpWhitelist] = useState('*');
  const [rateLimit, setRateLimit] = useState<number>(10000);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    'vtu:data',
    'vtu:airtime',
    'bills:pay',
    'wallet:read',
  ]);

  // Newly Created Key Success Modal
  const [createdKeySuccess, setCreatedKeySuccess] = useState<ResellerApiKey | null>(null);

  // Provider Key Edit Modal
  const [editingProvider, setEditingProvider] = useState<ProviderGatewayKey | null>(null);
  const [providerKeyInput, setProviderKeyInput] = useState('');
  const [providerSecretInput, setProviderSecretInput] = useState('');
  const [pingingProviderId, setPingingProviderId] = useState<string | null>(null);

  // Active Code Tab
  const [codeTab, setCodeTab] = useState<'curl' | 'node' | 'python'>('curl');

  // Available scopes
  const ALL_SCOPES = [
    { id: 'vtu:data', label: 'VTU SME & Corp Data', desc: 'Query and dispatch MTN, Airtel, Glo data bundles' },
    { id: 'vtu:airtime', label: 'Airtime VTU & PIN', desc: 'Direct recharge and airtime epins' },
    { id: 'bills:pay', label: 'Utility Bills', desc: 'Prepaid electricity tokens & Cable TV renew' },
    { id: 'logs:purchase', label: 'Social Logs Marketplace', desc: 'Purchase verified aged social media accounts' },
    { id: 'numbers:rent', label: 'Virtual Phone Numbers (OTP)', desc: 'Order temporary numbers for WhatsApp, Telegram' },
    { id: 'sms:send', label: 'Bulk SMS Gateway', desc: 'Send transactional & marketing SMS via branded SenderID' },
    { id: 'wallet:read', label: 'Wallet Balance & Rates', desc: 'Check reseller Naira liquidity and wholesale price list' },
  ];

  const KNOWN_RESELLERS = [
    { id: 'RES-001', name: 'Emmanuel Owighoyota', email: 'emmanuelowighoyota9@gmail.com' },
    { id: 'RES-002', name: 'Adebayo Ogunlesi', email: 'adebayo.reseller@gmail.com' },
    { id: 'RES-003', name: 'Chinedu Eze', email: 'chinedu.vtu@yahoo.com' },
    { id: 'RES-004', name: 'Grace Michael', email: 'grace.logs@outlook.com' },
    { id: 'RES-005', name: 'Femi Alabi', email: 'femi.telecoms@gmail.com' },
    { id: 'CUSTOM', name: '+ New Custom Reseller...', email: '' },
  ];

  // Open modal with fresh generated key
  const handleOpenAddModal = (resellerPresetId?: string) => {
    const resId = resellerPresetId || 'RES-001';
    setSelectedResellerId(resId);
    setKeyEnvironment('live');
    const newKey = generateSecureApiKey('live');
    setGeneratedKey(newKey);
    setKeyLabel('');
    setIpWhitelist('*');
    setRateLimit(10000);
    setWebhookUrl('');
    setSelectedScopes(['vtu:data', 'vtu:airtime', 'bills:pay', 'wallet:read']);
    setIsAddModalOpen(true);
  };

  const handleScopeToggle = (scopeId: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scopeId) ? prev.filter((s) => s !== scopeId) : [...prev, scopeId]
    );
  };

  const handleSelectAllScopes = () => {
    if (selectedScopes.length === ALL_SCOPES.length) {
      setSelectedScopes([]);
    } else {
      setSelectedScopes(ALL_SCOPES.map((s) => s.id));
    }
  };

  const handleSaveNewApiKey = (e: React.FormEvent) => {
    e.preventDefault();

    let rName = '';
    let rEmail = '';

    if (selectedResellerId === 'CUSTOM') {
      rName = customResellerName.trim() || 'Custom Reseller Partner';
      rEmail = customResellerEmail.trim() || 'reseller@domain.com';
    } else {
      const found = KNOWN_RESELLERS.find((r) => r.id === selectedResellerId);
      rName = found?.name || 'Reseller Partner';
      rEmail = found?.email || 'reseller@domain.com';
    }

    const finalKeyString = generatedKey.trim() || generateSecureApiKey(keyEnvironment);
    const finalLabel = keyLabel.trim() || `${rName} API Client`;

    const newApiKeyRecord: ResellerApiKey = {
      id: `KEY-EDH-${Math.floor(100 + Math.random() * 900)}`,
      resellerId: selectedResellerId === 'CUSTOM' ? `RES-NEW-${Date.now().toString().slice(-4)}` : selectedResellerId,
      resellerName: rName,
      resellerEmail: rEmail,
      keyLabel: finalLabel,
      apiKey: finalKeyString,
      environment: keyEnvironment,
      scopes: selectedScopes.length > 0 ? selectedScopes : ['wallet:read'],
      ipWhitelist: ipWhitelist.trim() || '*',
      dailyRateLimit: rateLimit,
      requestsToday: 0,
      status: 'active',
      webhookUrl: webhookUrl.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsedAt: 'Never used yet',
    };

    const updated = [newApiKeyRecord, ...resellerKeys];
    saveResellerKeys(updated);

    setIsAddModalOpen(false);
    setCreatedKeySuccess(newApiKeyRecord);

    if (onNotify) {
      onNotify(`Reseller API Key generated successfully for ${rName}!`);
    }
  };

  const handleToggleStatus = (id: string) => {
    const updated = resellerKeys.map((k) => {
      if (k.id === id) {
        const nextStatus = k.status === 'active' ? 'revoked' : 'active';
        return { ...k, status: nextStatus as 'active' | 'revoked' };
      }
      return k;
    });
    saveResellerKeys(updated);
    if (onNotify) {
      onNotify('API Key status updated.');
    }
  };

  const handleRegenerateKey = (id: string) => {
    const target = resellerKeys.find((k) => k.id === id);
    if (!target) return;

    const newKey = generateSecureApiKey(target.environment);
    const updated = resellerKeys.map((k) => {
      if (k.id === id) {
        return { ...k, apiKey: newKey, lastUsedAt: 'Just rotated' };
      }
      return k;
    });
    saveResellerKeys(updated);

    // Show copy dialog
    setCreatedKeySuccess({ ...target, apiKey: newKey });
    if (onNotify) {
      onNotify(`Rotated API Key for ${target.keyLabel}. Make sure to update the client.`);
    }
  };

  const handleDeleteKey = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this reseller API key? This action cannot be undone.')) {
      const updated = resellerKeys.filter((k) => k.id !== id);
      saveResellerKeys(updated);
      if (onNotify) {
        onNotify('Reseller API Key deleted.');
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Provider Ping Simulation
  const handlePingProvider = (providerId: string) => {
    setPingingProviderId(providerId);
    setTimeout(() => {
      const latency = Math.floor(35 + Math.random() * 45);
      const updated = providerKeys.map((p) => {
        if (p.id === providerId) {
          return {
            ...p,
            status: 'connected' as const,
            lastPingMs: latency,
            lastChecked: 'Just now',
          };
        }
        return p;
      });
      saveProviderKeys(updated);
      setPingingProviderId(null);
      if (onNotify) {
        onNotify(`Gateway connection test successful! Response latency: ${latency}ms`);
      }
    }, 600);
  };

  const handleSaveProviderKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider) return;

    const updated = providerKeys.map((p) => {
      if (p.id === editingProvider.id) {
        return {
          ...p,
          apiKey: providerKeyInput.trim() || p.apiKey,
          apiSecret: providerSecretInput.trim() || p.apiSecret,
          lastChecked: 'Updated just now',
        };
      }
      return p;
    });
    saveProviderKeys(updated);
    setEditingProvider(null);
    if (onNotify) {
      onNotify(`Provider credentials for ${editingProvider.providerName} updated.`);
    }
  };

  // Filtered keys
  const filteredKeys = resellerKeys.filter((k) => {
    const matchesSearch =
      k.resellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.resellerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.keyLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.apiKey.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEnv = filterEnv === 'all' || k.environment === filterEnv;
    const matchesStatus = filterStatus === 'all' || k.status === filterStatus;

    return matchesSearch && matchesEnv && matchesStatus;
  });

  const activeLiveKeys = resellerKeys.filter((k) => k.status === 'active' && k.environment === 'live').length;
  const totalCallsToday = resellerKeys.reduce((acc, k) => acc + k.requestsToday, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Actions */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
                REST API v1 Gateway
              </span>
              <span className="text-xs text-neutral-400">Bearer Token Authentication</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Reseller API Keys & Gateway Manager
            </h2>
            <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
              Easily generate, grant scopes, restrict IP addresses, and monitor API keys for automated reseller portals, WooCommerce plugins, mobile apps, and Telegram bots.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenAddModal()}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-extrabold shadow-lg shadow-emerald-950/60 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Reseller API Key</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-neutral-800/80">
          <div className="p-3 rounded-xl bg-neutral-950/50 border border-neutral-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Active Live Keys</div>
            <div className="font-mono text-xl font-black text-emerald-400 mt-0.5">{activeLiveKeys} Keys</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/50 border border-neutral-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Requests Today</div>
            <div className="font-mono text-xl font-black text-white mt-0.5">{totalCallsToday.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/50 border border-neutral-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Avg Latency</div>
            <div className="font-mono text-xl font-black text-teal-300 mt-0.5">48ms</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-950/50 border border-neutral-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Gateways Health</div>
            <div className="font-mono text-xl font-black text-amber-300 mt-0.5">100% Online</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by reseller name, email, label, or key..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {/* Environment Filter */}
          <select
            value={filterEnv}
            onChange={(e) => setFilterEnv(e.target.value as typeof filterEnv)}
            className="bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Environments</option>
            <option value="live">Live Production</option>
            <option value="sandbox">Sandbox Test</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
            className="bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="revoked">Revoked</option>
          </select>

          <button
            onClick={() => handleOpenAddModal()}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Add Key</span>
          </button>
        </div>
      </div>

      {/* Reseller API Keys Table */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-400" />
              <span>Reseller API Keys Directory</span>
            </h3>
            <p className="text-[11px] text-neutral-400">
              Showing {filteredKeys.length} of {resellerKeys.length} issued reseller API keys
            </p>
          </div>
        </div>

        {filteredKeys.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-neutral-800 text-neutral-500 flex items-center justify-center mx-auto">
              <KeyRound className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white">No Reseller API Keys Found</h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              No keys match your search criteria. You can issue a new API key right now.
            </p>
            <button
              onClick={() => handleOpenAddModal()}
              className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
            >
              + Create First Reseller Key
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/70 border-b border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-400">
                <tr>
                  <th className="p-4 font-bold">Reseller / Owner</th>
                  <th className="p-4 font-bold">Application / Label</th>
                  <th className="p-4 font-bold">Secret API Key</th>
                  <th className="p-4 font-bold">Environment</th>
                  <th className="p-4 font-bold">Authorized Scopes</th>
                  <th className="p-4 font-bold">Today Usage</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filteredKeys.map((keyItem) => {
                  const isRevealed = !!revealedKeys[keyItem.id];
                  const isCopied = copiedKeyId === keyItem.id;
                  const usagePercent = Math.min(100, Math.round((keyItem.requestsToday / keyItem.dailyRateLimit) * 100));

                  return (
                    <tr key={keyItem.id} className="hover:bg-neutral-850/50 transition">
                      {/* Reseller info */}
                      <td className="p-4">
                        <div className="font-bold text-white">{keyItem.resellerName}</div>
                        <div className="text-[11px] text-neutral-400">{keyItem.resellerEmail}</div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{keyItem.resellerId}</div>
                      </td>

                      {/* Label & Webhook */}
                      <td className="p-4">
                        <div className="font-semibold text-white">{keyItem.keyLabel}</div>
                        <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                          <Globe className="h-3 w-3 text-neutral-500" />
                          <span>IP: {keyItem.ipWhitelist}</span>
                        </div>
                        {keyItem.webhookUrl && (
                          <div className="text-[10px] text-emerald-400 truncate max-w-[180px] mt-0.5" title={keyItem.webhookUrl}>
                            WH: {keyItem.webhookUrl}
                          </div>
                        )}
                      </td>

                      {/* Secret API Key */}
                      <td className="p-4 font-mono">
                        <div className="flex items-center gap-2 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
                          <span className="text-xs text-neutral-300">
                            {isRevealed
                              ? keyItem.apiKey
                              : `${keyItem.apiKey.slice(0, 15)}••••••••••••••••${keyItem.apiKey.slice(-4)}`}
                          </span>
                          <div className="flex items-center gap-1 ml-auto shrink-0">
                            <button
                              onClick={() => toggleReveal(keyItem.id)}
                              className="p-1 text-neutral-400 hover:text-white"
                              title={isRevealed ? 'Hide API Key' : 'Reveal API Key'}
                            >
                              {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5 text-neutral-500" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(keyItem.apiKey, keyItem.id)}
                              className={`p-1 transition ${isCopied ? 'text-emerald-400' : 'text-neutral-400 hover:text-white'}`}
                              title="Copy API Key"
                            >
                              {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-1">
                          Created {keyItem.createdAt} • Used {keyItem.lastUsedAt}
                        </div>
                      </td>

                      {/* Environment */}
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            keyItem.environment === 'live'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {keyItem.environment}
                        </span>
                      </td>

                      {/* Scopes */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {keyItem.scopes.map((s) => (
                            <span
                              key={s}
                              className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-neutral-800 text-neutral-300 border border-neutral-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Today Usage */}
                      <td className="p-4 font-mono">
                        <div className="text-xs text-white font-bold">
                          {keyItem.requestsToday.toLocaleString()} / {keyItem.dailyRateLimit.toLocaleString()}
                        </div>
                        <div className="w-24 bg-neutral-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              usagePercent > 85 ? 'bg-rose-500' : usagePercent > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{usagePercent}% rate limit</div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            keyItem.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {keyItem.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRegenerateKey(keyItem.id)}
                            className="p-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-400 hover:text-amber-300 transition"
                            title="Regenerate / Rotate Key"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(keyItem.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                              keyItem.status === 'active'
                                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                            }`}
                          >
                            {keyItem.status === 'active' ? 'Revoke' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteKey(keyItem.id)}
                            className="p-1.5 rounded-lg border border-neutral-800 hover:border-rose-900 bg-neutral-950 text-neutral-500 hover:text-rose-400 transition"
                            title="Delete Key"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upstream Provider Gateway Credentials */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-sky-400" />
              <span>Upstream Provider API Credentials</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Master connection secrets for Jejelaye GCT API, Moniepoint webhooks, and SMS routes
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providerKeys.map((p) => {
            const isPinging = pingingProviderId === p.id;
            return (
              <div key={p.id} className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-xs">{p.providerName}</div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {p.lastPingMs}ms
                  </span>
                </div>

                <div className="text-[11px] text-neutral-400">{p.serviceCategory}</div>

                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-[11px] text-neutral-300 flex items-center justify-between">
                  <span className="truncate">{p.apiKey.slice(0, 10)}••••••••••••••••</span>
                  <button
                    onClick={() => {
                      setEditingProvider(p);
                      setProviderKeyInput(p.apiKey);
                      setProviderSecretInput(p.apiSecret || '');
                    }}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-sans font-bold underline shrink-0 ml-2"
                  >
                    Edit Key
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-500">
                  <span className="truncate max-w-[200px]">{p.endpointUrl}</span>
                  <button
                    onClick={() => handlePingProvider(p.id)}
                    disabled={isPinging}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    <RefreshCw className={`h-3 w-3 ${isPinging ? 'animate-spin' : ''}`} />
                    <span>{isPinging ? 'Pinging...' : 'Test Ping'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Developer API Quick Integration Snippets */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="h-4 w-4 text-amber-400" />
              <span>Reseller Developer Integration Snippet</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Send this code example to your reseller partner to authenticate their requests.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-bold">
            {(['curl', 'node', 'python'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setCodeTab(tab)}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] transition ${
                  codeTab === tab ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl bg-neutral-950 p-4 font-mono text-xs text-neutral-300 border border-neutral-800 overflow-x-auto">
          {codeTab === 'curl' && (
            <pre>
{`curl -X POST https://api.emmydigitalhub.com.ng/v1/data/purchase \\
  -H "Authorization: Bearer ${resellerKeys[0]?.apiKey || 'edh_live_sk_894109f2a1b7e90c3d4e5f6a7b8c9d0e'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "network": "MTN",
    "phone": "08140008920",
    "plan_id": "mtn_sme_5gb",
    "ref": "REQ_894109482"
  }'`}
            </pre>
          )}

          {codeTab === 'node' && (
            <pre>
{`import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.emmydigitalhub.com.ng/v1',
  headers: {
    Authorization: 'Bearer ${resellerKeys[0]?.apiKey || 'edh_live_sk_894109f2a1b7e90c3d4e5f6a7b8c9d0e'}',
    'Content-Type': 'application/json'
  }
});

// Buy Data Example
const res = await client.post('/data/purchase', {
  network: 'MTN',
  phone: '08140008920',
  plan_id: 'mtn_sme_5gb'
});
console.log(res.data);`}
            </pre>
          )}

          {codeTab === 'python' && (
            <pre>
{`import requests

url = "https://api.emmydigitalhub.com.ng/v1/data/purchase"
headers = {
    "Authorization": "Bearer ${resellerKeys[0]?.apiKey || 'edh_live_sk_894109f2a1b7e90c3d4e5f6a7b8c9d0e'}",
    "Content-Type": "application/json"
}
payload = {
    "network": "MTN",
    "phone": "08140008920",
    "plan_id": "mtn_sme_5gb"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`}
            </pre>
          )}
        </div>
      </div>

      {/* ================= MODAL: ADD RESELLER API KEY ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 text-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Generate Reseller API Key</h4>
                  <p className="text-[11px] text-neutral-400">Issue secure programmatic credentials for a reseller partner</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewApiKey} className="space-y-4 pt-4">
              {/* Step 1: Reseller Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Select Reseller Account</label>
                <select
                  value={selectedResellerId}
                  onChange={(e) => setSelectedResellerId(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {KNOWN_RESELLERS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} {r.email ? `(${r.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* If custom reseller chosen */}
              {selectedResellerId === 'CUSTOM' && (
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Reseller Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Telecoms"
                      value={customResellerName}
                      onChange={(e) => setCustomResellerName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Reseller Email</label>
                    <input
                      type="email"
                      required
                      placeholder="reseller@domain.com"
                      value={customResellerEmail}
                      onChange={(e) => setCustomResellerEmail(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Application Label */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Application Name / Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Production Mobile App Backend, WooCommerce Plugin"
                  value={keyLabel}
                  onChange={(e) => setKeyLabel(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Step 3: Environment Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Environment Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setKeyEnvironment('live');
                      setGeneratedKey(generateSecureApiKey('live'));
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      keyEnvironment === 'live'
                        ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>Live Production</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setKeyEnvironment('sandbox');
                      setGeneratedKey(generateSecureApiKey('sandbox'));
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                      keyEnvironment === 'sandbox'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span>Sandbox Test Mode</span>
                  </button>
                </div>
              </div>

              {/* Step 4: Secret API Key string */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-300">Generated Secret Key</label>
                  <button
                    type="button"
                    onClick={() => setGeneratedKey(generateSecureApiKey(keyEnvironment))}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Regenerate</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={generatedKey}
                    onChange={(e) => setGeneratedKey(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 font-mono text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedKey, 'modal-key')}
                    className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
                  >
                    {copiedKeyId === 'modal-key' ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Step 5: Scope Permissions */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Authorized Scopes & Permissions</label>
                  <button
                    type="button"
                    onClick={handleSelectAllScopes}
                    className="text-[10px] text-neutral-400 hover:text-white underline"
                  >
                    {selectedScopes.length === ALL_SCOPES.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 rounded-xl bg-neutral-950 border border-neutral-800">
                  {ALL_SCOPES.map((scope) => {
                    const isChecked = selectedScopes.includes(scope.id);
                    return (
                      <label
                        key={scope.id}
                        className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition ${
                          isChecked ? 'bg-neutral-900 border border-neutral-700' : 'hover:bg-neutral-900/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleScopeToggle(scope.id)}
                          className="mt-0.5 h-3.5 w-3.5 accent-emerald-500 rounded cursor-pointer"
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{scope.label}</span>
                            <span className="text-[10px] font-mono text-neutral-500 font-normal">({scope.id})</span>
                          </div>
                          <div className="text-[10px] text-neutral-400">{scope.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Step 6: Security Safeguards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    IP Whitelist (comma-separated or &apos;*&apos;)
                  </label>
                  <input
                    type="text"
                    value={ipWhitelist}
                    onChange={(e) => setIpWhitelist(e.target.value)}
                    placeholder="* for any IP, or 102.89.44.12"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Daily Rate Limit (Requests/Day)
                  </label>
                  <select
                    value={rateLimit}
                    onChange={(e) => setRateLimit(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono"
                  >
                    <option value={1000}>1,000 req/day (Starter)</option>
                    <option value={5000}>5,000 req/day (Standard)</option>
                    <option value={10000}>10,000 req/day (Pro)</option>
                    <option value={50000}>50,000 req/day (High Volume)</option>
                    <option value={1000000}>Unlimited (Enterprise Partner)</option>
                  </select>
                </div>
              </div>

              {/* Webhook Callback */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  Webhook Callback URL (Optional)
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://reseller-site.com/api/edh-webhook"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-950/50"
                >
                  Save & Issue API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: KEY CREATED SUCCESS POPUP ================= */}
      {createdKeySuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-base font-bold text-white">Reseller API Key Activated!</h4>
              <p className="text-xs text-neutral-400">
                Key issued for <strong className="text-white">{createdKeySuccess.resellerName}</strong> ({createdKeySuccess.keyLabel})
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>Secret API Key Token</span>
                <span className="text-amber-400 text-[10px] font-bold">Copy Now</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900 font-mono text-xs text-emerald-300 break-all border border-neutral-700 select-all flex items-center justify-between gap-2">
                <span>{createdKeySuccess.apiKey}</span>
                <button
                  onClick={() => copyToClipboard(createdKeySuccess.apiKey, 'created-key')}
                  className="shrink-0 p-1.5 rounded-lg bg-emerald-600/30 text-emerald-300 hover:bg-emerald-600/40"
                  title="Copy Key"
                >
                  {copiedKeyId === 'created-key' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Provide this key to the reseller partner along with their authorization documentation. It grants programmatic debit access to their wallet balance.
              </span>
            </div>

            <button
              onClick={() => setCreatedKeySuccess(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
            >
              Done & Return to Directory
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PROVIDER GATEWAY ================= */}
      {editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-800 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white">Edit Provider Key</h4>
                <p className="text-xs text-neutral-400">{editingProvider.providerName}</p>
              </div>
              <button onClick={() => setEditingProvider(null)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveProviderKey} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Provider API Key / Token</label>
                <input
                  type="text"
                  required
                  value={providerKeyInput}
                  onChange={(e) => setProviderKeyInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              {editingProvider.apiSecret !== undefined && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">Provider API Secret / Webhook Key</label>
                  <input
                    type="text"
                    value={providerSecretInput}
                    onChange={(e) => setProviderSecretInput(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono"
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProvider(null)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
