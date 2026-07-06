"use client";

import { logout } from "@/services/auth.service";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutButtonProps = {
  label?: string;
  className?: string;
};

export default function LogoutButton({
  label = "Keluar",
  className = "flex w-full items-center justify-center gap-2 rounded-2xl border border-error-200 bg-white py-3 text-sm font-medium text-error-600 transition hover:bg-error-50",
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      <LogOut className="size-4" />
      {isLoggingOut ? "Memproses..." : label}
    </button>
  );
}
