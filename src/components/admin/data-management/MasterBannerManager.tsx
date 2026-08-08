"use client";

import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useMasterBanner } from "@/hooks/useMasterBanner";
import { useModal } from "@/hooks/useModal";
import { mapMasterBannerApiError } from "@/lib/master-banner-errors";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  deleteMasterBanner,
  saveMasterBanner,
} from "@/services/master-banner.service";
import type {
  MasterBannerFormData,
  MasterBannerFormErrors,
} from "@/types/master-banner";
import { useEffect, useState } from "react";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const emptyForm: MasterBannerFormData = {
  title: "",
  subtitle: "",
};

export default function MasterBannerManager() {
  const { banner, isLoading, error, refetch } = useMasterBanner();
  const [form, setForm] = useState<MasterBannerFormData>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingGambarUrl, setExistingGambarUrl] = useState<string | null>(
    null,
  );
  const [fieldErrors, setFieldErrors] = useState<MasterBannerFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteModal = useModal();

  useEffect(() => {
    if (banner) {
      setForm({
        title: banner.title,
        subtitle: banner.subtitle,
      });
      setExistingGambarUrl(banner.gambar);
      setImagePreview(banner.gambar);
      setImageFile(null);
    } else {
      setForm(emptyForm);
      setExistingGambarUrl(null);
      setImagePreview(null);
      setImageFile(null);
    }
    setFieldErrors({});
    setFormError(null);
    setImageError(null);
  }, [banner]);

  const handleFormChange = (
    field: keyof MasterBannerFormData,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("File harus berupa gambar (JPG, PNG, dll.)");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Ukuran gambar maksimal 2MB");
      return;
    }

    setImageError(null);
    setFieldErrors((prev) => ({ ...prev, gambar: undefined }));
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.subtitle.trim()) return;

    if (!banner && !imageFile) {
      setImageError("Gambar banner wajib diupload");
      return;
    }

    if (banner && !imageFile && !existingGambarUrl) {
      setImageError("Gambar banner wajib diupload");
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    setImageError(null);

    try {
      const result = await saveMasterBanner({
        ...form,
        gambar: imageFile,
      });

      await refetch();
      showSuccessToast(result.message);
    } catch (err) {
      const { fieldErrors: apiFieldErrors, formError: apiFormError } =
        mapMasterBannerApiError(err);
      setFieldErrors(apiFieldErrors);
      setFormError(apiFormError);
      if (apiFieldErrors.gambar) {
        setImageError(apiFieldErrors.gambar);
      }
      if (apiFormError) {
        showErrorToast(apiFormError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!banner) return;

    setIsDeleting(true);

    try {
      const result = await deleteMasterBanner();
      await refetch();
      deleteModal.closeModal();
      showSuccessToast(result.message);
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Gagal menghapus banner",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const hasImage = Boolean(imageFile || existingGambarUrl);
  const isFormValid =
    form.title.trim().length > 0 &&
    form.subtitle.trim().length > 0 &&
    hasImage;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Master Banner
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isLoading
              ? "Memuat data..."
              : banner
                ? "Banner aktif — ubah lalu simpan untuk memperbarui"
                : "Belum ada banner — isi form lalu simpan"}
          </p>
        </div>
        {banner && (
          <Button
            size="sm"
            variant="outline"
            onClick={deleteModal.openModal}
            disabled={isLoading || isSubmitting}
            className="border-error-300 text-error-600 hover:bg-error-50 dark:border-error-700 dark:text-error-400"
          >
            Hapus Banner
          </Button>
        )}
      </div>

      {error && (
        <Alert variant="error" title="Gagal memuat data" message={error} />
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Memuat master banner...
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-8">
          {formError && (
            <div className="mb-4">
              <Alert
                variant="error"
                title="Gagal menyimpan"
                message={formError}
              />
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label>Judul</Label>
                <Input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  placeholder="Contoh: Dukung Produk Lokal, Bangun Desa"
                  error={Boolean(fieldErrors.title)}
                  hint={fieldErrors.title}
                />
              </div>

              <div>
                <Label>Subtitle</Label>
                <TextArea
                  value={form.subtitle}
                  onChange={(value) => handleFormChange("subtitle", value)}
                  placeholder="Deskripsi singkat banner"
                  rows={4}
                  error={Boolean(fieldErrors.subtitle)}
                  hint={fieldErrors.subtitle}
                />
              </div>
            </div>

            <div>
              <Label>Gambar Banner</Label>
              <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 transition hover:border-brand-400 hover:bg-brand-50/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-600">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {imagePreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview banner"
                      className="mb-3 max-h-40 w-full rounded-xl border border-gray-200 object-cover dark:border-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {banner
                        ? "Klik untuk ganti gambar"
                        : "Klik untuk upload ulang"}
                    </span>
                    {banner && !imageFile && (
                      <span className="mt-1 text-xs text-gray-500">
                        Gambar saat ini akan tetap digunakan jika tidak
                        diupload ulang
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <svg
                      className="mb-2 h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Klik untuk upload gambar
                    </span>
                    <span className="mt-1 text-xs text-gray-500">
                      PNG, JPG, WEBP · maks. 2MB
                    </span>
                  </>
                )}
              </label>
              {(imageError || fieldErrors.gambar) && (
                <p className="mt-2 text-sm text-error-600">
                  {imageError || fieldErrors.gambar}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting
                ? "Menyimpan..."
                : banner
                  ? "Simpan Perubahan"
                  : "Simpan Banner"}
            </Button>
          </div>
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        className="max-w-[420px] p-5 lg:p-8"
      >
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Hapus Banner
        </h4>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Yakin ingin menghapus banner{" "}
          <span className="font-medium text-gray-800 dark:text-white/90">
            {banner?.title}
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={deleteModal.closeModal}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-error-500 text-white ring-0 hover:bg-error-600 disabled:bg-error-300"
          >
            {isDeleting ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
