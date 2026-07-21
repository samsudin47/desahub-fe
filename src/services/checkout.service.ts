import { getMarketplaceUmkmUrl } from "@/config/env";
import { getApiSuccessMessage } from "@/lib/api-message";
import { apiRequest } from "@/lib/api-client";
import type {
  CancelCheckoutDatas,
  CheckoutDatas,
  CreateCheckoutPayload,
} from "@/types/checkout";

export type CheckoutMutationResult<T> = {
  data: T;
  message: string;
};

const CART_CHECKOUT_PATH = "cart/checkout";
const CHECKOUT_PATH = "checkout";

export async function createCheckout(
  payload: CreateCheckoutPayload,
): Promise<CheckoutMutationResult<CheckoutDatas>> {
  const response = await apiRequest<CheckoutDatas>(
    getMarketplaceUmkmUrl(CART_CHECKOUT_PATH),
    {
      method: "POST",
      body: payload,
    },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}

export async function fetchCheckout(uuid: string): Promise<CheckoutDatas> {
  const response = await apiRequest<CheckoutDatas>(
    getMarketplaceUmkmUrl(`${CHECKOUT_PATH}/${uuid}`),
    { method: "GET" },
  );

  return response.datas;
}

export async function cancelCheckout(
  uuid: string,
): Promise<CheckoutMutationResult<CancelCheckoutDatas>> {
  const response = await apiRequest<CancelCheckoutDatas>(
    getMarketplaceUmkmUrl(`${CHECKOUT_PATH}/${uuid}/cancel`),
    { method: "POST" },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}
