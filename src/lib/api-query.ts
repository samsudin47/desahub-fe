import type { ApiListParams, ApiPagination } from "@/types/api";

export const DEFAULT_LIST_PER_PAGE = 15;

export function buildListQuery(params: ApiListParams = {}): string {
  const query = new URLSearchParams();

  if (params.page != null) {
    query.set("page", String(params.page));
  }

  if (params.perPage != null) {
    query.set("perPage", String(params.perPage));
  }

  const search = params.search?.trim();
  if (search) {
    query.set("search", search);
  }

  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export function emptyPagination(
  perPage = DEFAULT_LIST_PER_PAGE,
): ApiPagination {
  return {
    currentPage: 1,
    perPage,
    total: 0,
    lastPage: 1,
    from: null,
    to: null,
  };
}
