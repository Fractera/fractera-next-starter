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

type Props = {
  products: Product[]
  deleting: string | null
  onDelete: (id: string) => void
  lang: string
  labels: { colPhoto: string; colName: string; colPrice: string; colId: string; empty: string }
}

export function ProductTable({ products, deleting, onDelete, lang, labels }: Props) {
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
            <th className="w-10 px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {products.map((row, i) => {
            // Название на языке страницы: в таблице человек ищет глазами то же
            // слово, которое увидит в карточке.
            const p = localizeProduct(row, lang)
            const href = `/${lang}/manage/products/${p.id}`
            const cell = "px-4 py-2.5"
            return (
              <tr
                key={p.id}
                className={`border-b border-border transition-colors last:border-0 hover:bg-muted/40 ${i % 2 !== 0 ? "bg-muted/20" : ""}`}
              >
                <td className={cell}>
                  <Link href={href} tabIndex={-1} aria-hidden className="block">
                    {p.media_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.media_url} alt="" className="h-8 w-8 rounded border border-border object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-muted/40 text-muted-foreground opacity-40">—</div>
                    )}
                  </Link>
                </td>
                {/* Название несёт ссылку с текстом — по ней ориентируется и
                    экранный диктор, и клавиатура. */}
                <td className={`${cell} font-medium`}>
                  <Link href={href} className="block text-foreground hover:underline">
                    {p.localizedName}
                  </Link>
                </td>
                <td className={cell}>
                  <Link href={href} tabIndex={-1} aria-hidden className="block text-foreground">
                    {p.price.toFixed(2)}
                  </Link>
                </td>
                <td className={cell}>
                  <Link href={href} tabIndex={-1} aria-hidden className="block font-mono text-muted-foreground">
                    {p.id.slice(0, 8)}…
                  </Link>
                </td>
                <td className={`${cell} text-right`}>
                  <button
                    onClick={() => onDelete(p.id)}
                    disabled={deleting === p.id}
                    className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-40"
                  >
                    {deleting === p.id
                      ? <Loader2 size={13} className="animate-spin" />
                      : <Trash2 size={13} />}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
