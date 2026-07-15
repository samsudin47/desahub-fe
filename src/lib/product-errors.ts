import { mapStructuredApiError } from "@/lib/api-form-errors";
import { ApiError } from "@/types/api";
import type { ProductFormErrors } from "@/types/product";

const FIELD_MAP = {
  nama_product: "nama_product",
  deskripsi: "deskripsi",
  harga: "harga",
  stock: "stock",
  uuid_kategori: "uuid_kategori",
  uuid_penjual: "uuid_penjual",
} as const satisfies Record<string, keyof ProductFormErrors>;

export function mapProductApiError(error: unknown): {
  fieldErrors: ProductFormErrors;
  formError: string;
  imageError: string | null;
} {
  const { fieldErrors, formError } = mapStructuredApiError(error, FIELD_MAP);
  const imageError =
    error instanceof ApiError ? (error.getFieldError("gambar") ?? null) : null;

  return { fieldErrors, formError, imageError };
}
