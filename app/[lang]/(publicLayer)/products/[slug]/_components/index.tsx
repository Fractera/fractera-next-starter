import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/nav/breadcrumbs.server"
import { buildAlternates } from "@/lib/seo/alternates"
import { constructMetadata } from "@/lib/construct-metadata"
import { buildProductSchema } from "@/lib/jsonld"
import { brand } from "@/lib/brand"
import { getAppConfig } from "@/config/app-config"
import { productById, prerenderSlugs } from "@/lib/catalogue"
import { localizeProduct } from "@/lib/products/localize"
import { catalogueUi } from "../../_data"
import { ProductDetail } from "../_widgets/static/product-detail"
import { PageShell } from "@/components/content-page/page-shell"

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
    /* Оболочка — общая (`PageShell`, 2026-08-19): свой `<main>` со своей лентой
       и своим воздухом здесь стоял ровно потому, что решение принималось в этом
       файле, а не в общем месте. */
    <PageShell jsonLd={<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}>
      <Breadcrumbs
        lang={lang}
        trail={[{ label: t.title, href: `/${lang}/products` }, { label: p.localizedName }]}
      />

      <ProductDetail
        lang={lang}
        product={p}
        currency={currency}
        backLabel={t.backToCatalogue}
      />
    </PageShell>
  )
}
