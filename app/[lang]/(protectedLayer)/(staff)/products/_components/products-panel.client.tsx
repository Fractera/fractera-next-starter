"use client"

// Динамический контейнер каталога — образец для каждой защищённой страницы со
// списком.
//
// 🔒 ЗАКРЫТ ПО УМОЛЧАНИЮ. Ничего не запрашивается при открытии страницы:
// посетитель видит скелетон настоящей таблицы и кнопку, которая говорит, что
// сделает нажатие. Страница адресуема мгновенно и не стоит базе ничего, пока
// строки никому не понадобились.
//
// 🔒 КНОПКА — В ОДНОЙ СТРОКЕ С ЗАГОЛОВКОМ, а не под таблицей. Под длинной
// таблицей она уезжает за нижний край, и человек ищет глазами то, ради чего
// пришёл. Управление списком стоит там, где список назван.
//
// 🔒 СТРАНИЦЫ И ПОИСК СЧИТАЕТ СЕРВЕР. Браузер получает ровно ту страницу, что
// показывает. Фильтрация загруженного массива работает до первой тысячи строк,
// а потом страница везёт мегабайты ради десяти видимых записей.
//
// Поиск запускается КНОПКОЙ, а не набором текста: запрос на каждую букву — это
// запрос на каждую букву, и на медленной сети он же обгоняет сам себя.

import { useState, useCallback, useEffect } from "react"
import { Plus, X, Loader2, Eye, Search } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import type { UploadedFile } from "@/services/upload/upload.service"
import { projectApi } from "@/lib/architecture/project-api"
import type { Product } from "./types"
import { ProductForm } from "./product-form.client"
import { ProductTable } from "./product-table.client"
import { ProductTableSkeleton } from "./product-table-skeleton"

export type ProductsLabels = {
  reveal: string; revealHint: string; loading: string
  tableTitle: string; empty: string; count: string
  add: string; cancelAdd: string; newProduct: string
  name: string; price: string; uploadPhoto: string; save: string
  colPhoto: string; colName: string; colPrice: string; colId: string
  created: string; deleted: string; failed: string
  searchPlaceholder: string; find: string; nothingFound: string
  perPage: string; prev: string; next: string; pageOf: string
}

// Выбранный шаг живёт в браузере: это предпочтение ЧЕЛОВЕКА, а не свойство
// каталога, и оно должно пережить перезагрузку, не попав в базу проекта.
const SIZE_KEY = "fractera-products-per-page"
const PAGE_SIZES = [10, 20, 50, 100]

export function ProductsPanel({ labels }: { labels: ProductsLabels }) {
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(10)
  // Что НАБРАНО в поле и что ПРИМЕНЕНО к выборке — разные вещи: иначе таблица
  // дёргалась бы, пока человек печатает.
  const [query, setQuery] = useState("")
  const [applied, setApplied] = useState("")
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ name: "", price: "" })
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const saved = Number(localStorage.getItem(SIZE_KEY))
    if (PAGE_SIZES.includes(saved)) setPerPage(saved)
  }, [])

  const load = useCallback(async (opts?: { page?: number; perPage?: number; q?: string }) => {
    const p = opts?.page ?? page
    const size = opts?.perPage ?? perPage
    const q = opts?.q ?? applied
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p), perPage: String(size) })
      if (q) params.set("q", q)
      const res = await fetch(projectApi(`/products?${params}`))
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json()
      setProducts(data.products ?? [])
      setPage(data.page ?? 1)
      setPages(data.pages ?? 1)
      setTotal(data.total ?? 0)
      setRevealed(true)
    } catch {
      toast.error(labels.failed)
    } finally {
      setLoading(false)
    }
  }, [page, perPage, applied, labels.failed])

  function search() {
    setApplied(query)
    void load({ page: 1, q: query })
  }

  function changeSize(next: number) {
    setPerPage(next)
    localStorage.setItem(SIZE_KEY, String(next))
    if (revealed) void load({ page: 1, perPage: next })
  }

  async function add() {
    if (!form.name.trim() || !form.price) return
    setSaving(true)
    try {
      const res = await fetch(projectApi("/products"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          price: parseFloat(form.price),
          media_id: uploaded?.id ?? null,
          media_url: uploaded?.url ?? null,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      toast.success(labels.created)
      setForm({ name: "", price: "" })
      setUploaded(null)
      setAdding(false)
      await load({ page: 1 })
    } catch {
      toast.error(labels.failed)
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    setDeleting(id)
    try {
      const res = await fetch(projectApi(`/products/${id}`), { method: "DELETE" })
      if (!res.ok) throw new Error(String(res.status))
      toast.success(labels.deleted)
      // Перезагружаем страницу выборки, а не вычёркиваем строку: после удаления
      // последней записи на странице её надо покинуть, и это знает сервер.
      await load()
    } catch {
      toast.error(labels.failed)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <section>
      {/* Строка заголовка: имя раздела, кнопка раскрытия и кнопка добавления —
          всё управление списком на одной линии с его названием. */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-foreground">{labels.tableTitle}</h2>
        <div className="flex items-center gap-2">
          {!revealed && (
            <Button size="sm" onClick={() => load({ page: 1 })} disabled={loading}>
              {loading ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
              {loading ? labels.loading : labels.reveal}
            </Button>
          )}
          {revealed && (
            <Button size="sm" variant="outline" onClick={() => setAdding(v => !v)}>
              {adding ? <X size={12} /> : <Plus size={12} />}
              {adding ? labels.cancelAdd : labels.add}
            </Button>
          )}
        </div>
      </div>

      {/* Поиск — под названием таблицы. Запускается кнопкой и клавишей Enter:
          два способа для одного действия, оба привычные. */}
      <div className="mb-3 flex gap-2">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
          placeholder={labels.searchPlaceholder}
          className="h-8 max-w-xs text-xs"
        />
        <Button size="sm" variant="secondary" onClick={search} disabled={loading}>
          <Search size={12} />{labels.find}
        </Button>
      </div>

      {adding && (
        <ProductForm
          form={form} setForm={setForm} saving={saving}
          onSave={add} onUpload={setUploaded} labels={labels}
        />
      )}

      {!revealed ? (
        <>
          <ProductTableSkeleton labels={labels} />
          <p className="mt-2 text-center text-[10px] text-muted-foreground">{labels.revealHint}</p>
        </>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-xs text-muted-foreground">
          {applied ? labels.nothingFound : labels.empty}
        </div>
      ) : (
        <>
          <ProductTable products={products} deleting={deleting} onDelete={remove} labels={labels} />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[10px] text-muted-foreground">
              {labels.count.replace("{count}", String(total))}
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-muted-foreground">{labels.perPage}</span>
                <Select value={String(perPage)} onValueChange={v => changeSize(Number(v))}>
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
                        onClick={() => load({ page: page - 1 })}
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
                        onClick={() => load({ page: page + 1 })}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
