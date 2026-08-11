"use client"

// Подвал списка: сколько всего записей, сколько показывать на странице и
// переходы между страницами.
//
// Отдельным компонентом, потому что это законченный узел интерфейса, который
// повторится в каждом следующем списке защищённого слоя. Скопированный в
// страницу, он разойдётся с оригиналом на первой же правке.
//
// Пагинация — стандартный `shadcn`, без самописных стрелок: закон проекта
// требует один набор примитивов на весь интерфейс.

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationNext, PaginationPrevious, PaginationFirst, PaginationLast,
} from "@/components/ui/pagination"
import { PAGE_SIZES } from "@/app/[lang]/(protectedLayer)/_lib/use-product-list"

export type PagerLabels = {
  count: string; perPage: string; prev: string; next: string; pageOf: string
  first: string; last: string
}

export function ProductsPager(
  { labels, total, page, pages, perPage, onPage, onSize }: {
    labels: PagerLabels
    total: number; page: number; pages: number; perPage: number
    onPage: (p: number) => void
    onSize: (s: number) => void
  },
) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
      <p className="text-[10px] text-muted-foreground">
        {labels.count.replace("{count}", String(total))}
      </p>

      <div className="flex items-center gap-1.5 sm:gap-3">
        <div className="flex items-center gap-1">
          {/* Подпись уходит на узком экране: рядом стоит число, и что оно
              значит, видно из соседства с пагинацией. Место дороже слова. */}
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

        {/* 🔒 ПАГИНАЦИЯ ВИДНА ВСЕГДА, даже когда страница одна.
            Пряталась она по правилу «не показывать бесполезное» — и владелец
            решил, что функция не сделана: на двух товарах страниц одна, стрелки
            исчезали целиком, и проверить их было нечем.
            Невидимый элемент неотличим от несуществующего. Погашенная стрелка
            сообщает две вещи разом: управление есть, и дальше идти некуда. */}
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
              {/* Четыре края движения: в начало · шаг назад · шаг вперёд · в конец. */}
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
                {/* На узком экране остаётся «1/3»: слово «Страница» занимает
                    больше места, чем сообщает, — рядом стрелки, и смысл числа
                    очевиден из них. */}
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

