import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/nav/breadcrumbs.server"
import { buildAlternates } from "@/lib/seo/alternates"
import { brand } from "@/lib/brand"
import { productById, prerenderSlugs } from "@/lib/catalogue"
import { localizeProduct } from "../../../(protectedLayer)/(staff)/manage/products/_lib/localize-product"
import { catalogueUi } from "../../_data/ui.i18n"

// ПУБЛИЧНАЯ СТРАНИЦА ТОВАРА — статика через ISR.
//
// 🔒 ЧТО ЗДЕСЬ ДОКАЗАНО ДОКУМЕНТАЦИЕЙ, А НЕ ПРЕДПОЛОЖЕНО (Next 16.3):
//   • `generateStaticParams` предрендерит СРЕЗ товаров на сборке — время сборки
//     перестаёт зависеть от размера каталога;
//   • товар вне среза рождается при первом обращении и дальше отдаётся статикой
//     («generated at request time», `dynamicParams` по умолчанию `true`);
//   • товара, которого нет в базе, страница не выдумает: `notFound()` — и это
//     ровно то, что документация обещает словами «if the post does not exist,
//     then 404 is returned».
//
// Флаг `dynamicParams` НЕ выставлен намеренно: `true` — значение по умолчанию, а
// лишняя строка создаёт впечатление, что здесь есть выбор, которого нет.
//
// 🔒 `revalidate` СТАТИЧЕСКИ ВЫЧИСЛИМ. Документация требует буквально этого:
// `3600` можно, `60 * 60` нельзя — второе Next не разберёт и страница станет
// динамической молча.
export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await prerenderSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string; slug: string }> },
): Promise<Metadata> {
  const { lang, slug } = await params
  const row = await productById(slug)
  if (!row) return {}
  const p = localizeProduct(row, lang)
  return {
    title: p.localizedName,
    description: p.localizedDescription ?? undefined,
    alternates: buildAlternates(lang, `/products/${slug}`),
    openGraph: p.media_url ? { images: [p.media_url] } : undefined,
  }
}

export default async function ProductPage({ lang, slug }: { lang: string; slug: string }) {
  const row = await productById(slug)
  if (!row) notFound()

  const p = localizeProduct(row, lang)
  const t = catalogueUi(lang)
  const site = brand()

  // Разметка товара для поисковика. Цена здесь ПУБЛИЧНАЯ — та же, что видит
  // человек без входа. Цена роли (скидка VIP) появляется только после
  // гидратации: показать поисковику одну цену, а посетителю другую — это
  // маскировка, за неё наказывают.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.localizedName,
    ...(p.localizedDescription ? { description: p.localizedDescription } : {}),
    ...(p.media_url ? { image: site.siteUrl ? `${site.siteUrl}${p.media_url}` : p.media_url } : {}),
    sku: p.id,
    offers: {
      "@type": "Offer",
      price: p.price,
      availability: "https://schema.org/InStock",
      ...(site.siteUrl ? { url: `${site.siteUrl}/${lang}/products/${p.id}` } : {}),
    },
  }

  return (
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Breadcrumbs
          lang={lang}
          trail={[{ label: t.title, href: `/${lang}/products` }, { label: p.localizedName }]}
        />

        <article className="mt-6">
          {p.media_url && (
            <figure className="mb-6 overflow-hidden rounded-2xl border border-border bg-muted/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.media_url} alt={p.localizedName} className="mx-auto h-72 w-full object-contain p-6" />
            </figure>
          )}

          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-2xl">{p.localizedName}</h1>
          <p className="mt-2 text-xl font-medium text-foreground">
            {new Intl.NumberFormat(lang, { style: "decimal", minimumFractionDigits: 2 }).format(p.price)}
          </p>

          {p.localizedDescription && (
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">{p.localizedDescription}</p>
          )}

          <Link
            href={`/${lang}/products`}
            className="mt-8 inline-block text-xs text-muted-foreground underline hover:text-foreground"
          >
            ← {t.backToCatalogue}
          </Link>
        </article>
      </div>
    </main>
  )
}
