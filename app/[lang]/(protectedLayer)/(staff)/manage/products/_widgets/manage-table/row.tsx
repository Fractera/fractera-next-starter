import Link from "next/link"
import type { LocalizedProduct } from "@/lib/products/localize"

// Строка таблицы персонала: вся строка ведёт в карточку товара.
//
// 🔒 СТРОКА — ЭТО ССЫЛКА, а не строка с обработчиком нажатия. Разница не
// косметическая: настоящая ссылка открывается средним щелчком в новой вкладке,
// копируется правой кнопкой, видна экранному диктору как переход и работает с
// клавиатуры. `onClick` на `<tr>` не умеет ничего из этого, а список, из
// которого нельзя открыть запись в соседней вкладке, раздражает на второй
// минуте работы.
//
// Ссылка стоит на ячейках, а не на всей строке: `<a>` не может обернуть `<tr>`
// по правилам разметки таблицы.
//
// 🔒 АДРЕС ЗДЕСЬ БЕЗУСЛОВЕН — и это отличие от прежней общей таблицы. Та
// принимала `hrefFor?` необязательным, потому что обслуживала и администратора,
// которому вести некуда, и покупателя, которого ведут на витрину. У персонала
// адрес один и известен: карточка управления. Условной ветки «а вдруг ссылки
// нет» больше не существует, и ошибиться в ней негде.

// Ячейка-спутник: она повторяет тот же переход, что и ячейка с названием,
// поэтому диктору её объявлять не надо, а табуляции — останавливаться.
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

export function ManageRow(
  { product, href, money, striped }: {
    product: LocalizedProduct
    href: string
    money: Intl.NumberFormat
    striped: boolean
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
      {/* Название несёт ссылку с текстом — по ней ориентируется и экранный
          диктор, и клавиатура. */}
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
    </tr>
  )
}
