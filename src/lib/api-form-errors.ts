import { ApiError } from "@/types/api";

type FormErrorResult<T extends string> = {
  fieldErrors: Partial<Record<T, string>>;
  formError: string;
};

export function mapStructuredApiError<T extends string>(
  error: unknown,
  fieldMap: Record<string, T>,
  fallbackMessage = "Terjadi kesalahan. Silakan coba lagi.",
): FormErrorResult<T> {
  if (!(error instanceof ApiError)) {
    return { fieldErrors: {}, formError: fallbackMessage };
  }

  const fieldErrors: Partial<Record<T, string>> = {};

  for (const [apiField, formField] of Object.entries(fieldMap)) {
    const message = error.getFieldError(apiField);
    if (message) {
      fieldErrors[formField as T] = message;
    }
  }

  const formError =
    Object.keys(fieldErrors).length === 0 ? error.message : "";

  return { fieldErrors, formError };
}
