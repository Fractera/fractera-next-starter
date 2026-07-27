import { AutomationPage } from "../../_components/projects/automation-page.server";

// PUBLIC AUTOMATION ROUTE (step 304) — /<lang>/<category>/<automation>. Dynamic per request: the hero
// (title + description) is always shown; the body is gated by the automation's access tier against the
// caller's roles (see automation-page.server.tsx). notFound() for an unknown category/automation.
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; category: string; automation: string }>;
}) {
  const { lang, category, automation } = await params;
  return <AutomationPage lang={lang} category={category} automation={automation} />;
}
