"use client"

import type { CSSProperties } from "react"
import type { SlotName } from "../_lib/routing"

// ЖИВОЙ ЧЕРТЁЖ РАСКЛАДКИ (31-17, 2026-08-29) — перенос интерфейса панели
// управления (`bridges/app/app/[lang]/parallel-routing`) в слой архитектора.
//
// 🔒 ЧЕРТЁЖ — НЕ УКРАШЕНИЕ, А ЕДИНСТВЕННЫЙ СПОСОБ УВИДЕТЬ ВЫБОР ДО СОХРАНЕНИЯ.
// Список из восьми выключателей отвечает на вопрос «что включено» и молчит о том,
// ЧТО ПОЛУЧИТСЯ: где встанет промо, что останется от центра, куда денутся колонки.
// Ровно поэтому блоки не появляются мгновенно, а ЕДУТ 300 мс — движение показывает,
// что именно подвинулось, а подмена картинки этого не показывает.
//
// 🔒 ПОДПИСИ ПРИЕЗЖАЮТ ПРОПСАМИ. Файл клиентский, а словарь слоя серверный: тот же
// закон, что и у остальных островков архитектора.
//
// 🔒 ЦЕНТР В ОБЫЧНОМ РЕЖИМЕ НАЗЫВАЕТСЯ ИНАЧЕ. Именованных областей там нет вовсе —
// середину заполняет собственный `children` Next. Назвать её «Содержимым» как область
// значило бы назвать механизм, которого в этом режиме не существует.

/** Доли высоты, повторяют чертёж панели: промо, полоса над центром, полоса под ним. */
const PROMO_H = 14
const CH_H = 15
const CF_H = 15

const MOVE = "300ms ease-in-out"

function Block({
  slot,
  label,
  active,
  hovered,
  style,
}: {
  slot: SlotName | "children"
  label: string
  active: boolean
  hovered: boolean
  style?: CSSProperties
}) {
  const tone = hovered
    ? "bg-primary/60 text-primary-foreground ring-2 ring-primary"
    : active
      ? "bg-primary text-primary-foreground"
      : "bg-muted text-muted-foreground"

  return (
    <div
      data-preview-block={slot}
      data-preview-on={active ? "true" : "false"}
      className={
        "flex select-none items-center justify-center overflow-hidden rounded-md text-[11px] font-medium transition-colors duration-300 " +
        tone
      }
      style={style}
    >
      <span className="truncate px-1.5">{label}</span>
    </div>
  )
}

export function SlotLayoutPreview({
  active,
  hovered,
  labels,
  centerLabel,
}: {
  /** Включённые области — ровно те, что сейчас выбраны на экране. */
  active: ReadonlySet<SlotName>
  /** Область под курсором в списке справа; `null` — курсора нет. */
  hovered: SlotName | null
  labels: Record<string, string>
  centerLabel: string
}) {
  const on = (s: SlotName) => active.has(s)
  const hov = (s: SlotName) => hovered === s

  return (
    <div
      data-layout-preview
      className="flex h-[420px] min-w-0 flex-col gap-1.5 rounded-xl border border-border bg-card p-3"
    >
      <Block
        slot="header"
        label={labels.header}
        active={on("header")}
        hovered={hov("header")}
        style={{ flex: "0 0 9%", minHeight: 26 }}
      />

      <div className="relative min-h-0 flex-1">
        <Block
          slot="left"
          label={labels.left}
          active={on("left")}
          hovered={hov("left")}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: on("left") ? "calc(20% - 6px)" : 0,
            overflow: "hidden",
            transition: `width ${MOVE}`,
          }}
        />
        <Block
          slot="right"
          label={labels.right}
          active={on("right")}
          hovered={hov("right")}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: on("right") ? "calc(20% - 6px)" : 0,
            overflow: "hidden",
            transition: `width ${MOVE}`,
          }}
        />

        {on("promoScreen") && (
          <Block
            slot="promoScreen"
            label={labels.promoScreen}
            active
            hovered={hov("promoScreen")}
            style={{
              position: "absolute",
              top: 0,
              left: on("left") ? "calc(20% + 2px)" : 0,
              right: on("right") ? "calc(20% + 2px)" : 0,
              height: on("center") ? `${PROMO_H}%` : "100%",
              minHeight: 22,
              transition: `left ${MOVE}, right ${MOVE}, height ${MOVE}`,
            }}
          />
        )}

        {on("center") && (
          <div
            className="absolute bottom-0 flex flex-col gap-1.5"
            style={{
              left: on("left") ? "calc(20% + 2px)" : 0,
              right: on("right") ? "calc(20% + 2px)" : 0,
              top: on("promoScreen") ? `calc(${PROMO_H}% + 6px)` : 0,
              transition: `left ${MOVE}, right ${MOVE}, top ${MOVE}`,
            }}
          >
            {on("centerHeader") && (
              <Block
                slot="centerHeader"
                label={labels.centerHeader}
                active
                hovered={hov("centerHeader")}
                style={{ flex: `0 0 ${CH_H}%`, minHeight: 22 }}
              />
            )}
            <Block slot="center" label={centerLabel} active hovered={hov("center")} style={{ flex: 1 }} />
            {on("centerFooter") && (
              <Block
                slot="centerFooter"
                label={labels.centerFooter}
                active
                hovered={hov("centerFooter")}
                style={{ flex: `0 0 ${CF_H}%`, minHeight: 22 }}
              />
            )}
          </div>
        )}
      </div>

      <Block
        slot="footer"
        label={labels.footer}
        active={on("footer")}
        hovered={hov("footer")}
        style={{ flex: "0 0 7%", minHeight: 22 }}
      />
    </div>
  )
}
