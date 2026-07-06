"use client";

import { useAuthUser } from "@/hooks/useAuthUser";
import { formatDisplayName, getUserInitials } from "@/lib/user-display";
import Link from "next/link";

export default function AccountProfileCard() {
  const { user, isReady } = useAuthUser();

  if (!isReady) {
    return (
      <div className="flex animate-pulse items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
        <div className="size-16 rounded-full bg-gray-100" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 rounded bg-gray-100" />
          <div className="h-4 w-56 rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
        <p className="text-sm text-gray-600">Anda belum masuk.</p>
        <Link
          href="/login"
          className="mt-3 inline-block text-sm font-medium text-desahub-600 hover:text-desahub-700"
        >
          Masuk sekarang
        </Link>
      </div>
    );
  }

  const displayName = formatDisplayName(user.username);
  const initials = getUserInitials(user.username);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
      <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-desahub-100 text-xl font-bold text-desahub-700">
        {initials}
      </span>
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{displayName}</h1>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-xs text-desahub-600">{user.role}</p>
      </div>
    </div>
  );
}
