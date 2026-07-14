"use client";

import MasterKategoriTable from "@/components/admin/data-management/MasterKategoriTable";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useMasterKategoriList } from "@/hooks/useMasterKategoriList";
import { useModal } from "@/hooks/useModal";
import { mapMasterKategoriApiError } from "@/lib/master-kategori-errors";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  createMasterKategori,
  deleteMasterKategori,
  updateMasterKategori,
} from "@/services/master-kategori.service";
import type {
  MasterKategori,
  MasterKategoriFormData,
  MasterKategoriFormErrors,
} from "@/types/master-kategori";
import { useState } from "react";

const emptyForm: MasterKategoriFormData = {
  nama_kategori: "",
  deskripsi: "",
};

export default function MasterKategoriManager() {
  const { items, isLoading, error, refetch } = useMasterKategoriList();
  const [form, setForm] = useState<MasterKategoriFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<MasterKategori | null>(null);
  const [fieldErrors, setFieldErrors] = useState<MasterKategoriFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formModal = useModal();
  const deleteModal = useModal();

  const resetFormState = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFieldErrors({});
    setFormError(null);
  };

  const openAddModal = () => {
    resetFormState();
    formModal.openModal();
  };

  const openEditModal = (item: MasterKategori) => {
    setEditingId(item.uuid);
    setForm({
      nama_kategori: item.nama_kategori,
      deskripsi: item.deskripsi,
    });
    setFieldErrors({});
    setFormError(null);
    formModal.openModal();
  };

  const openDeleteModal = (item: MasterKategori) => {
    setDeletingItem(item);
    deleteModal.openModal();
  };

  const handleFormChange = (
    field: keyof MasterKategoriFormData,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  };

  const handleSave = async () => {
    if (!form.nama_kategori.trim()) return;

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    try {
      const result = editingId
        ? await updateMasterKategori(editingId, form)
        : await createMasterKategori(form);

      await refetch();
      formModal.closeModal();
      resetFormState();
      showSuccessToast(result.message);
    } catch (err) {
      const { fieldErrors: apiFieldErrors, formError: apiFormError } =
        mapMasterKategoriApiError(err);
      setFieldErrors(apiFieldErrors);
      setFormError(apiFormError);
      if (apiFormError) {
        showErrorToast(apiFormError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    setIsDeleting(true);

    try {
      const result = await deleteMasterKategori(deletingItem.uuid);
      await refetch();
      deleteModal.closeModal();
      setDeletingItem(null);
      showSuccessToast(result.message);
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Gagal menghapus kategori",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const isFormValid = form.nama_kategori.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Master Kategori
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isLoading
              ? "Memuat data..."
              : `${items.length} kategori terdaftar`}
          </p>
        </div>
        <Button size="sm" onClick={openAddModal} disabled={isLoading}>
          + Tambah Kategori
        </Button>
      </div>

      {error && (
        <Alert variant="error" title="Gagal memuat data" message={error} />
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Memuat master kategori...
          </p>
        </div>
      ) : (
        <MasterKategoriTable
          items={items}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}

      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.closeModal}
        className="max-w-[520px] p-5 lg:p-8"
      >
        <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          {editingId ? "Edit Kategori" : "Tambah Kategori"}
        </h4>

        {formError && (
          <div className="mb-4">
            <Alert variant="error" title="Gagal menyimpan" message={formError} />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label>Nama Kategori</Label>
            <Input
              type="text"
              value={form.nama_kategori}
              onChange={(e) =>
                handleFormChange("nama_kategori", e.target.value)
              }
              placeholder="Contoh: Makanan"
              error={Boolean(fieldErrors.nama_kategori)}
              hint={fieldErrors.nama_kategori}
            />
          </div>

          <div>
            <Label>Deskripsi</Label>
            <TextArea
              value={form.deskripsi}
              onChange={(value) => handleFormChange("deskripsi", value)}
              placeholder="Deskripsi kategori"
              rows={3}
              error={Boolean(fieldErrors.deskripsi)}
              hint={fieldErrors.deskripsi}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
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
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting
              ? "Menyimpan..."
              : editingId
                ? "Simpan Perubahan"
                : "Tambah Kategori"}
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        className="max-w-[420px] p-5 lg:p-8"
      >
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Hapus Kategori
        </h4>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Yakin ingin menghapus{" "}
          <span className="font-medium text-gray-800 dark:text-white/90">
            {deletingItem?.nama_kategori}
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
