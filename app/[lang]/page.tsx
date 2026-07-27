import HomeEntry from "./_components"

// Thin server entry — a page is never a client component. All logic and markup
// live in the route's entry component (_components/index.tsx). Localized route:
// the [lang] segment selects the language; proxy.ts maps `/` → `/<default>`.
// See app/CRUD-DOCS/workspace-standards/shell-component-architecture.md.

// Step 304 (owner's decision): the home body is now the public project showcase, which reads the live
// catalog from the Projects service (:3003) at request time — a DELIBERATE, owner-approved exception to
// the static-first canon (STATIC-FIRST.md) for the project surface. Dynamic per request, not ISR.
// dynamicParams still renders an unlisted language on demand (the resolver gives an en-fallback).
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return <HomeEntry lang={lang} />
}
