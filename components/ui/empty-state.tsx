import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// ПУСТОЕ СОСТОЯНИЕ — ОДИН ВИД НА ВЕСЬ ПРОЕКТ.
//
// 🔒 ЧТО ЭТО ЛЕЧИТ (замер 2026-08-15). «Здесь пока ничего нет» рисовали пять
// разных мест, и все по-разному: высота `py-8` / `py-12` / `py-24`, скругление
// `xl` / `2xl`, текст 12 / 14 / 16 пикселей, у двоих центрирование через
// `flex`, у остальных через `text-center`. Одно и то же сообщение выглядело на
// соседних экранах как три разных элемента интерфейса.
//
// Дефект того же рода, что и пять шапок: место, где каждый пишет сам, обязано
// разъехаться — это вопрос числа правок, а не аккуратности.
//
// 🔒 ЗАГОЛОВОК И ПОЯСНЕНИЕ — РАЗНЫЕ ВЕЩИ. Короткая строка («Товаров пока нет»)
// отвечает, что произошло; пояснение под ней — что с этим делать. Второе
// необязательно: выдумывать совет, которого нет, хуже, чем промолчать.

export function EmptyState({
  title,
  hint,
  action,
  className,
}: {
  /** Что произошло — одна короткая строка. */
  title: ReactNode
  /** Что с этим делать. Не выдумывать, если сказать нечего. */
  hint?: ReactNode
  /** Кнопка или ссылка — единственное действие, которое здесь уместно. */
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-6 py-16 text-center",
        className,
      )}
    >
      <p className="text-base font-medium text-foreground">{title}</p>
      {hint && <p className="max-w-md text-sm leading-normal text-muted-foreground">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
