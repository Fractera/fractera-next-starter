"use client"

// ВИДЖЕТ «витрина аккаунта» — динамический островок покупателя (шаг 521).
//
// 🔒 ЭТО ЕДИНИЦА ВЛАДЕНИЯ, А НЕ СБОРКА ЧУЖИХ КУСКОВ. Всё, что отвечает на вопрос
// «как выглядит и ведёт себя ЭТА таблица», лежит в этой папке: поведение списка,
// скелетон, управление, подвал, строка, покупка и слова. Снеси папку маршрута —
// виджет исчезнет целиком, не оставив ссылок. Это и есть приёмка.
//
// 🔒 ЧТО ОСТАЛОСЬ СНАРУЖИ. Только сквозное — то, что отвечает «как проект вообще
// делает X»: `projectApi` (обращение к базе), `toast` (сообщение о неудаче),
// `components/ui/*` (кольцо примитивов), `lib/products/*` (модель предмета),
// `components/cart/*` (корзина — переиспользуемая часть продукта: она живёт в
// шапке на каждой странице и говорит на 82 языках).
//
// 🔒 ЗАКРЫТ ПО УМОЛЧАНИЮ. Пока человек не нажал «Показать», база не спрошена, и
// страница адресуема мгновенно: защищённая страница — это статическая страница с
// динамическими дырами, а не динамическая страница.

import { localizeProduct } from "@/lib/products/localize"
import { EmptyState } from "@/components/ui/empty-state"
import type { CartUi } from "@/components/cart/cart.i18n"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"
import { useShopList } from "./use-list"
import { ShopToolbar } from "./toolbar.client"
import { ShopPager } from "./pager.client"
import { ShopTableSkeleton } from "./skeleton"
import { ShopRow } from "./row"
import { AddToOrder } from "./add-to-order.client"
import type { ShopTableUi } from "./ui.i18n"

export function ShopTable(
  { lang, currency, ui, labels, cart, dialogUi }: {
    lang: string
    /** Валюта витрины: цена без неё — просто цифра. */
    currency: string
    /** Слова САМОГО виджета. Резолвятся на сервере и приезжают пропсом. */
    ui: ShopTableUi
    /** Слова страницы: объяснение того, что здесь можно, а чего нельзя. */
    labels: { buyOnly: string }
    /** Слова корзины — переиспользуемая часть продукта, 82 языка. */
    cart: CartUi
    dialogUi: AppDialogUi
  },
) {
  const list = useShopList(ui.failed)
  const money = new Intl.NumberFormat(lang, { style: "currency", currency })

  return (
    <>
      <ShopToolbar
        labels={{
          tableTitle: ui.tableTitle,
          reveal: ui.reveal,
          loading: ui.loading,
          searchPlaceholder: ui.searchPlaceholder,
          find: ui.find,
          reset: ui.reset,
        }}
        revealed={list.revealed}
        loading={list.loading}
        query={list.query}
        applied={list.applied}
        onQuery={list.setQuery}
        onReveal={() => void list.load({ page: 1 })}
        onSearch={() => void list.search()}
        onReset={() => void list.resetSearch()}
      />

      {!list.revealed ? (
        <>
          {/* Скелетон держит место под «минус · количество · плюс · корзина», а
              не под значок: форма загрузки та же, что форма ответа. */}
          <ShopTableSkeleton
            labels={{ colPhoto: ui.colPhoto, colName: ui.colName, colPrice: ui.colPrice, colId: ui.colId }}
          />
          <p className="mt-3 text-xs text-muted-foreground">{ui.revealHint}</p>
        </>
      ) : (
        <>
          <p className="mb-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            {labels.buyOnly}
          </p>

          {list.products.length === 0 ? (
            <EmptyState title={ui.empty} />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="w-14 px-4 py-2.5 text-left font-medium text-muted-foreground">{ui.colPhoto}</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{ui.colName}</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{ui.colPrice}</th>
                    <th className="px-4 py-2.5 text-left font-mono font-medium text-muted-foreground">{ui.colId}</th>
                    <th className="w-40 px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {list.products.map((row, i) => {
                    const p = localizeProduct(row, lang)
                    return (
                      <ShopRow
                        key={p.id}
                        product={p}
                        href={`/${lang}/products/${p.id}`}
                        money={money}
                        striped={i % 2 !== 0}
                        action={<AddToOrder product={p} labels={cart} dialogUi={dialogUi} />}
                      />
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <ShopPager
            labels={{
              count: ui.count, perPage: ui.perPage,
              prev: ui.prev, next: ui.next, pageOf: ui.pageOf,
              first: ui.first, last: ui.last,
            }}
            total={list.total}
            page={list.page}
            pages={list.pages}
            perPage={list.perPage}
            onPage={(p) => void list.load({ page: p })}
            onSize={(s) => void list.changeSize(s)}
          />
        </>
      )}
    </>
  )
}
