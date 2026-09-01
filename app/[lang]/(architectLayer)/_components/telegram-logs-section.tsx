import { AlertTriangle } from "lucide-react"
import { H4, Small } from "@/components/ui/typography"
import { TelegramLogs } from "./telegram-logs.client"
import { readInbox, type ChannelsState } from "@/lib/architect/channels"
import type { TelegramUi } from "../_i18n/telegram.i18n"

// РАЗДЕЛ «ЛОГИ» — СЕРВЕРНАЯ ПОЛОВИНА (77-5, 2026-09-01).
//
// 🔒 ПУСТО — ЭТО ТРИ РАЗНЫХ СОСТОЯНИЯ, А НЕ ОДНО, И У КАЖДОГО СВОЁ ЛЕЧЕНИЕ:
//   • токена нет            → сохранить его в «Настройках»;
//   • токен есть, чат не привязан → привязать, иначе боту физически некому писать;
//   • всё настроено, но никто не писал → ждать, здесь ничего не сломано.
// Тот же закон, что у «Настроек», и он же оплачен в 28-13: молчащая пустота
// читается как поломка. ✗ Одна фраза «сообщений нет» на все три случая отправила
// бы человека чинить работающее.
//
// 🔒 СЛУЖБА НЕ ОТВЕТИЛА — ОТДЕЛЬНЫЙ ЭКРАН, ТОТ ЖЕ, ЧТО В «НАСТРОЙКАХ». Повторён
// не текстом, а словами из одного словаря: два объяснения одного отказа
// разъезжаются на первой же правке.
//
// 🔒 ПЕРВАЯ СТРАНИЦА ЧИТАЕТСЯ СЕРВЕРОМ. Лента получает её пропсом и дальше живёт
// сама — так первое, что видит человек, приходит вместе с HTML.

export async function TelegramLogsSection({
  state,
  ui,
}: {
  state: ChannelsState
  ui: TelegramUi
}) {
  const w = ui.logs

  if (!state.available) {
    return (
      <div
        data-telegram-logs-state="service-down"
        className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3"
      >
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
        <div className="flex flex-col gap-1">
          <Small className="text-destructive">{ui.settings.serviceDown}</Small>
          <code className="w-fit rounded bg-destructive/10 px-1.5 py-0.5 font-mono text-[length:var(--fs-small)]">
            pm2 start fractera-channels
          </code>
        </div>
      </div>
    )
  }

  const page = await readInbox(0, 50)
  const tg = state.telegram

  // Какая именно пустота — решает состояние бота, а не отсутствие строк.
  const empty = !tg?.configured
    ? w.emptyNoToken
    : !tg.chatId
      ? w.emptyNotLinked
      : w.emptyNoMessages

  return (
    <div data-telegram-logs-state="ready" className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <H4 variant="ui">{w.title}</H4>
        <Small className="leading-relaxed text-muted-foreground">{w.lead}</Small>
      </div>

      {/* Новые сверху: лента читается как разговор, а не как файл. */}
      <TelegramLogs
        initial={[...page.messages].reverse()}
        initialLastId={page.lastId}
        labels={{
          refresh: w.refresh,
          refreshing: w.refreshing,
          live: w.live,
          counted: w.counted,
          ringNote: w.ringNote,
          kindVoice: w.kindVoice,
          kindFile: w.kindFile,
          kindLocation: w.kindLocation,
          forwarded: w.forwarded,
          empty,
        }}
      />
    </div>
  )
}
