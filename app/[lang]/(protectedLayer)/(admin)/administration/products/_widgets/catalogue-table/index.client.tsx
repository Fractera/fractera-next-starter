"use client"

// ВИДЖЕТ «каталог» — динамический островок администрирования (шаг 521).
//
// 🔒 ЭТО ЕДИНИЦА ВЛАДЕНИЯ, А НЕ СБОРКА ЧУЖИХ КУСКОВ. Всё, что отвечает на вопрос
// «как выглядит и ведёт себя ЭТА таблица», лежит в этой папке: поведение списка,
// скелетон, управление, подвал, строка, слова. Снеси папку маршрута — виджет
// исчезнет целиком, не оставив ссылок. Это и есть приёмка.
//
// 🔒 ЧТО ОСТАЛОСЬ СНАРУЖИ. Только сквозное — то, что отвечает «как проект вообще
// делает X»: `projectApi` (обращение к базе), `toast` (сообщение о неудаче),
// `components/ui/*` (кольцо примитивов), `lib/products/*` (модель предмета, ею же
// пользуется публичная витрина). Фрагменты виджета наружу не выходят.
//
// 🔒 ЗАКРЫТ ПО УМОЛЧАНИЮ. Пока человек не нажал «Показать», база не спрошена, и
// страница адресуема мгновенно: защищённая страница — это статическая страница с
// динамическими дырами, а не динамическая страница.
//
// 🔒 УДАЛЕНИЕ — ЕДИНСТВЕННОЕ, ЧТО УМЕЕТ ЭТОТ СЛОЙ, и потому оно здесь одно.
// Заводить товары администратор не может, править их — тоже: это права
// персонала. Прежде отсутствие прав выражалось пустыми строками и непереданными
// пропсами общей таблицы; теперь его выражает отсутствие кода.

import { useState } from "react"
import { toast } from "sonner"
import { projectApi } from "@/lib/architecture/project-api"
import { localizeProduct } from "@/lib/products/localize"
import { EmptyState } from "@/components/ui/empty-state"
import { useCatalogueList } from "./use-list"
import { CatalogueToolbar } from "./toolbar.client"
import { CataloguePager } from "./pager.client"
import { CatalogueTableSkeleton } from "./skeleton"
import { CatalogueRow } from "./row.client"
import type { CatalogueTableUi } from "./ui.i18n"

export function CatalogueTable(
  { lang, currency, ui, labels }: {
    lang: string
    /** Валюта витрины: цена без неё — просто цифра. */
    currency: string
    /** Слова САМОГО виджета. Резолвятся на сервере и приезжают пропсом. */
    ui: CatalogueTableUi
    /** Слова страницы: объяснение единственного права и его подтверждение. */
    labels: { deleteOnly: string; confirm: string; deleted: string }
  },
) {
  const list = useCatalogueList(ui.failed)
  const [deleting, setDeleting] = useState<string | null>(null)

  const money = new Intl.NumberFormat(lang, { style: "currency", currency })

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
      toast.error(ui.failed)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      <CatalogueToolbar
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
          {/* Скелетон повторяет ПЯТЬ колонок этой таблицы — вместе с колонкой
              действия, которая у неё действительно есть. */}
          <CatalogueTableSkeleton
            labels={{ colPhoto: ui.colPhoto, colName: ui.colName, colPrice: ui.colPrice, colId: ui.colId }}
          />
          <p className="mt-3 text-xs text-muted-foreground">{ui.revealHint}</p>
        </>
      ) : (
        <>
          <p className="mb-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            {labels.deleteOnly}
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
                    <th className="w-10 px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {list.products.map((row, i) => {
                    const p = localizeProduct(row, lang)
                    return (
                      <CatalogueRow
                        key={p.id}
                        product={p}
                        money={money}
                        striped={i % 2 !== 0}
                        deleting={deleting === p.id}
                        onDelete={() => void remove(p.id)}
                        deleteLabel={labels.deleted}
                      />
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <CataloguePager
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
