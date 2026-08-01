"use client";

import AuthDivider from "@/components/auth/AuthDivider";
import AuthPageShell from "@/components/auth/AuthPageShell";
import { AuthField, PasswordField } from "@/components/auth/AuthField";
import SsoButtons from "@/components/auth/SsoButtons";
import MktButton from "@/components/marketplace/ui/MktButton";
import { FORGOT_PASSWORD_PATH, REGISTER_PATH } from "@/config/auth-routes";
import { mapLoginApiError } from "@/lib/auth-errors";
import { getPostLoginPath, getSafeRedirectPath, login } from "@/services/auth.service";
import type { LoginFormData } from "@/types/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

type FormErrors = Partial<Record<keyof LoginFormData, string>>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<LoginFormData>({
    username: "",
    password: "",
  }); 
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof LoginFormData>(key: K, value: LoginFormData[K]) => {
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
      const authData = await login(form);
      router.push(
        getSafeRedirectPath(
          searchParams.get("redirect"),
          getPostLoginPath(authData.user.role),
        ),
      );
    } catch (error) {
      const { fieldErrors, formError: apiFormError } = mapLoginApiError(error);
      setErrors(fieldErrors);
      setFormError(apiFormError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      title="Masuk ke DesaHub"
      description="Gunakan username dan password akun Anda untuk melanjutkan."
      footer={
        <p className="text-center text-sm text-gray-600 sm:text-left">
          Belum punya akun?{" "}
          <Link href={REGISTER_PATH} className="font-medium text-desahub-600 hover:text-desahub-700">
            Daftar sekarang
          </Link>
        </p>
      }
    >
      <SsoButtons mode="login" />
      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthField
          name="username"
          label="Username"
          placeholder="Masukkan username"
          autoComplete="username"
          value={form.username}
          error={errors.username}
          onChange={(e) => updateField("username", e.target.value)}
        />

        <PasswordField
          name="password"
          label="Password"
          placeholder="Masukkan password"
          autoComplete="current-password"
          value={form.password}
          error={errors.password}
          onChange={(e) => updateField("password", e.target.value)}
        />

        <div className="flex justify-end">
          <Link
            href={FORGOT_PASSWORD_PATH}
            className="text-sm font-medium text-desahub-600 hover:text-desahub-700"
          >
            Lupa password?
          </Link>
        </div>

        {formError && (
          <p className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">
            {formError}
          </p>
        )}

        <MktButton type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Masuk"}
        </MktButton>
      </form>
    </AuthPageShell>
  );
}
