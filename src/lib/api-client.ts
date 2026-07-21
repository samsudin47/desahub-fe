import { notifyUnauthorized } from "@/lib/auth-events";
import { getAuthToken } from "@/lib/auth-session";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";
import { ApiError } from "@/types/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?:
    | URLSearchParams
    | FormData
    | Record<string, string>
    | Record<string, unknown>
    | unknown[];
  headers?: HeadersInit;
  token?: string | null;
  skipAuthRedirect?: boolean;
};

function buildBody(
  body:
    | URLSearchParams
    | FormData
    | Record<string, string>
    | Record<string, unknown>
    | unknown[]
    | undefined,
): BodyInit | undefined {
  if (!body) return undefined;
  if (body instanceof URLSearchParams || body instanceof FormData) return body;
  if (
    Array.isArray(body) ||
    Object.values(body).some(
      (value) => typeof value !== "string" && value !== undefined,
    )
  ) {
    return JSON.stringify(body);
  }
  return new URLSearchParams(body);
}

function getContentType(
  body:
    | URLSearchParams
    | FormData
    | Record<string, string>
    | Record<string, unknown>
    | unknown[]
    | undefined,
): string | undefined {
  if (!body || body instanceof FormData) return undefined;
  if (
    Array.isArray(body) ||
    Object.values(body).some(
      (value) => typeof value !== "string" && value !== undefined,
    )
  ) {
    return "application/json";
  }
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

function shouldTriggerUnauthorized(
  response: Response,
  payload: ApiErrorResponse | null,
  hadToken: boolean,
  skipAuthRedirect: boolean,
): boolean {
  if (skipAuthRedirect || !hadToken) return false;
  return response.status === 401 || payload?.result === "unauthorized";
}

export async function apiRequest<T>(
  url: string,
  options: RequestOptions = {},
): Promise<ApiSuccessResponse<T>> {
  const { method = "GET", body, headers = {}, skipAuthRedirect = false } = options;
  const contentType = getContentType(body);
  const resolvedToken =
    options.token === null ? null : (options.token ?? getAuthToken());
  const hadToken = Boolean(resolvedToken);

  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      ...(contentType ? { "Content-Type": contentType } : {}),
      ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
      ...headers,
    },
    body: buildBody(body),
  });

  const payload = await parseJson<ApiSuccessResponse<T> | ApiErrorResponse>(response);

  if (
    shouldTriggerUnauthorized(
      response,
      payload as ApiErrorResponse | null,
      hadToken,
      skipAuthRedirect,
    )
  ) {
    notifyUnauthorized();
  }

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

  if (payload?.result === "unauthorized" || payload?.result === "forbidden") {
    const errorPayload = payload as ApiErrorResponse;
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
