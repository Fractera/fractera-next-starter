"use client"

// Строка каталога администратора: только чтение и единственное действие —
// удаление.
//
// 🔒 СТРОКА НЕ ССЫЛКА, И ЭТО НЕ ЗАБЫВЧИВОСТЬ. Вести некуда: карточка товара
// принадлежит слою персонала, и администратор её открыть не может. Ссылка,
// ведущая в отказ, — обещание, которого интерфейс не сдержит. Прежде это
// выражалось непереданным пропсом `hrefFor` у общей таблицы, то есть отсутствием
// значения; теперь — отсутствием кода ссылки. Второе нельзя передать по ошибке.
//
// 🔒 ПОДТВЕРЖДЕНИЕ ОБЯЗАТЕЛЬНО. Это единственное действие в приложении, после
// которого нельзя вернуться назад.

import { Trash2, Loader2 } from "lucide-react"
import type { LocalizedProduct } from "@/lib/products/localize"

export function CatalogueRow(
  { product, money, striped, deleting, onDelete, deleteLabel }: {
    product: LocalizedProduct
    money: Intl.NumberFormat
    striped: boolean
    deleting: boolean
    onDelete: () => void
    /** Подпись действия для диктора: колонка заголовка не имеет. */
    deleteLabel: string
  },
) {
  const cell = "px-4 py-2.5"
  return (
    <tr className={`border-b border-border transition-colors last:border-0 hover:bg-muted/40 ${striped ? "bg-muted/20" : ""}`}>
      <td className={cell}>
        {product.media_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={product.media_url} alt="" className="h-8 w-8 rounded border border-border object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-muted/40 text-muted-foreground opacity-40">—</div>
        )}
      </td>
      <td className={`${cell} font-medium text-foreground`}>{product.localizedName}</td>
      <td className={`${cell} text-foreground`}>{money.format(product.price)}</td>
      <td className={`${cell} font-mono text-muted-foreground`}>{product.id.slice(0, 8)}…</td>
      <td className={`${cell} text-right`}>
        <button
          onClick={onDelete}
          disabled={deleting}
          aria-label={deleteLabel}
          className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-40"
        >
          {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
        </button>
      </td>
    </tr>
  )
}
