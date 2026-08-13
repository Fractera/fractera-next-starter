import type { Metadata } from "next"
import HomeEntry from "./_components"
import { getAppConfig, metaForLang } from "@/config/app-config"
import { buildAlternates, urlFor } from "@/lib/seo/alternates"

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
//
// 🔒 СВОИ АЛЬТЕРНАТИВЫ — ШАГ 503, И ЭТО БЫЛА САМАЯ ДОРОГАЯ ПРОПАЖА ПРОЕКТА.
// Здесь их не было, и главная брала канонический адрес у макета — а он один на всё
// дерево и равен корню сайта. То есть КАЖДЫЙ языковой вариант главной объявлял
// каноническим английский корень: `/ru` дословно говорил поисковику «я копия `/`,
// индексируй не меня». Плюс ни одного `hreflang` — переводы друг о друге не знали.
// Набор одинаковых по смыслу адресов, ни один из которых не назвал себя оригиналом,
// — это то, что поисковик называет дорвеем, и теряется при этом не позиция, а
// присутствие целых языков.
//
// Заметить это глазами нельзя: страницы открываются, переключатель работает, сайт
// выглядит исправным. Поэтому проверка машинная — `npm run check:seo`.
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> },
): Promise<Metadata> {
  const { lang } = await params
  const { title, description, siteName } = metaForLang(lang)
  return {
    title,
    description,
    // Главная — пустой `subPath`: `/` для языка по умолчанию, `/<язык>` для
    // остальных, и просто `/` в одноязычном режиме.
    alternates: buildAlternates(lang, ""),
    // 🔒 `og:url` ОБЪЯВЛЯЕТСЯ ЗДЕСЬ, А НЕ НАСЛЕДУЕТСЯ. Раньше он приезжал из
    // макета вместе с его каноническим адресом — то есть на всех языках указывал
    // на корень сайта, и русская карточка в мессенджере вела на английскую
    // страницу. Когда умолчание макета убрали (шаг 503), неверный адрес честно
    // исчез, а верный обязан появиться здесь: тот же `urlFor`, что и у
    // канонического адреса, поэтому разойтись они не могут.
    openGraph: { title, description, siteName, locale: lang, url: urlFor(lang, "") },
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
