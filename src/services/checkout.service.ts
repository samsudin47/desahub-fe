import { getMarketplaceUmkmUrl } from "@/config/env";
import { getApiSuccessMessage } from "@/lib/api-message";
import { apiRequest } from "@/lib/api-client";
import type {
  CancelCheckoutDatas,
  CheckoutDatas,
  CheckoutPaymentDatas,
  CheckoutShippingDatas,
  CheckoutShippingPayload,
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

export async function fetchCheckoutShipping(
  uuid: string,
): Promise<CheckoutShippingDatas> {
  const response = await apiRequest<CheckoutShippingDatas>(
    getMarketplaceUmkmUrl(`${CHECKOUT_PATH}/${uuid}/shipping`),
    { method: "GET" },
  );

  return response.datas;
}

export async function updateCheckoutShipping(
  uuid: string,
  payload: CheckoutShippingPayload,
): Promise<CheckoutMutationResult<CheckoutShippingDatas>> {
  const response = await apiRequest<CheckoutShippingDatas>(
    getMarketplaceUmkmUrl(`${CHECKOUT_PATH}/${uuid}/shipping`),
    {
      method: "PUT",
      body: payload,
    },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}

export async function createCheckoutPayment(
  uuid: string,
): Promise<CheckoutMutationResult<CheckoutPaymentDatas>> {
  const response = await apiRequest<CheckoutPaymentDatas>(
    getMarketplaceUmkmUrl(`${CHECKOUT_PATH}/${uuid}/pay`),
    { method: "POST" },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}

export async function fetchCheckoutPayment(
  uuid: string,
): Promise<CheckoutPaymentDatas> {
  const response = await apiRequest<CheckoutPaymentDatas>(
    getMarketplaceUmkmUrl(`${CHECKOUT_PATH}/${uuid}/payment`),
    { method: "GET" },
  );

  return response.datas;
}
