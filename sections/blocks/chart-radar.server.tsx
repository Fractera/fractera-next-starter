import type { SectionRenderer } from '@/sections/contract'
import { ChartRadarIsland } from '@/components/charts/chart-radar.client'
import { MONTHS_6 } from '@/components/charts/sample-data'

// ВИД `chartRadar` — тонкий серверный рендерер (шаг 58).
//
// 🔒 РИСОВАНИЕ ЖИВЁТ В ОСТРОВКЕ `components/charts/chart-radar.client.tsx`, здесь
// только перевод полей блока в его пропсы. Ни один файл под `sections/` не
// бывает клиентским — это свойство слоя, и ловит его `check:static`.
//
// 🔒 ДАННЫЕ ОБРАЗЦА — УМОЛЧАНИЕ. Материал вправе прислать свои; не прислал —
// рисуется массив из исходника владельца. Пустая карточка в каталоге читается
// как поломка вида, а не как отсутствие материала.
export const chartRadar: SectionRenderer<'chartRadar'> = (b, { key: k }) => (
  <ChartRadarIsland
    key={k}
    title={b.title}
    description={b.description}
    rows={b.rows ?? MONTHS_6}
    labels={{ a: b.labels?.a ?? 'Series A', b: b.labels?.b ?? 'Series B' }}
    footer={b.footer}
  />
)
