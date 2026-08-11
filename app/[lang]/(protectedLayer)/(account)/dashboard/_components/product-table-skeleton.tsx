import { Skeleton } from "@/components/ui/skeleton"

// Reference no-JS skeleton for the product table. Renders the SAME chrome as
// ProductTable (border frame + column headers) so the static shell is identical,
// and fills the body with placeholder rows whose cells are shadcn <Skeleton>.
//
// Why this exists: the dashboard data (the cell VALUES) is loaded client-side
// from /api/* and can only appear once JS runs — but everything around it (the
// frame, the column headers, the row grid) is static and MUST render without JS
// instead of a blank "Loading…" spinner (STATIC-FIRST.md §4a). The real row count
// is unknown before the fetch, so we render a fixed 5 rows as the reference shape.
const SKELETON_ROWS = 5

export function ProductTableSkeleton({ rows = SKELETON_ROWS }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-14">Photo</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Name</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Price</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground font-mono">ID</th>
            <th className="px-4 py-2.5 w-10" />
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr
              key={i}
              className={`border-b border-border last:border-0 ${i % 2 !== 0 ? "bg-muted/20" : ""}`}
            >
              <td className="px-4 py-2.5">
                <Skeleton className="h-8 w-8 rounded" />
              </td>
              <td className="px-4 py-2.5">
                <Skeleton className="h-3.5 w-28" />
              </td>
              <td className="px-4 py-2.5">
                <Skeleton className="h-3.5 w-12" />
              </td>
              <td className="px-4 py-2.5">
                <Skeleton className="h-3.5 w-16" />
              </td>
              <td className="px-4 py-2.5">
                <Skeleton className="h-3.5 w-3.5 ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
