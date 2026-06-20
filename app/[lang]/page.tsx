import HomeEntry from "./_components"

// Thin server entry — a page is never a client component. All logic and markup
// live in the route's entry component (_components/index.tsx). Localized route:
// the [lang] segment selects the language; proxy.ts maps `/` → `/<default>`.
// See app/CRUD-DOCS/workspace-standards/shell-component-architecture.md.
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return <HomeEntry lang={lang} />
}
