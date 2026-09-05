import { AlertTriangle, Timer, ScrollText } from "lucide-react"
import { H4, Small } from "@/components/ui/typography"
import { TelegramSchedule } from "./telegram-schedule.client"
import { OpenAiKeySection } from "./openai-key"
import { AnthropicKeySection } from "./anthropic-key"
import { AgentChannelSection } from "./agent-channel"
import { FactsRegistrySection } from "./facts-registry"
import { ToolsRegistry } from "./tools-registry"
import { InProgress } from "./in-progress"
import { SettingsCard } from "./settings-card"
import type { ChannelsState, TelegramState } from "@/lib/architect/channels"
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
  lang,
  state,
  ui,
}: {
  lang: string
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
      <div className="flex flex-col gap-4">
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

        {/* 🔒 РЕЕСТР ВИДЕН, ДАЖЕ КОГДА СЛУЖБА ЛЕЖИТ, И ЭТО НЕ МЕЛОЧЬ.
            ✗ Найдено измерением 81-3: карточка была смонтирована ВНУТРИ раздела,
            который при отказе службы исчезает целиком, — и на машине человека,
            где службы каналов нет по устройству, реестра не существовало вовсе.
            Реестр описывает ПРОЕКТ, а не бота: он про то, что система умеет
            вынимать из любого сообщения, и от живости Telegram не зависит. */}
        <FactsRegistrySection lang={lang} ui={ui} />
        <ToolsRegistry />
      </div>
    )
  }

  const configured = Boolean(tg?.configured)

  return (
    <div data-telegram-settings="ready" className="flex flex-col gap-4">
      {/* ── 1. Подписка Claude Code и два бота проекта (117) ───────────── */}
      {/* 🪦 ЗДЕСЬ СТОЯЛ СПИСОК БОТОВ СЛУЖБЫ `:3500` — УБРАН 2026-09-05 (117)
          прямым словом владельца. Его вопрос: «если мы добавим Telegram-бота здесь, мы сможем
          упростить работу в терминале? Если нет — нужно убрать этот ввод».
          ✗ ИЗМЕРЕНО 2026-09-05, ОТВЕТ — НЕТ: этот ввод писал в `config.json`
          службы `:3500`, а плагин каналов читал СОВСЕМ ДРУГОЙ файл
          (`/root/.claude/channels/telegram/.env`). Два хранилища, ноль связи: владелец
          вводил бота здесь и не понимал, почему терминал его не видит.
          🔒 ЗАМЕНЕН ДВУМЯ КАРТОЧКАМИ, КОТОРЫЕ ПИШУТ ТУДА, ОТКУДА ЧИТАЕТ ПЛАГИН.
          🛑 Цена названа: вместе со списком ушли расписание и привязка СТАРОГО
          бота — обе принадлежали отменённой цепочке через чат. Сама служба `:3500`
          жива: раздел «Логи» читает её склад, файлы шлёт она же. */}
      <AgentChannelSection lang={lang} ui={ui} />

      {/* ── 2. Ключи: чем оплачено дополнительное ───────────────────────
          🔒 ОБА КЛЮЧА СТОЯТ РЯДОМ И ПОСЛЕ ПОДПИСКИ. Подписка отвечает на вопрос
          «работает ли агент вообще», ключи — «чем оплачено то, что сверх него».
          Разнеси их по разным экранам — и человек перестанет видеть, что одно
          обязательно, а другое нет. */}
      <OpenAiKeySection ui={ui} />
      <AnthropicKeySection />
      <TelegramTail configured={configured} lang={lang} tg={tg} ui={ui} />
    </div>
  )
}

/** Пустой бот — строка, в которую человек вписывает первый токен. */
function TelegramTail({
  configured,
  lang,
  tg,
  ui,
}: {
  configured: boolean
  lang: string
  tg: TelegramState | null
  ui: TelegramUi
}) {
  const w = ui.settings
  return (
    <>
      {/* ── 3. Расписание ───────────────────────────────────────────────── */}
      <SettingsCard
        mark={{ "data-schedule-card": "" }}
        icon={<Timer className="size-4 text-muted-foreground" />}
        title={w.scheduleLabel}
      >
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
      </SettingsCard>
      {/* ── 4. Реестр признаков (81-3) ──────────────────────────────────
          🔒 МЕСТО НАЗВАНО ВЛАДЕЛЬЦЕМ: он ответил адресом этого раздела на
          прямой вопрос, где живёт реестр. Стоит ПЕРЕД инструкцией боту:
          реестр говорит, что система умеет вынимать, а инструкция — как ей
          об этом рассказывать. Порядок смысловой, как у трёх карточек выше. */}
      <FactsRegistrySection lang={lang} ui={ui} />
      <ToolsRegistry />

      {/* ── 5. Ваша инструкция боту — каркас (77-15) ─────────────────────────
          🔒 МЕСТО ЗАНЯТО ЗАРАНЕЕ ПО ПРЯМОМУ СЛОВУ ВЛАДЕЛЬЦА: «создаём на этой
          странице ещё одну вкладку ниже расписание и также пишем там просто текст
          что скоро будет добавлена». Раздел, появившийся потом из ниоткуда,
          заметить труднее, чем тот, который сам сказал, что он будет (28-13).
          🛑 ЗДЕСЬ БУДЕТ ТЕКСТ, КОТОРЫЙ ЕДЕТ В ИНСТРУКЦИЮ БОТА ДОБАВКОЙ к его
          собственным правилам — а значит это поле влияет на поведение продукта,
          и его ТЗ (77-19) отдельно называет, что оно НЕ отменяет. */}
      <div className="rounded-lg border border-border">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
          <span className="flex flex-1 items-center gap-2">
            <ScrollText className="size-4 text-muted-foreground" />
            <H4 variant="ui">{ui.skeleton.instructionTitle}</H4>
          </span>
        </div>
        <div className="p-3">
          <InProgress
            where="instruction"
            label={ui.skeleton.inProgress}
            lead={ui.skeleton.instructionLead}
          />
        </div>
      </div>
    </>
  )
}
