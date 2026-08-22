import { Skeleton } from "@/components/ui/skeleton"

// Скелетон списка покупателя — СВОЙ (шаг 521, требование владельца 2026-08-21,
// названо критическим).
//
// 🔒 ПЯТАЯ КОЛОНКА ЗДЕСЬ ШИРЕ, ЧЕМ У СОСЕДЕЙ, и это не придирка. В строке
// покупателя стоит не значок, а тройка «минус — количество — плюс» и кнопка
// корзины: место под них занимает не 3.5 пикселя ширины, а сорок с лишним.
// Общий скелетон рисовал узкую ячейку под значок всем четверым, и после ответа
// таблица покупателя раздвигалась вправо на глазах.
//
// Ровно это и значит «общий скелетон заранее решает, что все таблицы одной
// формы»: он существует, чтобы показать БУДУЩУЮ форму, а показывал чужую.
//
// 🔒 ЗАЧЕМ СКЕЛЕТОН ВООБЩЕ. Значения приходят из базы и появляются только после
// запроса, а рама, заголовки колонок и сетка строк статические и обязаны
// рисоваться без JavaScript — вместо пустого «Загрузка…».
const SKELETON_ROWS = 5

export function ShopTableSkeleton(
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
            <th className="w-40 px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className={`border-b border-border last:border-0 ${i % 2 !== 0 ? "bg-muted/20" : ""}`}>
              <td className="px-4 py-2.5"><Skeleton className="h-8 w-8 rounded" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-3.5 w-28" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-3.5 w-12" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-3.5 w-16" /></td>
              {/* Место под «минус · количество · плюс · корзина». */}
              <td className="px-4 py-2.5"><Skeleton className="ml-auto h-7 w-32" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
