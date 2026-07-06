import { getIamUrl } from "@/config/env";
import { apiRequest } from "@/lib/api-client";
import {
  API_ROLES,
  USER_ROLE_OPTIONS,
  type RegisterableRole,
  type RoleOption,
} from "@/types/auth";

type ApiRoleItem = {
  value?: string;
  code?: string;
  role?: string;
  label?: string;
  name?: string;
  description?: string;
  desc?: string;
};

function isRegisterableRole(value: string): value is RegisterableRole {
  return (
    value !== API_ROLES.SUPERADMIN &&
    (Object.values(API_ROLES) as string[]).includes(value)
  );
}

function normalizeRole(item: ApiRoleItem): RoleOption | null {
  const raw = (item.value ?? item.code ?? item.role ?? "").toUpperCase();
  if (!isRegisterableRole(raw)) return null;

  const fallback = USER_ROLE_OPTIONS.find((option) => option.value === raw);

  return {
    value: raw,
    label: item.label ?? item.name ?? fallback?.label ?? raw,
    description: item.description ?? item.desc ?? fallback?.description ?? "",
  };
}

function extractRoleItems(
  datas: ApiRoleItem[] | { roles: ApiRoleItem[] },
): ApiRoleItem[] {
  if (Array.isArray(datas)) return datas;
  return datas.roles ?? [];
}

export async function fetchRegisterableRoles(): Promise<RoleOption[]> {
  try {
    const response = await apiRequest<ApiRoleItem[] | { roles: ApiRoleItem[] }>(
      getIamUrl("auth/roles"),
      { method: "GET" },
    );

    const roles = extractRoleItems(response.datas)
      .map(normalizeRole)
      .filter((role): role is RoleOption => role !== null);

    if (roles.length > 0) return roles;
  } catch {
    // Endpoint belum tersedia — gunakan fallback statis
  }

  return USER_ROLE_OPTIONS;
}
