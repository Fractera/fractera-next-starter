"use client"

import { useState } from "react"
import { AppDialog, type AppDialogSize } from "@/components/dialog/app-dialog.client"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"

// КАТАЛОГ МОДАЛЬНЫХ ОКОН (шаг 62-2, 2026-08-30, заказ владельца).
//
// 🔒 ЗАЧЕМ ОН НУЖЕН, ЕСЛИ СТАНДАРТ И ТАК ЕСТЬ. Затем, что стандарт был невидим.
// Владелец сказал дословно: «мы вообще не стандартизировали модальные окна? то
// есть мы объяснили модели, что она может использовать блоки, но не объяснили,
// что она может использовать модальные окна определённого стандарта?»
//
// Формально стандарт существовал: один `AppDialog`, гейт `check:dialogs`, закон
// в инструкции. И этого оказалось мало — обход совершил САМ АГЕНТ, писавший
// корпус, через сутки после того, как сослался на этот гейт в комментарии.
// ✗ Цена: окно заявки открылось без прокрутки, и кнопка «Отправить» уехала за
// край экрана. Правило, которое негде УВИДЕТЬ, исполняется по памяти — то есть
// не исполняется.
//
// 🔒 РАЗДЕЛ УСТРОЕН КАК КАТАЛОГ БЛОКОВ, И ЭТО НЕ АНАЛОГИЯ, А ТА ЖЕ ПРИЧИНА.
// Блок нельзя выбрать, не увидев; окно — тоже. Здесь каждая настройка стандарта
// открывается настоящим `AppDialog`, а не рисунком: витрина, перерисовывающая
// предмет по-своему, показывает себя, а не продукт.
//
// 🔒 ЧЕТВЁРТЫЙ ОБРАЗЕЦ — ДЛИННЫЙ, И ОН ГЛАВНЫЙ. Именно на нём видно то, чего не
// хватало заявке: тело прокручивается, а заголовок и кнопки стоят на месте.
// Образец без прокрутки не доказал бы ничего — окно на три строки выглядит
// правильным при любой реализации.

export type DialogsCatalogueUi = {
  /** Подпись кнопки, открывающей образец: «Показать окно». */
  show: string
  /** Четыре образца: заголовок карточки, что он показывает, и слова окна. */
  samples: {
    id: string
    name: string
    note: string
    title: string
    description: string
    body?: string
    footerOk?: string
    footerCancel?: string
  }[]
  /** Слова длинного образца: одна фраза, повторяемая, чтобы тело переросло экран. */
  longLine: string
  /** Подпись неотменяемого образца — у него нет ни крестика, ни Escape. */
  lockedHint: string
}

type Props = { ui: DialogsCatalogueUi; dialogUi: AppDialogUi }

/** Настройки, которые показывает каждый образец. Порядок — от простого к сложному. */
const SHAPE: Record<string, { size: AppDialogSize; footer: boolean; long: boolean; locked: boolean }> = {
  plain: { size: "sm", footer: false, long: false, locked: false },
  footer: { size: "md", footer: true, long: false, locked: false },
  long: { size: "lg", footer: true, long: true, locked: false },
  locked: { size: "sm", footer: true, long: false, locked: true },
}

export function DialogsCatalogue({ ui, dialogUi }: Props) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      {ui.samples.map(s => {
        const shape = SHAPE[s.id] ?? SHAPE.plain
        return (
          <section key={s.id} data-dialog-sample={s.id} className="rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[length:var(--fs-body)] font-medium text-foreground">{s.name}</p>
                <p className="mt-1 text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
                  {s.note}
                </p>
              </div>
              <button
                type="button"
                data-show-dialog={s.id}
                onClick={() => setOpen(s.id)}
                className="shrink-0 rounded-md border border-border px-4 py-2 text-[length:var(--fs-small)] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                {ui.show}
              </button>
            </div>

            <AppDialog
              open={open === s.id}
              onOpenChange={v => setOpen(v ? s.id : null)}
              ui={dialogUi}
              size={shape.size}
              title={s.title}
              description={s.description}
              dismissible={!shape.locked}
              footer={
                shape.footer ? (
                  <>
                    {!shape.locked && (
                      <button
                        type="button"
                        onClick={() => setOpen(null)}
                        className="rounded-md border border-border px-4 py-2 text-[length:var(--fs-small)] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {s.footerCancel}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setOpen(null)}
                      className="rounded-md bg-primary px-4 py-2 text-[length:var(--fs-small)] font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      {s.footerOk}
                    </button>
                  </>
                ) : undefined
              }
            >
              {shape.long ? (
                // 🔒 ДЛИНА ЗДЕСЬ — ЧАСТЬ ОБРАЗЦА, А НЕ НАПОЛНИТЕЛЬ. Тело обязано
                // перерасти экран, иначе прокрутку не увидеть, а именно её
                // отсутствие и стоило владельцу дефекта.
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 24 }, (_, i) => (
                    <p key={i} className="text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
                      {i + 1}. {ui.longLine}
                    </p>
                  ))}
                </div>
              ) : shape.locked ? (
                <p className="text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
                  {ui.lockedHint}
                </p>
              ) : s.body ? (
                <p className="text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{s.body}</p>
              ) : undefined}
            </AppDialog>
          </section>
        )
      })}
    </div>
  )
}
