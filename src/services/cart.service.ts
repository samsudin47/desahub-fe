import { getMarketplaceUmkmUrl } from "@/config/env";
import { getApiSuccessMessage } from "@/lib/api-message";
import { apiRequest } from "@/lib/api-client";
import type { AddCartItemPayload, CartDatas } from "@/types/cart";

export type CartMutationResult = {
  data: CartDatas;
  message: string;
};

const CART_ITEMS_PATH = "cart/items";
const CART_PATH = "cart";

export async function fetchCart(): Promise<CartDatas> {
    const response = await apiRequest<CartDatas>(
      getMarketplaceUmkmUrl(CART_PATH),
      { method: "GET" },
    );
    return response.datas;
}

export async function addCartItem(
  payload: AddCartItemPayload,
): Promise<CartMutationResult> {
  const response = await apiRequest<CartDatas>(
    getMarketplaceUmkmUrl(CART_ITEMS_PATH),
    {
      method: "POST",
      body: {
        uuid_product: payload.uuid_product,
        quantity: String(payload.quantity ?? 1),
      },
    },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}

export async function removeCartItem(
  cartItemId: string,
): Promise<CartMutationResult> {
  const response = await apiRequest<CartDatas>(
    getMarketplaceUmkmUrl(`${CART_ITEMS_PATH}/${cartItemId}`),
    { method: "DELETE" },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}

export async function increaseCartItem(
  cartItemId: string,
): Promise<CartMutationResult> {
  const response = await apiRequest<CartDatas>(
    getMarketplaceUmkmUrl(`${CART_ITEMS_PATH}/${cartItemId}/plus`),
    { method: "POST" },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}

export async function decreaseCartItem(
  cartItemId: string,
): Promise<CartMutationResult> {
  const response = await apiRequest<CartDatas>(
    getMarketplaceUmkmUrl(`${CART_ITEMS_PATH}/${cartItemId}/minus`),
    { method: "POST" },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}