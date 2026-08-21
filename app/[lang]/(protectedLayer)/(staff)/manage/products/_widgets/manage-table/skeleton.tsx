import { Skeleton } from "@/components/ui/skeleton"

// Скелетон таблицы персонала — СВОЙ (шаг 521, требование владельца 2026-08-21,
// названо критическим).
//
// 🔒 ОБЩИЙ СКЕЛЕТОН ЗАРАНЕЕ РЕШАЛ, ЧТО ВСЕ ТАБЛИЦЫ ОДНОЙ ФОРМЫ. Он рисовал пятую
// колонку — под действие строки, — потому что она есть у администратора и у
// покупателя. У персонала действия в строке нет: строка целиком ведёт в
// карточку, и править товар человек уходит туда. Пустая пятая колонка обещала
// кнопку, которой в этой таблице не будет никогда.
//
// Итог прежнего устройства: пока идёт запрос, видна пятиколоночная сетка, а
// после ответа — четырёхколоночная таблица. Разметка дёргалась, и это не
// косметика: скелетон существует ровно для того, чтобы показать БУДУЩУЮ форму.
//
// 🔒 ЗАЧЕМ СКЕЛЕТОН ВООБЩЕ. Значения приходят из базы и появляются только после
// запроса, а рама, заголовки колонок и сетка строк статические и обязаны
// рисоваться без JavaScript — вместо пустого «Загрузка…».
const SKELETON_ROWS = 5

export function ManageTableSkeleton(
  { rows = SKELETON_ROWS, labels }: {
    rows?: number
    labels: { colPhoto: string; colName: string; colPrice: string; colId: string }
  },
) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="w-14 px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colPhoto}</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colName}</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colPrice}</th>
            <th className="px-4 py-2.5 text-left font-mono font-medium text-muted-foreground">{labels.colId}</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className={`border-b border-border last:border-0 ${i % 2 !== 0 ? "bg-muted/20" : ""}`}>
              <td className="px-4 py-2.5"><Skeleton className="h-8 w-8 rounded" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-3.5 w-28" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-3.5 w-12" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-3.5 w-16" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
