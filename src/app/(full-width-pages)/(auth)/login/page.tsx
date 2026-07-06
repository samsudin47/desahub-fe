import LoginForm from "@/components/auth/LoginForm";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Masuk | DesaHub",
  description: "Masuk ke akun DesaHub dengan username dan password atau SSO Google.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat...</div>}>
      <LoginForm />
    </Suspense>
  );
}
