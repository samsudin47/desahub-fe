import type { Metadata } from "next";

import CategoryDetailView from "@/components/marketplace/category/CategoryDetailView";
import { formatSlugLabel } from "@/lib/slugify";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${formatSlugLabel(slug)} | Marketplace UMKM | DesaHub`,
  };
}

export default async function KategoriDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return <CategoryDetailView slug={slug} />;
}
