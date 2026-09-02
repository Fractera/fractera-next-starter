import { Wrench } from "lucide-react"
import { H4, Small } from "@/components/ui/typography"
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
    <section data-tools-registry className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Wrench className="size-4 text-muted-foreground" aria-hidden />
        <H4>Реестр инструментов</H4>
      </div>

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
    </section>
  )
}
