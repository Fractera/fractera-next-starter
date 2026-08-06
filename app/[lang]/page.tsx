import type { Metadata } from "next"
import HomeEntry from "./_components"
import { getAppConfig } from "@/config/app-config"

// Thin server entry — a page is never a client component. All logic and markup
// live in the route's entry component (_components/index.tsx).
//
// Step 500: the public project showcase was removed together with the projects
// layer (:3003). The home is now the workspace's own identity, read from
// APP-CONFIG, so the page needs no data fetch at all — plain static output.
export const revalidate = 300
export const dynamicParams = true

export async function generateMetadata(): Promise<Metadata> {
  const config = getAppConfig()
  const title = config.name || config.short_name || ""
  const description = config.description || ""
  return {
    title,
    description,
    openGraph: { title, description },
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
