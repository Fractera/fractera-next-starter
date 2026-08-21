"use client"

// Подвал таблицы учётных записей: сколько записей и переходы по страницам.
//
// 🔒 СВОЙ, А НЕ ОБЩИЙ (шаг 521), но по составу — как у соседних списков: счёт
// слева, выбор размера страницы и переходы справа.
//
// 🪦 Здесь стояло «выбора размера страницы тут НЕТ, служба режет по сто».
// Отменено 2026-08-21: владелец указал, что селектора не хватает, и правильным
// ответом было расширить СЛУЖБУ — она приняла параметр `perPage` с закрытым
// набором ступеней. Ограничение чужой стороны объясняют пользователю только
// тогда, когда его действительно нельзя снять.
//
// Примитивы платформенные (`components/ui/*`): кольцо примитивов, а не фрагмент
// виджета. Самописных стрелок в проекте не бывает.

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationNext, PaginationPrevious, PaginationFirst, PaginationLast,
} from "@/components/ui/pagination"
import { Small } from "@/components/ui/typography"
import { PAGE_SIZES } from "./use-list"
import type { UsersTableUi } from "./ui.i18n"

export function UsersPager(
  { ui, total, page, pages, perPage, onPage, onSize }: {
    ui: UsersTableUi
    total: number
    page: number
    pages: number
    perPage: number
    onPage: (p: number) => void
    onSize: (s: number) => void
  },
) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
      <Small>{ui.count.replace("{count}", String(total))}</Small>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <div className="flex items-center gap-1">
          {/* Подпись уходит на узком экране: рядом стоит число, и что оно значит,
              видно из соседства с пагинацией. Место дороже слова. */}
          <span className="hidden text-[10px] text-muted-foreground sm:inline">{ui.perPage}</span>
          <Select value={String(perPage)} onValueChange={v => onSize(Number(v))}>
            <SelectTrigger className="h-7 w-[60px] px-2 text-xs" aria-label={ui.perPage}><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map(s => (
                <SelectItem key={s} value={String(s)} className="text-xs">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
    </div>
  )
}
