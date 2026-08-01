/** Role identifiers from Laravel IAM service */
export const API_ROLES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  WARGA: "WARGA",
  USER: "USER",
} as const;

export type ApiUserRole = (typeof API_ROLES)[keyof typeof API_ROLES];

export interface RoleOption {
  value: ApiUserRole;
  label: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

/** Maps Laravel validation field names to LoginForm field keys */
export const LOGIN_FIELD_MAP: Record<string, keyof LoginFormData> = {
  username: "username",
  password: "password",
};

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  role: ApiUserRole | "";
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: ApiUserRole;
}

export interface AuthUser {
  uuid: string;
  username: string;
  email: string;
  role: ApiUserRole;
  is_active: boolean;
  last_activity_at: string;
}

export interface AuthData {
  token: string;
  user: AuthUser;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

/** Maps Laravel validation field names to RegisterForm field keys */
export const REGISTER_FIELD_MAP: Record<string, keyof RegisterFormData> = {
  username: "username",
  email: "email",
  password: "password",
  password_confirmation: "passwordConfirmation",
  role: "role",
};

export interface ForgotPasswordFormData {
  email: string;
}

export const FORGOT_PASSWORD_FIELD_MAP: Record<string, keyof ForgotPasswordFormData> = {
  email: "email",
};

export interface ResetPasswordFormData {
  email: string;
  token: string;
  password: string;
  passwordConfirmation: string;
}

export const RESET_PASSWORD_FIELD_MAP: Record<string, keyof ResetPasswordFormData> = {
  email: "email",
  token: "token",
  password: "password",
  password_confirmation: "passwordConfirmation",
};
