import { ApiError, type ApiSuccessResponse } from "@/types/api";

type ApiMessageFields = Pick<
  ApiSuccessResponse<unknown>,
  "message" | "description" | "additionalInformation"
>;

export function getApiSuccessMessage(
  response: ApiMessageFields,
  fallback = "Operasi berhasil",
): string {
  return (
    response.message?.trim() ||
    response.description?.trim() ||
    response.additionalInformation?.trim() ||
    fallback
  );
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    const validationMessages = error.validationFailed
      .map((message) => message.trim())
      .filter(Boolean);

    if (validationMessages.length > 0) {
      return validationMessages.join(" ");
    }

    return error.message || fallback;
  }

  if (error instanceof Error) return error.message || fallback;
  return fallback;
}
