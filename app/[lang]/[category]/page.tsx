import type { Metadata } from "next";
import { CategoryPage } from "../_components/projects/category-page.server";
import { getCatalog, getCategory, pickI18n } from "../_components/projects/catalog";
import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config";

// PUBLIC CATEGORY ROUTE — /<lang>/<category>.
//
// STATIC-FIRST (step 311): statically generated (ISR), reversing step-304 force-dynamic. generateStaticParams
// pre-renders every category × language; dynamicParams=true renders an unknown-yet one on demand, then
// static. The component calls notFound() for an unknown category.
export const revalidate = 300;
export const dynamicParams = true;

// META from the category's own localized title/description (durable rule, step 311).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}): Promise<Metadata> {
  const { lang, category } = await params;
  const cat = await getCategory(category);
  if (!cat) return {};
  const title = pickI18n(cat.titleI18n, lang);
  const description = pickI18n(cat.descriptionI18n, lang);
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export async function generateStaticParams() {
  const categories = await getCatalog();
  return SUPPORTED_LANGUAGES.flatMap((lang) =>
    categories.map((cat) => ({ lang, category: cat.slug })),
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}) {
  const { lang, category } = await params;
  return <CategoryPage lang={lang} category={category} />;
}
