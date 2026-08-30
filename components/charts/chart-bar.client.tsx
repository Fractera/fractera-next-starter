"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ChartPoint } from "./sample-data"

// ДИАГРАММА-СТОЛБЦЫ С ПЕРЕКЛЮЧАТЕЛЕМ РЯДА (шаг 58, вид `chartBar`).
//
// 🔒 ПЕРЕНОС ОБРАЗЦА ОДИН В ОДИН. Главное в форме — шапка: она не заголовок, а
// ДВЕ КНОПКИ с итогами рядов, и нажатая меняет то, что рисует диаграмма. Ряд
// показывается один: два ряда столбиками за девяносто дней превращаются в кашу,
// и образец решает это переключателем, а не накоплением.
//
// 🔒 ИТОГ СЧИТАЕТСЯ ИЗ ДАННЫХ, А НЕ ЗАПИСЫВАЕТСЯ ЧИСЛОМ. Записанный итог
// разойдётся с рядом на первой же правке строк — и разойдётся молча, потому что
// сумму девяноста чисел никто не проверяет глазами.
//
// 🔒 ОБЩЕГО ПЕРЕКЛЮЧАТЕЛЯ С `chartLine` НЕТ НАМЕРЕННО. Виды похожи ровно
// сегодня; вынеси я их шапку в один компонент — правка образца одного вида
// поехала бы во второй, которого владелец не трогал.

type Series = "a" | "b"

export type ChartBarProps = {
  title: string
  description?: string
  rows: ChartPoint[]
  labels: { a: string; b: string }
}

export function ChartBarIsland({ title, description, rows, labels }: ChartBarProps) {
  const [active, setActive] = React.useState<Series>("a")

  const config = {
    views: { label: title },
    a: { label: labels.a, color: "var(--chart-2)" },
    b: { label: labels.b, color: "var(--chart-1)" },
  } satisfies ChartConfig

  const total = React.useMemo(
    () => ({
      a: rows.reduce((acc, r) => acc + r.a, 0),
      b: rows.reduce((acc, r) => acc + r.b, 0),
    }),
    [rows],
  )

  return (
    <Card className="py-0" data-chart-bar>
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        <div className="flex">
          {(["a", "b"] as const).map(key => (
            <button
              key={key}
              type="button"
              data-active={active === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
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
          <BarChart accessibilityLayer data={rows} margin={{ left: 12, right: 12 }}>
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
            <Bar dataKey={active} fill={`var(--color-${active})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
