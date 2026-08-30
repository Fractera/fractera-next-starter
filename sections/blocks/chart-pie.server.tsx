import type { SectionRenderer } from '@/sections/contract'
import { ChartPieIsland } from '@/components/charts/chart-pie.client'
import { BROWSER_SHARE } from '@/components/charts/sample-data'

// ВИД `chartPie` — тонкий серверный рендерер (шаг 58).
//
// 🔒 РИСОВАНИЕ ЖИВЁТ В ОСТРОВКЕ `components/charts/chart-pie.client.tsx`, здесь
// только перевод полей блока в его пропсы. Ни один файл под `sections/` не
// бывает клиентским — это свойство слоя, и ловит его `check:static`.
//
// 🔒 ДАННЫЕ ОБРАЗЦА — УМОЛЧАНИЕ. Материал вправе прислать свои; не прислал —
// рисуется массив из исходника владельца. Пустая карточка в каталоге читается
// как поломка вида, а не как отсутствие материала.
export const chartPie: SectionRenderer<'chartPie'> = (b, { key: k }) => (
  <ChartPieIsland
    key={k}
    title={b.title}
    description={b.description}
    shares={b.shares ?? BROWSER_SHARE}
    footer={b.footer}
  />
)
