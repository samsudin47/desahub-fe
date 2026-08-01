"use client";

import AuthPageShell from "@/components/auth/AuthPageShell";
import { AuthField, PasswordField } from "@/components/auth/AuthField";
import MktButton from "@/components/marketplace/ui/MktButton";
import { FORGOT_PASSWORD_PATH, LOGIN_PATH } from "@/config/auth-routes";
import { mapResetPasswordApiError } from "@/lib/auth-errors";
import { resetPassword } from "@/services/auth.service";
import type { ResetPasswordFormData } from "@/types/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type FormErrors = Partial<Record<keyof ResetPasswordFormData, string>>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const emailFromQuery = searchParams.get("email")?.trim() ?? "";
  const hasValidLink = Boolean(token && emailFromQuery);

  const [form, setForm] = useState<ResetPasswordFormData>({
    email: emailFromQuery,
    token,
    password: "",
    passwordConfirmation: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof ResetPasswordFormData>(
    key: K,
    value: ResetPasswordFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (formError) setFormError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!hasValidLink) {
      setFormError("Tautan reset password tidak valid atau sudah kadaluarsa.");
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setFormError("");

    try {
      await resetPassword({
        ...form,
        email: emailFromQuery,
        token,
      });
      router.push(LOGIN_PATH);
    } catch (error) {
      const { fieldErrors, formError: apiFormError } = mapResetPasswordApiError(error);
      setErrors(fieldErrors);
      setFormError(apiFormError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      title="Atur ulang password"
      description={
        hasValidLink
          ? "Masukkan password baru untuk akun Anda."
          : "Tautan reset password tidak valid. Minta tautan baru dari halaman lupa password."
      }
      footer={
        <p className="text-center text-sm text-gray-600 sm:text-left">
          Sudah ingat password?{" "}
          <Link
            href={LOGIN_PATH}
            className="font-medium text-desahub-600 hover:text-desahub-700"
          >
            Masuk
          </Link>
        </p>
      }
    >
      {!hasValidLink ? (
        <div className="space-y-5">
          <p className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">
            Parameter token atau email tidak ditemukan pada tautan.
          </p>
          <Link href={FORGOT_PASSWORD_PATH}>
            <MktButton type="button" size="lg" className="w-full">
              Minta tautan baru
            </MktButton>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <AuthField
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            value={emailFromQuery}
            readOnly
            className="bg-gray-50 text-gray-600"
          />

          <PasswordField
            name="password"
            label="Password baru"
            placeholder="Masukkan password baru"
            autoComplete="new-password"
            required
            value={form.password}
            error={errors.password}
            onChange={(e) => updateField("password", e.target.value)}
          />

          <PasswordField
            name="passwordConfirmation"
            label="Konfirmasi password"
            placeholder="Ulangi password baru"
            autoComplete="new-password"
            required
            value={form.passwordConfirmation}
            error={errors.passwordConfirmation}
            onChange={(e) => updateField("passwordConfirmation", e.target.value)}
          />

          {formError && (
            <p className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">
              {formError}
            </p>
          )}

          <MktButton type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan password baru"}
          </MktButton>
        </form>
      )}
    </AuthPageShell>
  );
}
