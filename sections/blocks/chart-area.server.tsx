import type { SectionRenderer } from '@/sections/contract'
import { ChartAreaIsland } from '@/components/charts/chart-area.client'
import { VISITORS_90D } from '@/components/charts/sample-data'

// ВИД `chartArea` — тонкий серверный рендерер (шаг 58).
//
// 🔒 ЗДЕСЬ НЕТ НИ ОДНОГО ПРАВИЛА РИСОВАНИЯ. Диаграмму рисует островок
// `components/charts/chart-area.client.tsx`; этот файл только переводит поля
// блока в его пропсы. Тот же приём, что у `workspace`: раскладка живёт в
// компоненте, вид знает лишь материал.
//
// 🔒 БЕЗ `"use client"` — свойство слоя, а не выбор. Клиентским здесь не бывает
// ни один файл: это ловит `check:static`, и ловит уже после того, как публичная
// страница перестала быть предрендеренной.
//
// 🔒 ДАННЫЕ ОБРАЗЦА — УМОЛЧАНИЕ, А НЕ ЕДИНСТВЕННЫЙ ВАРИАНТ. Материал вправе
// прислать свои строки; не прислал — рисуется тот же массив, что в исходнике
// владельца. Диаграмма без данных не бывает: пустая карточка на витрине
// каталога выглядела бы поломкой вида, а не отсутствием материала.
export const chartArea: SectionRenderer<'chartArea'> = (b, { key: k }) => (
  <ChartAreaIsland
    key={k}
    title={b.title}
    description={b.description}
    rows={b.rows ?? VISITORS_90D}
    labels={{ a: b.labels?.a ?? 'Series A', b: b.labels?.b ?? 'Series B' }}
    ranges={b.ranges}
  />
)
