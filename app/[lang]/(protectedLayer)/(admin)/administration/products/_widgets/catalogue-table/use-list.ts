"use client"

// Поведение каталога администратора — СВОЁ, а не общее (шаг 521).
//
// 🔒 ЗАЧЕМ КОПИЯ. Общий `_lib/use-product-list.ts` держал одну выборку на четыре
// роли: один поиск, одну разбивку, один ключ размера страницы. Администратору
// нужен весь каталог и, вероятно, иные правила выборки — удалённые записи,
// сортировка по дате. Пока движок был общим, каждая такая правка задевала три
// чужие таблицы, и потому не делалась.
//
// 🔒 ПЕРЕЗАГРУЗКА ПОСЛЕ УДАЛЕНИЯ — ЧАСТЬ ЭТОГО ПОВЕДЕНИЯ. Удалив последнюю запись
// на странице, страницу надо покинуть, и знает об этом сервер: поэтому
// администратор зовёт `load()` заново, а не вычёркивает строку из массива.
//
// 🔒 ЧТО ОСТАЛОСЬ СНАРУЖИ. `projectApi` и `toast` — сквозные соглашения проекта
// («как здесь принято ходить в базу и сообщать о неудаче»), а не фрагменты
// виджета.

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import { projectApi } from "@/lib/architecture/project-api"
import type { Product } from "@/lib/products/types"

// 🔒 КЛЮЧ ХРАНЕНИЯ СВОЙ У КАЖДОЙ ТАБЛИЦЫ. Раньше он был общий, и человек,
// поставивший 100 строк здесь, получал 100 строк в трёх соседних слоях. Это
// разные задачи и разные привычки.
const SIZE_KEY = "fractera-administration-per-page"
export const PAGE_SIZES = [10, 20, 50, 100]

type LoadOpts = { page?: number; perPage?: number; q?: string }

export function useCatalogueList(failedLabel: string) {
  // Закрыт по умолчанию: пока человек не нажал, база не спрошена, и страница
  // адресуема мгновенно.
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [perPage, setPerPage] = useState(10)
  // Что НАБРАНО в поле и что ПРИМЕНЕНО к выборке — разные вещи, иначе таблица
  // дёргалась бы, пока человек печатает.
  const [query, setQuery] = useState("")
  const [applied, setApplied] = useState("")

  useEffect(() => {
    const saved = Number(localStorage.getItem(SIZE_KEY))
    if (PAGE_SIZES.includes(saved)) setPerPage(saved)
  }, [])

  const load = useCallback(async (opts?: LoadOpts) => {
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
      toast.error(failedLabel)
    } finally {
      setLoading(false)
    }
  }, [page, perPage, applied, failedLabel])

  const search = useCallback(() => {
    setApplied(query)
    void load({ page: 1, q: query })
  }, [query, load])

  // Сброс — отдельное действие, а не «поиск по пустой строке»: стереть текст и
  // нажать «Найти» человек не догадывается, и остаётся запертым в выборке.
  const resetSearch = useCallback(() => {
    setQuery("")
    setApplied("")
    void load({ page: 1, q: "" })
  }, [load])

  const changeSize = useCallback((next: number) => {
    setPerPage(next)
    localStorage.setItem(SIZE_KEY, String(next))
    if (revealed) void load({ page: 1, perPage: next })
  }, [revealed, load])

  return {
    revealed, loading, products, page, pages, total, perPage,
    query, setQuery, applied,
    load, search, resetSearch, changeSize,
  }
}
