"use client";

import { LOGIN_PATH } from "@/config/auth-routes";
import { isGuestOnlyPath } from "@/lib/auth-access";
import {
  subscribeAuthSession,
  subscribeUnauthorized,
} from "@/lib/auth-events";
import { clearAuthSession, getAuthUser } from "@/lib/auth-session";
import { logout as logoutRequest, validateToken } from "@/services/auth.service";
import type { AuthUser } from "@/types/auth";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  syncSession: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readUserFromStorage(): AuthUser | null {
  return getAuthUser();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  const syncSession = useCallback(() => {
    setUser(readUserFromStorage());
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
    router.push(LOGIN_PATH);
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      const storedUser = readUserFromStorage();

      if (!storedUser) {
        if (isMounted) {
          setUser(null);
          setIsReady(true);
        }
        return;
      }

      const isValid = await validateToken();
      if (!isMounted) return;

      setUser(isValid ? readUserFromStorage() : null);
      setIsReady(true);
    }

    void initializeAuth();

    const unsubscribeSession = subscribeAuthSession(() => {
      if (isMounted) {
        syncSession();
      }
    });

    const unsubscribeUnauthorized = subscribeUnauthorized(() => {
      clearAuthSession();
      setUser(null);

      if (typeof window === "undefined") return;

      const pathname = window.location.pathname;
      if (isGuestOnlyPath(pathname)) return;

      const redirect = `${LOGIN_PATH}?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirect);
    });

    return () => {
      isMounted = false;
      unsubscribeSession();
      unsubscribeUnauthorized();
    };
  }, [router, syncSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      isAuthenticated: user !== null,
      logout,
      syncSession,
    }),
    [user, isReady, logout, syncSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
