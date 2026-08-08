import { getDataManagementUrl } from "@/config/env";
import { getApiSuccessMessage } from "@/lib/api-message";
import { apiRequest } from "@/lib/api-client";
import type {
  MasterBanner,
  MasterBannerSubmitData,
} from "@/types/master-banner";

export type MasterBannerMutationResult = {
  data: MasterBanner | null;
  message: string;
};

const MASTER_BANNER_PATH = "master-banner";

function toFormData(data: MasterBannerSubmitData): FormData {
  const formData = new FormData();
  formData.append("title", data.title.trim());
  formData.append("subtitle", data.subtitle.trim());

  if (data.gambar) {
    formData.append("gambar", data.gambar);
  }

  return formData;
}

function normalizeBanner(
  datas: MasterBanner | MasterBanner[] | null | undefined,
): MasterBanner | null {
  if (!datas) return null;
  if (Array.isArray(datas)) return datas[0] ?? null;
  if (!datas.uuid) return null;
  return datas;
}

export async function fetchMasterBanner(): Promise<MasterBanner | null> {
  const response = await apiRequest<MasterBanner | MasterBanner[]>(
    getDataManagementUrl(MASTER_BANNER_PATH),
    { method: "GET" },
  );

  return normalizeBanner(response.datas);
}

export async function saveMasterBanner(
  data: MasterBannerSubmitData,
): Promise<MasterBannerMutationResult> {
  const response = await apiRequest<MasterBanner>(
    getDataManagementUrl(MASTER_BANNER_PATH),
    {
      method: "POST",
      body: toFormData(data),
    },
  );

  return {
    data: normalizeBanner(response.datas),
    message: getApiSuccessMessage(response),
  };
}

export async function deleteMasterBanner(): Promise<{ message: string }> {
  const response = await apiRequest<unknown[]>(
    getDataManagementUrl(MASTER_BANNER_PATH),
    { method: "DELETE" },
  );

  return {
    message: getApiSuccessMessage(response),
  };
}
