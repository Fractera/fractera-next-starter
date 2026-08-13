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
import type { ProductListUi } from "@/app/[lang]/(protectedLayer)/_data/products.i18n"
import type { ShoppingProductsUi } from "../_data/ui.i18n"

export function ProductsPanel(
  { lang, currency, labels, common, cart }:
  { lang: string; currency: string; labels: ShoppingProductsUi; common: ProductListUi; cart: CartUi },
) {
  const list = useProductList(common.failed)

  return (
    <>
      <ProductsToolbar
        labels={{
          tableTitle: common.tableTitle,
          reveal: common.reveal,
          loading: common.loading,
          // Заводить товары покупатель не может — кнопки создания у него нет.
          add: "",
          cancelAdd: "",
          searchPlaceholder: common.searchPlaceholder,
          find: common.find,
          reset: common.reset,
        }}
        revealed={list.revealed}
        loading={list.loading}
        adding={false}
        query={list.query}
        applied={list.applied}
        onQuery={list.setQuery}
        onReveal={() => void list.load({ page: 1 })}
        onSearch={() => void list.search()}
        onReset={() => void list.resetSearch()}
      />

      {!list.revealed ? (
        <>
          <ProductTableSkeleton
            labels={{ colPhoto: common.colPhoto, colName: common.colName, colPrice: common.colPrice, colId: common.colId }}
          />
          <p className="mt-3 text-xs text-muted-foreground">{common.revealHint}</p>
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
              colPhoto: common.colPhoto, colName: common.colName,
              colPrice: common.colPrice, colId: common.colId, empty: common.empty,
            }}
            hrefFor={(id) => `/${lang}/products/${id}`}
            rowAction={(p) => <AddToOrder product={p} labels={cart} />}
          />

          <ProductsPager
            labels={{
              count: common.count, perPage: common.perPage,
              prev: common.prev, next: common.next, pageOf: common.pageOf,
              first: common.first, last: common.last,
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
