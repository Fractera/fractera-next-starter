import { Skeleton } from "@/components/ui/skeleton"

// Скелетон таблицы цен — СВОЙ, и это не украшение (шаг 521, требование владельца
// 2026-08-21, названо критическим).
//
// 🔒 ОБЩИЙ СКЕЛЕТОН ВРАЛ О ФОРМЕ ТАБЛИЦЫ, и разбор это вскрыл. Он рисовал ПЯТЬ
// колонок — фото, название, цена, идентификатор, действие, — потому что такова
// таблица каталога. У бухгалтерии колонок ТРИ: ни фотографии, ни колонки
// действия здесь нет, цена правится прямо в своей ячейке. Чтобы спрятать лишнюю
// колонку, страница передавала в общий скелетон `colPhoto: ""` — пустая строка
// как способ убрать заголовок, при этом сама колонка оставалась.
//
// Итог был такой: пока идёт запрос, человек видит пятиколоночную сетку, а после
// ответа — трёхколоночную таблицу. Разметка дёргалась, и это не косметика:
// скелетон существует ровно для того, чтобы показать БУДУЩУЮ форму.
//
// Это и есть довод владельца в чистом виде: общий скелетон заранее решает, что
// все таблицы одной формы, и остальным остаётся притворяться.
//
// 🔒 ЗАЧЕМ СКЕЛЕТОН ВООБЩЕ. Значения приходят из базы и появляются только после
// запроса, а рама, заголовки колонок и сетка строк статические и обязаны
// рисоваться без JavaScript — вместо пустого «Загрузка…».
const SKELETON_ROWS = 5

export function PriceTableSkeleton(
  { rows = SKELETON_ROWS, labels }: {
    rows?: number
    labels: { colName: string; colPrice: string; colId: string }
  },
) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colName}</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colPrice}</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colId}</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className={`border-b border-border last:border-0 ${i % 2 !== 0 ? "bg-muted/20" : ""}`}>
              <td className="px-4 py-2.5"><Skeleton className="h-3.5 w-28" /></td>
              {/* Ячейка цены выше прочих: в ней стоит поле правки, а не текст. */}
              <td className="px-4 py-2.5"><Skeleton className="h-7 w-20" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-3.5 w-16" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
