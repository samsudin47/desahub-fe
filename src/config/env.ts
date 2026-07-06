export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? "",
  iamPrefix: process.env.NEXT_PUBLIC_IAM_PREFIX ?? "",
} as const;

export function getIamUrl(path: string): string {
  if (!env.apiBaseUrl || !env.iamPrefix) {
    throw new Error(
      "NEXT_PUBLIC_API_URL dan NEXT_PUBLIC_IAM_PREFIX harus dikonfigurasi di file .env",
    );
  }

  const base = env.apiBaseUrl.replace(/\/$/, "");
  const prefix = env.iamPrefix.replace(/^\/|\/$/g, "");
  const normalizedPath = path.replace(/^\//, "");
  return `${base}/${prefix}/${normalizedPath}`;
}
