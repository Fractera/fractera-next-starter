import { Wrench } from "lucide-react"
import { Small } from "@/components/ui/typography"
import { SettingsCard } from "./settings-card"
import {
  INBOX_STORE,
  FACT_MATCHER,
  REGISTRY_EVOLUTION,
  LINK_FINDER,
  HERMES,
  type Actor,
} from "@/lib/task/actors"

// РЕЕСТР ИНСТРУМЕНТОВ — соседняя карточка реестра признаков (правка владельца
// 2026-09-02).
//
// 🔒 ПРАВИЛО ВЛАДЕЛЬЦА: «для каждого действия мы создаём свой инструмент, который
// владеет навыком и умеет делать только одно действие». Реестр признаков
// отвечает, ЧТО извлекать; этот — КТО это делает.
//
// 🔒 ПОКАЗЫВАТЬ ОБЯЗАТЕЛЬНО, И ПРИЧИНА ТА ЖЕ, ЧТО У РЕЕСТРА ПРИЗНАКОВ: правило,
// которое негде увидеть, исполняется по памяти — то есть не исполняется. Пять
// инструментов жили в коде и не были названы нигде на экране.
//
// 🛑 СОСТОЯНИЕ «ЗАГЛУШКА» СТОИТ РЯДОМ С ИМЕНЕМ, А НЕ В КОММЕНТАРИИ. Инструмент,
// который отвечает 200 и ничего не делает, выглядит работающим ровно до того дня,
// когда на него понадобится опереться.

/** Порядок — порядок исполнения в разборе, а не алфавит. */
const TOOLS: { actor: Actor; real: boolean; where: string }[] = [
  { actor: INBOX_STORE, real: true, where: "строка 2 разбора" },
  { actor: FACT_MATCHER, real: true, where: "строка 3 разбора" },
  { actor: REGISTRY_EVOLUTION, real: false, where: "строка 4 разбора" },
  { actor: LINK_FINDER, real: true, where: "строка 5 разбора" },
  { actor: HERMES, real: false, where: "второй режим бота, пока не подключён" },
]

export function ToolsRegistry() {
  return (
    // 🔒 КАРТОЧКА СКЛАДНАЯ И САМА НЕСЁТ СВОЮ РАМКУ (111). Прежде рамку рисовал
    // ВЫЗЫВАЮЩИЙ — `<div className="rounded-lg border p-4">` в двух местах
    // `telegram-settings.tsx`, — и это ровно та копия, которая расходится: один
    // вызов правят, второй остаётся прежним. Теперь вид карточки знает она сама.
    <SettingsCard
      mark={{ "data-tools-registry": "" }}
      icon={<Wrench className="size-4 text-muted-foreground" aria-hidden />}
      title="Реестр инструментов"
      status={
        <Small data-tools-count className="text-muted-foreground">
          {TOOLS.length} шт.
        </Small>
      }
      bodyClassName="flex flex-col gap-4 p-3"
    >
      <Small className="text-muted-foreground">
        Один инструмент — одно действие. Реестр признаков отвечает, что извлекать; этот — кто и чем
        это делает. У каждого инструмента своя инструкция внутри, поэтому в таблице разбора в колонке
        «Инструкция» у них стоит именно это.
      </Small>

      <div className="flex flex-col gap-3">
        {TOOLS.map(({ actor, real, where }) => (
          <div
            key={actor.name}
            data-tool={actor.name}
            data-tool-real={String(real)}
            className="rounded-md border p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-foreground">{actor.name}</span>
              {/* 🔒 Пометка честная и краткая: «заглушка» значит, что за именем
                  сегодня нет работы, и это видно раньше, чем на него обопрутся. */}
              <span
                className={
                  real
                    ? "rounded-full border px-2 py-0.5 text-[0.75em] text-muted-foreground"
                    : "rounded-full border border-warning px-2 py-0.5 text-[0.75em] text-warning"
                }
              >
                {real ? "настоящий" : "заглушка, отвечает 200"}
              </span>
              <span className="text-[0.8em] text-muted-foreground">{where}</span>
            </div>
            <Small className="mt-2 block text-muted-foreground">{actor.what}</Small>
          </div>
        ))}
      </div>
    </SettingsCard>
  )
}
