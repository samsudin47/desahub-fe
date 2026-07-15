import { getMarketplaceUrl } from "@/config/env";
import { getApiSuccessMessage } from "@/lib/api-message";
import { apiRequest } from "@/lib/api-client";
import type { Product, ProductFormData } from "@/types/product";

type ProductListDatas = {
  product: Product[];
};

export type ProductMutationResult<T> = {
  data: T;
  message: string;
};

export type ProductSubmitData = ProductFormData & {
  gambar?: File | File[] | null;
};

const PRODUCT_PATH = "product";

function toFormData(data: ProductSubmitData): FormData {
  const formData = new FormData();
  formData.append("nama_product", data.nama_product.trim());
  formData.append("deskripsi", data.deskripsi.trim());
  formData.append("harga", data.harga.trim());
  formData.append("stock", data.stock.trim());
  formData.append("uuid_kategori", data.uuid_kategori);
  formData.append("uuid_penjual", data.uuid_penjual);

  if (data.gambar) {
    const files = Array.isArray(data.gambar) ? data.gambar : [data.gambar];
    for (const file of files) {
      formData.append("gambar", file);
    }
  }

  return formData;
}

export async function fetchProductList(): Promise<Product[]> {
  const response = await apiRequest<ProductListDatas>(
    getMarketplaceUrl(PRODUCT_PATH),
    { method: "GET" },
  );

  return response.datas.product ?? [];
}

export async function fetchProductByUuid(uuid: string): Promise<Product> {
  const response = await apiRequest<Product>(
    getMarketplaceUrl(`${PRODUCT_PATH}/${uuid}`),
    { method: "GET" },
  );

  return response.datas;
}

export async function createProduct(
  data: ProductSubmitData,
): Promise<ProductMutationResult<Product>> {
  const response = await apiRequest<Product>(
    getMarketplaceUrl(PRODUCT_PATH),
    {
      method: "POST",
      body: toFormData(data),
    },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}

export async function updateProduct(
  uuid: string,
  data: ProductSubmitData,
): Promise<ProductMutationResult<Product>> {
  const response = await apiRequest<Product>(
    getMarketplaceUrl(`${PRODUCT_PATH}/${uuid}`),
    {
      method: "POST",
      body: toFormData(data),
    },
  );

  return {
    data: response.datas,
    message: getApiSuccessMessage(response),
  };
}

export async function deleteProduct(uuid: string): Promise<{ message: string }> {
  const response = await apiRequest<unknown[]>(
    getMarketplaceUrl(`${PRODUCT_PATH}/${uuid}`),
    { method: "DELETE" },
  );

  return {
    message: getApiSuccessMessage(response),
  };
}
