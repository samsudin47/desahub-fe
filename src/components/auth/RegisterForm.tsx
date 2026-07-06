"use client";



import AuthDivider from "@/components/auth/AuthDivider";

import { AuthField, PasswordField } from "@/components/auth/AuthField";

import { AuthRoleSelect } from "@/components/auth/AuthRoleSelect";

import AuthPageShell from "@/components/auth/AuthPageShell";

import SsoButtons from "@/components/auth/SsoButtons";

import Checkbox from "@/components/form/input/Checkbox";

import MktButton from "@/components/marketplace/ui/MktButton";

import { useRegisterableRoles } from "@/hooks/useRegisterableRoles";

import { mapRegisterApiError } from "@/lib/auth-errors";

import { getPostLoginPath, register } from "@/services/auth.service";

import type { RegisterFormData } from "@/types/auth";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { FormEvent, useState } from "react";



type FormErrors = Partial<Record<keyof RegisterFormData, string>>;



export default function RegisterForm() {

  const router = useRouter();

  const { roles, isLoading: isRolesLoading, error: rolesError } = useRegisterableRoles();

  const [form, setForm] = useState<RegisterFormData>({

    username: "",

    email: "",

    password: "",

    passwordConfirmation: "",

    role: "",

  });

  const [errors, setErrors] = useState<FormErrors>({});

  const [agreed, setAgreed] = useState(false);

  const [formError, setFormError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);



  const updateField = <K extends keyof RegisterFormData>(key: K, value: RegisterFormData[K]) => {

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

      const authData = await register(form);

      router.push(getPostLoginPath(authData.user.role));

    } catch (error) {

      const { fieldErrors, formError: apiFormError } = mapRegisterApiError(error);

      setErrors(fieldErrors);

      setFormError(apiFormError);

    } finally {

      setIsSubmitting(false);

    }

  };



  return (

    <AuthPageShell

      contentAlign="start"

      title="Daftar Akun DesaHub"

      description="Buat akun untuk mengakses layanan desa digital dan marketplace UMKM."

      footer={

        <p className="text-center text-sm text-gray-600 sm:text-left">

          Sudah punya akun?{" "}

          <Link href="/login" className="font-medium text-desahub-600 hover:text-desahub-700">

            Masuk di sini

          </Link>

        </p>

      }

    >

      <SsoButtons mode="register" />

      <AuthDivider />



      <form onSubmit={handleSubmit} className="space-y-5" noValidate>

        <AuthField

          name="username"

          label="Username"

          placeholder="Pilih username unik"

          autoComplete="username"

          value={form.username}

          error={errors.username}

          onChange={(e) => updateField("username", e.target.value)}

        />



        <AuthField

          name="email"

          type="email"

          label="Email"

          placeholder="nama@email.com"

          autoComplete="email"

          value={form.email}

          error={errors.email}

          onChange={(e) => updateField("email", e.target.value)}

        />



        <AuthRoleSelect

          name="role"

          label="Role"

          placeholder="Pilih role Anda"

          value={form.role}

          error={errors.role}

          options={roles}

          isLoading={isRolesLoading}

          loadError={rolesError}

          onChange={(value) => updateField("role", value as RegisterFormData["role"])}

        />



        <PasswordField

          name="password"

          label="Password"

          placeholder="Minimal 8 karakter"

          autoComplete="new-password"

          value={form.password}

          error={errors.password}

          onChange={(e) => updateField("password", e.target.value)}

        />



        <PasswordField

          name="passwordConfirmation"

          label="Konfirmasi Password"

          placeholder="Ulangi password"

          autoComplete="new-password"

          value={form.passwordConfirmation}

          error={errors.passwordConfirmation}

          onChange={(e) => updateField("passwordConfirmation", e.target.value)}

        />



        <div>

          <div className="flex items-start gap-3">

            <Checkbox

              checked={agreed}

              onChange={(checked) => setAgreed(checked)}

            />

            <p className="text-sm text-gray-600">

              Saya menyetujui{" "}

              <span className="font-medium text-gray-800">Syarat & Ketentuan</span> dan{" "}

              <span className="font-medium text-gray-800">Kebijakan Privasi</span> DesaHub.

            </p>

          </div>

        </div>



        {formError && (

          <p className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-600">

            {formError}

          </p>

        )}



        <MktButton type="submit" size="lg" className="w-full" disabled={isSubmitting}>

          {isSubmitting ? "Memproses..." : "Daftar"}

        </MktButton>

      </form>

    </AuthPageShell>

  );

}


