"use client";

import { useState } from "react";
import Button from "@/components/ui/button/Button";
import FormSelect from "@/components/ui/select/FormSelect";
import ScrollArea from "@/components/ui/scroll-area/ScrollArea";
import Label from "@/components/form/Label";
import { Modal } from "@/components/ui/modal";
import ProductsTable from "@/components/admin/marketplace/ProductsTable";
import {
  categories,
  getUniqueSellers,
  products as initialProducts,
  type Product,
  type ProductCategory,
  type Seller,
} from "@/data/marketplace";
import { useModal } from "@/hooks/useModal";

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  category: ProductCategory;
  sellerId: string;
  stock: string;
  imageUrl: string;
  featured: boolean;
};

const DEFAULT_IMAGE_COLOR = "#fef3c7";
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const inputClass =
  "h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

function getEmptyForm(sellers: Seller[]): ProductFormData {
  return {
    name: "",
    description: "",
    price: "",
    category: "makanan",
    sellerId: sellers[0]?.id ?? "",
    stock: "10",
    imageUrl: "",
    featured: false,
  };
}

export default function ProductsManager() {
  const sellers = getUniqueSellers();
  const [productList, setProductList] = useState<Product[]>(() => [
    ...initialProducts,
  ]);
  const [form, setForm] = useState<ProductFormData>(() => getEmptyForm(sellers));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const formModal = useModal();
  const deleteModal = useModal();

  const lowStock = productList.filter((p) => p.stock < 20).length;

  const openAddModal = () => {
    setEditingId(null);
    setForm(getEmptyForm(sellers));
    setImageError(null);
    formModal.openModal();
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      sellerId: product.seller.id,
      stock: product.stock.toString(),
      imageUrl: product.imageUrl ?? "",
      featured: product.featured ?? false,
    });
    setImageError(null);
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
    const reader = new FileReader();
    reader.onload = () => {
      handleFormChange("imageUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    handleFormChange("imageUrl", "");
    setImageError(null);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price || !form.sellerId) return;

    const seller = sellers.find((s) => s.id === form.sellerId);
    if (!seller) return;

    const existing = editingId
      ? productList.find((p) => p.id === editingId)
      : undefined;

    const productData: Product = {
      id: editingId ?? `p${Date.now()}`,
      name: form.name.trim(),
      description:
        form.description.trim() || "Deskripsi produk belum diisi.",
      price: Math.max(0, parseInt(form.price, 10) || 0),
      category: form.category,
      seller,
      rating: existing?.rating ?? 4.5,
      sold: existing?.sold ?? 0,
      stock: Math.max(0, parseInt(form.stock, 10) || 0),
      imageColor: existing?.imageColor ?? DEFAULT_IMAGE_COLOR,
      imageUrl: form.imageUrl || undefined,
      featured: form.featured,
    };

    if (editingId) {
      setProductList((prev) =>
        prev.map((p) => (p.id === editingId ? productData : p)),
      );
    } else {
      setProductList((prev) => [...prev, productData]);
    }

    formModal.closeModal();
    setForm(getEmptyForm(sellers));
    setEditingId(null);
  };

  const handleDelete = () => {
    if (!deletingProduct) return;
    setProductList((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    deleteModal.closeModal();
    setDeletingProduct(null);
  };

  const isFormValid =
    form.name.trim() && form.price && form.sellerId && form.stock;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Daftar Produk
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {productList.length} produk terdaftar
            {lowStock > 0 && ` · ${lowStock} produk stok rendah`}
          </p>
        </div>
        <Button size="sm" onClick={openAddModal}>
          + Tambah Produk
        </Button>
      </div>

      <ProductsTable
        products={productList}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModal}
        className="flex max-h-[85vh] max-w-[600px] flex-col p-5 lg:p-8"
      >
        <h4 className="mb-4 shrink-0 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId ? "Edit Produk" : "Tambah Produk"}
        </h4>

        <ScrollArea className="h-[min(56vh,calc(85vh-10rem))]" viewportClassName="pr-3">
          <div className="space-y-4 pb-1">
          <div>
            <Label>Nama Produk</Label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="Contoh: Keripik Singkong Pedas"
              className={inputClass}
            />
          </div>

          <div>
            <Label>Deskripsi</Label>
            <textarea
              value={form.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              placeholder="Deskripsi singkat produk"
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Harga (Rp)</Label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => handleFormChange("price", e.target.value)}
                placeholder="15000"
                className={inputClass}
              />
            </div>
            <div>
              <Label>Stok</Label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => handleFormChange("stock", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormSelect
              label="Kategori"
              value={form.category}
              onChange={(value) =>
                handleFormChange("category", value as ProductCategory)
              }
              options={categories.map((cat) => ({
                value: cat.slug,
                label: `${cat.icon} ${cat.name}`,
              }))}
            />
            <FormSelect
              label="Penjual"
              value={form.sellerId}
              onChange={(value) => handleFormChange("sellerId", value)}
              options={sellers.map((seller) => ({
                value: seller.id,
                label: seller.name,
              }))}
              placeholder="Pilih penjual"
            />
          </div>

          <div>
            <Label>Gambar Produk</Label>
            {form.imageUrl ? (
              <div className="flex items-start gap-4">
                <img
                  src={form.imageUrl}
                  alt="Preview produk"
                  className="h-28 w-28 rounded-xl border border-gray-200 object-cover dark:border-gray-700"
                />
                <div className="flex flex-col gap-2">
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    Ganti Gambar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="text-sm text-error-600 hover:text-error-700 dark:text-error-400"
                  >
                    Hapus Gambar
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-brand-400 hover:bg-brand-50/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-brand-600">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
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
              </label>
            )}
            {imageError && (
              <p className="mt-2 text-sm text-error-600">{imageError}</p>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => handleFormChange("featured", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Tandai sebagai produk unggulan
            </span>
          </label>
          </div>
        </ScrollArea>

        <div className="mt-6 flex shrink-0 justify-end gap-3">
          <Button size="sm" variant="outline" onClick={formModal.closeModal}>
            Batal
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!isFormValid}>
            {editingId ? "Simpan Perubahan" : "Tambah Produk"}
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
            {deletingProduct?.name}
          </span>
          ? Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={deleteModal.closeModal}>
            Batal
          </Button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-error-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-error-600"
          >
            Hapus
          </button>
        </div>
      </Modal>
    </div>
  );
}
