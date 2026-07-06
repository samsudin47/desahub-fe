"use client";

import { useState } from "react";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { Modal } from "@/components/ui/modal";
import SellersTable from "@/components/admin/marketplace/SellersTable";
import { getUniqueSellers, type Seller } from "@/data/marketplace";
import { useModal } from "@/hooks/useModal";

type SellerFormData = {
  name: string;
  village: string;
  rating: string;
  policy: string;
};

const emptyForm: SellerFormData = {
  name: "",
  village: "Desa Sukamaju",
  rating: "4.5",
  policy: "",
};

export default function SellersManager() {
  const [sellers, setSellers] = useState<Seller[]>(() => getUniqueSellers());
  const [form, setForm] = useState<SellerFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingSeller, setDeletingSeller] = useState<Seller | null>(null);

  const formModal = useModal();
  const deleteModal = useModal();

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    formModal.openModal();
  };

  const openEditModal = (seller: Seller) => {
    setEditingId(seller.id);
    setForm({
      name: seller.name,
      village: seller.village,
      rating: seller.rating.toString(),
      policy: seller.policy,
    });
    formModal.openModal();
  };

  const openDeleteModal = (seller: Seller) => {
    setDeletingSeller(seller);
    deleteModal.openModal();
  };

  const handleFormChange = (field: keyof SellerFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.village.trim()) return;

    const sellerData: Seller = {
      id: editingId ?? `toko-${Date.now()}`,
      name: form.name.trim(),
      village: form.village.trim(),
      rating: Math.min(5, Math.max(0, parseFloat(form.rating) || 0)),
      policy: form.policy.trim() || "Kebijakan toko belum diatur.",
    };

    if (editingId) {
      setSellers((prev) =>
        prev.map((s) => (s.id === editingId ? sellerData : s)),
      );
    } else {
      setSellers((prev) => [...prev, sellerData]);
    }

    formModal.closeModal();
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = () => {
    if (!deletingSeller) return;
    setSellers((prev) => prev.filter((s) => s.id !== deletingSeller.id));
    deleteModal.closeModal();
    setDeletingSeller(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Penjual UMKM
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {sellers.length} UMKM aktif di marketplace desa
          </p>
        </div>
        <Button size="sm" onClick={openAddModal}>
          + Tambah Toko
        </Button>
      </div>

      <SellersTable
        sellers={sellers}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModal}
        className="max-w-[520px] p-5 lg:p-8"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId ? "Edit Toko" : "Tambah Toko"}
        </h4>

        <div className="space-y-4">
          <div>
            <Label>Nama Toko</Label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="Contoh: Warung Bu Siti"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>

          <div>
            <Label>Desa</Label>
            <input
              type="text"
              value={form.village}
              onChange={(e) => handleFormChange("village", e.target.value)}
              placeholder="Desa Sukamaju"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>

          <div>
            <Label>Rating (0–5)</Label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={(e) => handleFormChange("rating", e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>

          <div>
            <Label>Kebijakan Toko</Label>
            <textarea
              value={form.policy}
              onChange={(e) => handleFormChange("policy", e.target.value)}
              placeholder="Kebijakan pengiriman, retur, dll."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button size="sm" variant="outline" onClick={formModal.closeModal}>
            Batal
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!form.name.trim() || !form.village.trim()}
          >
            {editingId ? "Simpan Perubahan" : "Tambah Toko"}
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        className="max-w-[420px] p-5 lg:p-8"
      >
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Hapus Toko
        </h4>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Yakin ingin menghapus{" "}
          <span className="font-medium text-gray-800 dark:text-white/90">
            {deletingSeller?.name}
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
