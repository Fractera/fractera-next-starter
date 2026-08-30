"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ChartPoint } from "./sample-data"

// ДИАГРАММА-ОБЛАСТЬ С ВЫБОРОМ ОТРЕЗКА (шаг 58, вид `chartArea`).
//
// 🔒 ЭТО ОСТРОВОК, И ИНАЧЕ БЫТЬ НЕ МОЖЕТ. Ни один файл под `sections/` не бывает
// клиентским — это свойство слоя, а не предпочтение: клиентский компонент,
// владеющий маршрутом, делает публичную страницу динамической, и ловит это
// `check:static`. Поэтому вид состоит из двух половин: серверный рендерер
// `sections/blocks/chart-area.server.tsx` переводит поля блока в пропсы, а
// движение живёт здесь.
//
// 🔒 ФОРМА ПЕРЕНЕСЕНА ИЗ ОБРАЗЦА ВЛАДЕЛЬЦА ОДИН В ОДИН: две области с
// накоплением (`stackId="a"`), заливка градиентом от 0.8 к 0.1, сглаживание
// `natural`, сетка без вертикальных линий, подсказка с точкой. Менять это
// «на свой вкус» запрещено — витрину переносят, а не сочиняют похожую.
//
// 🔒 ОТСЧЁТ ИДЁТ ОТ ПОСЛЕДНЕЙ ТОЧКИ ДАННЫХ, А НЕ ОТ ЗАШИТОЙ ДАТЫ. В источнике
// стоит `new Date("2024-06-30")` — дата его собственного примера. Оставь её, и
// на любых других данных выбор «последние 7 дней» показал бы пустоту, ничего не
// сообщив о причине.

type Range = { days: number; label: string }

export type ChartAreaProps = {
  title: string
  description?: string
  rows: ChartPoint[]
  labels: { a: string; b: string }
  /** Отрезки в выпадающем списке. Пусто — списка нет вовсе. */
  ranges?: Range[]
}

export function ChartAreaIsland({ title, description, rows, labels, ranges = [] }: ChartAreaProps) {
  const [days, setDays] = React.useState<number>(ranges[0]?.days ?? 0)

  const config = {
    a: { label: labels.a, color: "var(--chart-1)" },
    b: { label: labels.b, color: "var(--chart-2)" },
  } satisfies ChartConfig

  const shown = React.useMemo(() => {
    if (!days || rows.length === 0) return rows
    const last = new Date(rows[rows.length - 1].x)
    const from = new Date(last)
    from.setDate(from.getDate() - days)
    return rows.filter(r => new Date(r.x) >= from)
  }, [rows, days])

  return (
    <Card className="pt-0" data-chart-area>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </div>
        {ranges.length > 0 ? (
          <Select value={String(days)} onValueChange={v => setDays(Number(v))}>
            <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label={title}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {ranges.map(r => (
                <SelectItem key={r.days} value={String(r.days)} className="rounded-lg">
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
          <AreaChart data={shown}>
            <defs>
              <linearGradient id="fillChartAreaA" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-a)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-a)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillChartAreaB" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-b)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-b)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={value =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
              }
            />
            <Area dataKey="b" type="natural" fill="url(#fillChartAreaB)" stroke="var(--color-b)" stackId="a" />
            <Area dataKey="a" type="natural" fill="url(#fillChartAreaA)" stroke="var(--color-a)" stackId="a" />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
