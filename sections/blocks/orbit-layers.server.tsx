import type { SectionRenderer } from '@/sections/contract'
import { OrbitLayersStatic } from '@/components/orbit-layers/static'
import { OrbitLayersSwap } from '@/components/orbit-layers/swap.client'

// ВИД `orbitLayers` — тонкий серверный рендерер (шаг 60, 2026-08-30).
//
// 🔒 ЭТО ТОТ САМЫЙ СЛУЧАЙ, РАДИ КОТОРОГО ВЛАДЕЛЕЦ ЗАДАЛ ВОПРОС: «можем ли мы
// реализовать эту секцию внутри блока или не можем, потому что она имеет
// Motion?». Можем. Рендерер остаётся серверным, движение живёт в островке
// `components/orbit-layers/swap.client.tsx` поверх статического близнеца,
// которого печатает сервер. Наличие анимации никогда не решает «блок или
// виджет» — решает переиспользование.
//
// 🔒 БЛИЗНЕЦ СТРОИТСЯ ЗДЕСЬ, НА СЕРВЕРЕ, И УЕЗЖАЕТ В ОСТРОВОК ДЕТЬМИ. Островок
// его не перерисовывает: пока движение не разбудили, в разметке стоит ровно то,
// что отдал сервер, — страница остаётся предрендеренной и читается без
// JavaScript.
export const orbitLayers: SectionRenderer<'orbitLayers'> = (b, { key: k }) => {
  const ui = {
    badge: b.badge,
    title: b.title,
    accent: b.accent,
    lead: b.lead,
    cards: b.cards,
    core: b.core,
  }
  return (
    <OrbitLayersSwap key={k} ui={ui}>
      <OrbitLayersStatic ui={ui} />
    </OrbitLayersSwap>
  )
}
