import { getIamUrl } from "@/config/env";
import { apiRequest } from "@/lib/api-client";
import { clearAuthSession, getAuthToken, saveAuthSession } from "@/lib/auth-session";
import type {
  ApiUserRole,
  AuthData,
  LoginFormData,
  RegisterFormData,
  RegisterPayload,
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

export async function logout(): Promise<void> {  const token = getAuthToken();

  try {
    if (token) {
      await apiRequest<[]>(getIamUrl("auth/logout"), {
        method: "POST",
        token,
      });
    }
  } catch {
    // Session lokal tetap dihapus meskipun request ke BE gagal
  } finally {
    clearAuthSession();
  }
}