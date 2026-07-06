import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";
import { ApiError } from "@/types/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: URLSearchParams | FormData | Record<string, string>;
  headers?: HeadersInit;
  token?: string;
};

function buildBody(
  body: URLSearchParams | FormData | Record<string, string> | undefined,
): BodyInit | undefined {
  if (!body) return undefined;
  if (body instanceof URLSearchParams || body instanceof FormData) return body;
  return new URLSearchParams(body);
}

function getContentType(
  body: URLSearchParams | FormData | Record<string, string> | undefined,
): string | undefined {
  if (!body || body instanceof FormData) return undefined;
  return "application/x-www-form-urlencoded";
}

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function extractFieldErrors(payload: ApiErrorResponse | null): Record<string, string[]> {
  if (!payload?.errors) return {};
  return payload.errors;
}

function extractErrorMessage(
  payload: ApiErrorResponse | null,
  fallback: string,
): string {
  return (
    payload?.message ??
    payload?.description ??
    payload?.additionalInformation ??
    fallback
  );
}

export async function apiRequest<T>(
  url: string,
  options: RequestOptions = {},
): Promise<ApiSuccessResponse<T>> {
  const { method = "GET", body, headers = {}, token } = options;
  const contentType = getContentType(body);

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      ...(contentType ? { "Content-Type": contentType } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: buildBody(body),
  });

  const payload = await parseJson<ApiSuccessResponse<T> | ApiErrorResponse>(response);

  if (!response.ok || payload?.result === "error" || payload?.result === "failed") {
    const errorPayload = payload as ApiErrorResponse | null;
    throw new ApiError(
      extractErrorMessage(errorPayload, `Request failed (${response.status})`),
      response.status,
      {
        fieldErrors: extractFieldErrors(errorPayload),
        validationFailed: errorPayload?.validationFailed ?? [],
        code: errorPayload?.code,
      },
    );
  }

  return payload as ApiSuccessResponse<T>;
}
