// Прибор 106-4: печатает реестр ВСТРОЕННЫХ признаков, ВЫЗЫВАЯ порождающий код,
// а не пересказывая его грепом. Приём взят из дорогих фактов 81-1.
import { builtinFacts } from "@/lib/facts/builtin"

const rows = builtinFacts().map((f) => {
  const any = f as unknown as Record<string, unknown>
  return {
    key: f.key,
    level: (any.level as string) ?? null,
    title: f.title,
    description: f.description,
    howToFind: (any.howToFind as string) ?? (any.how_to_find as string) ?? "",
  }
})

console.log(JSON.stringify({ count: rows.length, rows }, null, 2))
