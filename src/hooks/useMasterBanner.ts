"use client";

import { fetchMasterBanner } from "@/services/master-banner.service";
import type { MasterBanner } from "@/types/master-banner";
import { useCallback, useEffect, useState } from "react";

export function useMasterBanner() {
  const [banner, setBanner] = useState<MasterBanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMasterBanner();
      setBanner(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat master banner",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { banner, isLoading, error, refetch, setBanner };
}
