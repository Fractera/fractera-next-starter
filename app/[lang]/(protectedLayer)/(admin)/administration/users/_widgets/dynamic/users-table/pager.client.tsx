"use client"

// Подвал таблицы учётных записей: сколько записей и переходы по страницам.
//
// 🔒 СВОЙ, А НЕ ОБЩИЙ (шаг 521) — и отличается от соседей ровно тем, что здесь
// НЕТ ВЫБОРА РАЗМЕРА СТРАНИЦЫ. Товары лежат в базе приложения, и сколько строк
// показать, решаем мы; учётные записи принадлежат службе авторизации, она их
// нарезает по сто и менять это отсюда нечем. Выпадающий список, который ничего
// не меняет, — обещание, которого интерфейс не сдержит.
//
// Примитивы платформенные (`components/ui/*`): кольцо примитивов, а не фрагмент
// виджета. Самописных стрелок в проекте не бывает.

import {
  Pagination, PaginationContent, PaginationItem,
  PaginationNext, PaginationPrevious, PaginationFirst, PaginationLast,
} from "@/components/ui/pagination"
import { Small } from "@/components/ui/typography"
import type { UsersTableUi } from "./ui.i18n"

export function UsersPager(
  { ui, total, page, pages, onPage }: {
    ui: UsersTableUi
    total: number
    page: number
    pages: number
    onPage: (p: number) => void
  },
) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
      <Small>{total} {ui.total}</Small>

      {/* 🔒 ПАГИНАЦИЯ ВИДНА ВСЕГДА, даже когда страница одна. Пряталась она у
          соседа по правилу «не показывать бесполезное» — и владелец решил, что
          функция не сделана: записей мало, страниц одна, стрелки исчезали
          целиком, и проверить их было нечем. Невидимый элемент неотличим от
          несуществующего; погашенная стрелка сообщает две вещи разом: управление
          есть, и дальше идти некуда. */}
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationFirst
              title={ui.first}
              aria-disabled={page <= 1}
              className={page <= 1 ? "pointer-events-none opacity-40" : ""}
              onClick={() => onPage(1)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              title={ui.prev}
              aria-disabled={page <= 1}
              className={page <= 1 ? "pointer-events-none opacity-40" : ""}
              onClick={() => onPage(page - 1)}
            />
          </PaginationItem>
          <PaginationItem>
            {/* На узком экране — только числа: подпись «страница 1 из 3» съедает
                место, которого там нет, а соседство со стрелками объясняет само. */}
            <span className="px-1 text-[10px] tabular-nums text-muted-foreground sm:hidden">
              {page}/{pages}
            </span>
            <span className="hidden px-2 text-[10px] text-muted-foreground sm:inline">
              {ui.pageOf.replace("{page}", String(page)).replace("{pages}", String(pages))}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              title={ui.next}
              aria-disabled={page >= pages}
              className={page >= pages ? "pointer-events-none opacity-40" : ""}
              onClick={() => onPage(page + 1)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLast
              title={ui.last}
              aria-disabled={page >= pages}
              className={page >= pages ? "pointer-events-none opacity-40" : ""}
              onClick={() => onPage(pages)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
