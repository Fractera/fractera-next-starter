import type { SectionSet, DesignManifest } from './contract'
import { set as fracteraSet, manifest as fracteraManifest } from './fractera'

// КАКИМ НАБОРОМ СЕКЦИЙ РИСУЕТСЯ СТРАНИЦА.
//
// 🔒 ЗДЕСЬ ОДНА ФУНКЦИЯ, И ЭТО ГЛАВНОЕ. Выбор дизайна обязан жить в одном месте:
// разреши странице выбирать самой — и привязка размажется по десяткам файлов, а
// первая же новая страница, забывшая её повторить, нарисуется чужим набором.
// Ошибка при этом не падает: страница просто выглядит не так, и человек заметит
// это не сразу.
//
// СЕГОДНЯ дизайн один, поэтому функция всегда отдаёт «fractera». Привязка к
// проекту (`app/[lang]/(<проект>)/_data/project.ts` → `design`) — следующая
// партия шага 508; она изменит ТОЛЬКО тело этой функции, и ни одной страницы
// трогать не придётся. Ради этого функция и появилась раньше второго дизайна.

const DESIGNS: Record<string, { set: SectionSet; manifest: DesignManifest }> = {
  fractera: { set: fracteraSet, manifest: fracteraManifest },
}

export const DEFAULT_DESIGN = 'fractera'

/** Набор рендереров, которым рисуется страница. */
export function activeSet(design: string = DEFAULT_DESIGN): SectionSet {
  return DESIGNS[design]?.set ?? DESIGNS[DEFAULT_DESIGN].set
}

/** Паспорт дизайна — для витрины и для отчёта покрытия. */
export function designManifest(design: string = DEFAULT_DESIGN): DesignManifest {
  return DESIGNS[design]?.manifest ?? DESIGNS[DEFAULT_DESIGN].manifest
}

/** Какие дизайны установлены в проекте. */
export function designNames(): string[] {
  return Object.keys(DESIGNS)
}
