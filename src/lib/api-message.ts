import type { ApiSuccessResponse } from "@/types/api";

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
