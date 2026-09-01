import { Hammer } from "lucide-react"
import { Small } from "@/components/ui/typography"

// «В ПРОЦЕССЕ РАЗРАБОТКИ» — ОДНА ЗАГЛУШКА НА ВСЕ НЕПОСТРОЕННЫЕ МЕСТА ВХОДА
// (77-15, 2026-09-01, прямая формулировка владельца: «поставить просто надпись в
// процессе разработки»).
//
// 🔒 ОДИН КОМПОНЕНТ, А НЕ СЕМЬ ОДИНАКОВЫХ БЛОКОВ. Заглушек в этом заходе сразу
// семь: четыре вида логов, календарь, карта и карточка инструкции. Написанные по
// отдельности, они разъезжаются — это уже замерено на анатомии шага (28-2).
//
// 🔒 ЗАГЛУШКА НАЗЫВАЕТ СЕБЯ, А НЕ МОЛЧИТ. Пустое место человек читает как
// поломку, а не как «рано» (28-13). Поэтому у неё есть значок, имя того, чего тут
// ещё нет, и — если оно есть — строка о том, что здесь будет.
//
// 🔒 ПРИЗНАК В РАЗМЕТКЕ ИМЕНУЕТ МЕСТО. Без него замер «заглушка на месте» не
// отличает семь заглушек друг от друга и подтверждает не то, что проверяли.

export function InProgress({
  where,
  label,
  lead,
}: {
  /** Имя места — попадает в признак разметки: `logs-db`, `calendar`, `instruction`. */
  where: string
  /** Что именно здесь будет. */
  label: string
  /** Одна строка объяснения; необязательна. */
  lead?: string
}) {
  return (
    <div
      data-in-progress={where}
      className="flex items-start gap-2 rounded-md border border-dashed border-border bg-muted/30 p-3"
    >
      <Hammer className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-col gap-1">
        <Small className="font-medium text-foreground">{label}</Small>
        {lead && <Small className="leading-relaxed text-muted-foreground">{lead}</Small>}
      </div>
    </div>
  )
}
