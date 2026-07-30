import type { Metadata } from "next"
import HomeEntry from "./_components"
import { projectsStrings } from "./_components/projects/projects.i18n"

// Thin server entry — a page is never a client component. All logic and markup
// live in the route's entry component (_components/index.tsx). Localized route:
// the [lang] segment selects the language; proxy.ts maps `/` → `/<default>`.
// See app/CRUD-DOCS/workspace-standards/shell-component-architecture.md.

// STATIC-FIRST (step 311, owner's decision — reverses the step-304 force-dynamic): the home body is the
// public project showcase reading the :3003 catalog, now with ISR caching (see catalog.ts) instead of a
// per-request render. The page is statically generated and re-fetches the catalog at most once per window,
// so opening the home costs the server nothing. [lang] langs are enumerated by the layout's
// generateStaticParams; dynamicParams renders an unlisted language on demand (en-fallback resolver).
export const revalidate = 300
export const dynamicParams = true

// META for the home (localized chrome strings — the showcase title/subtitle).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const L = projectsStrings(lang)
  return {
    title: L.homeTitle,
    description: L.homeSubtitle,
    openGraph: { title: L.homeTitle, description: L.homeSubtitle },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return <HomeEntry lang={lang} />
}
