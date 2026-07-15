"use client";

import { fetchDropdownKategori } from "@/services/dropdown.service";
import type { DropdownKategori } from "@/types/dropdown-kategori";
import { useCallback, useEffect, useState } from "react";

export function useDropdownKategori() {
  const [items, setItems] = useState<DropdownKategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchDropdownKategori();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat dropdown kategori",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { items, isLoading, error, refetch };
}
