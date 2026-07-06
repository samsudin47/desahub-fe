import { getIamUrl } from "@/config/env";
import { apiRequest } from "@/lib/api-client";
import { API_ROLES, type ApiUserRole, type RoleOption } from "@/types/auth";

type ApiRoleItem = {
  uuid?: string;
  role: string;
  name: string;
  description?: string;
  is_system?: boolean;
};

type ApiRolesDatas = ApiRoleItem[] | { roles: ApiRoleItem[] };

function extractRoles(datas: ApiRolesDatas): ApiRoleItem[] {
  if (Array.isArray(datas)) return datas;
  return datas.roles ?? [];
}

function isKnownRole(value: string): value is ApiUserRole {
  return (Object.values(API_ROLES) as string[]).includes(value);
}

function normalizeRole(item: ApiRoleItem): RoleOption | null {
  const raw = item.role.toUpperCase();
  if (!isKnownRole(raw)) return null;

  return {
    value: raw,
    label: item.name || raw,
  };
}

export async function fetchRegisterableRoles(): Promise<RoleOption[]> {
  const response = await apiRequest<ApiRolesDatas>(getIamUrl("roles"), {
    method: "GET",
    token: null,
  });

  return extractRoles(response.datas)
    .map(normalizeRole)
    .filter((role): role is RoleOption => role !== null);
}
