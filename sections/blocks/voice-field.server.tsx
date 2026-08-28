import type { SectionRenderer } from '@/sections/contract'
import { voiceStrings } from '@/lib/i18n/voice-field.i18n'
import { VoiceBlock } from '@/components/form/voice-block.client'

// ПОЛЕ ВВОДА С ГОЛОСОМ КАК ВИД КАТАЛОГА (шаг 32-9, 2026-08-28).
//
// 🔒 ПОЧЕМУ ВИД, А НЕ ВИТРИНА. Владелец сказал прямо: «добавь его в стандартные
// блоки». Пока у элемента нет `kind`, поставить его в страницу нечем: материал
// страницы — список имён видов, и вещь без имени в этом списке назвать нельзя.
// Живой образец на `/blocks` показывал элемент и не давал им пользоваться.
//
// 🔒 РЕНДЕРЕР ОСТАЁТСЯ СЕРВЕРНЫМ. Под `sections/` нет ни одного `"use client"` —
// это свойство слоя, а не случайность. Секция резолвит словарь и рисует островок,
// который живёт в `components/form/`; островку уезжает ОДНА строка подписи, а не
// словарь целиком.
//
// 🔒 РАЗМЕР ПРИХОДИТ ПОЛЕМ, А НЕ ВТОРЫМ ВИДОМ. `line` — строка с микрофоном
// внутри рамки, `area` — область текста с кнопкой снизу. Умолчание — строка:
// короткий ответ нужен чаще длинного.
export const voiceField: SectionRenderer<'voiceField'> = (b, { key: k, lang }) => (
  <VoiceBlock
    key={k}
    lang={lang}
    variant={b.variant}
    title={b.title}
    hint={b.hint}
    comment={b.comment}
    placeholder={b.placeholder}
    micLabel={voiceStrings(lang).mic}
  />
)
