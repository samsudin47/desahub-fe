import { API_PREFIXES, type ApiServiceKey } from "./api-prefixes";

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
} as const;

function buildServiceUrl(service: ApiServiceKey, path: string): string {
  if (!env.apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL harus dikonfigurasi di file .env");
  }

  const base = env.apiBaseUrl.replace(/\/$/, "");
  const prefix = API_PREFIXES[service].replace(/^\/|\/$/g, "");
  const normalizedPath = path.replace(/^\//, "");
  return `${base}/${prefix}/${normalizedPath}`;
}

export function getApiUrl(service: ApiServiceKey, path: string): string {
  return buildServiceUrl(service, path);
}

export function getIamUrl(path: string): string {
  return getApiUrl("iam", path);
}

export function getDataManagementUrl(path: string): string {
  return getApiUrl("dataManagement", path);
}
