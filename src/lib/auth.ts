'use client';

export interface UserSession {
  role: 'admin' | 'operator' | 'auditor';
  username: string;
  token: string;
  timestamp: number;
}

const STORAGE_KEY = 'gsit_auth_session';

export function getSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  const session = getSession();
  return session?.role === 'admin';
}

export function loginAsAdmin(username: string = 'admin'): UserSession {
  const session: UserSession = {
    role: 'admin',
    username,
    token: `adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    timestamp: Date.now(),
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  return session;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
