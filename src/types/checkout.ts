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
