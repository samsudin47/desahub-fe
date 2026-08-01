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
  MasterPenjual,
  MasterPenjualFormData,
} from "@/types/master-penjual";

type MasterPenjualListDatas = {
  master_penjual: MasterPenjual[];
};

export type MasterPenjualMutationResult<T> = {
  data: T;
  message: string;
};

const MASTER_PENJUAL_PATH = "master-penjual";

function toFormBody(data: MasterPenjualFormData): Record<string, string> {
  return {
    nama_penjual: data.nama_penjual.trim(),
    email: data.email.trim(),
    no_hp: data.no_hp.trim(),
    alamat: data.alamat.trim(),
  };
}

/** Unpaginated-style fetch for dropdowns / consumers that need a simple array. */
export async function fetchMasterPenjualList(): Promise<MasterPenjual[]> {
  const response = await apiRequest<MasterPenjualListDatas>(
    getDataManagementUrl(MASTER_PENJUAL_PATH),
    { method: "GET" },
  );

  return response.datas.master_penjual ?? [];
}

export async function fetchMasterPenjualPage(
  params: ApiListParams = {},
): Promise<ApiPaginatedResult<MasterPenjual>> {
  const perPage = params.perPage ?? DEFAULT_LIST_PER_PAGE;
  const response = await apiRequest<MasterPenjualListDatas>(
    getDataManagementUrl(
      `${MASTER_PENJUAL_PATH}${buildListQuery({ ...params, perPage })}`,
    ),
    { method: "GET" },
  );

  return {
    items: response.datas.master_penjual ?? [],
    pagination: response.pagination ?? emptyPagination(perPage),
  };
}

export async function createMasterPenjual(
  data: MasterPenjualFormData,
): Promise<MasterPenjualMutationResult<MasterPenjual>> {
  const response = await apiRequest<MasterPenjual>(
    getDataManagementUrl(MASTER_PENJUAL_PATH),
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

export async function updateMasterPenjual(
  uuid: string,
  data: MasterPenjualFormData,
): Promise<MasterPenjualMutationResult<MasterPenjual>> {
  const response = await apiRequest<MasterPenjual>(
    getDataManagementUrl(`${MASTER_PENJUAL_PATH}/${uuid}`),
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

export async function deleteMasterPenjual(
  uuid: string,
): Promise<{ message: string }> {
  const response = await apiRequest<unknown[]>(
    getDataManagementUrl(`${MASTER_PENJUAL_PATH}/${uuid}`),
    { method: "DELETE" },
  );

  return {
    message: getApiSuccessMessage(response),
  };
}
