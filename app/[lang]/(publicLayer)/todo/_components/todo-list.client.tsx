"use client"

// ОСТРОВОК СПИСКА ДЕЛ — та часть, ради которой существует третья ступень
// лестницы «что кладут на страницу».
//
// 🔒 ОСТРОВОК, А НЕ ДИНАМИЧЕСКАЯ СТРАНИЦА. Оболочка вокруг остаётся статической:
// заголовок, подпись и пустое состояние приходят с сервера в разметке. Клиент
// владеет только строками, и это разница между «страница с интерактивом» и
// «страница, которой нет в поиске».
//
// 🔒 СЛОВА ПРИХОДЯТ ПРОПСОМ. Клиентский файл не импортирует словарь: десять
// языков × словарь уезжают в браузер на каждой странице. Серверный компонент
// резолвит `todoUi(lang)` и отдаёт готовые строки.
//
// 🔒 СОСТОЯНИЕ ПОКАЗЫВАЕТСЯ СРАЗУ, ПОДТВЕРЖДАЕТСЯ ПОТОМ. Пункт появляется в
// списке до ответа сервера; отказ возвращает список назад и говорит причину.
// Ожидание круга к серверу на каждое нажатие читается как «не работает».

import { useEffect, useState } from "react"
import { Loader2, Trash2 } from "lucide-react"
import type { TodoUi } from "../_data/ui.i18n"

export type Todo = { id: string; title: string; done: number }

export function TodoList({ initial, ui }: { initial: Todo[]; ui: TodoUi }) {
  const [rows, setRows] = useState<Todo[]>(initial)
  const [title, setTitle] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send(body: Record<string, unknown>) {
    const r = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!r.ok) throw new Error(String((await r.json().catch(() => ({}))).error ?? r.status))
  }

  // 🔒 СТРОКИ ПЕРЕЧИТЫВАЮТСЯ ПРИ ОТКРЫТИИ (найдено живой проверкой 2026-08-19).
  //
  // Первая отрисовка приходит с сервера и лежит в статике: посетитель и поисковик
  // видят список без JS. Но статика — это СНИМОК: страница, собранная минуту
  // назад, покажет вчерашние строки, и добавленный пункт не появится, пока не
  // истечёт окно ISR. Для изменчивых данных снимок годится как первая краска и
  // не годится как истина.
  //
  // Каталог этим не болеет: его сбрасывает метка при изменении товара. У списка
  // дел такой метки нет и быть не должно — он меняется каждую секунду.
  useEffect(() => {
    void reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function reload() {
    const r = await fetch("/api/todos", { cache: "no-store" })
    const d = await r.json().catch(() => ({}))
    if (d.ok) setRows(d.rows as Todo[])
  }

  async function add(e: React.FormEvent) {
    e.preventDefault()
    const value = title.trim()
    if (!value || busy) return
    setBusy(true)
    setError(null)
    setTitle("")
    try {
      await send({ op: "add", title: value })
      await reload()
    } catch {
      setError(ui.failed)
      setTitle(value)
    } finally {
      setBusy(false)
    }
  }

  async function toggle(row: Todo) {
    const next = row.done ? 0 : 1
    setRows(rs => rs.map(r => (r.id === row.id ? { ...r, done: next } : r)))
    try {
      await send({ op: "toggle", id: row.id, done: Boolean(next) })
    } catch {
      setRows(rs => rs.map(r => (r.id === row.id ? { ...r, done: row.done } : r)))
      setError(ui.failed)
    }
  }

  async function remove(row: Todo) {
    const before = rows
    setRows(rs => rs.filter(r => r.id !== row.id))
    try {
      await send({ op: "delete", id: row.id })
    } catch {
      setRows(before)
      setError(ui.failed)
    }
  }

  return (
    <div className="mt-6">
      <form onSubmit={add} className="flex gap-2">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={ui.placeholder}
          maxLength={200}
          className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-base text-foreground"
        />
        <button
          type="submit"
          disabled={busy || !title.trim()}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          {ui.add}
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">{ui.empty}</p>
      ) : (
        <ul className="mt-6 space-y-1">
          {rows.map(row => (
            <li key={row.id} className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
              <input
                type="checkbox"
                checked={Boolean(row.done)}
                onChange={() => toggle(row)}
                className="size-4 shrink-0 accent-primary"
              />
              <span className={row.done ? "flex-1 text-muted-foreground line-through" : "flex-1 text-foreground"}>
                {row.title}
              </span>
              <button
                type="button"
                onClick={() => remove(row)}
                aria-label={ui.remove}
                title={ui.remove}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
