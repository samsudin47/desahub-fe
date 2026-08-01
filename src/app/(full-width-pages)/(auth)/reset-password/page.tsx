import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Atur Ulang Password | DesaHub",
  description: "Atur password baru akun DesaHub menggunakan tautan dari email.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
