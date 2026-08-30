"use client"

import { Pie, PieChart } from "recharts"

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

// КРУГОВАЯ ДИАГРАММА С ПОДПИСЯМИ НА СЕКТОРАХ (шаг 58, вид `chartPie`).
//
// 🔒 ПЕРЕНОС ОБРАЗЦА ОДИН В ОДИН: квадратная область, подписи прямо на секторах
// (`label`), подсказка без строки заголовка (`hideLabel`), подвал карточки под
// диаграммой.
//
// 🔒 ЗДЕСЬ ЦВЕТ БЕРЁТСЯ ПОДОЛЬНО, И ЭТО ПЕРВЫЙ ВИД, ГДЕ НУЖНЫ ВСЕ ПЯТЬ РОЛЕЙ.
// Доля получает `fill: var(--color-<имя>)`, а сами имена объявлены в `config`,
// который `ChartStyle` превращает в переменные. Значит палитра «Дизайна»
// доезжает до каждого сектора: сменил человек `chart-4` — сменился четвёртый.
//
// 🔒 ДОЛЕЙ НЕ БОЛЬШЕ ПЯТИ. Ролей цвета ровно пять, и шестая доля осталась бы
// без своей переменной — сектор нарисовался бы цветом по умолчанию, то есть
// чужим. Лишнее сводится в «Прочее», как и сделано в образце.

export type ChartPieProps = {
  title: string
  description?: string
  shares: ChartShare[]
  /** Две строки подвала: сначала выделенная, потом приглушённая. */
  footer?: { note?: string; hint?: string }
}

export function ChartPieIsland({ title, description, shares, footer }: ChartPieProps) {
  const limited = shares.slice(0, 5)

  const config: ChartConfig = {
    value: { label: title },
    ...Object.fromEntries(
      limited.map((s, i) => [s.name, { label: s.name, color: `var(--chart-${i + 1})` }]),
    ),
  }

  const data = limited.map(s => ({ ...s, fill: `var(--color-${s.name})` }))

  return (
    <Card className="flex flex-col" data-chart-pie>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" label nameKey="name" />
          </PieChart>
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
