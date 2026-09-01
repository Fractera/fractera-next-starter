"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Small } from "@/components/ui/typography"

// РАСПИСАНИЕ — ОТДЕЛЬНЫЙ ОСТРОВОК (77-9, 2026-09-01).
//
// 🔒 ОТДЕЛЁН ОТ НАСТРОЙКИ БОТА ПО СЛОВУ ВЛАДЕЛЬЦА, И РАЗДЕЛЕНИЕ СОДЕРЖАТЕЛЬНОЕ:
// «Телеграм» отвечает на вопрос «какой это бот и кому он пишет», расписание — на
// вопрос «как часто дёргать проект». Пока они стояли одной карточкой, кнопка
// привязки оказалась под заголовком «Расписание», и человек читал её как часть
// расписания. ✗ это ошибка переноса: порядок источника я перенёс дословно, не
// спросив, верен ли он.
//
// 🔒 ОБЩЕГО СОСТОЯНИЯ С НАСТРОЙКОЙ БОТА НЕТ, И ОНО НЕ НУЖНО: правду показывает
// сервер, а `router.refresh()` перерисовывает оба островка разом.
//
// 🔒 ШАГ ВЫБИРАЕТСЯ ИЗ СПИСКА, А НЕ ВВОДИТСЯ ЧИСЛОМ — перенесено из панели
// вместе с доводом: свободное поле означает «поставлю единицу и посмотрю», а
// цена ошибки — постоянная нагрузка, которую никто не заметит месяцами.

export type TelegramScheduleLabels = {
  scheduleOff: string
  scheduleEvery: string
  scheduleSaved: string
  scheduleHint: string
  failed: string
}

export function TelegramSchedule({
  configured,
  tickSeconds,
  labels,
}: {
  configured: boolean
  tickSeconds: number
  labels: TelegramScheduleLabels
}) {
  const router = useRouter()
  const [tick, setTick] = useState(tickSeconds)
  const [error, setError] = useState<string | null>(null)

  const STEPS = [0, 60, 300, 900, 3600]

  async function saveTick(next: number) {
    const before = tick
    setTick(next)
    try {
      const r = await fetch("/api/architect/channels/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tickSeconds: next }),
      })
      if (!r.ok) {
        setTick(before)
        setError(labels.failed)
        return
      }
      toast.success(labels.scheduleSaved)
      router.refresh()
    } catch {
      // Служба не ответила — возвращаем прежнее значение: показать выбранное как
      // сохранённое значит соврать о состоянии сервера.
      setTick(before)
      setError(labels.failed)
    }
  }

  return (
    <div data-telegram-schedule className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {STEPS.map(n => (
          <Button
            key={n}
            variant={tick === n ? "default" : "outline"}
            size="sm"
            disabled={!configured}
            onClick={() => saveTick(n)}
          >
            {n === 0 ? labels.scheduleOff : labels.scheduleEvery.replace("{n}", String(n))}
          </Button>
        ))}
      </div>
      <Small className="leading-relaxed text-muted-foreground">{labels.scheduleHint}</Small>
      {error && <Small className="text-destructive">{error}</Small>}
    </div>
  )
}
