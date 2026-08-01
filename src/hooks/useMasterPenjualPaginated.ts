"use client";

import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  DEFAULT_LIST_PER_PAGE,
  emptyPagination,
} from "@/lib/api-query";
import { fetchMasterPenjualPage } from "@/services/master-penjual.service";
import type { ApiPagination } from "@/types/api";
import type { MasterPenjual } from "@/types/master-penjual";
import { useCallback, useEffect, useState } from "react";

const PER_PAGE = DEFAULT_LIST_PER_PAGE;

export function useMasterPenjualPaginated() {
  const [items, setItems] = useState<MasterPenjual[]>([]);
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
      const result = await fetchMasterPenjualPage({
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
        err instanceof Error ? err.message : "Gagal memuat master penjual",
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
