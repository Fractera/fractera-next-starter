"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ChartPoint } from "./sample-data"

// ДИАГРАММА-ЛИНИЯ С ПЕРЕКЛЮЧАТЕЛЕМ РЯДА (шаг 58, вид `chartLine`).
//
// 🔒 ПЕРЕНОС ОБРАЗЦА ОДИН В ОДИН. От `chartBar` отличается тремя вещами, и все
// три взяты у источника: форма ряда (линия `monotone` толщиной 2 без точек),
// отступы карточки (`py-4 sm:py-0` вместо `py-0`) и цвета рядов, назначенные в
// обратном порядке. Похожесть кажущаяся: сводить их в один вид с полем «форма»
// значит потерять именно эти различия.
//
// 🔒 ТОЧЕК НА ЛИНИИ НЕТ (`dot={false}`), И ЭТО НЕ УКРАШЕНИЕ. Девяносто одна
// точка на ширине карточки сливается в пунктир и перестаёт читаться как линия.

type Series = "a" | "b"

export type ChartLineProps = {
  title: string
  description?: string
  rows: ChartPoint[]
  labels: { a: string; b: string }
}

export function ChartLineIsland({ title, description, rows, labels }: ChartLineProps) {
  const [active, setActive] = React.useState<Series>("a")

  const config = {
    views: { label: title },
    a: { label: labels.a, color: "var(--chart-1)" },
    b: { label: labels.b, color: "var(--chart-2)" },
  } satisfies ChartConfig

  const total = React.useMemo(
    () => ({
      a: rows.reduce((acc, r) => acc + r.a, 0),
      b: rows.reduce((acc, r) => acc + r.b, 0),
    }),
    [rows],
  )

  return (
    <Card className="py-4 sm:py-0" data-chart-line>
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        <div className="flex">
          {(["a", "b"] as const).map(key => (
            <button
              key={key}
              type="button"
              data-active={active === key}
              className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActive(key)}
            >
              <span className="text-xs text-muted-foreground">{labels[key]}</span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {total[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
          <LineChart accessibilityLayer data={rows} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="x"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value =>
                new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={value =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Line
              dataKey={active}
              type="monotone"
              stroke={`var(--color-${active})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
