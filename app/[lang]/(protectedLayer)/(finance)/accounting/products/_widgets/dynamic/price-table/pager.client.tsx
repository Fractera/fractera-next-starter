"use client"

// Подвал списка цен: сколько записей, сколько на странице, переходы.
//
// 🔒 СВОЙ, А НЕ ОБЩИЙ (шаг 521). У общего был свой довод — «повторится в каждом
// следующем списке», — и он же оказался ловушкой: размеры страницы приходили из
// общего движка, поэтому изменить шаг для одной таблицы значило изменить его для
// четырёх. Здесь размеры свои, и бухгалтерия вправе листать иначе, чем каталог.
//
// Примитивы остаются платформенными (`components/ui/*`): это кольцо примитивов,
// а не фрагмент виджета. Самописных стрелок в проекте не бывает.

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationNext, PaginationPrevious, PaginationFirst, PaginationLast,
} from "@/components/ui/pagination"
import { Small } from "@/components/ui/typography"
import { PAGE_SIZES } from "./use-list"

export function PricePager(
  { labels, total, page, pages, perPage, onPage, onSize }: {
    labels: {
      count: string; perPage: string; prev: string; next: string; pageOf: string
      first: string; last: string
    }
    total: number; page: number; pages: number; perPage: number
    onPage: (p: number) => void
    onSize: (s: number) => void
  },
) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
      <Small>{labels.count.replace("{count}", String(total))}</Small>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <div className="flex items-center gap-1">
          {/* Подпись уходит на узком экране: рядом стоит число, и что оно значит,
              видно из соседства с пагинацией. Место дороже слова. */}
          <span className="hidden text-[10px] text-muted-foreground sm:inline">{labels.perPage}</span>
          <Select value={String(perPage)} onValueChange={v => onSize(Number(v))}>
            <SelectTrigger className="h-7 w-[60px] px-2 text-xs" aria-label={labels.perPage}><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map(s => (
                <SelectItem key={s} value={String(s)} className="text-xs">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 🔒 ПАГИНАЦИЯ ВИДНА ВСЕГДА, даже когда страница одна. Пряталась она по
            правилу «не показывать бесполезное» — и владелец решил, что функция не
            сделана: на двух товарах страниц одна, стрелки исчезали целиком, и
            проверить их было нечем. Невидимый элемент неотличим от
            несуществующего; погашенная стрелка сообщает две вещи разом:
            управление есть, и дальше идти некуда. */}
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationFirst
                title={labels.first}
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-40" : ""}
                onClick={() => onPage(1)}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                title={labels.prev}
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-40" : ""}
                onClick={() => onPage(page - 1)}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-1 text-[10px] tabular-nums text-muted-foreground sm:hidden">
                {page}/{pages}
              </span>
              <span className="hidden px-2 text-[10px] text-muted-foreground sm:inline">
                {labels.pageOf.replace("{page}", String(page)).replace("{pages}", String(pages))}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                title={labels.next}
                aria-disabled={page >= pages}
                className={page >= pages ? "pointer-events-none opacity-40" : ""}
                onClick={() => onPage(page + 1)}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast
                title={labels.last}
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
