import LoginForm from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk | DesaHub",
  description: "Masuk ke akun DesaHub dengan username dan password atau SSO Google.",
};

export default function LoginPage() {
  return <LoginForm />;
}
