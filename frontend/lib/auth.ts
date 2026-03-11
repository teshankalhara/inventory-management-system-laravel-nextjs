import { User } from '@/types';

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

function setAuthCookie(token: string | null): void {
  if (typeof document === 'undefined') return;

  if (!token) {
    document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    return;
  }

  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
}

export function saveAuth(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setAuthCookie(token);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  setAuthCookie(null);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || token === 'undefined' || token === 'null') return null;
  return token;
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw || raw === 'undefined' || raw === 'null') return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function isAdmin(): boolean {
  return getUser()?.role === 'admin';
}
