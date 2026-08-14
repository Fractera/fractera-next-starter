import { manifestOf, type SectionSet } from '@/sections/contract'
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

// ДИЗАЙН ПО УМОЛЧАНИЮ — «fractera». Ровно то оформление, которое проект носил до
// появления слоя секций: рендереры перенесены дословно, класс за классом.
//
// 🔒 ЭТО ПРОСТО ОДИН ИЗ ДИЗАЙНОВ, А НЕ «ПРАВИЛЬНЫЙ». Он покрывает все шестнадцать
// видов и потому годится в основу, но привилегий у него нет: чужой дизайн,
// покрывающий шесть, не хуже — он честно объявляет шесть.

export const set: SectionSet = {
  p, h2, h3, quote, list, olist, figure, code, note, cta, callout, table, docref, founder, columns, group,
}

// `inherits: false` — брать нечего и не у кого: это и есть набор по умолчанию.
export const manifest = manifestOf('fractera', set, false)
