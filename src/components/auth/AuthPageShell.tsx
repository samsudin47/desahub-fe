import AppLogo from "@/components/common/AppLogo";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type AuthPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  /** "center" untuk form pendek (login), "start" untuk form panjang (register) */
  contentAlign?: "center" | "start";
};

export default function AuthPageShell({
  title,
  description,
  children,
  footer,
  contentAlign = "center",
}: AuthPageShellProps) {
  return (
    <div className="flex w-full flex-col bg-white lg:w-1/2 lg:min-h-screen lg:overflow-y-auto">
      <div
        className={cn(
          "mx-auto flex w-full max-w-md flex-col px-4 py-8 sm:px-6 lg:px-10 lg:py-10",
          contentAlign === "center" && "min-h-screen justify-center",
          contentAlign === "start" && "min-h-0"
        )}
      >
        <div className="mb-6">
          <AppLogo href="/marketplace-umkm" size="md" />
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="mb-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-gray-500">{description}</p>
        </div>

        {children}

        {footer && <div className="mt-8">{footer}</div>}
      </div>
    </div>
  );
}
