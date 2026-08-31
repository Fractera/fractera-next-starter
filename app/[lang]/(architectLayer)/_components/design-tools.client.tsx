"use client"

import { useState } from "react"
import { H3 } from "@/components/ui/typography"
import type { DesignUi } from "../_i18n/design.i18n"

// ИНСТРУМЕНТЫ РАЗРАБОТЧИКА ПОВЕРХ САЙТА (шаг 41, 2026-08-29).
//
// 🔒 ЭТОТ РАЗДЕЛ ПРАВИТ НЕ ПРОЕКТ, А ТО, ЧТО ВИДИТ ТОЛЬКО ЕГО ХОЗЯИН. Пять
// соседних разделов меняют сайт для посетителя; здесь — приборы, которые лежат
// поверх сайта и в самом проекте не значат ничего. Отсюда и другое хранилище:
// `PLATFORM-CONFIG`, а не `DESIGN-CONFIG`.
//
// 🔒 ВЫКЛЮЧАТЕЛЬ ПИШЕТ ЗАПЛАТУ В `features`, И ЭТО ВАЖНЕЕ, ЧЕМ КАЖЕТСЯ. В том же
// файле живут одиннадцать других возможностей, режим разработки, выключатели
// документов агента и состояние переезда. Снимок целиком затирал бы всё это при
// каждой галочке — а в этот файл пишет ещё и панель, из другого процесса.
//
// 🔒 СОСТОЯНИЕ ОТРИСОВЫВАЕТСЯ СРАЗУ, А НЕ ПОСЛЕ ОТВЕТА СЕРВЕРА. Галочка, которая
// «думает» полсекунды, читается как неисправная: человек жмёт второй раз и
// получает обратное значение. При отказе положение возвращается назад и об этом
// говорится словом.

export function DesignTools({
  initial,
  ui,
}: {
  /** Действующее значение выключателя: умолчание проекта или решение владельца. */
  initial: boolean
  ui: DesignUi
}) {
  const [on, setOn] = useState(initial)
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle")

  async function toggle() {
    const next = !on
    setOn(next)
    setStatus("saving")
    try {
      const res = await fetch("/api/architect/platform-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patch: { features: { viewportBadge: next } } }),
      })
      if (res.ok) {
        setStatus("saved")
      } else {
        setOn(!next)
        setStatus("failed")
      }
    } catch {
      setOn(!next)
      setStatus("failed")
    }
  }

  return (
    <div data-tools-instruments className="flex flex-col gap-3">
      {/* 🔒 ИСКЛЮЧЕНИЕ НАЗЫВАЕТСЯ ИСКЛЮЧЕНИЕМ, И ЭТО НЕ ВЕЖЛИВОСТЬ (76-4).
          Раздел с 76-3 называет себя витриной переиспользуемых инструментов.
          Прибор, оставленный внутри неё молча, объявляется инструментом — и
          следующий агент построит седьмую карточку по его образцу. Владелец
          сказал прямо: «по сути не является инструмент, но в порядке исключения
          мы его оставим здесь».

          🔒 РАЗДЕЛИТЕЛЬ ЗДЕСЬ НЕСЁТ СМЫСЛ, А НЕ ВИД: он и есть граница между
          тем, что берут в код, и тем, что смотрят глазами. */}
      <div className="border-t border-border pt-5">
        <H3 variant="ui">{ui.pages.tools.instrumentsTitle}</H3>
        <p className="mt-1 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
          {ui.pages.tools.instrumentsLead}
        </p>
      </div>

      <section data-tool="viewportBadge" className="rounded-lg border border-border p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[length:var(--fs-body)] font-medium text-foreground">{ui.viewportBadgeLabel}</p>
            <p className="mt-1 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
              {ui.viewportBadgeHint}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            data-tool-state={on ? "on" : "off"}
            onClick={toggle}
            className={
              "relative h-6 w-11 shrink-0 rounded-full transition-colors " +
              (on ? "bg-primary" : "bg-muted-foreground/30")
            }
          >
            <span
              className={
                "absolute top-0.5 size-5 rounded-full bg-background transition-all " +
                (on ? "left-[1.375rem]" : "left-0.5")
              }
            />
          </button>
        </div>
        <p className="mt-3 text-[length:var(--fs-small)] text-muted-foreground">
          {on ? ui.toolsOn : ui.toolsOff}
          {status === "failed" && ` · ${ui.colors.failed}`}
        </p>
      </section>
    </div>
  )
}
