import type { Product } from "@/data/marketplace";
import { categories } from "@/data/marketplace";
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

  const emoji =
    categories.find((c) => c.slug === product.category)?.icon ??
    {
      makanan: "🍚",
      minuman: "🥤",
      kerajinan: "🧺",
      pertanian: "🌾",
      fashion: "👕",
      jasa: "🛠️",
    }[product.category];

  if (product.imageUrl) {
    return (
      <img
        src={product.imageUrl}
        alt={product.name}
        className={cn("rounded-xl object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl",
        sizeClass,
        className,
      )}
      style={{ backgroundColor: product.imageColor }}
      aria-hidden
    >
      {emoji}
    </div>
  );
}
