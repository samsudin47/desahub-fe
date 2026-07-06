import {
  AUTH_REQUIRED_PATHS,
  GUEST_ONLY_PATHS,
} from "@/config/auth-routes";
import { API_ROLES, type ApiUserRole, type AuthUser } from "@/types/auth";

export function isGuestOnlyPath(pathname: string): boolean {
  return GUEST_ONLY_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function isAuthRequiredPath(pathname: string): boolean {
  return AUTH_REQUIRED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function isAdminPath(pathname: string): boolean {
  if (pathname.startsWith("/marketplace-umkm")) return false;
  if (isGuestOnlyPath(pathname)) return false;
  if (pathname.startsWith("/error-")) return false;
  return true;
}

export function isAdminRole(role: ApiUserRole): boolean {
  return role === API_ROLES.ADMIN || role === API_ROLES.SUPERADMIN;
}

export function canAccessAdmin(user: AuthUser | null): boolean {
  return user !== null && isAdminRole(user.role);
}

export function canAccessPath(
  pathname: string,
  user: AuthUser | null,
): { allowed: boolean; reason?: "auth" | "forbidden" } {
  if (isGuestOnlyPath(pathname)) {
    return { allowed: true };
  }

  if (isAdminPath(pathname)) {
    if (!user) return { allowed: false, reason: "auth" };
    if (!canAccessAdmin(user)) return { allowed: false, reason: "forbidden" };
    return { allowed: true };
  }

  if (isAuthRequiredPath(pathname)) {
    if (!user) return { allowed: false, reason: "auth" };
    return { allowed: true };
  }

  return { allowed: true };
}
