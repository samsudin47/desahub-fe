export type MasterBanner = {
  uuid: string;
  title: string;
  subtitle: string;
  gambar: string;
};

export type MasterBannerFormData = {
  title: string;
  subtitle: string;
};

export type MasterBannerSubmitData = MasterBannerFormData & {
  gambar?: File | null;
};

export type MasterBannerFormErrors = Partial<
  Record<keyof MasterBannerFormData | "gambar", string>
>;
