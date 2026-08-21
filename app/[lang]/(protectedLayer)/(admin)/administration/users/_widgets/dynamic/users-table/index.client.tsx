"use client"

// ВИДЖЕТ «учётные записи» — динамический островок в статической странице.
//
// 🔒 ЭТО ЕДИНИЦА ВЛАДЕНИЯ. Всё, что отвечает на вопрос «как выглядит и ведёт
// себя ЭТА таблица», лежит в этой папке: выборка, скелетон, строка, редактор
// ролей, слова. Снеси папку маршрута — виджет исчезнет целиком, не оставив
// ссылок; это и есть его приёмка.
//
// 🔒 ЧТО ОСТАЛОСЬ СНАРУЖИ — только сквозное: примитивы `components/ui/*`,
// `toast`, список ролей `lib/roles.ts` (модель предмета, ею же пользуется
// авторизация). Фрагменты виджета наружу не выходят даже тогда, когда похожи на
// соседские.
//
// 🔒 ЗАКРЫТ ПО УМОЛЧАНИЮ, и здесь это правило дороже, чем у товаров: список
// людей — самая чувствительная выборка страницы. Пока человек не нажал, служба
// авторизации не спрошена вовсе.

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/ui/empty-state"
import { useUsersList } from "./use-list"
import { UsersRow } from "./row.client"
import { UsersTableSkeleton } from "./skeleton"
import type { UsersTableUi } from "./ui.i18n"

export function UsersTable({ lang, ui }: { lang: string; ui: UsersTableUi }) {
  const { revealed, loading, rows, total, page, pages, query, setQuery, load } = useUsersList(ui)
  const cols = { colAccount: ui.colAccount, colRoles: ui.colRoles, colProvider: ui.colProvider, colCreated: ui.colCreated }

  if (!revealed) {
    return (
      <div className="mt-6">
        <Button onClick={() => load()} disabled={loading}>
          {loading ? ui.loading : ui.reveal}
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <form
        className="flex gap-2"
        onSubmit={e => { e.preventDefault(); load({ q: query }) }}
      >
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={ui.searchPlaceholder}
          className="max-w-xs"
        />
        <Button type="submit" variant="secondary" disabled={loading}>{ui.search}</Button>
      </form>

      {loading ? (
        <UsersTableSkeleton labels={cols} />
      ) : rows.length === 0 ? (
        <EmptyState title={ui.empty} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-3 py-2 text-left font-medium">{ui.colAccount}</th>
                  <th className="px-3 py-2 text-left font-medium">{ui.colRoles}</th>
                  <th className="px-3 py-2 text-left font-medium">{ui.colProvider}</th>
                  <th className="px-3 py-2 text-left font-medium">{ui.colCreated}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  // После сохранения список перечитывается заново, а не правится
                  // в памяти: роли меняет СЛУЖБА, и её ответ — единственная
                  // правда о том, что получилось.
                  <UsersRow key={row.id} row={row} ui={ui} lang={lang} onSaved={() => load({ page, q: query })} />
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            {total} {ui.total}{pages > 1 ? ` · ${page}/${pages}` : ""}
          </p>
        </>
      )}
    </div>
  )
}
