export const API_PREFIXES = {
  iam: "api/v1/iam-services",
  dataManagement: "api/v1/data-management",
  marketplace: "api/v1/marketplace-service",
} as const;

export type ApiServiceKey = keyof typeof API_PREFIXES;
