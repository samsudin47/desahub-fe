import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa Password | DesaHub",
  description: "Reset password akun DesaHub melalui tautan yang dikirim ke email Anda.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
