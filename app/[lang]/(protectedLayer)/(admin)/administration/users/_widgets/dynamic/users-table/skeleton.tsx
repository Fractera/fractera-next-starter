import { Skeleton } from "@/components/ui/skeleton"

// Скелетон ЭТОЙ таблицы — четыре колонки, ровно её собственные.
//
// 🔒 ПОЧЕМУ НЕ ОБЩИЙ (шаг 521, названо владельцем критическим). Общий скелетон
// заранее решает, что все таблицы одной формы: у соседей их пять, здесь четыре,
// и чужая рама во время загрузки означала бы, что разметка дёрнется, когда
// придёт ответ.
//
// Рама и заголовки статические: они известны до всякого запроса и рисуются без
// JavaScript — вместо пустого «Загрузка…».
const ROWS = 5

export function UsersTableSkeleton(
  { labels }: { labels: { colAccount: string; colRoles: string; colProvider: string; colCreated: string } },
) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="px-3 py-2 text-left font-medium">{labels.colAccount}</th>
            <th className="px-3 py-2 text-left font-medium">{labels.colRoles}</th>
            <th className="px-3 py-2 text-left font-medium">{labels.colProvider}</th>
            <th className="px-3 py-2 text-left font-medium">{labels.colCreated}</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: ROWS }, (_, i) => (
            <tr key={i} className="border-b border-border/60 last:border-0">
              <td className="px-3 py-2"><Skeleton className="h-4 w-48" /></td>
              <td className="px-3 py-2"><Skeleton className="h-4 w-24" /></td>
              <td className="px-3 py-2"><Skeleton className="h-4 w-16" /></td>
              <td className="px-3 py-2"><Skeleton className="h-4 w-20" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
