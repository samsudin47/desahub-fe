import { getDropdownUrl } from "@/config/env";
import { apiRequest } from "@/lib/api-client";
import { slugify } from "@/lib/slugify";
import type { DropdownKategori } from "@/types/dropdown-kategori";

type DropdownKategoriDatas = {
  kategori: DropdownKategori[];
};

const KATEGORI_PATH = "kategori";

export async function fetchDropdownKategori(): Promise<DropdownKategori[]> {
  const response = await apiRequest<DropdownKategoriDatas>(
    getDropdownUrl(KATEGORI_PATH),
    { method: "GET" },
  );

  return response.datas.kategori ?? [];
}

export function findDropdownKategoriBySlug(
  items: DropdownKategori[],
  slug: string,
): DropdownKategori | undefined {
  return items.find((item) => slugify(item.nama_kategori) === slug);
}
