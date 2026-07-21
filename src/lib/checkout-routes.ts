export const CHECKOUT_FLOW_PREFIXES = [
  "/marketplace-umkm/checkout",
  "/marketplace-umkm/pembayaran",
  "/marketplace-umkm/selesai",
] as const;

export function isCheckoutFlowPath(path: string): boolean {
  return CHECKOUT_FLOW_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

export function getCheckoutPagePath(uuid: string): string {
  return `/marketplace-umkm/checkout/${uuid}`;
}

export function getPembayaranPagePath(uuid: string): string {
  return `/marketplace-umkm/pembayaran/${uuid}`;
}

export const ACTIVE_CHECKOUT_STORAGE_KEY = "desahub_active_checkout_uuid";

export const CART_PAGE_PATH = "/marketplace-umkm/keranjang";
