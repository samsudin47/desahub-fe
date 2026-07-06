export type ProductCategory =
  | "makanan"
  | "minuman"
  | "kerajinan"
  | "pertanian"
  | "fashion"
  | "jasa";

export type OrderStatus =
  | "menunggu_pembayaran"
  | "diproses"
  | "dikirim"
  | "selesai"
  | "dibatalkan";

export interface Category {
  slug: ProductCategory;
  name: string;
  icon: string;
}

export interface Seller {
  id: string;
  name: string;
  village: string;
  rating: number;
  policy: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  seller: Seller;
  rating: number;
  sold: number;
  stock: number;
  imageColor: string;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
  shippingAddress: string;
  paymentMethod?: string;
}

export const categories: Category[] = [
  { slug: "makanan", name: "Makanan", icon: "🍚" },
  { slug: "minuman", name: "Minuman", icon: "🥤" },
  { slug: "kerajinan", name: "Kerajinan", icon: "🧺" },
  { slug: "pertanian", name: "Pertanian", icon: "🌾" },
  { slug: "fashion", name: "Fashion", icon: "👕" },
  { slug: "jasa", name: "Jasa", icon: "🛠️" },
];

const sellers: Seller[] = [
  {
    id: "toko-1",
    name: "Warung Bu Siti",
    village: "Desa Sukamaju",
    rating: 4.8,
    policy:
      "Pengiriman 1-2 hari kerja. Retur dalam 24 jam jika produk rusak.",
  },
  {
    id: "toko-2",
    name: "Kerajinan Pak Joko",
    village: "Desa Sukamaju",
    rating: 4.9,
    policy: "Produk handmade, waktu produksi 3-5 hari.",
  },
  {
    id: "toko-3",
    name: "Kebun Pak Budi",
    village: "Desa Sukamaju",
    rating: 4.7,
    policy: "Panen segar setiap hari. Gratis ongkir untuk pembelian di atas Rp 100.000.",
  },
  {
    id: "toko-4",
    name: "UMKM Ibu Rina",
    village: "Desa Sukamaju",
    rating: 4.6,
    policy: "Pembayaran via transfer bank. Konfirmasi dalam 1x24 jam.",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Keripik Singkong Pedas",
    description:
      "Keripik singkong homemade dengan bumbu pedas khas desa. Renyah dan tanpa pengawet.",
    price: 15000,
    category: "makanan",
    seller: sellers[0],
    rating: 4.8,
    sold: 234,
    stock: 50,
    imageColor: "#fef3c7",
    featured: true,
  },
  {
    id: "p2",
    name: "Dodol Durian Asli Tok Dalang",
    description: "Dodol durian asli dengan bahan baku lokal pilihan.",
    price: 25000,
    category: "makanan",
    seller: sellers[0],
    rating: 4.9,
    sold: 189,
    stock: 30,
    imageColor: "#fde68a",
    featured: true,
  },
  {
    id: "p3",
    name: "Jamu Kunyit Asam",
    description: "Jamu tradisional segar, dibuat setiap pagi.",
    price: 12000,
    category: "minuman",
    seller: sellers[0],
    rating: 4.7,
    sold: 156,
    stock: 40,
    imageColor: "#fef9c3",
    featured: true,
  },
  {
    id: "p4",
    name: "Teh Herbal Desa",
    description: "Campuran daun herbal organik dari kebun lokal.",
    price: 35000,
    category: "minuman",
    seller: sellers[3],
    rating: 4.6,
    sold: 98,
    stock: 25,
    imageColor: "#d1fae5",
    featured: true,
  },
  {
    id: "p5",
    name: "Anyaman Bambu Tok Dalang",
    description: "Keranjang anyaman bambu tangan, cocok untuk dekorasi.",
    price: 75000,
    category: "kerajinan",
    seller: sellers[1],
    rating: 4.9,
    sold: 67,
    stock: 15,
    imageColor: "#ecfccb",
    featured: true,
  },
  {
    id: "p6",
    name: "Tas Rotan Handmade",
    description: "Tas rotan anyaman tradisional dengan desain modern.",
    price: 120000,
    category: "kerajinan",
    seller: sellers[1],
    rating: 5.0,
    sold: 45,
    stock: 10,
    imageColor: "#fef3c7",
    featured: true,
  },
  {
    id: "p7",
    name: "Beras Organik 5kg",
    description: "Beras organik hasil panen petani lokal.",
    price: 85000,
    category: "pertanian",
    seller: sellers[2],
    rating: 4.8,
    sold: 312,
    stock: 100,
    imageColor: "#fef9c3",
    featured: true,
  },
  {
    id: "p8",
    name: "Sayur Paket Segar",
    description: "Paket sayur segar langsung dari kebun.",
    price: 20000,
    category: "pertanian",
    seller: sellers[2],
    rating: 4.7,
    sold: 278,
    stock: 35,
    imageColor: "#d1fae5",
    featured: true,
  },
  {
    id: "p9",
    name: "Batik Tulis Motif Desa",
    description: "Kain batik tulis dengan motif khas desa Sukamaju.",
    price: 350000,
    category: "fashion",
    seller: sellers[3],
    rating: 4.9,
    sold: 23,
    stock: 8,
    imageColor: "#e0e7ff",
  },
  {
    id: "p10",
    name: "Jasa Jahit Pakaian",
    description: "Jasa jahit pakaian custom oleh penjahit lokal berpengalaman.",
    price: 150000,
    category: "jasa",
    seller: sellers[3],
    rating: 4.8,
    sold: 56,
    stock: 99,
    imageColor: "#fce7f3",
  },
  {
    id: "p11",
    name: "Sambal Bawang Homemade",
    description: "Sambal bawang pedas dengan resep turun-temurun.",
    price: 18000,
    category: "makanan",
    seller: sellers[0],
    rating: 4.9,
    sold: 445,
    stock: 60,
    imageColor: "#fee2e2",
  },
  {
    id: "p12",
    name: "Madu Hutan Asli",
    description: "Madu murni dari lebah hutan sekitar desa.",
    price: 95000,
    category: "pertanian",
    seller: sellers[2],
    rating: 4.9,
    sold: 134,
    stock: 20,
    imageColor: "#fef3c7",
  },
];

