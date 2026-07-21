import type { CartItem } from "@/data/marketplace";
import { mapCartItemApiToCartItem } from "@/lib/map-marketplace-cart";
import type { CheckoutDatas, CheckoutItemApi } from "@/types/checkout";

function mapCheckoutItemToCartItem(item: CheckoutItemApi): CartItem {
  return mapCartItemApiToCartItem({
    uuid: item.uuid,
    quantity: item.quantity,
    subtotal: item.subtotal,
    produk: item.produk,
  });
}

export function mapCheckoutDatasToItems(datas: CheckoutDatas): CartItem[] {
  return datas.items.map(mapCheckoutItemToCartItem);
}
