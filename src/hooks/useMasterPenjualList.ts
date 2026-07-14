"use client";

import { fetchMasterPenjualList } from "@/services/master-penjual.service";
import type { MasterPenjual } from "@/types/master-penjual";
import { useCallback, useEffect, useState } from "react";

export function useMasterPenjualList() {
  const [items, setItems] = useState<MasterPenjual[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMasterPenjualList();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat master penjual",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { items, isLoading, error, refetch, setItems };
}
