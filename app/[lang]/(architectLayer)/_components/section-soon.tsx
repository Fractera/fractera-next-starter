import { Clock } from "lucide-react"
import { H4, Small } from "@/components/ui/typography"

// ЧЕСТНАЯ ЗАГЛУШКА НЕПОСТРОЕННОГО РАЗДЕЛА (77-1, 2026-08-31).
//
// 🔒 ЗАГЛУШКА ГОВОРИТ ТРИ ВЕЩИ, И ТРЕТЬЯ ВАЖНЕЕ ДВУХ ПЕРВЫХ: что здесь будет ·
// почему место занято сейчас, а не появится потом из ниоткуда · и ГДЕ это
// работает СЕГОДНЯ. Без третьей строки человек, которому нужен бот прямо сейчас,
// уходит ни с чем, хотя рабочая вкладка панели никуда не делась.
//
// ✗ МОЛЧАЩАЯ ЗАГЛУШКА ЧИТАЕТСЯ КАК ПОЛОМКА — оплачено в 28-13: шаг, до которого
// человек не дошёл, показывал пустоту, и владелец прочитал это как сломанную
// страницу, а не как «рано».
//
// 🔒 ОДИН КОМПОНЕНТ НА ВСЕ ЗАГЛУШКИ ЭТОГО ВХОДА. Два блока, написанные по
// отдельности, разъезжаются — замерено на анатомии шага (28-2).
//
// 🔒 БЕЗ КНОПКИ И БЕЗ ССЫЛКИ-ДЕЙСТВИЯ. Адрес панели назван СЛОВАМИ, а не сделан
// кнопкой: панель живёт на чужом поддомене, её адрес выводится из адреса сайта и
// у нового сервера пуст. Кнопка, ведущая в пустоту, хуже строки текста —
// оплачено шагом 66.

export function SectionSoon({
  section,
  title,
  lead,
  whereLabel,
  where,
}: {
  /** Чей это раздел — уезжает в признак, по нему замер отличает одну заглушку от другой. */
  section: string
  title: string
  lead: string
  whereLabel: string
  where: string
}) {
  return (
    <section
      data-section-soon={section}
      className="rounded-lg border border-dashed border-border bg-card p-4 sm:p-5"
    >
      <div className="flex items-start gap-2.5">
        <Clock size={15} aria-hidden className="mt-0.5 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex flex-col gap-2">
          <H4 variant="ui">{title}</H4>
          <Small className="text-muted-foreground">{lead}</Small>
          <Small className="text-muted-foreground">
            <strong className="text-foreground">{whereLabel}</strong> {where}
          </Small>
        </div>
      </div>
    </section>
  )
}
