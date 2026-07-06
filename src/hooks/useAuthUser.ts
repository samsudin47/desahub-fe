"use client";

import { useAuth } from "@/context/AuthContext";

export function useAuthUser() {
  const { user, isReady } = useAuth();
  return { user, isReady };
}
