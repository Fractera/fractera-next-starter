import { notFound } from "next/navigation";
import { SUPPORTED_LANGUAGES } from "@/config/translations/translations.config";

// Nested layout for localized CONTENT routes (the home page and any pages the
// user builds under /<lang>/…). The root app/layout.tsx owns <html>/<body>, the
// theme and JSON-LD; this layer only validates the language segment. Service
// pages (/architecture, /ai-core, …) live at the root and never reach here —
// proxy.ts keeps them unprefixed.
//
// generateStaticParams enumerates the configured languages so they can be
// statically generated once the content subtree is opted out of force-dynamic
// (see CRUD-DOCS/workspace-standards/multilingual-content.md §4 — the static
// optimization is a follow-up that requires a real `next build` to verify).
export function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!SUPPORTED_LANGUAGES.includes(lang)) notFound();
  return <>{children}</>;
}
