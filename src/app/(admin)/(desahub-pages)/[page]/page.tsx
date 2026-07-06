import DesaHubPageShell from "@/components/pages/DesaHubPageShell";
import { desaHubPages } from "@/config/desahub-menu";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ page: string }>;
};

export function generateStaticParams() {
  return Object.keys(desaHubPages).map((page) => ({ page }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { page } = await params;
  const title = desaHubPages[page];

  if (!title) {
    return { title: "DesaHub" };
  }

  return {
    title: `${title} | DesaHub`,
    description: `${title} - DesaHub`,
  };
}

export default async function DesaHubPage({ params }: PageProps) {
  const { page } = await params;
  const title = desaHubPages[page];

  if (!title) {
    notFound();
  }

  return <DesaHubPageShell title={title} />;
}
