import Link from "next/link"
import type { LocalizedProduct } from "@/lib/products/localize"

// Строка списка покупателя: ведёт на ПУБЛИЧНУЮ страницу товара, а справа стоит
// добавление в заказ.
//
// 🔒 АДРЕС ЗДЕСЬ ДРУГОЙ, ЧЕМ У ПЕРСОНАЛА, и ради этого различия виджеты и
// разошлись. У покупателя нет карточки управления, зато есть витрина: страница
// открыта всем и уже статическая — законный адрес для него. Прежде адрес строки
// приходил в общую таблицу пропсом, то есть был её настройкой; теперь он
// свойство ЭТОЙ таблицы и нигде больше не выбирается.
//
// Ссылка стоит на ячейках, а не на всей строке: `<a>` не может обернуть `<tr>`
// по правилам разметки таблицы, а последняя ячейка занята покупкой — сделать её
// частью ссылки значило бы уводить на витрину при попытке нажать «в заказ».

function Cell(
  { href, plain, className, children }:
  { href: string; plain?: boolean; className?: string; children: React.ReactNode },
) {
  return (
    <Link href={href} className={className} {...(plain ? { tabIndex: -1, "aria-hidden": true } : {})}>
      {children}
    </Link>
  )
}

export function ShopRow(
  { product, href, money, striped, action }: {
    product: LocalizedProduct
    href: string
    money: Intl.NumberFormat
    striped: boolean
    /** Покупка: живёт своим файлом рядом, потому что у неё своё состояние. */
    action: React.ReactNode
  },
) {
  const cell = "px-4 py-2.5"
  return (
    <tr className={`border-b border-border transition-colors last:border-0 hover:bg-muted/40 ${striped ? "bg-muted/20" : ""}`}>
      <td className={cell}>
        <Cell href={href} plain>
          {product.media_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={product.media_url} alt="" className="h-8 w-8 rounded border border-border object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-muted/40 text-muted-foreground opacity-40">—</div>
          )}
        </Cell>
      </td>
      <td className={`${cell} font-medium`}>
        <Cell href={href} className="block text-foreground hover:underline">
          {product.localizedName}
        </Cell>
      </td>
      <td className={cell}>
        <Cell href={href} plain className="block text-foreground">
          {money.format(product.price)}
        </Cell>
      </td>
      <td className={cell}>
        <Cell href={href} plain className="block font-mono text-muted-foreground">
          {product.id.slice(0, 8)}…
        </Cell>
      </td>
      <td className={`${cell} text-right`}>{action}</td>
    </tr>
  )
}
