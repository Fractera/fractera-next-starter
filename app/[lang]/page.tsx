import type { Metadata } from "next"
import HomeEntry from "./_components"
import { getAppConfig, metaForLang } from "@/config/app-config"

// Thin server entry — a page is never a client component. All logic and markup
// live in the route's entry component (_components/index.tsx).
//
// Step 500: the public project showcase was removed together with the projects
// layer (:3003). The home is now the workspace's own identity, read from
// APP-CONFIG, so the page needs no data fetch at all — plain static output.
export const revalidate = 300
export const dynamicParams = true

// Мета берётся НА ЯЗЫК (шаг 501). Прежде эта функция даже не принимала `params`:
// при двух языках испанская страница получала английский заголовок и описание, то
// есть объявляла себя англоязычной. Перевод берётся из `i18n` конфига, а если его
// нет — основное значение (правило «нет перевода → основной язык»).
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> },
): Promise<Metadata> {
  const { lang } = await params
  const { title, description, siteName } = metaForLang(lang)
  return {
    title,
    description,
    openGraph: { title, description, siteName, locale: lang },
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
