import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type MktButtonVariant = "primary" | "outline" | "ghost";
type MktButtonSize = "sm" | "md" | "lg";

interface MktButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: MktButtonVariant;
  size?: MktButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<MktButtonVariant, string> = {
  primary:
    "bg-desahub-500 text-white hover:bg-desahub-600 shadow-theme-xs disabled:bg-desahub-300",
  outline:
    "border border-desahub-500 text-desahub-600 bg-white hover:bg-desahub-50",
  ghost: "text-desahub-600 hover:bg-desahub-50",
};

const sizeStyles: Record<MktButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function MktButton({
  variant = "primary",
  size = "md",
  startIcon,
  endIcon,
  className,
  children,
  disabled,
  ...props
}: MktButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition",
        variantStyles[variant],
        sizeStyles[size],
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
}
