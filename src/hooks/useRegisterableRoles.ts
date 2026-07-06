"use client";

import { fetchRegisterableRoles } from "@/services/role.service";
import type { RoleOption } from "@/types/auth";
import { useEffect, useEffectEvent, useState } from "react";

export function useRegisterableRoles() {
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoles = useEffectEvent(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchRegisterableRoles();
      setRoles(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat daftar role",
      );
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    void loadRoles();
  }, []);

  return { roles, isLoading, error, refetch: loadRoles };
}