export const mockOrders: Order[] = [
  {
    id: "ORD-2026-001",
    items: [
      { product: products[0], quantity: 2 },
      { product: products[2], quantity: 1 },
    ],
    status: "menunggu_pembayaran",
    total: 42000,
    createdAt: "2026-07-03T08:30:00",
    shippingAddress: "Jl. Merdeka No. 12, Desa Sukamaju",
  },
  {
    id: "ORD-2026-002",
    items: [{ product: products[4], quantity: 1 }],
    status: "diproses",
    total: 75000,
    createdAt: "2026-07-01T14:20:00",
    shippingAddress: "Jl. Merdeka No. 12, Desa Sukamaju",
    paymentMethod: "Transfer Bank",
  },
  {
    id: "ORD-2026-003",
    items: [{ product: products[6], quantity: 2 }],
    status: "dikirim",
    total: 170000,
    createdAt: "2026-06-28T10:00:00",
    shippingAddress: "Jl. Merdeka No. 12, Desa Sukamaju",
    paymentMethod: "GoPay",
  },
  {
    id: "ORD-2026-004",
    items: [{ product: products[1], quantity: 3 }],
    status: "selesai",
    total: 75000,
    createdAt: "2026-06-20T16:45:00",
    shippingAddress: "Jl. Merdeka No. 12, Desa Sukamaju",
    paymentMethod: "Transfer Bank",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  menunggu_pembayaran: "Menunggu Pembayaran",
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan",
};

export const paymentMethods = [
  { id: "bca", name: "Transfer Bank BCA", account: "1234567890 a.n. DesaHub" },
  { id: "bri", name: "Transfer Bank BRI", account: "0987654321 a.n. DesaHub" },
  { id: "ovo", name: "OVO", account: "0812-3456-7890" },
  { id: "gopay", name: "GoPay", account: "0812-3456-7890" },
];
