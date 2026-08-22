"use client"

// ВИДЖЕТ «таблица цен» — динамический островок бухгалтерии (шаг 521).
//
// 🔒 ЭТО ЕДИНИЦА ВЛАДЕНИЯ, А НЕ СБОРКА ЧУЖИХ КУСКОВ. Всё, что отвечает на вопрос
// «как выглядит и ведёт себя ЭТА таблица», лежит в этой папке: поведение списка,
// скелетон, управление, подвал, строка, слова. Снеси папку маршрута — виджет
// исчезнет целиком, не оставив ссылок. Это и есть приёмка.
//
// Прежде наверху лежало 665 строк на четыре слоя прав, а здесь оставалась одна
// сборка: общего было больше, чем своего. Разбор вернул принадлежность.
//
// 🔒 ЧТО ОСТАЛОСЬ СНАРУЖИ. Только сквозное — то, что отвечает «как проект вообще
// делает X»: `projectApi` (обращение к базе), `toast` (сообщение о неудаче),
// `components/ui/*` (кольцо примитивов), `lib/products/*` (модель предмета, ею же
// пользуется публичная витрина). Фрагменты виджета наружу не выходят.
//
// 🔒 ЗАКРЫТ ПО УМОЛЧАНИЮ. Пока человек не нажал «Показать», база не спрошена, и
// страница адресуема мгновенно: защищённая страница — это статическая страница с
// динамическими дырами, а не динамическая страница.

import { useState } from "react"
import { localizeProduct } from "@/lib/products/localize"
import { EmptyState } from "@/components/ui/empty-state"
import { usePriceList } from "./use-list"
import { PriceToolbar } from "./toolbar.client"
import { PricePager } from "./pager.client"
import { PriceTableSkeleton } from "./skeleton"
import { PriceRow } from "./row.client"
import type { PriceTableUi } from "./ui.i18n"

export function PriceTable(
  { lang, currency, ui, labels }: {
    lang: string
    /** Валюта витрины: цена без неё — просто цифра. */
    currency: string
    /** Слова САМОГО виджета. Резолвятся на сервере и приезжают пропсом. */
    ui: PriceTableUi
    /** Слова страницы, которые виджет показывает: объяснение права и тосты правки. */
    labels: {
      priceOnly: string
      save: string; cancel: string; saved: string; invalidPrice: string
    }
  },
) {
  const {
    revealed, loading, products, page, pages, total, perPage,
    query, setQuery, applied, load, search, resetSearch, changeSize,
  } = usePriceList(ui.failed)

  // Сохранённая цена кладётся в уже загруженный список, а не перезапрашивается:
  // повторный запрос ради одного изменившегося числа сбрасывает позицию прокрутки
  // и мигает таблицей на каждой правке.
  const [patched, setPatched] = useState<Record<string, number>>({})
  const rows = products.map(p =>
    localizeProduct(patched[p.id] != null ? { ...p, price: patched[p.id] } : p, lang),
  )

  return (
    <>
      <PriceToolbar
        labels={{
          tableTitle: ui.tableTitle,
          reveal: ui.reveal,
          loading: ui.loading,
          searchPlaceholder: ui.searchPlaceholder,
          find: ui.find,
          reset: ui.reset,
        }}
        revealed={revealed}
        loading={loading}
        query={query}
        applied={applied}
        onQuery={setQuery}
        onReveal={() => void load({ page: 1 })}
        onSearch={() => void search()}
        onReset={() => void resetSearch()}
      />

      {!revealed ? (
        <>
          {/* Скелетон повторяет ТРИ колонки этой таблицы, а не пять чужой. */}
          <PriceTableSkeleton labels={{ colName: ui.colName, colPrice: ui.colPrice, colId: ui.colId }} />
          <p className="mt-3 text-xs text-muted-foreground">{ui.revealHint}</p>
        </>
      ) : (
        <>
          <p className="mb-3 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            {labels.priceOnly}
          </p>

          {rows.length === 0 ? (
            <EmptyState title={ui.empty} />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{ui.colName}</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{ui.colPrice}</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{ui.colId}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(p => (
                    <PriceRow
                      key={p.id}
                      product={p}
                      lang={lang}
                      currency={currency}
                      labels={{
                        save: labels.save, cancel: labels.cancel,
                        saved: labels.saved, failed: ui.failed, invalidPrice: labels.invalidPrice,
                      }}
                      onSaved={(id, price) => setPatched(prev => ({ ...prev, [id]: price }))}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <PricePager
            labels={{
              count: ui.count, perPage: ui.perPage,
              prev: ui.prev, next: ui.next, pageOf: ui.pageOf,
              first: ui.first, last: ui.last,
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
