import type { CartItem, Product } from "@/data/marketplace";
import type { CartDatas, CartItemApi } from "@/types/cart";

function mapCartItemToProduct(item: CartItemApi): Product {
  return {
    id: item.produk.uuid,
    name: item.produk.nama_produk,
    description: "",
    price: item.produk.harga,
    category: "fashion",
    seller: {
      id: item.produk.penjual.uuid,
      name: item.produk.penjual.nama,
      village: "",
      rating: 0,
      policy: "",
    },
    rating: 0,
    sold: 0,
    stock: item.produk.stock,
    imageColor: "#F3F4F6",
    imageUrl: item.produk.gambar || undefined,
  };
}

export function mapCartDatasToItems(datas: CartDatas): CartItem[] {
    return datas.items.map((item) => ({
      id: item.uuid,
      product: mapCartItemToProduct(item),
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));
}