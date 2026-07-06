import RegisterForm from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar | DesaHub",
  description: "Daftar akun DesaHub untuk mengakses layanan desa digital dan marketplace UMKM.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
