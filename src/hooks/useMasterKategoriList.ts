"use client";

import { fetchMasterKategoriList } from "@/services/master-kategori.service";
import type { MasterKategori } from "@/types/master-kategori";
import { useCallback, useEffect, useState } from "react";

export function useMasterKategoriList() {
  const [items, setItems] = useState<MasterKategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMasterKategoriList();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat master kategori",
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
