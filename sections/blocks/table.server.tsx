import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'

// Таблица.
export const table: SectionRenderer<'table'> = (b, { key: k }) => {
  const lastCol = b.headers.length - 1
  return (
    <figure key={k} className="my-6 overflow-x-auto rounded-2xl border border-border">
      {b.caption && (
        <figcaption className="border-b border-border bg-muted/40 px-5 py-3 text-sm font-semibold text-muted-foreground">
          {inline(b.caption, `${k}-cap`)}
        </figcaption>
      )}
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            {b.headers.map((h, ci) => (
              <th
                key={ci}
                scope="col"
                className={`px-4 py-3 align-bottom font-semibold ${ci === lastCol ? 'bg-primary/10 text-foreground' : 'text-foreground'}`}
              >
                {inline(h, `${k}-h${ci}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {b.rows.map((row, ri) => (
            <tr key={ri} className="border-b border-border last:border-0">
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 align-top leading-relaxed ${
                    ci === 0
                      ? 'font-medium text-foreground'
                      : ci === lastCol
                        ? 'bg-primary/5 text-foreground'
                        : 'text-muted-foreground'
                  }`}
                >
                  {inline(cell, `${k}-r${ri}c${ci}`)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
