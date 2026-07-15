export type Product = {
  uuid: string;
  nama_product: string;
  deskripsi: string;
  harga: number;
  stock: number;
  gambar: string;
  uuid_kategori: string;
  nama_kategori: string;
  uuid_penjual: string;
  nama_penjual: string;
};

export type ProductFormData = {
  nama_product: string;
  deskripsi: string;
  harga: string;
  stock: string;
  uuid_kategori: string;
  uuid_penjual: string;
};

export type ProductFormErrors = Partial<Record<keyof ProductFormData, string>>;
