import { mapStructuredApiError } from "@/lib/api-form-errors";
import type { MasterPenjualFormErrors } from "@/types/master-penjual";

const FIELD_MAP = {
  nama_penjual: "nama_penjual",
  email: "email",
  no_hp: "no_hp",
  alamat: "alamat",
} as const satisfies Record<string, keyof MasterPenjualFormErrors>;

export function mapMasterPenjualApiError(error: unknown): {
  fieldErrors: MasterPenjualFormErrors;
  formError: string;
} {
  return mapStructuredApiError(error, FIELD_MAP);
}
