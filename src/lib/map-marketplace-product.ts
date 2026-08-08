import type { Product, ProductCategory, Seller } from "@/data/marketplace";
import type { ProductCategoryProduct } from "@/types/product-category";

const KNOWN_CATEGORIES: ProductCategory[] = [
  "makanan",
  "minuman",
  "kerajinan",
  "pertanian",
  "fashion",
  "jasa",
];

function toProductCategory(slug: string): ProductCategory {
  return KNOWN_CATEGORIES.includes(slug as ProductCategory)
    ? (slug as ProductCategory)
    : "makanan";
}

function toSeller(item: ProductCategoryProduct): Seller {
  return {
    id: item.penjual.uuid,
    name: item.penjual.nama ?? "Penjual",
    village: "",
    rating: 0,
    policy: "",
  };
}

export function mapToMarketplaceProduct(
  item: ProductCategoryProduct & { total_terjual?: number },
  categorySlug = "makanan",
): Product {
  return {
    id: item.uuid,
    name: item.nama_produk,
    description: item.deskripsi,
    price: item.harga,
    category: toProductCategory(categorySlug),
    seller: toSeller(item),
    rating: item.rating ?? 0,
    sold: item.total_terjual ?? 0,
    stock: item.stock,
    imageColor: "#F3F4F6",
    imageUrl: item.gambar ?? undefined,
  };
}
