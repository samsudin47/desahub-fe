"use client";

import { fetchProductCategoryByUuid } from "@/services/product-category.service";
import type { ProductCategoryDetail } from "@/types/product-category";
import { useCallback, useEffect, useState } from "react";

export function useProductCategory(uuid: string | undefined) {
  const [data, setData] = useState<ProductCategoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!uuid) {
      setData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchProductCategoryByUuid(uuid);
      setData(result);
    } catch (err) {
      setData(null);
      setError(
        err instanceof Error ? err.message : "Gagal memuat produk kategori",
      );
    } finally {
      setIsLoading(false);
    }
  }, [uuid]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}
