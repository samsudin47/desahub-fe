import { getIamUrl } from "@/config/env";
import { apiRequest } from "@/lib/api-client";
import { ApiError } from "@/types/api";
import { clearAuthSession, getAuthToken, saveAuthSession } from "@/lib/auth-session";
import type {
  ApiUserRole,
  AuthData,
  LoginFormData,
  RegisterFormData,
  RegisterPayload,
  ResetPasswordFormData,
  ForgotPasswordFormData,
} from "@/types/auth";
import { API_ROLES } from "@/types/auth";

function toRegisterPayload(form: RegisterFormData): RegisterPayload {  if (!form.role) {
    throw new Error("Role is required");
  }

  return {
    username: form.username.trim(),
    email: form.email.trim(),
    password: form.password,
    password_confirmation: form.passwordConfirmation,
    role: form.role,
  };
}

export async function register(form: RegisterFormData): Promise<AuthData> {
  const payload = toRegisterPayload(form);

  const response = await apiRequest<AuthData>(getIamUrl("auth/register"), {
    method: "POST",
    token: null,
    body: {
      username: payload.username,
      email: payload.email,
      password: payload.password,
      password_confirmation: payload.password_confirmation,
      role: payload.role,
    },
  });

  saveAuthSession({
    token: response.datas.token,
    user: response.datas.user,
  });

  return response.datas;
}

export async function login(form: LoginFormData): Promise<AuthData> {
  const response = await apiRequest<AuthData>(getIamUrl("auth/login"), {
    method: "POST",
    token: null,
    body: {
      username: form.username.trim(),
      password: form.password,
    },
  });

  saveAuthSession({
    token: response.datas.token,
    user: response.datas.user,
  });

  return response.datas;
}

export function getPostLoginPath(role: ApiUserRole): string {
  if (role === API_ROLES.ADMIN || role === API_ROLES.SUPERADMIN) {
    return "/";
  }
  return "/marketplace-umkm";
}

export function getSafeRedirectPath(
  redirect: string | null | undefined,
  fallback: string,
): string {
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }
  return fallback;
}

export async function validateToken(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;

  try {
    await apiRequest<unknown>(getIamUrl("auth/token-validation"), {
      method: "GET",
      token,
      skipAuthRedirect: true,
    });
    return true;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      clearAuthSession();
    }
    return false;
  }
}

export async function logout(): Promise<void> {
  const token = getAuthToken();

  try {
    if (token) {
      await apiRequest<[]>(getIamUrl("auth/logout"), {
        method: "POST",
        token,
        skipAuthRedirect: true,
      });
    }
  } catch {
    // Session lokal tetap dihapus meskipun request ke BE gagal
  } finally {
    clearAuthSession();
  }
}

export async function forgotPassword(form: ForgotPasswordFormData): Promise<void> {
  await apiRequest<unknown[]>(getIamUrl("auth/forgot-password"), {
    method: "POST",
    token: null,
    body: {
      email: form.email.trim(),
    },
  });
}

export async function resetPassword(form: ResetPasswordFormData): Promise<void> {
  await apiRequest<unknown[]>(getIamUrl("auth/reset-password"), {
    method: "POST",
    token: null,
    body: {
      email: form.email.trim(),
      token: form.token.trim(),
      password: form.password,
      password_confirmation: form.passwordConfirmation,
    },
  });
}