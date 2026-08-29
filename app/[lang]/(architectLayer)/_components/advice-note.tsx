import { AlertTriangle, Info } from "lucide-react"
import { P, Small } from "@/components/ui/typography"

// ЦВЕТНОЙ КОНТЕЙНЕР НАД УПРАВЛЕНИЕМ (31-19, 2026-08-29; второй тон — 31-20).
//
// 🔒 ВЫНЕСЕН, ПОТОМУ ЧТО ПОТРЕБИТЕЛЕЙ СТАЛО ТРОЕ: цена языка · режим маршрутизации,
// который пока никто не читает · совет добавлять по одному слоту. Тот же порог, по
// которому в 31-12 вынесены выключатели и редактор меню. Двух копий хватало, трёх —
// уже нет: третья расходится с первыми молча, и один и тот же по смыслу блок
// начинает выглядеть по-разному на соседних страницах одного слоя.
//
// 🔒 БЕЗ `"use client"` НАМЕРЕННО. Файл не держит состояния и потому годится обоим:
// серверной странице и клиентскому островку. Поставь директиву — и он перестанет
// быть общим, оставшись общим по названию.
//
// 🔒 ТОНОВ РОВНО ДВА, И ОНИ РАЗЛИЧАЮТСЯ НЕ ГРОМКОСТЬЮ, А ЖАНРОМ (решение владельца
// 2026-08-29). `advice` — **цена решения, названная до того, как решение приняли**:
// оно останется верным навсегда. `warning` — **состояние системы прямо сейчас**:
// способности ещё нет, и блок исчезнет, когда она появится. Два одинаково оранжевых
// блока подряд человек читает как один длинный текст и второй пропускает; разные
// жанры обязаны выглядеть по-разному, иначе тот, что временный, не заметят.
export type NoteTone = "advice" | "warning"

const TONE: Record<NoteTone, { box: string; icon: string; title: string; text: string }> = {
  advice: {
    box: "border-amber-500/40 bg-amber-500/10",
    icon: "text-amber-600 dark:text-amber-400",
    title: "text-amber-900 dark:text-amber-100",
    text: "text-amber-800 dark:text-amber-200",
  },
  warning: {
    box: "border-destructive/40 bg-destructive/10",
    icon: "text-destructive",
    title: "text-destructive",
    text: "text-destructive/90",
  },
}

export function AdviceNote({
  title,
  text,
  probe,
  tone = "advice",
}: {
  title: string
  text: string
  /** Значение `data-advice`: по нему предупреждение находят зондом на своей странице. */
  probe: string
  tone?: NoteTone
}) {
  const c = TONE[tone]
  const Icon = tone === "warning" ? Info : AlertTriangle
  return (
    <div
      data-advice={probe}
      data-tone={tone}
      className={"flex items-start gap-2 rounded-lg border p-4 " + c.box}
    >
      <Icon className={"mt-0.5 size-4 shrink-0 " + c.icon} aria-hidden />
      <div className="flex flex-col gap-1">
        <P className={"text-[length:var(--fs-body)] font-medium " + c.title}>{title}</P>
        <Small className={c.text}>{text}</Small>
      </div>
    </div>
  )
}
