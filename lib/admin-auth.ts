'use client';

import { useSyncExternalStore } from 'react';

export interface AdminUser {
  email: string;
  name: string;
  role: 'Super Administrator';
  avatar: string;
  lastLogin: string;
  token: string;
}

export const OFFICIAL_ADMIN_CREDENTIALS = {
  email: 'owighoyotaemmanuel424@gmail.com',
  password: 'Owighoyota12345',
  name: 'Emmanuel Owighoyota',
  role: 'Super Administrator' as const,
  avatar: 'EO',
};

const STORAGE_KEY = 'edh_admin_auth_session';

function safeParseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw || typeof raw !== 'string') return fallback;
  const trimmed = raw.trim();
  if (!trimmed) return fallback;
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    return fallback;
  }
}

export function getStoredAdminSession(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return safeParseJson<AdminUser | null>(raw, null);
  } catch {
    return null;
  }
}

export function setStoredAdminSession(admin: AdminUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(admin));
    window.dispatchEvent(new Event('edh_admin_auth_changed'));
  } catch (err) {
    console.error('Failed to save admin session', err);
  }
}

export function clearStoredAdminSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('edh_admin_auth_changed'));
  } catch (err) {
    console.error('Failed to clear admin session', err);
  }
}

let cachedSession: AdminUser | null = null;
let lastRawSession: string | null = null;

function subscribeAdminAuth(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('edh_admin_auth_changed', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('edh_admin_auth_changed', callback);
    window.removeEventListener('storage', callback);
  };
}

function getAdminSnapshot(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== lastRawSession) {
      lastRawSession = raw;
      cachedSession = safeParseJson<AdminUser | null>(raw, null);
    }
    return cachedSession;
  } catch {
    return null;
  }
}

function getServerSnapshot(): null {
  return null;
}

export function useAdminSession(): AdminUser | null {
  return useSyncExternalStore(subscribeAdminAuth, getAdminSnapshot, getServerSnapshot);
}

export function authenticateAdmin(emailInput: string, passwordInput: string): { success: boolean; user?: AdminUser; error?: string } {
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  const targetEmail = OFFICIAL_ADMIN_CREDENTIALS.email.toLowerCase();
  const targetPassword = OFFICIAL_ADMIN_CREDENTIALS.password;

  if (cleanEmail !== targetEmail) {
    return {
      success: false,
      error: 'Invalid administrator email address. Please check and try again.',
    };
  }

  if (cleanPassword !== targetPassword) {
    return {
      success: false,
      error: 'Invalid password. Please check your admin credentials.',
    };
  }

  const user: AdminUser = {
    email: OFFICIAL_ADMIN_CREDENTIALS.email,
    name: OFFICIAL_ADMIN_CREDENTIALS.name,
    role: OFFICIAL_ADMIN_CREDENTIALS.role,
    avatar: OFFICIAL_ADMIN_CREDENTIALS.avatar,
    lastLogin: new Date().toISOString(),
    token: `EDH_ADM_${Date.now()}_SECURE_TOKEN`,
  };

  setStoredAdminSession(user);

  return {
    success: true,
    user,
  };
}
