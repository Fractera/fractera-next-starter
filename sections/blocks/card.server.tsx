import type { SectionRenderer } from '@/sections/contract'

// Ячейка раздела карточками. Держит любые блоки — абзац, заголовок, список.
//
// 🔒 ЛЁГКАЯ ЗАЛИВКА ГРАДИЕНТОМ, А НЕ СПЛОШНЫМ ЦВЕТОМ. Сплошная подложка под
// длинным текстом утомляет глаз и спорит с рамкой; градиент, гаснущий к низу,
// метит ячейку у заголовка и отпускает там, где начинается чтение. Доли
// (`/10`, `/25`) стоят у ФОНА и РАМКИ — на текст прозрачность не наносится
// нигде, иначе он проваливается ниже порога контраста.
//
// 🔒 ТОН — СМЫСЛОВАЯ ГРУППА ИЗ ОБЩЕГО СЛОВАРЯ, а не «зелёный» и «оранжевый».
// `data` (зелёный) — то, что вы делаете; `access` (оранжевый) — то, что стоит
// сделать заранее, тот же тон, каким предупреждает панель. Цвет придёт из темы
// клиента: в другой палитре группа останется той же, а оттенок — его.
//
// Ячейка без тона — обычная рамка: заливка обязана что-то значить, иначе она
// украшение, а украшение на каждой ячейке перестаёт выделять хоть что-нибудь.
const TONE_FILL: Record<string, string> = {
  data: 'border-tone-data/25 bg-gradient-to-b from-tone-data/10 to-transparent',
  reach: 'border-tone-reach/25 bg-gradient-to-b from-tone-reach/10 to-transparent',
  access: 'border-tone-access/25 bg-gradient-to-b from-tone-access/10 to-transparent',
  code: 'border-tone-code/25 bg-gradient-to-b from-tone-code/10 to-transparent',
  muted: 'border-border bg-gradient-to-b from-muted/60 to-transparent',
}

export const card: SectionRenderer<'card'> = (b, ctx) => (
  <div
    key={ctx.key}
    className={`flex w-full flex-1 flex-col gap-3 rounded-2xl border p-6 ${
      b.tone ? TONE_FILL[b.tone] : 'border-border'
    }`}
  >
    {ctx.renderBlocks(b.children, ctx.lang, ctx.ui, ctx.key)}
  </div>
)
