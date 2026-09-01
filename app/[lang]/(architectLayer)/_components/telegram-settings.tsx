import { MessagesSquare, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import { H4, Small } from "@/components/ui/typography"
import { TelegramSetup } from "./telegram-setup.client"
import type { ChannelsState } from "@/lib/architect/channels"
import type { TelegramUi } from "../_i18n/telegram.i18n"

// РАЗДЕЛ «НАСТРОЙКИ» ВХОДА «TELEGRAM-БОТ» — ПЕРЕНЕСЁН ИЗ ПАНЕЛИ (77-4, 2026-09-01).
// Источник: `bridges/app/app/[lang]/channels/page.tsx`.
//
// 🔒 ТРИ СОСТОЯНИЯ РАЗЛИЧАЮТСЯ ВИДОМ, А НЕ ОТТЕНКОМ ОДНОГО, И ПРИЧИНА ПЕРЕЕХАЛА
// ВМЕСТЕ С НИМИ: лечение у них разное.
//   • служба не запущена → её надо поднять: `pm2 start fractera-channels`;
//   • токен не сохранён  → его надо получить у @BotFather;
//   • токен сохранён, но Telegram его не узнаёт → он набран с ошибкой или отозван.
// Панель до переезда показывала третье припиской в подписи поля, где его легко
// пропустить. ✗ «Не работает» без указания, ЧТО именно не работает, — это отказ,
// который человек лечит наугад.
//
// 🔒 СЕРВЕРНЫЙ: резолвит слова и отдаёт островку СТРОКИ ПОИМЁННО (76-4).
//
// 🔒 ССЫЛКА В ПАНЕЛЬ НЕ ПЕРЕЕХАЛА, И ЭТО РЕШЕНИЕ РАЗВЕДКИ 77-2. В источнике строка
// про базу знаний вела на страницу панели; у гостя такой страницы нет, а ссылка в
// чужой контур хуже её отсутствия — она обещает место, куда человек не попадёт.

export function TelegramSettings({
  state,
  ui,
}: {
  state: ChannelsState
  ui: TelegramUi
}) {
  const w = ui.settings
  const tg = state.telegram

  // 🔒 СЛУЖБА НЕ ОТВЕТИЛА — ЭТО ОТДЕЛЬНЫЙ ЭКРАН, А НЕ ПУСТАЯ ФОРМА. Форма без
  // службы принимала бы ввод, которому некуда деться. И это НОРМАЛЬНОЕ состояние
  // на машине человека: служба каналов принадлежит платформе и живёт на сервере.
  if (!state.available) {
    return (
      <div
        data-telegram-settings="service-down"
        className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3"
      >
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
        <div className="flex flex-col gap-1">
          <Small className="text-destructive">{w.serviceDown}</Small>
          <code className="w-fit rounded bg-destructive/10 px-1.5 py-0.5 font-mono text-[length:var(--fs-small)]">
            pm2 start fractera-channels
          </code>
        </div>
      </div>
    )
  }

  return (
    <div data-telegram-settings="ready" className="flex flex-col gap-4">
      <div className="rounded-lg border border-border">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
          <span className="flex flex-1 items-center gap-2">
            <MessagesSquare className="size-4 text-muted-foreground" />
            <H4 variant="ui">Telegram</H4>
          </span>

          {/* Состояние привязки — одной строкой, тремя разными видами. */}
          {tg?.chatId ? (
            <span
              data-telegram-link="linked"
              className="inline-flex items-center gap-1.5 text-[length:var(--fs-small)] text-emerald-700 dark:text-emerald-300"
            >
              <CheckCircle2 className="size-3.5" />
              {w.linkedTo.replace("{who}", tg.who ?? tg.chatId)}
            </span>
          ) : tg?.configured ? (
            <span
              data-telegram-link="not-linked"
              className="text-[length:var(--fs-small)] text-amber-700 dark:text-amber-300"
            >
              {w.notLinked}
            </span>
          ) : (
            <span
              data-telegram-link="no-token"
              className="text-[length:var(--fs-small)] text-muted-foreground"
            >
              {w.noToken}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4 p-3">
          {/* 🔒 ТОКЕН ЕСТЬ, НО TELEGRAM ЕГО НЕ УЗНАЁТ — ОТДЕЛЬНОЕ СОСТОЯНИЕ, А НЕ
              приписка в подписи поля: лечение у него своё. */}
          {tg?.configured && !tg.reachable && (
            <p
              data-telegram-state="rejected"
              className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-2.5"
            >
              <XCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
              <Small className="text-destructive">{w.tokenRejected}</Small>
            </p>
          )}

          {tg?.configured && tg.reachable && tg.bot && (
            <Small data-telegram-state="ok" className="text-muted-foreground">
              {w.currentBot} <span className="font-mono text-foreground">@{tg.bot}</span>
            </Small>
          )}

          <TelegramSetup
            configured={Boolean(tg?.configured)}
            enabled={tg?.enabled !== false}
            tickSeconds={Number(tg?.tickSeconds ?? 0)}
            labels={{
              tokenLabel: w.tokenLabel,
              tokenPlaceholder: w.tokenPlaceholder,
              tokenReplace: w.tokenReplace,
              save: w.save,
              saving: w.saving,
              saved: w.saved,
              failed: w.failed,
              // Кнопка называет то, что произойдёт: у привязанного чата это
              // ЗАМЕНА привязки, а не первая её постановка.
              connect: tg?.chatId ? w.relink : w.connect,
              relink: w.relink,
              waiting: w.waiting,
              openTelegram: w.openTelegram,
              linked: w.linkedToast,
              linkTimeout: w.linkTimeout,
              linkExpired: w.linkExpired,
              linkFailed: w.linkFailed,
              channelOn: w.channelOn,
              scheduleLabel: w.scheduleLabel,
              scheduleHint: w.scheduleHint,
              scheduleOff: w.scheduleOff,
              scheduleEvery: w.scheduleEvery,
              scheduleSaved: w.scheduleSaved,
            }}
          />

          <Small className="border-t border-border pt-3 leading-relaxed text-muted-foreground">
            {w.answersFrom} {w.neverInvents}
          </Small>
        </div>
      </div>
    </div>
  )
}
