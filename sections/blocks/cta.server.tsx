import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'
import { CtaButton } from '@/sections/cta-button.server'

// Призыв к действию.
//
// 🔒 ПОДПИСЬ НАД КНОПКОЙ НЕОБЯЗАТЕЛЬНА (2026-08-16, замечено владельцем). Когда
// кнопка стоит внутри раздела, чей заголовок уже сказал то же самое, подпись —
// дословный повтор через полэкрана.
//
// 🔒 НЕТ ПОДПИСИ — НЕТ И РАМКИ (владелец 2026-08-19). Рамка существует, чтобы
// держать подпись; без неё она держала пустоту: кнопка жалась влево, а справа
// тянулся пустой прямоугольник во всю ширину. Владелец назвал это словом
// «некрасиво», и он прав — контейнер без содержимого читается как поломка
// вёрстки, а не как воздух.
//
// Кнопка одна на все места, где предлагается действие, — sections/cta-button:
// вторая копия классов совпадала бы с первой ровно до первой правки цвета.
export const cta: SectionRenderer<'cta'> = (b, { key: k }) =>
  b.text ? (
    <div key={k} className="my-4 flex flex-col gap-4 rounded-2xl border border-primary/30 bg-primary/[0.06] p-6">
      <p className="text-base font-medium text-foreground">{inline(b.text, k)}</p>
      <CtaButton href={b.href}>{b.label}</CtaButton>
    </div>
  ) : (
    <div key={k} className="my-4">
      <CtaButton href={b.href}>{b.label}</CtaButton>
    </div>
  )
