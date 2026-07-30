import type { Metadata } from "next";
import { AutomationPage } from "../../_components/projects/automation-page.server";
import { getCatalog, getAutomation } from "../../_components/projects/catalog";
import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config";

// PUBLIC AUTOMATION ROUTE — /<lang>/<category>/<automation>.
//
// STATIC-FIRST (step 311, owner's decision — reverses step-304 force-dynamic): the page is STATICALLY
// generated (ISR). generateStaticParams pre-renders every listed automation × language at build; the catalog
// is refetched on the ISR window (see catalog.ts), and dynamicParams=true renders a not-yet-built one on
// first request, then serves it static. No SSR per visitor — the only per-visitor part (the body access
// gate) is a client island inside AutomationPage.
export const revalidate = 300;
export const dynamicParams = true;

// META FROM THE AUTOMATION'S PASSPORT (durable rule, step 311): a public automation page's SEO title +
// description come from its own `passport.title` / `passport.description` (served through the catalog hero).
// This runs for EVERY automation with no per-automation work — create an automation and its page is
// self-describing. Unknown automation → the layout default (the page itself will notFound()).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; category: string; automation: string }>;
}): Promise<Metadata> {
  const { category, automation } = await params;
  const hero = await getAutomation(category, automation);
  if (!hero) return {};
  return {
    title: hero.title,
    description: hero.description,
    openGraph: { title: hero.title, description: hero.description },
    twitter: { card: "summary", title: hero.title, description: hero.description },
  };
}

export async function generateStaticParams() {
  const categories = await getCatalog();
  const params: { lang: string; category: string; automation: string }[] = [];
  for (const lang of SUPPORTED_LANGUAGES) {
    for (const cat of categories) {
      for (const a of cat.automations) {
        params.push({ lang, category: cat.slug, automation: a.slug });
      }
    }
  }
  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; category: string; automation: string }>;
}) {
  const { lang, category, automation } = await params;
  return <AutomationPage lang={lang} category={category} automation={automation} />;
}
