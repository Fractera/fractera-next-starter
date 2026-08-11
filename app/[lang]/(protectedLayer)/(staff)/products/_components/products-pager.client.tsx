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
  PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { PAGE_SIZES } from "../_lib/use-product-list"

export type PagerLabels = {
  count: string; perPage: string; prev: string; next: string; pageOf: string
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
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
      <p className="text-[10px] text-muted-foreground">
        {labels.count.replace("{count}", String(total))}
      </p>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">{labels.perPage}</span>
          <Select value={String(perPage)} onValueChange={v => onSize(Number(v))}>
            <SelectTrigger className="h-7 w-[68px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map(s => (
                <SelectItem key={s} value={String(s)} className="text-xs">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {pages > 1 && (
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  label={labels.prev}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? "pointer-events-none opacity-40" : ""}
                  onClick={() => onPage(page - 1)}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-2 text-[10px] text-muted-foreground">
                  {labels.pageOf.replace("{page}", String(page)).replace("{pages}", String(pages))}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  label={labels.next}
                  aria-disabled={page >= pages}
                  className={page >= pages ? "pointer-events-none opacity-40" : ""}
                  onClick={() => onPage(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}

