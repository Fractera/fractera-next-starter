import { AlertTriangle } from "lucide-react"
import { P, Small } from "@/components/ui/typography"

// ОРАНЖЕВЫЙ КОНТЕЙНЕР ПРЕДУПРЕЖДЕНИЯ (31-19, 2026-08-29).
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
// Цвет один и выбора не предлагает: это не «уровень важности», а один жанр —
// **цена решения, названная до того, как решение приняли**.
export function AdviceNote({
  title,
  text,
  probe,
}: {
  title: string
  text: string
  /** Значение `data-advice`: по нему предупреждение находят зондом на своей странице. */
  probe: string
}) {
  return (
    <div
      data-advice={probe}
      className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
      <div className="flex flex-col gap-1">
        <P className="text-[length:var(--fs-body)] font-medium text-amber-900 dark:text-amber-100">{title}</P>
        <Small className="text-amber-800 dark:text-amber-200">{text}</Small>
      </div>
    </div>
  )
}
