import type { Metadata } from "next";
import PublicMenu from "@/components/menu/PublicMenu";

interface MenuPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: MenuPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `قائمة ${slug}`,
    description: "قائمة طعام رقمية",
  };
}

export default async function PublicMenuPage({ params }: MenuPageProps) {
  const { slug } = await params;
  return <PublicMenu slug={slug} />;
}
