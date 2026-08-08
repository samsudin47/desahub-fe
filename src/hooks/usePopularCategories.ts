"use client";

import { fetchPopularCategories } from "@/services/popular-category.service";
import type { PopularCategory } from "@/types/popular-category";
import { useCallback, useEffect, useState } from "react";

export function usePopularCategories() {
  const [categories, setCategories] = useState<PopularCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPopularCategories();
      setCategories(data);
    } catch (err) {
      setCategories([]);
      setError(
        err instanceof Error ? err.message : "Gagal memuat kategori populer",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { categories, isLoading, error, refetch };
}
