import type { Metadata } from "next"
import { MediaImage } from "@/components/media/media-image.server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/nav/breadcrumbs.server"
import { buildAlternates } from "@/lib/seo/alternates"
import { constructMetadata } from "@/lib/construct-metadata"
import { buildProductSchema } from "@/lib/jsonld"
import { brand } from "@/lib/brand"
import { getAppConfig } from "@/config/app-config"
import { productById, prerenderSlugs } from "@/lib/catalogue"
import { localizeProduct } from "@/lib/products/localize"
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
export async function generateStaticParams() {
  const slugs = await prerenderSlugs()
  return slugs.map(slug => ({ slug }))
}

// 🔒 МЕТА СТРОИТСЯ ОБЩИМ СБОРЩИКОМ, А НЕ ОБЪЕКТОМ РУКАМИ. Написанный вручную
// объект накрывает только те поля, которые вспомнил автор, а остальные молча
// достаются от макета — и карточка товара в Twitter/X показывала имя и описание
// САЙТА вместо товара. `constructMetadata` заполняет весь набор из одного
// источника: og, twitter, robots, иконки, `metadataBase`.
//
// Заголовок возвращается СТРОКОЙ поверх собранного объекта намеренно: сборщик
// отдаёт `{ default, template }`, а шаблон применяется к потомкам, не к себе, —
// вкладка потеряла бы имя сайта («Яблоко» вместо «Яблоко | Fractera»). Строка
// же попадает под шаблон макета.
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string; slug: string }> },
): Promise<Metadata> {
  const { lang, slug } = await params
  const row = await productById(slug)
  if (!row) return {}
  const p = localizeProduct(row, lang)

  const meta = constructMetadata({
    lang,
    title: p.localizedName,
    description: p.localizedDescription ?? undefined,
    image: p.media_url ?? undefined,
    pathname: `/${lang}/products/${slug}`,
  })

  return {
    ...meta,
    title: p.localizedName,
    // hreflang сборщик не умеет — он даёт только canonical. Перевод товара живёт
    // по тому же адресу с другим языком, и об этом надо сказать явно.
    alternates: buildAlternates(lang, `/products/${slug}`),
  }
}

export default async function ProductPage({ lang, slug }: { lang: string; slug: string }) {
  const row = await productById(slug)
  if (!row) notFound()

  const p = localizeProduct(row, lang)
  const t = catalogueUi(lang)
  const site = brand()
  const currency = getAppConfig().commerce.currency

  // Разметка товара — ГОТОВЫМ сборщиком `buildProductSchema`, а не своим объектом.
  // Свой был написан здесь первым и потерял `priceCurrency`: разметка с ценой без
  // валюты отвергается поисковиком целиком, то есть карточка не появляется, хотя
  // разметка на странице есть. Сборщик знает про это поле, и знал всё время.
  //
  // Цена ПУБЛИЧНАЯ — та же, что видит человек без входа. Цена роли (скидка VIP)
  // появляется только после гидратации: показать поисковику одну цену, а
  // посетителю другую — это маскировка, за неё наказывают.
  const jsonLd = {
    ...buildProductSchema({
      name: p.localizedName,
      description: p.localizedDescription ?? undefined,
      price: p.price,
      currency,
      image: p.media_url ? (site.siteUrl ? `${site.siteUrl}${p.media_url}` : p.media_url) : undefined,
      url: site.siteUrl ? `${site.siteUrl}/${lang}/products/${p.id}` : undefined,
    }),
    sku: p.id,
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
              <MediaImage media={{ url: p.media_url!, width: p.media_width, height: p.media_height, blur: p.media_blur }} alt={p.localizedName} sizes="(max-width: 640px) 50vw, 280px" className="mx-auto h-72 w-full object-contain p-6" />
            </figure>
          )}

          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-2xl">{p.localizedName}</h1>
          <p className="mt-2 text-xl font-medium text-foreground">
            {/* Валюта показывается человеку тем же значением, что уезжает в разметку:
                цифра без валюты не значит ничего ни для того, ни для другого. */}
            {new Intl.NumberFormat(lang, { style: "currency", currency }).format(p.price)}
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
