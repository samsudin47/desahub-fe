"use client";

import {
  fetchMarketplaceBanner,
  type MarketplaceBanner,
} from "@/services/marketplace-banner.service";
import { useCallback, useEffect, useState } from "react";

export function useMarketplaceBanner() {
  const [banner, setBanner] = useState<MarketplaceBanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMarketplaceBanner();
      setBanner(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat banner");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { banner, isLoading, error, refetch, setBanner };
}
