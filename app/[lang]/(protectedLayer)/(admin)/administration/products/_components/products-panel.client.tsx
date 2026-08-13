"use client"

// Динамический контейнер страницы администрирования.
//
// 🔒 ЭТОТ ФАЙЛ ТОЛЬКО СОБИРАЕТ. Поведение списка, тулбар, пагинация, скелетон и
// сама таблица — общие, с корня защищённого слоя. Своего здесь ровно столько,
// сколько отличает эту роль от соседних: удаление и предупреждение о нём.
//
// 🔒 ТАБЛИЦЕ НЕ ПЕРЕДАЁТСЯ `hrefFor` — И ЭТО НЕ ЗАБЫВЧИВОСТЬ. Строки не ссылки,
// потому что вести некуда: карточка товара принадлежит слою персонала, и
// администратор её открыть не может. Ссылка, ведущая в отказ, — обещание,
// которого интерфейс не сдержит.

import { useState } from "react"
import { toast } from "sonner"
import { Trash2, Loader2 } from "lucide-react"
import { useProductList } from "@/app/[lang]/(protectedLayer)/_lib/use-product-list"
import { ProductsToolbar } from "@/app/[lang]/(protectedLayer)/_components/products/products-toolbar.client"
import { ProductsPager } from "@/app/[lang]/(protectedLayer)/_components/products/products-pager.client"
import { ProductTable } from "@/app/[lang]/(protectedLayer)/_components/products/product-table.client"
import { ProductTableSkeleton } from "@/app/[lang]/(protectedLayer)/_components/products/product-table-skeleton"
import { projectApi } from "@/lib/architecture/project-api"
import type { ProductListUi } from "@/app/[lang]/(protectedLayer)/_data/products.i18n"
import type { AdministrationProductsUi } from "../_data/ui.i18n"

export function ProductsPanel(
  { lang, currency, labels, common }: { lang: string; currency: string; labels: AdministrationProductsUi; common: ProductListUi },
) {
  const list = useProductList(common.failed)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function remove(id: string) {
    // Подтверждение — не формальность: это единственное действие в приложении,
    // после которого нельзя вернуться назад.
    if (!confirm(labels.confirm)) return
    setDeleting(id)
    try {
      const res = await fetch(projectApi(`/products/${id}`), { method: "DELETE" })
      if (!res.ok) throw new Error(String(res.status))
      toast.success(labels.deleted)
      // Перезагружаем выборку, а не вычёркиваем строку: после удаления последней
      // записи на странице её надо покинуть, и это знает сервер.
      await list.load()
    } catch {
      toast.error(common.failed)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      <ProductsToolbar
        labels={{
          tableTitle: common.tableTitle,
          reveal: common.reveal,
          loading: common.loading,
          // Заводить товары администратор не может — кнопки создания у него нет.
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
            {labels.deleteOnly}
          </p>

          <ProductTable
            products={list.products}
            lang={lang}
            currency={currency}
            labels={{
              colPhoto: common.colPhoto, colName: common.colName,
              colPrice: common.colPrice, colId: common.colId, empty: common.empty,
            }}
            // Действие строки этого слоя — единственное, что он умеет.
            rowAction={(p) => (
              <button
                onClick={() => void remove(p.id)}
                disabled={deleting === p.id}
                aria-label={labels.deleted}
                className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-40"
              >
                {deleting === p.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              </button>
            )}
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
