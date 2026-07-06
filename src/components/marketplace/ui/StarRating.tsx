import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export default function StarRating({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      <span className="font-medium text-gray-700">{rating.toFixed(1)}</span>
    </span>
  );
}
