import type { Metadata } from "next"
import { MediaImage } from "@/components/media/media-image.server"
import Link from "next/link"
import { Breadcrumbs } from "@/components/nav/breadcrumbs.server"
import { buildAlternates } from "@/lib/seo/alternates"
import { constructMetadata } from "@/lib/construct-metadata"
import { getAppConfig } from "@/config/app-config"
import { firstProducts, productsTotal, FIRST_BATCH } from "@/lib/catalogue"
import { localizeProduct } from "@/lib/products/localize"
import type { Product } from "@/lib/products/types"
import { catalogueUi } from "../_data/ui.i18n"
import { LoadMore } from "./load-more.client"

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
  const money = new Intl.NumberFormat(lang, { style: "currency", currency: cfg.commerce.currency })

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
    <main className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Breadcrumbs lang={lang} trail={[{ label: t.title }]} />

        <header className="mb-8 mt-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-xl">{t.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
        </header>

        {products.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-12 text-center text-sm text-muted-foreground">
            {t.empty}
          </p>
        ) : (
          <>
            {/* Сетка — серверная разметка. Каждая карточка это ССЫЛКА: её видит
                поисковик, она открывается средним щелчком и работает без JS. */}
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.map(p => (
                <li key={p.id}>
                  <Link
                    href={`/${lang}/products/${p.id}`}
                    className="group block overflow-hidden rounded-xl border border-border transition-colors hover:border-foreground/30"
                  >
                    <div className="aspect-square bg-muted/30 p-4">
                      {p.media_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <MediaImage media={{ url: p.media_url!, width: p.media_width, height: p.media_height, blur: p.media_blur }} alt={p.localizedName} sizes="(max-width: 640px) 50vw, 280px" className="h-full w-full object-contain" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">—</div>
                      )}
                    </div>
                    <div className="border-t border-border p-3">
                      <p className="truncate text-sm font-medium text-foreground group-hover:underline">
                        {p.localizedName}
                      </p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{money.format(p.price)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Догрузка появляется, только если есть что грузить. */}
            {total > FIRST_BATCH && (
              <LoadMore
                lang={lang}
                total={total}
                loaded={products.length}
                // Валюта приезжает ПРОПОМ: островок не читает настройки — они
                // серверные, и половина сетки иначе показывала бы цену в валюте,
                // а вторая половина, догруженная, голой цифрой.
                currency={cfg.commerce.currency}
                labels={{ more: t.loadMore, loading: t.loading, failed: t.failed, shown: t.shown }}
              />
            )}
          </>
        )}
      </div>
    </main>
  )
}
