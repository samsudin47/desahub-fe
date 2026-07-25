"use client";

import { useState, type ChangeEvent } from "react";
import { Loader2, MapPin } from "lucide-react";
import MktButton from "@/components/marketplace/ui/MktButton";
import { getApiErrorMessage } from "@/lib/api-message";
import { mapStructuredApiError } from "@/lib/api-form-errors";
import { cn } from "@/lib/cn";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { updateCheckoutShipping } from "@/services/checkout.service";
import type { CheckoutShippingPayload } from "@/types/checkout";

type CheckoutInfoCardProps = {
  checkoutUuid: string;
  status: string;
  disabled?: boolean;
  onShippingSaved?: () => void;
};

type LocationCoords = {
  latitude: number;
  longitude: number;
};

type ShippingField =
  | "nama_penerima"
  | "no_hp_penerima"
  | "alamat_penerima"
  | "location";

type ShippingFieldErrors = Partial<Record<ShippingField, string>>;

const inputClassName =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-desahub-500 focus:ring-2 focus:ring-desahub-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

const errorInputClassName = "border-red-300 focus:border-red-400 focus:ring-red-100";

export default function CheckoutInfoCard({
  checkoutUuid,
  status,
  disabled = false,
  onShippingSaved,
}: CheckoutInfoCardProps) {
  const [namaPenerima, setNamaPenerima] = useState("");
  const [nomorHpPenerima, setNomorHpPenerima] = useState("");
  const [alamatPengiriman, setAlamatPengiriman] = useState("");
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ShippingFieldErrors>({});
  const [formError, setFormError] = useState("");

  const clearFieldError = (field: ShippingField) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateAndGetPayload = (): CheckoutShippingPayload | null => {
    const nextErrors: ShippingFieldErrors = {};
    const nama = namaPenerima.trim();
    const noHp = nomorHpPenerima.trim();
    const alamat = alamatPengiriman.trim();

    if (!nama) nextErrors.nama_penerima = "Nama penerima wajib diisi.";
    if (!noHp) nextErrors.no_hp_penerima = "Nomor HP penerima wajib diisi.";
    if (!alamat) nextErrors.alamat_penerima = "Alamat pengiriman wajib diisi.";

    setFieldErrors(nextErrors);
    setFormError("");

    if (Object.keys(nextErrors).length > 0) {
      return null;
    }

    return {
      nama_penerima: nama,
      no_hp_penerima: noHp,
      alamat_penerima: alamat,
      ...(location && {
        latitude: location.latitude,
        longitude: location.longitude,
      }),
    };
  };

  const applyApiError = (error: unknown) => {
    const { fieldErrors: apiFieldErrors, formError: apiFormError } =
      mapStructuredApiError<ShippingField>(
        error,
        {
          nama_penerima: "nama_penerima",
          no_hp_penerima: "no_hp_penerima",
          alamat_penerima: "alamat_penerima",
          latitude: "location",
          longitude: "location",
        },
        "Gagal menyimpan data pengiriman",
      );

    setFieldErrors(apiFieldErrors);
    setFormError(apiFormError);
  };

  const handleShareLocation = () => {
    if (disabled || typeof window === "undefined") return;

    if (!navigator.geolocation) {
      setLocationError("Perangkat ini tidak mendukung berbagi lokasi.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        clearFieldError("location");
        setIsLocating(false);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Izin lokasi ditolak. Aktifkan akses lokasi di browser."
            : error.code === error.POSITION_UNAVAILABLE
              ? "Lokasi tidak tersedia saat ini."
              : "Gagal mendapatkan lokasi. Coba lagi.";
        setLocationError(message);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  const handleSaveAddress = async () => {
    if (disabled || isSaving) return;

    const payload = validateAndGetPayload();
    if (!payload) {
      showErrorToast("Lengkapi data pengiriman terlebih dahulu");
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateCheckoutShipping(checkoutUuid, payload);
      showSuccessToast(result.message);
      onShippingSaved?.();
    } catch (error) {
      applyApiError(error);
      showErrorToast(getApiErrorMessage(error, "Gagal menyimpan data pengiriman"));
    } finally {
      setIsSaving(false);
    }
  };

  const mapsUrl = location
    ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    : null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="mb-4 font-semibold text-gray-900">Informasi Checkout</h2>

      <dl className="mb-5 space-y-2 border-b border-gray-100 pb-5 text-sm text-gray-600">
        <div className="flex justify-between gap-4">
          <dt>ID Checkout</dt>
          <dd className="break-all text-right font-medium text-gray-900">
            {checkoutUuid}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Status</dt>
          <dd className="font-medium capitalize text-gray-900">{status}</dd>
        </div>
      </dl>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="nama-penerima"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Nama Penerima
          </label>
          <input
            id="nama-penerima"
            type="text"
            value={namaPenerima}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNamaPenerima(e.target.value);
              clearFieldError("nama_penerima");
            }}
            placeholder="Masukkan nama penerima"
            disabled={disabled || isSaving}
            className={cn(
              inputClassName,
              fieldErrors.nama_penerima && errorInputClassName,
            )}
            autoComplete="name"
          />
          {fieldErrors.nama_penerima && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.nama_penerima}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="nomor-hp-penerima"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Nomor HP Penerima
          </label>
          <input
            id="nomor-hp-penerima"
            type="tel"
            value={nomorHpPenerima}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setNomorHpPenerima(e.target.value);
              clearFieldError("no_hp_penerima");
            }}
            placeholder="Masukkan nomor hp penerima"
            disabled={disabled || isSaving}
            className={cn(
              inputClassName,
              fieldErrors.no_hp_penerima && errorInputClassName,
            )}
            autoComplete="tel"
          />
          {fieldErrors.no_hp_penerima && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.no_hp_penerima}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="alamat-pengiriman"
            className="mb-1.5 block text-sm font-medium text-gray-700"
          >
            Alamat Pengiriman / Penerima
          </label>
          <textarea
            id="alamat-pengiriman"
            value={alamatPengiriman}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setAlamatPengiriman(e.target.value);
              clearFieldError("alamat_penerima");
            }}
            placeholder="Contoh: Jl. Melati No. 12, RT 02/RW 01, Desa Sukamaju"
            disabled={disabled || isSaving}
            rows={3}
            className={cn(
              inputClassName,
              "resize-y",
              fieldErrors.alamat_penerima && errorInputClassName,
            )}
            autoComplete="street-address"
          />
          {fieldErrors.alamat_penerima && (
            <p className="mt-1 text-xs text-red-600">
              {fieldErrors.alamat_penerima}
            </p>
          )}
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-gray-700">
            Lokasi Pengiriman
          </span>
          <p className="mb-3 text-xs text-gray-500">
            Opsional. Bagikan lokasi untuk membantu penjual menemukan alamat
            pengiriman.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex w-full flex-col gap-2 sm:w-auto">
              <MktButton
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                disabled={disabled || isLocating || isSaving}
                onClick={handleShareLocation}
                startIcon={
                  isLocating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <MapPin className="size-4" />
                  )
                }
              >
                {isLocating
                  ? "Mengambil lokasi..."
                  : location
                    ? "Perbarui Lokasi"
                    : "Bagikan Lokasi"}
              </MktButton>

              <MktButton
                type="button"
                className="w-full sm:w-auto"
                disabled={disabled || isSaving || isLocating}
                onClick={() => void handleSaveAddress()}
                startIcon={
                  isSaving ? <Loader2 className="size-4 animate-spin" /> : undefined
                }
              >
                {isSaving ? "Menyimpan..." : "Tambah Alamat"}
              </MktButton>
            </div>

            {location && (
              <div className="min-w-0 flex-1 rounded-lg border border-desahub-100 bg-desahub-50 px-3 py-2.5 text-sm">
                <p className="font-medium text-desahub-700">Lokasi tersimpan</p>
                <p className="mt-0.5 break-all text-gray-600">
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </p>
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs font-medium text-desahub-600 underline-offset-2 hover:underline"
                  >
                    Lihat di peta
                  </a>
                )}
              </div>
            )}
          </div>

          {(locationError || fieldErrors.location) && (
            <p className="mt-2 text-xs text-red-600" role="alert">
              {locationError ?? fieldErrors.location}
            </p>
          )}
        </div>

        {formError && (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}
      </div>
    </div>
  );
}
