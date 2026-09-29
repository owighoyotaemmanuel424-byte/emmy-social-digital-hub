'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { BRAND } from '@/lib/branding';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Password confirmation check
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match.');
      return;
    }

    // 2. Password length check
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    // 3. Nigerian phone format validation
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (!/^(0[789][01]\d{8}|234[789][01]\d{8})$/.test(cleanPhone)) {
      setError('Please enter a valid 11-digit Nigerian phone number (e.g. 08012345678, 08140008920).');
      return;
    }

    // 4. Terms acceptance check
    if (!acceptedTerms) {
      setError('You must accept the Terms of Service to create an account.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: cleanPhone,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create your account.');
      }

      if (data.token) {
        try {
          localStorage.setItem('token', data.token);
          localStorage.setItem('emmy_auth_token', data.token);
        } catch {}
      }

      window.location.href = '/dashboard';
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-black tracking-tight text-white">Create Account</h2>
        <p className="text-xs text-slate-400">
          Get started with instant VTU airtime, data, and dedicated virtual account.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              required
              placeholder="Emmanuel Owighoyota"
              value={formData.name}
              onChange={handleChange}
              className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
            />
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
            />
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            Phone Number (11 Digits)
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              required
              placeholder="08140008920"
              maxLength={11}
              value={formData.phone}
              onChange={handleChange}
              className="w-full py-2.5 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-mono transition"
            />
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            Password (min 8 chars)
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              minLength={8}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full py-2.5 pl-10 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
            />
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password_confirmation"
              required
              minLength={8}
              placeholder="••••••••"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full py-2.5 pl-10 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition"
            />
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="pt-1 flex items-start gap-2.5">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-800 bg-slate-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
          />
          <label htmlFor="terms" className="text-xs text-slate-400 select-none leading-tight">
            I accept the <span className="text-slate-200 font-semibold">{BRAND.name}</span> Terms of Service & Privacy Policy.
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:scale-[0.99] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition disabled:opacity-50 mt-2"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Register Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 border-t border-slate-800/80 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-emerald-400 hover:text-emerald-300 font-bold transition"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
