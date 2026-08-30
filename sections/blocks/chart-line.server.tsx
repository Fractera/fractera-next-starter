import type { SectionRenderer } from '@/sections/contract'
import { ChartLineIsland } from '@/components/charts/chart-line.client'
import { VISITORS_90D } from '@/components/charts/sample-data'

// ВИД `chartLine` — тонкий серверный рендерер (шаг 58).
//
// 🔒 РИСОВАНИЕ ЖИВЁТ В ОСТРОВКЕ `components/charts/chart-line.client.tsx`, здесь
// только перевод полей блока в его пропсы. Ни один файл под `sections/` не
// бывает клиентским — это свойство слоя, и ловит его `check:static`.
//
// 🔒 ДАННЫЕ ОБРАЗЦА — УМОЛЧАНИЕ. Материал вправе прислать свои; не прислал —
// рисуется массив из исходника владельца. Пустая карточка в каталоге читается
// как поломка вида, а не как отсутствие материала.
export const chartLine: SectionRenderer<'chartLine'> = (b, { key: k }) => (
  <ChartLineIsland
    key={k}
    title={b.title}
    description={b.description}
    rows={b.rows ?? VISITORS_90D}
    labels={{ a: b.labels?.a ?? 'Series A', b: b.labels?.b ?? 'Series B' }}
  />
)
