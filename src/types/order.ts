export type OrderListStatusFilter =
  | "all"
  | "draft"
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | (string & {});

export type OrderApiStatus =
  | "draft"
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | (string & {});

export type OrderProduk = {
  uuid: string;
  nama_produk: string;
  harga: number;
  gambar: string;
};

export type OrderItemApi = {
  uuid: string;
  quantity: number;
  harga_satuan: number;
  subtotal: number;
  produk: OrderProduk;
};

export type OrderListItem = {
  uuid: string;
  order_number: string;
  status: OrderApiStatus;
  status_label: string;
  total_item: number;
  total_harga: number;
  created_at: string;
  items: OrderItemApi[];
};
