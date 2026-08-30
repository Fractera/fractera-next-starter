"use client"

import { LabelList, RadialBar, RadialBarChart } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ChartShare } from "./sample-data"

// РАДИАЛЬНЫЕ ПОЛОСЫ С ПОДПИСЯМИ ВНУТРИ (шаг 58, вид `chartRadial`).
//
// 🔒 ПЕРЕНОС ОБРАЗЦА ОДИН В ОДИН, ВКЛЮЧАЯ УГЛЫ. `startAngle={-90}` и
// `endAngle={380}` дают чуть больше полного оборота: полосы начинаются сверху и
// заканчиваются с небольшим нахлёстом, из-за которого кольцо читается замкнутым.
// Ровные -90…270 оставляют видимый стык.
//
// 🔒 ПОДПИСЬ ЛЕЖИТ НА САМОЙ ПОЛОСЕ И ВЫЖИВАЕТ ЛЮБУЮ ПАЛИТРУ. Приём источника:
// белый текст со смешиванием по яркости (`mix-blend-luminosity`). На светлой
// полосе он темнеет, на тёмной остаётся светлым — поэтому пять ролей цвета
// владельца не могут сделать подпись нечитаемой.
//
// 🔒 `background` У ПОЛОСЫ ОБЯЗАТЕЛЕН. Без него короткая полоса висит в пустоте,
// и величину не с чем сравнить: дорожка и есть шкала.

export type ChartRadialProps = {
  title: string
  description?: string
  shares: ChartShare[]
  footer?: { note?: string; hint?: string }
}

export function ChartRadialIsland({ title, description, shares, footer }: ChartRadialProps) {
  const limited = shares.slice(0, 5)

  const config: ChartConfig = {
    value: { label: title },
    ...Object.fromEntries(
      limited.map((s, i) => [s.name, { label: s.name, color: `var(--chart-${i + 1})` }]),
    ),
  }

  const data = limited.map(s => ({ ...s, fill: `var(--color-${s.name})` }))

  return (
    <Card className="flex flex-col" data-chart-radial>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart data={data} startAngle={-90} endAngle={380} innerRadius={30} outerRadius={110}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="name" />} />
            <RadialBar dataKey="value" background>
              <LabelList
                position="insideStart"
                dataKey="name"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      {footer ? (
        <CardFooter className="flex-col gap-2 text-sm">
          {footer.note ? (
            <div className="flex items-center gap-2 leading-none font-medium">{footer.note}</div>
          ) : null}
          {footer.hint ? <div className="leading-none text-muted-foreground">{footer.hint}</div> : null}
        </CardFooter>
      ) : null}
    </Card>
  )
}
