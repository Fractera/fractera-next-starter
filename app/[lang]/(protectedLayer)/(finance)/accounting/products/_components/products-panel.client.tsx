"use client"

// Динамический контейнер страницы цен.
//
// 🔒 ЭТОТ ФАЙЛ ТОЛЬКО СОБИРАЕТ. Поведение списка (страница, шаг, поиск) —
// `useProductList` на общем предке; тулбар, пагинация и скелетон — общие
// компоненты оттуда же. Своё здесь ровно одно: таблица, в которой правится
// цена. Копия списка ради другой роли была бы вторым местом, где чинить
// пагинацию.
//
// 🔒 ЗАКРЫТ ПО УМОЛЧАНИЮ, как и страница менеджера: пока человек не нажал,
// база не спрошена. Страница адресуема мгновенно.

import { useState } from "react"
import { useProductList } from "@/app/[lang]/(protectedLayer)/_lib/use-product-list"
import { ProductsToolbar } from "@/app/[lang]/(protectedLayer)/_components/products/products-toolbar.client"
import { ProductsPager } from "@/app/[lang]/(protectedLayer)/_components/products/products-pager.client"
import { ProductTableSkeleton } from "@/app/[lang]/(protectedLayer)/_components/products/product-table-skeleton"
import { localizeProduct } from "@/lib/products/localize"
import { ProductRow } from "./product-row.client"
import type { ProductListUi } from "@/app/[lang]/(protectedLayer)/_data/products.i18n"
import type { AccountingProductsUi } from "../_data/ui.i18n"

export function ProductsPanel(
  { lang, currency, labels, common }: { lang: string; currency: string; labels: AccountingProductsUi; common: ProductListUi },
) {
  const {
    revealed, loading, products, page, pages, total, perPage,
    query, setQuery, applied, load, search, resetSearch, changeSize,
  } = useProductList(common.failed)

  // Сохранённая цена кладётся в уже загруженный список, а не перезапрашивается:
  // повторный запрос ради одного изменившегося числа сбрасывает позицию прокрутки
  // и мигает таблицей на каждой правке.
  const [patched, setPatched] = useState<Record<string, number>>({})
  const rows = products.map(p =>
    localizeProduct(patched[p.id] != null ? { ...p, price: patched[p.id] } : p, lang),
  )

  return (
    <>
      <ProductsToolbar
        labels={{
          tableTitle: common.tableTitle,
          reveal: common.reveal,
          loading: common.loading,
          // Заводить товары бухгалтеру нечем — форма создания сюда не приходит,
          // и кнопка, которая её открывает, тоже.
          add: "",
          cancelAdd: "",
          searchPlaceholder: common.searchPlaceholder,
          find: common.find,
          reset: common.reset,
        }}
        revealed={revealed}
        loading={loading}
        adding={false}
        query={query}
        applied={applied}
        onQuery={setQuery}
        onReveal={() => void load({ page: 1 })}
        onSearch={() => void search()}
        onReset={() => void resetSearch()}
      />

      {!revealed ? (
        <>
          <ProductTableSkeleton
            labels={{ colPhoto: "", colName: common.colName, colPrice: common.colPrice, colId: common.colId }}
          />
          <p className="mt-3 text-xs text-muted-foreground">{common.revealHint}</p>
        </>
      ) : (
        <>
          <p className="mb-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            {labels.priceOnly}
          </p>

          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
              <p className="text-sm text-muted-foreground">{common.empty}</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{common.colName}</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{common.colPrice}</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{common.colId}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(p => (
                    <ProductRow
                      key={p.id}
                      product={p}
                      lang={lang}
                      currency={currency}
                      labels={{
                        save: labels.save, cancel: labels.cancel,
                        saved: labels.saved, failed: common.failed, invalidPrice: labels.invalidPrice,
                      }}
                      onSaved={(id, price) => setPatched(prev => ({ ...prev, [id]: price }))}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <ProductsPager
            labels={{
              count: common.count, perPage: common.perPage,
              prev: common.prev, next: common.next, pageOf: common.pageOf,
              first: common.first, last: common.last,
            }}
            total={total}
            page={page}
            pages={pages}
            perPage={perPage}
            onPage={(p) => void load({ page: p })}
            onSize={(s) => void changeSize(s)}
          />
        </>
      )}
    </>
  )
}
