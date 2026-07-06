import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/marketplace/product/ProductDetailView";
import { getProductById, products } from "@/data/marketplace";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  return {
    title: product
      ? `${product.name} | Marketplace UMKM | DesaHub`
      : "Produk | DesaHub",
  };
}

export default async function ProdukDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
