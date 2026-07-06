import type { Product } from "@/data/marketplace";
import { cn } from "@/lib/cn";

export default function ProductImage({
  product,
  className,
  size = "md",
}: {
  product: Product;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl",
  }[size];

  const emoji = {
    makanan: "🍚",
    minuman: "🥤",
    kerajinan: "🧺",
    pertanian: "🌾",
    fashion: "👕",
    jasa: "🛠️",
  }[product.category];

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl",
        sizeClass,
        className
      )}
      style={{ backgroundColor: product.imageColor }}
      aria-hidden
    >
      {emoji}
    </div>
  );
}
