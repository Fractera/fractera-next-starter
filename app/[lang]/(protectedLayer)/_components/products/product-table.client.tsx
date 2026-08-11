"use client"

// Таблица каталога.
//
// 🔒 СТРОКА — ЭТО ССЫЛКА, а не строка с обработчиком нажатия. Разница не
// косметическая: настоящая ссылка открывается средним щелчком в новой вкладке,
// копируется правой кнопкой, видна экранному диктору как переход и работает с
// клавиатуры. `onClick` на `<tr>` не умеет ничего из этого, а список, из
// которого нельзя открыть запись в соседней вкладке, раздражает на второй
// минуте работы.
//
// Ссылка стоит на ячейках, а не на всей строке: `<a>` не может обернуть `<tr>`
// по правилам разметки таблицы, а последняя ячейка занята удалением — сделать
// её частью ссылки значило бы вести на карточку при попытке нажать «удалить».

import Link from "next/link"
import { Trash2, Loader2 } from "lucide-react"
import type { Product } from "@/lib/products/types"
import { localizeProduct } from "@/lib/products/localize"

// 🔒 ВОЗМОЖНОСТИ ПРИХОДЯТ СВЕРХУ, А НЕ ЗАШИТЫ В ТАБЛИЦУ. Одна и та же таблица
// стоит в трёх слоях прав, и в каждом человек может РАЗНОЕ: персонал открывает
// карточку и правит её, администратор только удаляет, финансист не делает ни
// того, ни другого. Поэтому таблица не знает про роли — она принимает то, что ей
// дали: нет `onDelete` — нет и колонки удаления; нет `hrefFor` — строки не
// ссылки, потому что вести некуда.
//
// Так возможность и её признак в интерфейсе — ОДНА вещь: страница, которая не
// передала обработчик, физически не может показать кнопку. Флаг `canDelete`
// рядом с обработчиком разошёлся бы с ним на первой же правке.
type Props = {
  products: Product[]
  lang: string
  /** Валюта витрины: цена без неё — просто цифра. */
  currency: string
  labels: { colPhoto: string; colName: string; colPrice: string; colId: string; empty: string }
  /** Куда ведёт строка. Не передан — строки не ссылки. */
  hrefFor?: (id: string) => string
  /** Удаление. Не передано — колонки удаления нет вовсе. */
  onDelete?: (id: string) => void
  deleting?: string | null
}

// Ячейка: ссылка, когда есть куда вести, и обычный текст, когда некуда. Пустая
// `<a>` без адреса выглядит как ссылка, ведёт в никуда и попадает в обход
// клавиатурой — хуже отсутствия ссылки.
//
// `plain` — ячейка-спутник: она повторяет тот же переход, что и ячейка с
// названием, поэтому диктору её объявлять не надо, а табуляции — останавливаться.
function Cell(
  { href, plain, className, children }:
  { href?: string; plain?: boolean; className?: string; children: React.ReactNode },
) {
  if (!href) return <span className={className}>{children}</span>
  return (
    <Link href={href} className={className} {...(plain ? { tabIndex: -1, "aria-hidden": true } : {})}>
      {children}
    </Link>
  )
}

export function ProductTable({ products, lang, currency, labels, hrefFor, onDelete, deleting }: Props) {
  const money = new Intl.NumberFormat(lang, { style: "currency", currency })
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-24 text-center">
        <p className="text-sm text-muted-foreground">{labels.empty}</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="w-14 px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colPhoto}</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colName}</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colPrice}</th>
            <th className="px-4 py-2.5 text-left font-mono font-medium text-muted-foreground">{labels.colId}</th>
            {onDelete && <th className="w-10 px-4 py-2.5" />}
          </tr>
        </thead>
        <tbody>
          {products.map((row, i) => {
            // Название на языке страницы: в таблице человек ищет глазами то же
            // слово, которое увидит в карточке.
            const p = localizeProduct(row, lang)
            const href = hrefFor?.(p.id)
            const cell = "px-4 py-2.5"
            return (
              <tr
                key={p.id}
                className={`border-b border-border transition-colors last:border-0 hover:bg-muted/40 ${i % 2 !== 0 ? "bg-muted/20" : ""}`}
              >
                <td className={cell}>
                  <Cell href={href} plain>
                    {p.media_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.media_url} alt="" className="h-8 w-8 rounded border border-border object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-muted/40 text-muted-foreground opacity-40">—</div>
                    )}
                  </Cell>
                </td>
                {/* Название несёт ссылку с текстом — по ней ориентируется и
                    экранный диктор, и клавиатура. */}
                <td className={`${cell} font-medium`}>
                  <Cell href={href} className="block text-foreground hover:underline">
                    {p.localizedName}
                  </Cell>
                </td>
                <td className={cell}>
                  <Cell href={href} plain className="block text-foreground">
                    {money.format(p.price)}
                  </Cell>
                </td>
                <td className={cell}>
                  <Cell href={href} plain className="block font-mono text-muted-foreground">
                    {p.id.slice(0, 8)}…
                  </Cell>
                </td>
                {onDelete && <td className={`${cell} text-right`}>
                  <button
                    onClick={() => onDelete(p.id)}
                    disabled={deleting === p.id}
                    className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-40"
                  >
                    {deleting === p.id
                      ? <Loader2 size={13} className="animate-spin" />
                      : <Trash2 size={13} />}
                  </button>
                </td>}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
