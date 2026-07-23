import type { CartDatas, CartProduk } from "@/types/cart";

export type CheckoutStatus = "pending" | "cancelled" | string;

export type CheckoutItemApi = {
  uuid: string;
  quantity: number;
  harga_satuan: number;
  subtotal: number;
  produk: CartProduk;
};

export type CheckoutDatas = {
  uuid: string;
  status: CheckoutStatus;
  total_item: number;
  total_harga: number;
  items: CheckoutItemApi[];
};

export type CreateCheckoutPayload = {
  cart_item_uuids: string[];
};

export type CancelCheckoutDatas = {
  checkout: CheckoutDatas;
  cart: CartDatas;
};

export type CheckoutShippingPayload = {
  nama_penerima: string;
  no_hp_penerima: string;
  alamat_penerima: string;
  latitude: number;
  longitude: number;
};

export type CheckoutShippingDatas = {
  uuid: string;
  uuid_checkout: string;
  nama_penerima: string;
  no_hp_penerima: string;
  alamat_penerima: string;
  latitude: string;
  longitude: string;
};

export type CheckoutPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "cancelled"
  | string;

export type CheckoutPaymentDatas = {
  uuid: string;
  uuid_checkout: string;
  order_id: string;
  snap_token: string;
  client_key: string;
  is_production: boolean;
  gross_amount: number;
  payment_type: string | null;
  bank: string | null;
  va_number: string | null;
  bill_key: string | null;
  biller_code: string | null;
  transaction_status: string | null;
  status: CheckoutPaymentStatus;
  expired_at: string | null;
  paid_at: string | null;
};
