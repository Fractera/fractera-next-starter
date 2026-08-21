import { Skeleton } from "@/components/ui/skeleton"

// Скелетон ЭТОЙ таблицы — пять колонок, ровно её собственные.
//
// 🪦 Здесь стояло «четыре колонки». Шаг 532 добавил «Последний вход», и рама
// поехала за таблицей ТЕМ ЖЕ коммитом — иначе разметка дёргалась бы на одну
// колонку в момент ответа, то есть ровно тем дефектом, ради которого скелетон
// и держат своим.
//
// 🔒 ПОЧЕМУ НЕ ОБЩИЙ (шаг 521, названо владельцем критическим). Общий скелетон
// заранее решает, что все таблицы одной формы, и чужая рама во время загрузки
// означала бы, что разметка дёрнется, когда придёт ответ. Сегодняшняя правка —
// прямое доказательство: колонка прибавилась у одной таблицы из пяти.
//
// Рама и заголовки статические: они известны до всякого запроса и рисуются без
// JavaScript — вместо пустого «Загрузка…».
const ROWS = 5

export function UsersTableSkeleton(
  { labels }: {
    labels: {
      colAccount: string
      colRoles: string
      colProvider: string
      colCreated: string
      colLastSeen: string
    }
  },
) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colAccount}</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colRoles}</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colProvider}</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colCreated}</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{labels.colLastSeen}</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: ROWS }, (_, i) => (
            <tr key={i} className={`border-b border-border last:border-0 ${i % 2 !== 0 ? "bg-muted/20" : ""}`}>
              <td className="px-4 py-2.5"><Skeleton className="h-4 w-48" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-4 w-24" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-4 w-16" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-4 w-20" /></td>
              <td className="px-4 py-2.5"><Skeleton className="h-4 w-28" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
