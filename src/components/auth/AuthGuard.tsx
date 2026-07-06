"use client";

import { LOGIN_PATH } from "@/config/auth-routes";
import { useAuth } from "@/context/AuthContext";
import { canAccessPath } from "@/lib/auth-access";
import { getPostLoginPath } from "@/services/auth.service";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

type AuthGuardProps = {
  children: ReactNode;
  mode?: "default" | "guest" | "admin";
};

function AuthGuardFallback({ message }: { message: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4">
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export default function AuthGuard({ children, mode = "default" }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isReady, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isReady) return;

    if (mode === "guest") {
      if (isAuthenticated && user) {
        router.replace(getPostLoginPath(user.role));
      }
      return;
    }

    const access = canAccessPath(pathname, user);

    if (!access.allowed && access.reason === "auth") {
      const redirect = `${LOGIN_PATH}?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirect);
      return;
    }

    if (!access.allowed && access.reason === "forbidden") {
      if (user) {
        router.replace(getPostLoginPath(user.role));
      } else {
        router.replace(LOGIN_PATH);
      }
    }
  }, [isReady, isAuthenticated, user, pathname, router, mode]);

  if (!isReady) {
    return <AuthGuardFallback message="Memuat sesi..." />;
  }

  if (mode === "guest") {
    if (isAuthenticated) {
      return <AuthGuardFallback message="Mengalihkan..." />;
    }
    return children;
  }

  const access = canAccessPath(pathname, user);

  if (!access.allowed) {
    return (
      <AuthGuardFallback
        message={
          access.reason === "forbidden"
            ? "Anda tidak memiliki akses ke halaman ini."
            : "Mengalihkan ke halaman masuk..."
        }
      />
    );
  }

  return children;
}
