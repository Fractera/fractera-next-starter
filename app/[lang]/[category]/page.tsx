import { CategoryPage } from "../_components/projects/category-page.server";

// PUBLIC CATEGORY ROUTE (step 304) — /<lang>/<category>. Dynamic segment: it catches any first-level path
// under [lang] that is not a real static content group (Next resolves static segments first), so the
// component calls notFound() when the category is unknown. Dynamic per request (reads the live :3003 catalog).
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}) {
  const { lang, category } = await params;
  return <CategoryPage lang={lang} category={category} />;
}
