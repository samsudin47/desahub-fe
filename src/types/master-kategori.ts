export type MasterKategori = {
  uuid: string;
  nama_kategori: string;
  deskripsi: string;
};

export type MasterKategoriFormData = {
  nama_kategori: string;
  deskripsi: string;
};

export type MasterKategoriFormErrors = Partial<
  Record<keyof MasterKategoriFormData, string>
>;
