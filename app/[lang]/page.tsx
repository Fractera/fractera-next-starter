import HomeEntry from "./_components"

// Thin server entry — a page is never a client component. All logic and markup
// live in the route's entry component (_components/index.tsx). Localized route:
// the [lang] segment selects the language; proxy.ts maps `/` → `/<default>`.
// See app/CRUD-DOCS/workspace-standards/shell-component-architecture.md.

// Public localized content — static-first (STATIC-FIRST.md). Time-based ISR: generated once, then
// re-generated lazily on the first request after the revalidate window, for this page only (the server
// sleeps when idle; unvisited pages never re-render). dynamicParams renders an unlisted language on
// demand (the resolver gives an en-fallback), then caches it. generateStaticParams is on
// [lang]/layout.tsx.
export const dynamicParams = true;
export const revalidate = 600;

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return <HomeEntry lang={lang} />
}
