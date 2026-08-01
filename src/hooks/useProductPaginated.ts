"use client";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  DEFAULT_LIST_PER_PAGE,
  emptyPagination,
} from "@/lib/api-query";
import { fetchProductPage } from "@/services/product.service";
import type { ApiPagination } from "@/types/api";
import type { Product } from "@/types/product";
import { useCallback, useEffect, useState } from "react";

const PER_PAGE = DEFAULT_LIST_PER_PAGE;

export function useProductPaginated() {
  const [items, setItems] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<ApiPagination>(() =>
    emptyPagination(PER_PAGE),
  );
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchProductPage({
        page,
        perPage: PER_PAGE,
        search: debouncedSearch || undefined,
      });

      setItems(result.items);
      setPagination(result.pagination);

      if (
        result.pagination.lastPage > 0 &&
        page > result.pagination.lastPage
      ) {
        setPage(result.pagination.lastPage);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat daftar produk",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const setSearchQuery = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return {
    items,
    pagination,
    page,
    setPage,
    search,
    setSearch: setSearchQuery,
    isLoading,
    error,
    refetch,
  };
}
