export interface ApiSuccessResponse<T> {
  result: "success";
  code: number;
  message: string;
  description: string;
  additionalInformation: string;
  datas: T;
}

export interface ApiErrorResponse {
  result?: "error" | "failed" | "unauthorized" | "forbidden";
  code?: number;
  message?: string;
  description?: string;
  additionalInformation?: string;
  errors?: Record<string, string[]>;
  validationFailed?: string[];
}

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string[]>;
  readonly validationFailed: string[];
  readonly code?: number;

  constructor(
    message: string,
    status: number,
    options: {
      fieldErrors?: Record<string, string[]>;
      validationFailed?: string[];
      code?: number;
    } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = options.fieldErrors ?? {};
    this.validationFailed = options.validationFailed ?? [];
    this.code = options.code;
  }

  getFieldError(field: string): string | undefined {
    return this.fieldErrors[field]?.[0];
  }
}
