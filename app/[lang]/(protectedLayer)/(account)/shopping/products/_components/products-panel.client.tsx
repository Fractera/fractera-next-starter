"use client"

// Динамический контейнер страницы покупателя.
//
// 🔒 ЭТОТ ФАЙЛ ТОЛЬКО СОБИРАЕТ — как и три соседних слоя. Список, тулбар,
// пагинация, скелетон и таблица общие, с корня защищённого слоя; своего здесь
// ровно одно: действие строки, то есть то, чем эта роль отличается от остальных.
//
// 🔒 СТРОКИ — ССЫЛКИ НА ПУБЛИЧНУЮ СТРАНИЦУ ТОВАРА. У покупателя нет карточки
// управления, зато есть витрина, и это законный адрес для него: страница
// открыта всем и уже статическая. Слои персонала и покупателя ведут отсюда в
// РАЗНЫЕ места, и это как раз то, ради чего адрес строки стал свойством слоя.

import { useProductList } from "@/app/[lang]/(protectedLayer)/_lib/use-product-list"
import { ProductsToolbar } from "@/app/[lang]/(protectedLayer)/_components/products/products-toolbar.client"
import { ProductsPager } from "@/app/[lang]/(protectedLayer)/_components/products/products-pager.client"
import { ProductTable } from "@/app/[lang]/(protectedLayer)/_components/products/product-table.client"
import { ProductTableSkeleton } from "@/app/[lang]/(protectedLayer)/_components/products/product-table-skeleton"
import type { CartUi } from "@/components/cart/cart.i18n"
import { AddToOrder } from "./add-to-order.client"
import type { ShoppingProductsUi } from "../_data/ui.i18n"

export function ProductsPanel(
  { lang, currency, labels, cart }:
  { lang: string; currency: string; labels: ShoppingProductsUi; cart: CartUi },
) {
  const list = useProductList(labels.failed)

  return (
    <>
      <ProductsToolbar
        labels={{
          tableTitle: labels.tableTitle,
          reveal: labels.reveal,
          loading: labels.loading,
          // Заводить товары покупатель не может — кнопки создания у него нет.
          add: "",
          cancelAdd: "",
          searchPlaceholder: labels.searchPlaceholder,
          find: labels.find,
          reset: labels.reset,
        }}
        revealed={list.revealed}
        loading={list.loading}
        adding={false}
        query={list.query}
        applied={list.applied}
        onQuery={list.setQuery}
        onReveal={() => void list.load({ page: 1 })}
        onToggleAdd={() => {}}
        onSearch={() => void list.search()}
        onReset={() => void list.resetSearch()}
      />

      {!list.revealed ? (
        <>
          <ProductTableSkeleton
            labels={{ colPhoto: labels.colPhoto, colName: labels.colName, colPrice: labels.colPrice, colId: labels.colId }}
          />
          <p className="mt-3 text-xs text-muted-foreground">{labels.revealHint}</p>
        </>
      ) : (
        <>
          <p className="mb-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            {labels.buyOnly}
          </p>

          <ProductTable
            products={list.products}
            lang={lang}
            currency={currency}
            labels={{
              colPhoto: labels.colPhoto, colName: labels.colName,
              colPrice: labels.colPrice, colId: labels.colId, empty: labels.empty,
            }}
            hrefFor={(id) => `/${lang}/products/${id}`}
            rowAction={(p) => <AddToOrder product={p} labels={cart} />}
          />

          <ProductsPager
            labels={{
              count: labels.count, perPage: labels.perPage,
              prev: labels.prev, next: labels.next, pageOf: labels.pageOf,
              first: labels.first, last: labels.last,
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
