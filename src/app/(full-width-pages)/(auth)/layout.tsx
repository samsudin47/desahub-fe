import GridShape from "@/components/common/GridShape";
import AppLogo from "@/components/common/AppLogo";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-1 min-h-screen bg-desahub-25">
      <div className="relative flex min-h-screen w-full flex-col lg:flex-row lg:items-stretch">
        {children}

        <aside className="relative hidden overflow-hidden bg-desahub-950 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-1/2 lg:flex-col lg:items-center lg:justify-center">
          <GridShape />
          <div className="relative z-1 flex max-w-sm flex-col items-center px-10 text-center">
            <AppLogo size="auth" variant="light" href="/marketplace-umkm" className="mb-6" />
            <h2 className="mb-3 text-2xl font-semibold text-white">
              Platform Desa Digital Terpadu
            </h2>
            <p className="text-sm leading-relaxed text-desahub-100/80">
              Kelola layanan desa, akses informasi publik, dan dukung UMKM lokal melalui
              satu ekosistem DesaHub.
            </p>
            <div className="mt-8 grid w-full grid-cols-3 gap-3 text-center">
              {[
                { label: "Layanan Desa", icon: "🏛️" },
                { label: "Marketplace", icon: "🛒" },
                { label: "UMKM Lokal", icon: "🌾" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-white/5 px-2 py-3"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="mt-1.5 text-xs font-medium text-desahub-50">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
