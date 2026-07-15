"use client";

import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/product";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function AdminProductThumbnail({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const hasImage = Boolean(product.gambar);

  return (
    <>
      <button
        type="button"
        onClick={() => hasImage && setIsPreviewOpen(true)}
        disabled={!hasImage}
        className={cn(
          "inline-flex items-center justify-center text-gray-500 transition",
          hasImage
            ? "hover:text-brand-600 dark:hover:text-brand-400"
            : "cursor-not-allowed opacity-40",
          className,
        )}
        title={hasImage ? "Preview gambar" : "Tidak ada gambar"}
        aria-label={hasImage ? "Preview gambar" : "Tidak ada gambar"}
      >
        <Eye className="h-5 w-5" />
      </button>

      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        className="max-w-[480px] p-4"
      >
        {product.gambar && (
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={product.gambar}
              alt={product.nama_product}
              fill
              unoptimized
              className="object-contain"
              sizes="(max-width: 480px) 100vw, 480px"
            />
          </div>
        )}
      </Modal>
    </>
  );
}
