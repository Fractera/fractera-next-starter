"use client"

// Поведение таблицы учётных записей — СВОЁ, как у соседних виджетов.
//
// 🔒 ЧЕМ ОНО ОТЛИЧАЕТСЯ ОТ ТАБЛИЦ ТОВАРОВ. Записи живут в СЛУЖБЕ авторизации, а
// не в базе приложения: выборку, поиск и счёт страниц ведёт она, мы лишь
// передаём ей вопрос. Отсюда и размер страницы — не наше решение, а параметр
// запроса: служба принимает закрытый набор ступеней и молча приводит к
// ближайшей законной, если попросить иное.
//
// 🪦 Здесь стояло «выбора числа строк тут нет и быть не может, служба режет по
// сто». Отменено 2026-08-21: владелец указал, что селектора не хватает, и
// правильным ответом было расширить СЛУЖБУ, а не объяснять пользователю
// ограничение. Тот же порядок, что с ролью администратора.
//
// 🔒 ЗАКРЫТА ПО УМОЛЧАНИЮ. Пока человек не нажал, служба не спрошена. Список
// людей — самая дорогая и самая чувствительная выборка на этой странице, и
// запрашивать её у каждого, кто просто открыл адрес, незачем.
//
// 🔒 ОТКАЗ РАЗБИРАЕТСЯ ПО КОДУ, А НЕ ОДНОЙ ФРАЗОЙ. 403 и 502 — разные события:
// первое означает «вам сюда нельзя», второе — «служба не ответила». Одна общая
// фраза «не удалось» заставила бы владельца искать неисправность там, где её нет.

import { useState, useCallback, useEffect } from "react"
import { toast } from "sonner"
import type { UsersTableUi } from "./ui.i18n"

export type AccountRow = {
  id: string
  email: string
  nickname: string | null
  /** Приезжает строкой JSON — разбор в одном месте, см. `rolesOf`. */
  roles: string
  is_active: number
  provider: string
  created_at: string
  /**
   * Когда человек заходил в последний раз — колонка `users.last_login_at`
   * службы авторизации (`use-auth` §2).
   *
   * 🔒 ТИП НЕОБЯЗАТЕЛЬНЫЙ НАМЕРЕННО, И ЭТО НЕ ПЕРЕСТРАХОВКА. Дверь
   * `app/api/users/route.ts` сквозная — она отдаёт ровно то, что прислала
   * служба, а служба живёт вне этого репозитория. Присылает колонку —
   * `string` или `null`; не присылает — `undefined`. Три состояния доходят до
   * строки нетронутыми и там же расходятся (`last-seen.ts`): «ни разу» и «нет
   * данных» — разные ответы, и склеить их значило бы соврать ровно в том
   * вопросе, ради которого колонку и завели.
   */
  last_login_at?: string | null
}

/**
 * Роли строкой JSON → массив. Разбор ЗДЕСЬ, а не в двух местах: таблица и форма
 * изменения обязаны понимать роли одинаково, иначе одна запись покажет разные
 * роли в строке и в редакторе.
 */
export function rolesOf(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed.map(String) : ["user"]
  } catch {
    return ["user"]
  }
}

// 🔒 КЛЮЧ ХРАНЕНИЯ СВОЙ У КАЖДОЙ ТАБЛИЦЫ (шаг 521). Человек, поставивший сто
// строк здесь, не должен получить сто строк в каталоге товаров: это разные
// задачи и разные привычки.
const SIZE_KEY = "fractera-users-per-page"
export const PAGE_SIZES = [10, 20, 50, 100]

export function useUsersList(ui: UsersTableUi) {
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<AccountRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  // Что НАБРАНО и что ПРИМЕНЕНО — разные вещи, иначе список дёргается, пока
  // человек печатает.
  const [query, setQuery] = useState("")
  const [perPage, setPerPage] = useState(20)

  // Выбор человека переживает перезагрузку: он делается один раз и относится к
  // привычке, а не к сеансу. Читается ПОСЛЕ первой отрисовки — на сервере
  // localStorage нет, и обращение к нему в теле компонента ломает гидратацию.
  useEffect(() => {
    const saved = Number(localStorage.getItem(SIZE_KEY))
    if (PAGE_SIZES.includes(saved)) setPerPage(saved)
  }, [])

  const load = useCallback(
    async (opts: { page?: number; q?: string; perPage?: number } = {}) => {
      const nextPage = opts.page ?? 1
      const q = opts.q ?? ""
      const size = opts.perPage ?? perPage
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(nextPage), perPage: String(size) })
        if (q) params.set("q", q)
        const res = await fetch(`/api/users?${params}`, { cache: "no-store" })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          toast.error(res.status === 403 ? ui.forbidden : res.status === 502 ? ui.unreachable : ui.failed)
          return
        }
        const list = Array.isArray(data.users) ? (data.users as AccountRow[]) : []
        setRows(list)
        setTotal(Number(data.total) || list.length)
        setPage(nextPage)
        // Число страниц считает сторона, знающая размер страницы: у службы он
        // свой, и вычислять его здесь значило бы дублировать её решение.
        // Число страниц считает сторона, знающая, сколько строк она отдала:
        // служба подтверждает применённый размер своим ответом, и верить надо
        // ему, а не тому, что мы просили.
        const applied = Number(data.perPage) || size
        setPages(Math.max(1, Math.ceil((Number(data.total) || list.length) / applied)))
        setRevealed(true)
      } catch {
        toast.error(ui.unreachable)
      } finally {
        setLoading(false)
      }
    },
    [ui, perPage],
  )

  /** Сменить размер страницы: запомнить выбор и вернуться к первой странице. */
  const changeSize = useCallback(
    (size: number) => {
      setPerPage(size)
      localStorage.setItem(SIZE_KEY, String(size))
      // С первой страницы, а не с текущей: на новой нарезке «страница пять»
      // означает другое место списка, и человек оказался бы не там, где был.
      void load({ page: 1, q: query, perPage: size })
    },
    [load, query],
  )

  return { revealed, loading, rows, total, page, pages, perPage, query, setQuery, load, changeSize }
}
