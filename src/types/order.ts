export type OrderListStatusFilter =
  | "all"
  | "draft"
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "failed"
  | "cancelled"
  | (string & {});

export type OrderApiStatus =
  | "draft"
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
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

export type OrderPembeli = {
  uuid: string;
  username: string;
  email: string;
};

export type OrderShippingInfo = {
  nama_penerima: string;
  no_hp_penerima: string;
  alamat_penerima: string;
  courier: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
  completed_at: string | null;
  cancel_reason: string | null;
};

export type OrderShipping = OrderShippingInfo | null;

export type OrderPayment = {
  order_id: string | null;
  payment_type: string | null;
  status: string | null;
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

export type AdminOrder = OrderListItem & {
  pembeli: OrderPembeli;
  shipping: OrderShipping;
  payment: OrderPayment;
};

export type ShipOrderPayload = {
  courier: string;
  tracking_number: string;
};

export type CancelOrderPayload = {
  reason: string;
};
