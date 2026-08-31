import Link from "next/link"
import { MediaImage } from "@/components/media/media-image.server"
import type { LocalizedProduct } from "@/lib/products/localize"
import { FIRST_BATCH } from "@/lib/catalogue"
import { LoadMore } from "./load-more.client"

// ВИДЖЕТ «сетка витрины» — облик каталога товаров, принадлежащий ОДНОМУ маршруту
// (шаг 64).
//
// 🔒 ПОЧЕМУ ВИДЖЕТ, А НЕ ВИД КАТАЛОГА. Вид каталога обязан подходить ЛЮБОЙ
// странице проекта — на то он и каталог. Эта сетка не подходит ни одной другой:
// у неё товары из базы, цена в валюте проекта, догрузка по требованию и
// разметка `ItemList` на странице. Заведи её киндом — и в закрытом каталоге
// появится вид, который никто никогда не выберет из списка.
// ✗ Оплачено шагом 63: до него разметка лежала прямо в странице, и сторож
// `check:page-composition` числил её долгом — законных источников у страницы
// три, и «своя вёрстка» в них не входит.
//
// 🔒 ДАННЫЕ ДОБЫВАЕТ СТРАНИЦА, РИСУЕТ ВИДЖЕТ. Виджет, ходящий в базу сам,
// нельзя ни переставить, ни проверить отдельно от маршрута; а страница обязана
// добыть их всё равно — из тех же товаров она строит разметку `ItemList` для
// поисковика.
//
// 🔒 ВАЛЮТА ПРИЕЗЖАЕТ СТРОКОЙ, А НЕ ГОТОВЫМ ФОРМАТТЕРОМ. Формат цены нужен и
// здесь, и внутри островка догрузки, а `Intl.NumberFormat` через границу
// клиента не переедет: половина сетки показывала бы цену в валюте, а
// догруженная половина — голой цифрой.
export function CatalogueGrid({
  lang,
  products,
  total,
  currency,
  labels,
}: {
  lang: string
  products: LocalizedProduct[]
  total: number
  currency: string
  labels: { loadMore: string; loading: string; failed: string; shown: string }
}) {
  const money = new Intl.NumberFormat(lang, { style: "currency", currency })

  return (
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
          currency={currency}
          labels={{ more: labels.loadMore, loading: labels.loading, failed: labels.failed, shown: labels.shown }}
        />
      )}
    </>
  )
}
