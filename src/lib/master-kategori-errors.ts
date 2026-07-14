import { mapStructuredApiError } from "@/lib/api-form-errors";
import type { MasterKategoriFormErrors } from "@/types/master-kategori";

const FIELD_MAP = {
  nama_kategori: "nama_kategori",
  deskripsi: "deskripsi",
} as const satisfies Record<string, keyof MasterKategoriFormErrors>;

export function mapMasterKategoriApiError(error: unknown): {
  fieldErrors: MasterKategoriFormErrors;
  formError: string;
} {
  return mapStructuredApiError(error, FIELD_MAP);
}
