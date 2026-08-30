"use client"

import { Bar, BarChart, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ChartPoint } from "./sample-data"

// ОБРАЗЕЦ ПОДСКАЗКИ (шаг 58, вид `chartTooltip`).
//
// 🔒 ПРЕДМЕТ ЭТОГО ВИДА — САМА ПОДСКАЗКА, А НЕ СТОЛБЦЫ. Столбцы взяты простые
// (шесть дней, два ряда с накоплением) именно потому, что смотреть надо не на
// них: вид показывает, как выглядит подсказка без указателя (`hideIndicator`) и
// без курсора-подсветки (`cursor={false}`).
//
// 🔒 `defaultIndex` — ГЛАВНАЯ СТРОКА ФАЙЛА. Подсказка открыта СРАЗУ, без
// наведения мыши. Иначе вид в каталоге показывал бы пустую диаграмму: человек,
// пришедший смотреть на подсказку, увидел бы столбцы и ушёл. Он же делает вид
// пригодным для снимка экрана и для страницы, которую читают с телефона, где
// наведения не существует вовсе.
//
// 🔒 СКРУГЛЕНИЯ РАЗНЫЕ У ДВУХ РЯДОВ, И ЭТО НЕ УКРАШЕНИЕ. Нижний ряд скруглён
// снизу, верхний сверху — вместе они дают ОДИН столбик со скруглёнными концами.
// Одинаковые скругления превратили бы стопку в два отдельных кирпича.

export type ChartTooltipProps = {
  title: string
  description?: string
  rows: ChartPoint[]
  labels: { a: string; b: string }
  /** Какая точка показана открытой. По умолчанию вторая, как в образце. */
  openAt?: number
}

export function ChartTooltipIsland({
  title,
  description,
  rows,
  labels,
  openAt = 1,
}: ChartTooltipProps) {
  const config = {
    a: { label: labels.a, color: "var(--chart-1)" },
    b: { label: labels.b, color: "var(--chart-2)" },
  } satisfies ChartConfig

  return (
    <Card data-chart-tooltip>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart accessibilityLayer data={rows}>
            <XAxis
              dataKey="x"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={value =>
                new Date(value).toLocaleDateString("en-US", { weekday: "short" })
              }
            />
            <Bar dataKey="a" stackId="a" fill="var(--color-a)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="b" stackId="a" fill="var(--color-b)" radius={[4, 4, 0, 0]} />
            <ChartTooltip
              content={<ChartTooltipContent hideIndicator />}
              cursor={false}
              defaultIndex={openAt}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
