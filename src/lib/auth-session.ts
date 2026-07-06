import type { AuthSession } from "@/types/auth";

const TOKEN_KEY = "desahub_token";
const USER_KEY = "desahub_user";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function saveAuthSession(session: AuthSession): void {
  if (!isBrowser()) return;
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function getAuthToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): AuthSession["user"] | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession["user"];
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
