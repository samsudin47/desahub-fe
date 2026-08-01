import { getDataManagementUrl } from "@/config/env";
import { getApiSuccessMessage } from "@/lib/api-message";
import { apiRequest } from "@/lib/api-client";
import {
  buildListQuery,
  DEFAULT_LIST_PER_PAGE,
  emptyPagination,
} from "@/lib/api-query";
import type { ApiListParams, ApiPaginatedResult } from "@/types/api";
import type {
  MasterKategori,
  MasterKategoriFormData,
} from "@/types/master-kategori";

type MasterKategoriListDatas = {
  master_kategori: MasterKategori[];
};

export type MasterKategoriMutationResult<T> = {
  data: T;
  message: string;
};

const MASTER_KATEGORI_PATH = "master-kategori";

function toFormBody(data: MasterKategoriFormData): Record<string, string> {
  return {
    nama_kategori: data.nama_kategori.trim(),
    deskripsi: data.deskripsi.trim(),
  };
}

/** Unpaginated-style fetch for dropdowns / consumers that need a simple array. */
export async function fetchMasterKategoriList(): Promise<MasterKategori[]> {
  const response = await apiRequest<MasterKategoriListDatas>(
    getDataManagementUrl(MASTER_KATEGORI_PATH),
    { method: "GET" },
  );

  return response.datas.master_kategori ?? [];
}

export async function fetchMasterKategoriPage(
  params: ApiListParams = {},
): Promise<ApiPaginatedResult<MasterKategori>> {
  const perPage = params.perPage ?? DEFAULT_LIST_PER_PAGE;
  const response = await apiRequest<MasterKategoriListDatas>(
    getDataManagementUrl(
      `${MASTER_KATEGORI_PATH}${buildListQuery({ ...params, perPage })}`,
    ),
    { method: "GET" },
  );

  return {
    items: response.datas.master_kategori ?? [],
    pagination: response.pagination ?? emptyPagination(perPage),
  };
}

export async function createMasterKategori(
  data: MasterKategoriFormData,
): Promise<MasterKategoriMutationResult<MasterKategori>> {
  const response = await apiRequest<MasterKategori>(
    getDataManagementUrl(MASTER_KATEGORI_PATH),
    {
      method: "POST",
      body: toFormBody(data),
    },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}

export async function updateMasterKategori(
  uuid: string,
  data: MasterKategoriFormData,
): Promise<MasterKategoriMutationResult<MasterKategori>> {
  const response = await apiRequest<MasterKategori>(
    getDataManagementUrl(`${MASTER_KATEGORI_PATH}/${uuid}`),
    {
      method: "PUT",
      body: toFormBody(data),
    },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}

export async function deleteMasterKategori(
  uuid: string,
): Promise<{ message: string }> {
  const response = await apiRequest<unknown[]>(
    getDataManagementUrl(`${MASTER_KATEGORI_PATH}/${uuid}`),
    { method: "DELETE" },
  );

  return {
    message: getApiSuccessMessage(response),
  };
}
