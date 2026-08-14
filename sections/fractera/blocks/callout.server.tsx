import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'

// Выноска: то, что читатель не должен пропустить.
//
// 🔒 БЫЛА СЛЕПА К ТЕМЕ (найдено гейтом `check:sections` при переезде, шаг 508).
// Здесь стояли `border-sky-400/30`, `text-sky-300`, `text-sky-200` — абсолютные
// цвета, которые по определению одинаковы в обеих темах. Небесно-голубая подпись
// на светлом фоне почти не читается, и увидеть это можно было только глазами, на
// светлой теме, на странице, где выноска встречается, — а она не встречалась
// нигде: этот вид не был использован ни в одном материале.
//
// 🔒 ПОЧЕМУ ВЫНОСКА СТАЛА НЕЙТРАЛЬНОЙ, А НЕ «ТОЖЕ ГОЛУБОЙ». В палитре проекта
// один акцент — `primary`. Второго нет, и выдумать его значит вернуть тот же
// абсолютный цвет под другим именем. Поэтому панель нейтральная (`muted`), а
// внимание держит значок акцентом: отличие от кнопки `cta` остаётся, а тема
// продолжает работать.
export const callout: SectionRenderer<'callout'> = (b, { key: k }) => (
  <aside key={k} className="my-6 flex gap-4 rounded-2xl border border-border bg-muted/40 p-5">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-primary" aria-hidden>
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
    </svg>
    <p className="text-[15px] leading-relaxed text-muted-foreground">
      <span className="font-semibold text-foreground">{b.title} </span>
      {inline(b.text, k)}
    </p>
  </aside>
)
