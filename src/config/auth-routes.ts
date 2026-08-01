export const GUEST_ONLY_PATHS = [
  "/login",
  "/register",
  "/signin",
  "/signup",
  "/forgot-password",
  "/reset-password",
] as const;

export const AUTH_REQUIRED_PATHS = [
  "/marketplace-umkm/akun",
  "/marketplace-umkm/keranjang",
  "/marketplace-umkm/checkout",
  "/marketplace-umkm/pembayaran",
  "/marketplace-umkm/pesanan",
  "/marketplace-umkm/selesai",
] as const;

export const LOGIN_PATH = "/login";
export const REGISTER_PATH = "/register";
export const FORGOT_PASSWORD_PATH = "/forgot-password";
export const RESET_PASSWORD_PATH = "/reset-password";