import { Skeleton } from "@/components/ui/skeleton"

// Скелетон каталога администратора — СВОЙ (шаг 521, требование владельца
// 2026-08-21, названо критическим).
//
// 🔒 ЗДЕСЬ ПЯТАЯ КОЛОНКА НАСТОЯЩАЯ, и в этом вся разница с соседями. У
// администратора в строке есть действие — удаление, — поэтому узкая колонка
// справа обещает то, что действительно появится. У персонала её нет, у
// бухгалтерии колонок вообще три. Пока скелетон был общим, он рисовал ПЯТЬ
// колонок всем, и трое из четырёх видели во время загрузки чужую форму.
//
// Общий скелетон заранее решает, что все таблицы одной формы, и остальным
// остаётся притворяться — ровно это владелец и назвал критическим.
//
// 🔒 ЗАЧЕМ СКЕЛЕТОН ВООБЩЕ. Значения приходят из базы и появляются только после
// запроса, а рама, заголовки колонок и сетка строк статические и обязаны
// рисоваться без JavaScript — вместо пустого «Загрузка…».
const SKELETON_ROWS = 5

export function CatalogueTableSkeleton(
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
            <th className="w-10 px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className={`border-b border-border last:border-0 ${i % 2 !== 0 ? "bg-muted/20" : ""}`}>
              <td className="px-4 py-2.5"><Skeleton className="h-8 w-8 rounded" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-3.5 w-28" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-3.5 w-12" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-3.5 w-16" /></td>
              <td className="px-4 py-2.5"><Skeleton className="ml-auto h-3.5 w-3.5" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
