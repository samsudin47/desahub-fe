"use client";

import AuthPageShell from "@/components/auth/AuthPageShell";
import { AuthField } from "@/components/auth/AuthField";
import Alert from "@/components/ui/alert/Alert";
import MktButton from "@/components/marketplace/ui/MktButton";
import { LOGIN_PATH } from "@/config/auth-routes";
import { mapForgotPasswordApiError } from "@/lib/auth-errors";
import { forgotPassword } from "@/services/auth.service";
import type { ForgotPasswordFormData } from "@/types/auth";
import { Clock3, MailCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

type FormErrors = Partial<Record<keyof ForgotPasswordFormData, string>>;

export default function ForgotPasswordForm() {
  const [form, setForm] = useState<ForgotPasswordFormData>({ email: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const updateField = <K extends keyof ForgotPasswordFormData>(
    key: K,
    value: ForgotPasswordFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (formError) setFormError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrors({});
    setFormError("");

    try {
      await forgotPassword(form);
      setSubmittedEmail(form.email.trim());
      setIsSuccess(true);
    } catch (error) {
      const { fieldErrors, formError: apiFormError } = mapForgotPasswordApiError(error);
      setErrors(fieldErrors);
      setFormError(apiFormError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      title={isSuccess ? "Cek email Anda" : "Lupa password"}
      description={
        isSuccess
          ? "Jika email terdaftar, kami telah mengirim tautan reset password."
          : "Masukkan email akun Anda. Kami akan mengirim tautan untuk mengatur ulang password."
      }
      footer={
        <p className="text-center text-sm text-gray-600 sm:text-left">
          Ingat password Anda?{" "}
          <Link
            href={LOGIN_PATH}
            className="font-medium text-desahub-600 hover:text-desahub-700"
          >
            Kembali masuk
          </Link>
        </p>
      }
    >
      {isSuccess ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-desahub-100 bg-desahub-25/60 p-6 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-success-50 ring-8 ring-success-50/60">
              <MailCheck className="size-8 text-success-600" />
            </div>

            <p className="text-sm font-medium text-gray-800">Email reset telah dikirim</p>
            {submittedEmail && (
              <p className="mt-1 break-all text-sm font-medium text-desahub-700">
                {submittedEmail}
              </p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              Periksa kotak masuk (dan folder spam). Tautan hanya berlaku untuk waktu terbatas.
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Clock3 className="size-3.5 shrink-0" />
              <span>Cek email dalam beberapa menit</span>
            </div>
          </div>

          <Alert
            variant="success"
            title="Langkah berikutnya"
            message="Buka tautan di email, lalu buat password baru di halaman reset."
          />

          <Link href={LOGIN_PATH}>
            <MktButton type="button" size="lg" className="w-full">
              Kembali ke halaman masuk
            </MktButton>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <AuthField
            name="email"
            type="email"
            label="Email"
            placeholder="Masukkan email"
            autoComplete="email"
            required
            value={form.email}
            error={errors.email}
            onChange={(e) => updateField("email", e.target.value)}
          />

          {formError && (
            <p className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">
              {formError}
            </p>
          )}

          <MktButton type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Mengirim..." : "Kirim tautan reset"}
          </MktButton>
        </form>
      )}
    </AuthPageShell>
  );
}
