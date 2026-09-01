import type { SectionSet } from './contract'
import { p } from './blocks/p.server'
import { h2 } from './blocks/h2.server'
import { h3 } from './blocks/h3.server'
import { h4 } from './blocks/h4.server'
import { h5 } from './blocks/h5.server'
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
import { heroBadge } from './blocks/hero-badge.server'
import { heroSplit } from './blocks/hero-split.server'
import { languageMarquee } from './blocks/language-marquee.server'
import { projectTypeMarquee } from './blocks/project-type-marquee.server'
import { badges } from './blocks/badges.server'
import { panel } from './blocks/panel.server'
import { metrics } from './blocks/metrics.server'
import { flow } from './blocks/flow.server'
import { problemSolution } from './blocks/problem-solution.server'
import { noBill } from './blocks/no-bill.server'
import { cards } from './blocks/cards.server'
import { card } from './blocks/card.server'
import { statement } from './blocks/statement.server'
import { invite } from './blocks/invite.server'
import { faq } from './blocks/faq.server'
import { toc } from './blocks/toc.server'
import { voiceField } from './blocks/voice-field.server'
import { workspace } from './blocks/workspace.server'
import { benefitCards } from './blocks/benefit-cards.server'
import { splitPair } from './blocks/split-pair.server'
import { logoCards } from './blocks/logo-cards.server'
import { carousel } from './blocks/carousel.server'
import { support } from './blocks/support.server'
import { showcaseCarousel } from './blocks/showcase-carousel.server'
import { featureGrid } from './blocks/feature-grid.server'
import { promoBand } from './blocks/promo-band.server'
import { priceTable } from './blocks/price-table.server'
import { spotlightPair } from './blocks/spotlight-pair.server'
import { platformGrid } from './blocks/platform-grid.server'
import { chartArea } from './blocks/chart-area.server'
import { chartBar } from './blocks/chart-bar.server'
import { chartLine } from './blocks/chart-line.server'
import { chartPie } from './blocks/chart-pie.server'
import { chartRadar } from './blocks/chart-radar.server'
import { chartRadial } from './blocks/chart-radial.server'
import { chartTooltip } from './blocks/chart-tooltip.server'
import { orbitLayers } from './blocks/orbit-layers.server'
import { chat } from './blocks/chat.server'

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
  p, h2, h3, h4, h5, quote, list, olist, figure, code, note, cta, callout, table, docref, founder, columns, group, heroBadge, heroSplit, badges, panel, metrics, flow, problemSolution, cards, card, statement, invite, noBill, faq, toc, languageMarquee, projectTypeMarquee, voiceField, workspace, benefitCards, splitPair, logoCards, carousel, support, showcaseCarousel, featureGrid, promoBand, priceTable, spotlightPair, platformGrid, chartArea, chartBar, chartLine, chartPie, chartRadar, chartRadial, chartTooltip, orbitLayers, chat,
}
