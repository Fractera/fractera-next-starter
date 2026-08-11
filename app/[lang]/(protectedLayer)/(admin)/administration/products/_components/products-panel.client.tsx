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
import type { AdministrationProductsUi } from "../_data/ui.i18n"

export function ProductsPanel(
  { lang, currency, labels }: { lang: string; currency: string; labels: AdministrationProductsUi },
) {
  const list = useProductList(labels.failed)
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
      toast.error(labels.failed)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      <ProductsToolbar
        labels={{
          tableTitle: labels.tableTitle,
          reveal: labels.reveal,
          loading: labels.loading,
          // Заводить товары администратор не может — кнопки создания у него нет.
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
            {labels.deleteOnly}
          </p>

          <ProductTable
            products={list.products}
            lang={lang}
            currency={currency}
            labels={{
              colPhoto: labels.colPhoto, colName: labels.colName,
              colPrice: labels.colPrice, colId: labels.colId, empty: labels.empty,
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
