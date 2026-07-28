import { LegalPage } from "../../_components/legal/legal-page.server";

// PUBLIC LEGAL ROUTE (step 305) — /<lang>/legal/imprint (Legal Notice / Impressum). See privacy/page.tsx.
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LegalPage doc="imprint" lang={lang} />;
}
