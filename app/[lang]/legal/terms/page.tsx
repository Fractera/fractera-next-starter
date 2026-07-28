import { LegalPage } from "../../_components/legal/legal-page.server";

// PUBLIC LEGAL ROUTE (step 305) — /<lang>/legal/terms. See privacy/page.tsx for the routing note.
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LegalPage doc="terms" lang={lang} />;
}
