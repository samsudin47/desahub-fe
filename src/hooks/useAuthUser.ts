"use client";

import { getAuthUser } from "@/lib/auth-session";
import type { AuthUser } from "@/types/auth";
import { useEffect, useState } from "react";

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(getAuthUser());
    setIsReady(true);
  }, []);

  return { user, isReady };
}
