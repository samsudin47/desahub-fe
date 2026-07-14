export type MasterPenjual = {
  uuid: string;
  nama_penjual: string;
  email: string;
  no_hp: string;
  alamat: string;
};

export type MasterPenjualFormData = {
  nama_penjual: string;
  email: string;
  no_hp: string;
  alamat: string;
};

export type MasterPenjualFormErrors = Partial<
  Record<keyof MasterPenjualFormData, string>
>;
