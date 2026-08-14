import type { SectionSet } from './contract'
import { p } from './blocks/p.server'
import { h2 } from './blocks/h2.server'
import { h3 } from './blocks/h3.server'
import { quote } from './blocks/quote.server'
import { list } from './blocks/list.server'
import { olist } from './blocks/olist.server'
import { figure } from './blocks/figure.server'
import { code } from './blocks/code.server'
import { note } from './blocks/note.server'
import { cta } from './blocks/cta.server'
import { callout } from './blocks/callout.server'
import { table } from './blocks/table.server'
import { docref } from './blocks/docref.server'
import { founder } from './blocks/founder.server'
import { columns } from './blocks/columns.server'
import { group } from './blocks/group.server'
import { hero } from './blocks/hero.server'
import { badges } from './blocks/badges.server'
import { panel } from './blocks/panel.server'

// НАБОР СЕКЦИЙ ПРОЕКТА — единственный, и это осознанное решение (2026-08-14).
//
// 🔒 ПОЧЕМУ ЗДЕСЬ НЕТ ВЫБОРА ДИЗАЙНА. Он тут был: реестр наборов, манифест
// покрытия, наследование недостающего. Всё это обслуживало сценарий «несколько
// дизайнов на одном сервере», который владелец в обозримое время не планирует, —
// и было снесено, пока не обросло зависимостями. Машинерия под ненужный сценарий
// не бесплатна: её читает каждый, кто сюда заглянет, и обходит каждый, кто
// правит соседнее.
//
// 🔒 ЕСЛИ СЦЕНАРИЙ ВЕРНЁТСЯ, начинать надо отсюда: набор становится записью в
// карте, а `SectionSet` — частичным (`?` у ключей). Это одна правка в этом файле
// и одна в договоре; шестнадцать рендереров не трогаются вовсе — ради этого они
// и лежат по файлу на вид. Разбор того сценария сохранён в `SECTIONS.md`, чтобы
// следующая сессия не проектировала его заново.
export const SECTIONS: SectionSet = {
  p, h2, h3, quote, list, olist, figure, code, note, cta, callout, table, docref, founder, columns, group, hero, badges, panel,
}
