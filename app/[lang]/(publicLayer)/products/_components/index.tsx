import type { Metadata } from "next"
import { buildAlternates } from "@/lib/seo/alternates"
import { constructMetadata } from "@/lib/construct-metadata"
import { getAppConfig } from "@/config/app-config"
import { firstProducts, productsTotal } from "@/lib/catalogue"
import { localizeProduct } from "@/lib/products/localize"
import type { Product } from "@/lib/products/types"
import { catalogueUi } from "../_data"
import { CatalogueGrid } from "../_widgets/static/catalogue-grid"
import { PageHeader } from "@/components/content-page/page-header.server"
import { PageShell } from "@/components/content-page/page-shell"
import { EmptyState } from "@/components/ui/empty-state"

// ПУБЛИЧНАЯ ВИТРИНА КАТАЛОГА — одна страница, без пагинации (владелец
// 2026-08-11).
//
// 🔒 ПЕРВАЯ ПАРТИЯ УЕЗЖАЕТ В СТАТИЧЕСКИЙ HTML. Это не оптимизация, а условие
// существования SEO: поисковик, пришедший на витрину, обязан увидеть товары и
// ссылки на них в разметке, а не пустой каркас со скелетоном. По той же причине
// страница читается с выключенным JS.
//
// Остальные подгружаются по требованию — «показать ещё». Товары за пределами
// первой партии в HTML не попадают, поэтому индексируются они через КАРТУ САЙТА
// (`app/sitemap.ts`), а не через ссылки отсюда. Без карты сайта такой каталог
// показывал бы поисковику только первые двадцать четыре товара — и это не
// мелочь, а половина проекта вне индекса.
//
// ISR: страница пересобирается раз в час, а при создании товара — сразу, по
// метке `revalidateTag(CATALOGUE_TAG)`. Значение `revalidate` обязано быть
// статически вычислимым (документация Next 16): `3600` можно, `60 * 60` нельзя.
// Мета — общим сборщиком, как у страницы товара: объект, написанный руками,
// покрывает только вспомненные поля, а карточка в соцсетях достаётся от макета
// и рассказывает про сайт вместо каталога.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const t = catalogueUi(lang)
  const meta = constructMetadata({
    lang,
    title: t.metaTitle,
    description: t.metaDescription,
    pathname: `/${lang}/products`,
  })
  return { ...meta, title: t.metaTitle, alternates: buildAlternates(lang, "/products") }
}

export default async function Catalogue({ lang }: { lang: string }) {
  const t = catalogueUi(lang)
  const [rows, total] = await Promise.all([firstProducts(), productsTotal()])
  const products = (rows as unknown as Product[]).map(p => localizeProduct(p, lang))
  const cfg = getAppConfig()

  // Разметка списка: витрина — это перечень товаров, и `ItemList` ровно про то,
  // ЧТО перечислено и в каком порядке. Без неё поисковик видит просто набор
  // ссылок и решает сам, список это или меню.
  //
  // Перечисляется только то, что действительно есть в HTML — первая партия.
  // Объявить в разметке товары, которых на странице нет, значит соврать о
  // содержимом страницы; остальные приходят из карты сайта.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.localizedName,
      ...(cfg.url ? { url: `${cfg.url}/${lang}/products/${p.id}` } : {}),
    })),
  }

  return (
    /* Оболочка — общая (`PageShell`, 2026-08-19). Здесь стоял свой `<main>` со
       своей лентой и своим воздухом `py-work`: витрина — публичная страница с
       шапкой, и воздух у неё обязан быть тот же, что у блога, постов и правовых
       страниц. Своё значение стояло не по решению, а потому что решение
       принималось в этом файле. */
    /* 🔒 РИТМ ЛЕНТЫ — НА КОЛОНКЕ, А НЕ ОТСТУПОМ У СЕТКИ (владелец 2026-08-22:
       карточки касались черты под шапкой). Ровно так это уже сделано у списка
       блога — `flex flex-col gap-12`, — и повторить его дешевле, чем завести
       здесь своё число: два похожих списка с разным воздухом читаются как
       недоделка, а не как решение. Правка одна, а лечит и сетку, и пустое
       состояние, и кнопку под ними. */
    <PageShell className="flex flex-col gap-12" jsonLd={<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />}>
      <PageHeader lang={lang} breadcrumbs={[{ label: t.title }]} title={t.title} subtitle={t.subtitle} />

      {products.length === 0 ? (
        <EmptyState title={t.empty} />
      ) : (
        <CatalogueGrid
          lang={lang}
          products={products}
          total={total}
          currency={cfg.commerce.currency}
          labels={{ loadMore: t.loadMore, loading: t.loading, failed: t.failed, shown: t.shown }}
        />
      )}
    </PageShell>
  )
}
