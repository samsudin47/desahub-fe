export type ProductCategoryPenjual = {
  uuid: string;
  nama: string | null;
};

export type ProductCategoryProduct = {
  uuid: string;
  nama_produk: string;
  deskripsi: string;
  harga: number;
  rating: number | null;
  stock: number;
  gambar: string | null;
  penjual: ProductCategoryPenjual;
};

export type ProductCategoryDetail = {
  uuid: string;
  nama_kategori: string;
  total_produk: number;
  produk: ProductCategoryProduct[];
};
