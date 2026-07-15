"use client";

import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import ProductsTable from "@/components/admin/marketplace/ProductsTable";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import FormSelect from "@/components/ui/select/FormSelect";
import ScrollArea from "@/components/ui/scroll-area/ScrollArea";
import { Modal } from "@/components/ui/modal";
import { useMasterKategoriList } from "@/hooks/useMasterKategoriList";
import { useMasterPenjualList } from "@/hooks/useMasterPenjualList";
import { useProductList } from "@/hooks/useProductList";
import { useModal } from "@/hooks/useModal";
import { mapProductApiError } from "@/lib/product-errors";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/services/product.service";
import type { Product, ProductFormData, ProductFormErrors } from "@/types/product";
import { useState } from "react";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

function getEmptyForm(
  uuidKategori: string,
  uuidPenjual: string,
): ProductFormData {
  return {
    nama_product: "",
    deskripsi: "",
    harga: "",
    stock: "10",
    uuid_kategori: uuidKategori,
    uuid_penjual: uuidPenjual,
  };
}

export default function ProductsManager() {
  const { items, isLoading, error, refetch } = useProductList();
  const {
    items: kategoriList,
    isLoading: isKategoriLoading,
    error: kategoriError,
  } = useMasterKategoriList();
  const {
    items: penjualList,
    isLoading: isPenjualLoading,
    error: penjualError,
  } = useMasterPenjualList();

  const [form, setForm] = useState<ProductFormData>(() =>
    getEmptyForm("", ""),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingGambarUrl, setExistingGambarUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ProductFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formModal = useModal();
  const deleteModal = useModal();

  const isDropdownLoading = isKategoriLoading || isPenjualLoading;
  const dropdownError = kategoriError ?? penjualError;
  const lowStock = items.filter((p) => p.stock < 20).length;

  const resetFormState = () => {
    setForm(getEmptyForm(kategoriList[0]?.uuid ?? "", penjualList[0]?.uuid ?? ""));
    setEditingId(null);
    setImageFiles([]);
    setExistingGambarUrl("");
    setImagePreview("");
    setImageError(null);
    setFieldErrors({});
    setFormError(null);
  };

  const openAddModal = () => {
    resetFormState();
    formModal.openModal();
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.uuid);
    setForm({
      nama_product: product.nama_product,
      deskripsi: product.deskripsi,
      harga: product.harga.toString(),
      stock: product.stock.toString(),
      uuid_kategori: product.uuid_kategori,
      uuid_penjual: product.uuid_penjual,
    });
    setImageFiles([]);
    setExistingGambarUrl(product.gambar);
    setImagePreview(product.gambar);
    setImageError(null);
    setFieldErrors({});
    setFormError(null);
    formModal.openModal();
  };

  const openDeleteModal = (product: Product) => {
    setDeletingProduct(product);
    deleteModal.openModal();
  };

  const handleFormChange = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K],
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
    setImageFiles([file]);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!form.nama_product.trim() || !form.harga || !form.uuid_penjual) return;

    if (!editingId && imageFiles.length === 0) {
      setImageError("Gambar produk wajib diupload");
      return;
    }

    if (editingId && imageFiles.length === 0 && !existingGambarUrl) {
      setImageError("Gambar produk wajib diupload");
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);
    setImageError(null);

    try {
      const payload = {
        ...form,
        gambar: imageFiles.length > 0 ? imageFiles : null,
      };

      const result = editingId
        ? await updateProduct(editingId, payload)
        : await createProduct(payload);

      await refetch();
      formModal.closeModal();
      resetFormState();
      showSuccessToast(result.message);
    } catch (err) {
      const {
        fieldErrors: apiFieldErrors,
        formError: apiFormError,
        imageError: apiImageError,
      } = mapProductApiError(err);
      setFieldErrors(apiFieldErrors);
      setFormError(apiFormError);
      setImageError(apiImageError);
      if (apiFormError) {
        showErrorToast(apiFormError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    setIsDeleting(true);

    try {
      const result = await deleteProduct(deletingProduct.uuid);
      await refetch();
      deleteModal.closeModal();
      setDeletingProduct(null);
      showSuccessToast(result.message);
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Gagal menghapus produk",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const isFormValid =
    form.nama_product.trim() &&
    form.harga &&
    form.stock &&
    form.uuid_kategori &&
    form.uuid_penjual &&
    (imageFiles.length > 0 || Boolean(existingGambarUrl));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daftar Produk
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isLoading
              ? "Memuat data..."
              : `${items.length} produk terdaftar`}
            {!isLoading && lowStock > 0 && ` · ${lowStock} produk stok rendah`}
          </p>
        </div>
        <Button
          size="sm"
          onClick={openAddModal}
          disabled={isLoading || isDropdownLoading}
        >
          + Tambah Produk
        </Button>
      </div>

      {error && (
        <Alert variant="error" title="Gagal memuat data" message={error} />
      )}

      {dropdownError && (
        <Alert
          variant="error"
          title="Gagal memuat data referensi"
          message={dropdownError}
        />
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Memuat daftar produk...
          </p>
        </div>
      ) : (
        <ProductsTable
          products={items}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModal}
        className="flex max-h-[85vh] max-w-[600px] flex-col p-5 lg:p-8"
      >
        <h4 className="mb-4 shrink-0 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId ? "Edit Produk" : "Tambah Produk"}
        </h4>

        {formError && (
          <div className="mb-4 shrink-0">
            <Alert variant="error" title="Gagal menyimpan" message={formError} />
          </div>
        )}

        <ScrollArea className="h-[min(56vh,calc(85vh-10rem))]" viewportClassName="pr-3">
          <div className="space-y-4 pb-1">
            <div>
              <Label>Nama Produk</Label>
              <Input
                type="text"
                value={form.nama_product}
                onChange={(e) =>
                  handleFormChange("nama_product", e.target.value)
                }
                placeholder="Contoh: Ayam Cabe Ijo"
                error={Boolean(fieldErrors.nama_product)}
                hint={fieldErrors.nama_product}
              />
            </div>

            <div>
              <Label>Deskripsi</Label>
              <TextArea
                value={form.deskripsi}
                onChange={(value) => handleFormChange("deskripsi", value)}
                placeholder="Deskripsi singkat produk"
                rows={3}
                error={Boolean(fieldErrors.deskripsi)}
                hint={fieldErrors.deskripsi}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Harga (Rp)</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.harga}
                  onChange={(e) => handleFormChange("harga", e.target.value)}
                  placeholder="15000"
                  error={Boolean(fieldErrors.harga)}
                  hint={fieldErrors.harga}
                />
              </div>
              <div>
                <Label>Stok</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => handleFormChange("stock", e.target.value)}
                  error={Boolean(fieldErrors.stock)}
                  hint={fieldErrors.stock}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormSelect
                label="Kategori"
                value={form.uuid_kategori}
                onChange={(value) => handleFormChange("uuid_kategori", value)}
                options={kategoriList.map((kategori) => ({
                  value: kategori.uuid,
                  label: kategori.nama_kategori,
                }))}
                placeholder={
                  isKategoriLoading ? "Memuat kategori..." : "Pilih kategori"
                }
                disabled={isKategoriLoading || kategoriList.length === 0}
                error={fieldErrors.uuid_kategori}
              />
              <FormSelect
                label="Penjual"
                value={form.uuid_penjual}
                onChange={(value) => handleFormChange("uuid_penjual", value)}
                options={penjualList.map((penjual) => ({
                  value: penjual.uuid,
                  label: penjual.nama_penjual,
                }))}
                placeholder={
                  isPenjualLoading ? "Memuat penjual..." : "Pilih penjual"
                }
                disabled={isPenjualLoading || penjualList.length === 0}
                error={fieldErrors.uuid_penjual}
              />
            </div>

            <div>
              <Label>Gambar Produk</Label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 transition hover:border-brand-400 hover:bg-brand-50/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-600">
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
                      alt="Preview produk"
                      className="mb-3 h-28 w-28 rounded-xl border border-gray-200 object-cover dark:border-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {editingId
                        ? "Klik untuk upload gambar baru"
                        : "Klik untuk ganti gambar"}
                    </span>
                    {editingId && imageFiles.length === 0 && (
                      <span className="mt-1 text-xs text-gray-500">
                        Gambar saat ini akan tetap digunakan jika tidak diupload
                        ulang
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
              {imageError && (
                <p className="mt-2 text-sm text-error-600">{imageError}</p>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="mt-6 flex shrink-0 justify-end gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={formModal.closeModal}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isFormValid || isSubmitting || isDropdownLoading}
          >
            {isSubmitting
              ? "Menyimpan..."
              : editingId
                ? "Simpan Perubahan"
                : "Tambah Produk"}
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        className="max-w-[420px] p-5 lg:p-8"
      >
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Hapus Produk
        </h4>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Yakin ingin menghapus{" "}
          <span className="font-medium text-gray-800 dark:text-white/90">
            {deletingProduct?.nama_product}
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
