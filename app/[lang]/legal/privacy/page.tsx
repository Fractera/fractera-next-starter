import { LegalPage } from "../../_components/legal/legal-page.server";

// PUBLIC LEGAL ROUTE (step 305) — /<lang>/legal/privacy. Static segment `legal` wins over the dynamic
// [category] at this level, so this subtree is never captured by the showcase router. Dynamic per request:
// the body comes from the runtime config the architect may change at any time.
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LegalPage doc="privacy" lang={lang} />;
}
