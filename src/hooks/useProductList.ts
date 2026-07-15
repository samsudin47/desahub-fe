"use client";

import { fetchProductList } from "@/services/product.service";
import type { Product } from "@/types/product";
import { useCallback, useEffect, useState } from "react";

export function useProductList() {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchProductList();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat daftar produk",
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
