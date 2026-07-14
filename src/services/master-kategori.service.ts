import { getDataManagementUrl } from "@/config/env";
import { getApiSuccessMessage } from "@/lib/api-message";
import { apiRequest } from "@/lib/api-client";
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

export async function fetchMasterKategoriList(): Promise<MasterKategori[]> {
  const response = await apiRequest<MasterKategoriListDatas>(
    getDataManagementUrl(MASTER_KATEGORI_PATH),
    { method: "GET" },
  );

  return response.datas.master_kategori ?? [];
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
