"use client";

import {
  DEFAULT_BEST_SELLING_LIMIT,
  fetchBestSellingProducts,
} from "@/services/best-selling-product.service";
import type { BestSellingProduct } from "@/types/best-selling-product";
import { useCallback, useEffect, useState } from "react";

export function useBestSellingProducts(
  limit = DEFAULT_BEST_SELLING_LIMIT,
) {
  const [products, setProducts] = useState<BestSellingProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchBestSellingProducts(limit);
      setProducts(data);
    } catch (err) {
      setProducts([]);
      setError(
        err instanceof Error ? err.message : "Gagal memuat produk terlaris",
      );
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { products, isLoading, error, refetch };
}
