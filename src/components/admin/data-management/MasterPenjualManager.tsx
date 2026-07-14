"use client";

import MasterPenjualTable from "@/components/admin/data-management/MasterPenjualTable";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Alert from "@/components/ui/alert/Alert";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useMasterPenjualList } from "@/hooks/useMasterPenjualList";
import { useModal } from "@/hooks/useModal";
import { mapMasterPenjualApiError } from "@/lib/master-penjual-errors";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  createMasterPenjual,
  deleteMasterPenjual,
  updateMasterPenjual,
} from "@/services/master-penjual.service";
import type {
  MasterPenjual,
  MasterPenjualFormData,
  MasterPenjualFormErrors,
} from "@/types/master-penjual";
import { useState } from "react";

const emptyForm: MasterPenjualFormData = {
  nama_penjual: "",
  email: "",
  no_hp: "",
  alamat: "",
};

export default function MasterPenjualManager() {
  const { items, isLoading, error, refetch } = useMasterPenjualList();
  const [form, setForm] = useState<MasterPenjualFormData>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingItem, setDeletingItem] = useState<MasterPenjual | null>(null);
  const [fieldErrors, setFieldErrors] = useState<MasterPenjualFormErrors>({});
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

  const openEditModal = (item: MasterPenjual) => {
    setEditingId(item.uuid);
    setForm({
      nama_penjual: item.nama_penjual,
      email: item.email,
      no_hp: item.no_hp,
      alamat: item.alamat,
    });
    setFieldErrors({});
    setFormError(null);
    formModal.openModal();
  };

  const openDeleteModal = (item: MasterPenjual) => {
    setDeletingItem(item);
    deleteModal.openModal();
  };

  const handleFormChange = (
    field: keyof MasterPenjualFormData,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  };

  const handleSave = async () => {
    if (!form.nama_penjual.trim()) return;

    setIsSubmitting(true);
    setFieldErrors({});
    setFormError(null);

    try {
      const result = editingId
        ? await updateMasterPenjual(editingId, form)
        : await createMasterPenjual(form);

      await refetch();
      formModal.closeModal();
      resetFormState();
      showSuccessToast(result.message);
    } catch (err) {
      const { fieldErrors: apiFieldErrors, formError: apiFormError } =
        mapMasterPenjualApiError(err);
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
      const result = await deleteMasterPenjual(deletingItem.uuid);
      await refetch();
      deleteModal.closeModal();
      setDeletingItem(null);
      showSuccessToast(result.message);
    } catch (err) {
      showErrorToast(
        err instanceof Error ? err.message : "Gagal menghapus penjual",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const isFormValid = form.nama_penjual.trim().length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Master Penjual
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isLoading
              ? "Memuat data..."
              : `${items.length} penjual terdaftar`}
          </p>
        </div>
        <Button size="sm" onClick={openAddModal} disabled={isLoading}>
          + Tambah Penjual
        </Button>
      </div>

      {error && (
        <Alert variant="error" title="Gagal memuat data" message={error} />
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Memuat master penjual...
          </p>
        </div>
      ) : (
        <MasterPenjualTable
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
          {editingId ? "Edit Penjual" : "Tambah Penjual"}
        </h4>

        {formError && (
          <div className="mb-4">
            <Alert variant="error" title="Gagal menyimpan" message={formError} />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label>Nama Penjual</Label>
            <Input
              type="text"
              value={form.nama_penjual}
              onChange={(e) =>
                handleFormChange("nama_penjual", e.target.value)
              }
              placeholder="Contoh: Toko Sumber Rejeki"
              error={Boolean(fieldErrors.nama_penjual)}
              hint={fieldErrors.nama_penjual}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleFormChange("email", e.target.value)}
              placeholder="Contoh: penjual@gmail.com"
              error={Boolean(fieldErrors.email)}
              hint={fieldErrors.email}
            />
          </div>

          <div>
            <Label>No. HP</Label>
            <Input
              type="text"
              value={form.no_hp}
              onChange={(e) => handleFormChange("no_hp", e.target.value)}
              placeholder="Contoh: 081234567890"
              error={Boolean(fieldErrors.no_hp)}
              hint={fieldErrors.no_hp}
            />
          </div>

          <div>
            <Label>Alamat</Label>
            <TextArea
              value={form.alamat}
              onChange={(value) => handleFormChange("alamat", value)}
              placeholder="Alamat penjual"
              rows={3}
              error={Boolean(fieldErrors.alamat)}
              hint={fieldErrors.alamat}
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
                : "Tambah Penjual"}
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        className="max-w-[420px] p-5 lg:p-8"
      >
        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Hapus Penjual
        </h4>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Yakin ingin menghapus{" "}
          <span className="font-medium text-gray-800 dark:text-white/90">
            {deletingItem?.nama_penjual}
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
