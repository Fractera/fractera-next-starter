import { MessagesSquare, CheckCircle2, XCircle, AlertTriangle, Timer } from "lucide-react"
import { H4, Small } from "@/components/ui/typography"
import { TelegramSetup } from "./telegram-setup.client"
import { TelegramSchedule } from "./telegram-schedule.client"
import { OpenAiKeySection } from "./openai-key"
import type { ChannelsState } from "@/lib/architect/channels"
import type { TelegramUi } from "../_i18n/telegram.i18n"

// РАЗДЕЛ «НАСТРОЙКИ» ВХОДА «TELEGRAM-БОТ» — ПЕРЕНЕСЁН ИЗ ПАНЕЛИ (77-4),
// ПЕРЕЛОЖЕН И ДОПОЛНЕН (77-8, 77-9, 2026-09-01).
//
// 🔒 ТРИ КАРТОЧКИ В СМЫСЛОВОМ ПОРЯДКЕ, И ПОРЯДОК НАЗВАН ВЛАДЕЛЬЦЕМ:
//   1) «Telegram» — какой это бот, включён ли канал, кому он пишет;
//   2) «Ключ OpenAI» — без него бот не расшифрует голос и не соберёт ответ,
//      поэтому он стоит ВТОРЫМ, а не в отдельном разделе: «в одной настройке мы
//      должны пробросить сразу две»;
//   3) «Расписание» — как часто дёргать проект.
//
// 🔒 ТРИ СОСТОЯНИЯ БОТА РАЗЛИЧАЮТСЯ ВИДОМ, А НЕ ОТТЕНКОМ ОДНОГО, И ПРИЧИНА
// ПЕРЕЕХАЛА ВМЕСТЕ С НИМИ: лечение у них разное.
//   • служба не запущена → `pm2 start fractera-channels`;
//   • токен не сохранён  → взять у @BotFather;
//   • токен есть, Telegram его не узнаёт → он набран с ошибкой или отозван.
//
// 🔒 СЕРВЕРНЫЙ: резолвит слова и отдаёт островкам СТРОКИ ПОИМЁННО (76-4).

export function TelegramSettings({
  state,
  ui,
}: {
  state: ChannelsState
  ui: TelegramUi
}) {
  const w = ui.settings
  const tg = state.telegram

  // 🔒 СЛУЖБА НЕ ОТВЕТИЛА — ЭТО ОТДЕЛЬНЫЙ ЭКРАН, А НЕ ПУСТАЯ ФОРМА. И это
  // НОРМАЛЬНОЕ состояние на машине человека: служба каналов принадлежит
  // платформе и живёт на сервере.
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

  const configured = Boolean(tg?.configured)

  return (
    <div data-telegram-settings="ready" className="flex flex-col gap-4">
      {/* ── 1. Telegram ─────────────────────────────────────────────────── */}
      <div className="rounded-lg border border-border">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
          <span className="flex flex-1 items-center gap-2">
            <MessagesSquare className="size-4 text-muted-foreground" />
            <H4 variant="ui">Telegram</H4>
          </span>

          {tg?.chatId ? (
            <span
              data-telegram-link="linked"
              className="inline-flex items-center gap-1.5 text-[length:var(--fs-small)] text-emerald-700 dark:text-emerald-300"
            >
              <CheckCircle2 className="size-3.5" />
              {w.linkedTo.replace("{who}", tg.who ?? tg.chatId)}
            </span>
          ) : configured ? (
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
          {/* 🔒 ТОКЕН ЕСТЬ, НО TELEGRAM ЕГО НЕ УЗНАЁТ — ОТДЕЛЬНОЕ СОСТОЯНИЕ, а не
              приписка в подписи поля: лечение у него своё. */}
          {configured && !tg?.reachable && (
            <p
              data-telegram-state="rejected"
              className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/5 p-2.5"
            >
              <XCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
              <Small className="text-destructive">{w.tokenRejected}</Small>
            </p>
          )}

          {configured && tg?.reachable && tg.bot && (
            <Small data-telegram-state="ok" className="text-muted-foreground">
              {w.currentBot} <span className="font-mono text-foreground">@{tg.bot}</span>
            </Small>
          )}

          <TelegramSetup
            configured={configured}
            enabled={tg?.enabled !== false}
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
              // 🔒 ТЕКСТ НЕ ПЕРЕПИСАН — ПЕРЕЕХАЛ. Он же был внизу экрана сноской;
              // теперь стоит предупреждением у кнопки, к которой относится.
              afterLink: `${w.answersFrom} ${w.neverInvents}`,
            }}
          />
        </div>
      </div>

      {/* ── 2. Ключ OpenAI ──────────────────────────────────────────────── */}
      <OpenAiKeySection ui={ui} />

      {/* ── 3. Расписание ───────────────────────────────────────────────── */}
      <div className="rounded-lg border border-border">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
          <span className="flex flex-1 items-center gap-2">
            <Timer className="size-4 text-muted-foreground" />
            <H4 variant="ui">{w.scheduleLabel}</H4>
          </span>
        </div>
        <div className="p-3">
          <TelegramSchedule
            configured={configured}
            tickSeconds={Number(tg?.tickSeconds ?? 0)}
            labels={{
              scheduleOff: w.scheduleOff,
              scheduleEvery: w.scheduleEvery,
              scheduleSaved: w.scheduleSaved,
              scheduleHint: w.scheduleHint,
              failed: w.failed,
            }}
          />
        </div>
      </div>
    </div>
  )
}
