import type { LoginFormData, RegisterFormData } from "@/types/auth";
import { LOGIN_FIELD_MAP, REGISTER_FIELD_MAP } from "@/types/auth";
import { ApiError } from "@/types/api";

type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>>;
type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

type FieldRule<T extends string> = {
  field: T;
  keywords: string[];
};

function resolveFieldFromMessage<T extends string>(
  message: string,
  rules: FieldRule<T>[],
): T | null {
  const normalized = message.toLowerCase();

  for (const { field, keywords } of rules) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return field;
    }
  }

  return null;
}

function mapValidationFailed<T extends string>(
  messages: string[],
  rules: FieldRule<T>[],
): Partial<Record<T, string>> {
  const fieldErrors: Partial<Record<T, string>> = {};

  for (const message of messages) {
    const field = resolveFieldFromMessage(message, rules);
    if (field) {
      fieldErrors[field] = fieldErrors[field]
        ? `${fieldErrors[field]} ${message}`
        : message;
    }
  }

  return fieldErrors;
}

function mapStructuredFieldErrors<T extends string>(
  apiFieldErrors: Record<string, string[]>,
  fieldMap: Record<string, T>,
): Partial<Record<T, string>> {
  const mapped: Partial<Record<T, string>> = {};

  for (const [apiField, messages] of Object.entries(apiFieldErrors)) {
    const formField = fieldMap[apiField];
    if (formField && messages[0]) {
      mapped[formField] = messages[0];
    }
  }

  return mapped;
}

function mapApiFormError<T extends string>(
  error: ApiError,
  rules: FieldRule<T>[],
  fieldMap: Record<string, T>,
): { fieldErrors: Partial<Record<T, string>>; formError: string } {
  const fieldErrors =
    error.validationFailed.length > 0
      ? mapValidationFailed(error.validationFailed, rules)
      : mapStructuredFieldErrors(error.fieldErrors, fieldMap);

  const unmappedMessages = error.validationFailed.filter(
    (message) => !resolveFieldFromMessage(message, rules),
  );

  const formError =
    unmappedMessages.length > 0
      ? unmappedMessages.join(" ")
      : Object.keys(fieldErrors).length === 0
        ? error.message
        : "";

  return { fieldErrors, formError };
}

/** Urutan penting: field yang lebih spesifik dicek lebih dulu */
const REGISTER_MESSAGE_FIELD_RULES: FieldRule<keyof RegisterFormData>[] = [
  { field: "passwordConfirmation", keywords: ["password confirmation", "password_confirmation"] },
  { field: "username", keywords: ["username"] },
  { field: "email", keywords: ["email"] },
  { field: "password", keywords: ["password"] },
  { field: "role", keywords: ["role"] },
];

const LOGIN_MESSAGE_FIELD_RULES: FieldRule<keyof LoginFormData>[] = [
  { field: "username", keywords: ["username"] },
  { field: "password", keywords: ["password"] },
];

export function mapRegisterApiError(error: unknown): {
  fieldErrors: RegisterFormErrors;
  formError: string;
} {
  if (!(error instanceof ApiError)) {
    return {
      fieldErrors: {},
      formError: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }

  return mapApiFormError(error, REGISTER_MESSAGE_FIELD_RULES, REGISTER_FIELD_MAP);
}

export function mapLoginApiError(error: unknown): {
  fieldErrors: LoginFormErrors;
  formError: string;
} {
  if (!(error instanceof ApiError)) {
    return {
      fieldErrors: {},
      formError: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }

  return mapApiFormError(error, LOGIN_MESSAGE_FIELD_RULES, LOGIN_FIELD_MAP);
}