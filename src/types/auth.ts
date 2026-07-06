/** Role identifiers from Laravel IAM service */
export const API_ROLES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  WARGA: "WARGA",
  USER: "USER",
} as const;

export type ApiUserRole = (typeof API_ROLES)[keyof typeof API_ROLES];

/** Roles available on public registration (SUPERADMIN excluded) */
export type RegisterableRole = Exclude<ApiUserRole, "SUPERADMIN">;

export interface RoleOption {
  value: RegisterableRole;
  label: string;
  description: string;
}

export const USER_ROLE_OPTIONS: RoleOption[] = [
  {
    value: API_ROLES.WARGA,
    label: "Warga",
    description: "Warga, can be do anything for feed",
  },
  {
    value: API_ROLES.USER,
    label: "User",
    description: "User, can be do anything for info",
  },
  {
    value: API_ROLES.ADMIN,
    label: "Admin",
    description: "Admin, can be do anything for human capital",
  },
];

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
  role: RegisterableRole | "";
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
