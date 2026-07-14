export const API_PREFIXES = {
  iam: "api/v1/iam-services",
  dataManagement: "api/v1/data-management",
} as const;

export type ApiServiceKey = keyof typeof API_PREFIXES;
