import { mapStructuredApiError } from "@/lib/api-form-errors";
import type { MasterBannerFormErrors } from "@/types/master-banner";

const FIELD_MAP = {
  title: "title",
  subtitle: "subtitle",
  gambar: "gambar",
} as const satisfies Record<string, keyof MasterBannerFormErrors>;

export function mapMasterBannerApiError(error: unknown): {
  fieldErrors: MasterBannerFormErrors;
  formError: string;
} {
  return mapStructuredApiError(error, FIELD_MAP);
}
