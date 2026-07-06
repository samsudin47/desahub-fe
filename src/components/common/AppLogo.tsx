import Image from "next/image";
import Link from "next/link";

type AppLogoProps = {
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg" | "auth";
  variant?: "default" | "light";
  className?: string;
  href?: string;
};

const sizeConfig = {
  sm: { icon: 22, text: "text-base", gap: "gap-1.5" },
  md: { icon: 26, text: "text-lg", gap: "gap-1.5" },
  lg: { icon: 28, text: "text-lg", gap: "gap-1.5" },
  auth: { icon: 36, text: "text-2xl", gap: "gap-2" },
};

const ICON_ASPECT = 128 / 85;

export default function AppLogo({
  iconOnly = false,
  size = "md",
  variant = "default",
  className = "",
  href = "/",
}: AppLogoProps) {
  const { icon, text: textClass, gap } = sizeConfig[size];
  const iconHeight = iconOnly ? 34 : icon;
  const iconWidth = Math.round(iconHeight * ICON_ASPECT);

  return (
    <Link
      href={href}
      className={`inline-flex items-center ${gap} ${className}`}
    >
      <Image
        src="/images/logo/icon-desahub.png"
        alt=""
        width={iconWidth}
        height={iconHeight}
        className="shrink-0 rounded-md object-contain"
        style={{ width: iconWidth, height: iconHeight }}
        priority
        unoptimized
      />
      {!iconOnly && (
        <span className={`font-bold font-outfit leading-none ${textClass}`}>
          {variant === "light" ? (
            <>
              <span className="text-white">Desa</span>
              <span className="text-desahub-300">Hub</span>
            </>
          ) : (
            <>
              <span className="text-desahub-500">Desa</span>
              <span className="text-desahub-400">Hub</span>
            </>
          )}
        </span>
      )}
    </Link>
  );
}
