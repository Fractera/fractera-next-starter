"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ChartPoint } from "./sample-data"

// ЛЕПЕСТКОВАЯ ДИАГРАММА С ЛЕГЕНДОЙ (шаг 58, вид `chartRadar`).
//
// 🔒 ПЕРЕНОС ОБРАЗЦА ОДИН В ОДИН, ВКЛЮЧАЯ ОТРИЦАТЕЛЬНЫЕ ОТСТУПЫ. `top: -40` и
// `bottom: -10` не опечатка источника: они прижимают фигуру к легенде и убирают
// пустую полосу, которую `RadarChart` оставляет под своё несуществующее
// заглавие. «Поправленные» на ноль отступы дают карточку с дырой сверху.
//
// 🔒 ПЕРВЫЙ РЯД ПОЛУПРОЗРАЧЕН, ВТОРОЙ НЕТ. Две сплошные заливки друг поверх
// друга скрывают нижнюю целиком — на лепестковой это не «наложение цветов», а
// потеря ряда.
//
// 🔒 ЭТОТ ВИД ЧИТАЕМ ТОЛЬКО НА МАЛОМ ЧИСЛЕ ОСЕЙ. Шесть месяцев образца — это
// предел, за которым подписи по кругу начинают наезжать друг на друга.

export type ChartRadarProps = {
  title: string
  description?: string
  rows: ChartPoint[]
  labels: { a: string; b: string }
  footer?: { note?: string; hint?: string }
}

export function ChartRadarIsland({ title, description, rows, labels, footer }: ChartRadarProps) {
  const config = {
    a: { label: labels.a, color: "var(--chart-1)" },
    b: { label: labels.b, color: "var(--chart-2)" },
  } satisfies ChartConfig

  return (
    <Card data-chart-radar>
      <CardHeader className="items-center">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={rows} margin={{ top: -40, bottom: -10, left: 0, right: 0 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis dataKey="x" />
            <PolarGrid />
            <Radar dataKey="a" fill="var(--color-a)" fillOpacity={0.6} />
            <Radar dataKey="b" fill="var(--color-b)" />
            <ChartLegend className="mt-8" content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      {footer ? (
        <CardFooter className="flex-col gap-2 pt-4 text-sm">
          {footer.note ? (
            <div className="flex items-center gap-2 leading-none font-medium">{footer.note}</div>
          ) : null}
          {footer.hint ? (
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {footer.hint}
            </div>
          ) : null}
        </CardFooter>
      ) : null}
    </Card>
  )
}
