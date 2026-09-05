import { AlertTriangle, Bot, CheckCircle2, Cpu, XCircle } from "lucide-react"
import { Small } from "@/components/ui/typography"
import { appDialogUi } from "@/components/dialog/app-dialog.i18n"
import { readAgentChannel } from "@/lib/architect/agent-channel"
import { AgentBotForm } from "./agent-bot.client"
import { ClaudeTerminal } from "./claude-terminal.client"
import { InProgress } from "./in-progress"
import { SettingsCard } from "./settings-card"
import type { TelegramUi } from "../_i18n/telegram.i18n"

// КАНАЛ АГЕНТА: ПОДПИСКА CLAUDE CODE И ДВА ЕГО БОТА (шаг 117, 2026-09-05).
//
// 🔒 ПОДПИСКА СТОИТ ПЕРВОЙ КАРТОЧКОЙ, И ЭТО ПРЯМОЕ СЛОВО ВЛАДЕЛЬЦА: «самое
// главное, чего здесь не хватает, — первым пунктом авторизация в подписке Claude
// Code». Довод сильнее порядка привычки: без входа в подписку не работает НИЧЕГО
// из того, что ниже, — ни бот, ни ответы. Ключи OpenAI и Anthropic отвечают на
// вопрос «чем оплачено дополнительное», а этот — «работает ли агент вообще».
//
// 🔒 ОДИН ВОПРОС ЧАТУ НА СТРАНИЦУ, А НЕ ПО ОДНОМУ НА КАРТОЧКУ. Все три карточки
// показывают ОДНО состояние, снятое в одну секунду; три отдельных запроса дали бы
// три разных мгновения и объяснимую только кодом рассинхронизацию.
//
// 🔒 БОТОВ РОВНО ДВА, И ВТОРОЙ ЗАВЕДЁН ПУСТЫМ НАМЕРЕННО (решение владельца
// 2026-09-05): №1 — агент автоматизации, №2 — агент разработки, «позже сделаем
// его». Место под второй стоит сразу, потому что переделка раскладки задним
// числом дороже пустой карточки, а «в процессе разработки» с ИМЕНЕМ того, чего
// ждать, — не заглушка, а честное обещание.
//
// 🛑 ЧАТ НЕ ОТВЕТИЛ — ЭТО СОСТОЯНИЕ, А НЕ ПОЛОМКА. На машине человека службы
// `:3600` нет вовсе, и карточка говорит это словами: молчащая форма читается как
// сломанная настройка.

export async function AgentChannelSection({ lang, ui }: { lang: string; ui: TelegramUi }) {
  const w = ui.agent
  const state = await readAgentChannel()

  const subscribed = state.available && state.subscription.loggedIn

  return (
    <>
      {/* ── 1. Подписка Claude Code ─────────────────────────────────────── */}
      <SettingsCard
        mark={{ "data-agent-subscription": subscribed ? "on" : "off" }}
        icon={<Cpu className="size-4 text-muted-foreground" />}
        title={w.title}
        open
        status={
          subscribed ? (
            <span
              data-agent-state="on"
              className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[length:var(--fs-small)] text-emerald-800 dark:text-emerald-200"
            >
              <CheckCircle2 className="size-3.5" />
              {w.statusOn}
              {state.subscription.method && (
                <span className="font-mono opacity-70">{state.subscription.method}</span>
              )}
            </span>
          ) : (
            <span
              data-agent-state="off"
              className="inline-flex items-center gap-1.5 text-[length:var(--fs-small)] text-muted-foreground"
            >
              <XCircle className="size-3.5" />
              {w.statusOff}
            </span>
          )
        }
        bodyClassName="flex flex-col gap-3 p-3"
      >
        <Small className="leading-relaxed text-muted-foreground">{w.lead}</Small>

        {state.available ? (
          <div className="flex flex-wrap items-center gap-2">
            <ClaudeTerminal
              ui={appDialogUi(lang)}
              labels={{
                open: w.openTerminal,
                title: w.dialogTitle,
                description: w.dialogDescription,
                newTab: w.newTab,
              }}
            />
          </div>
        ) : (
          <div
            data-agent-chat="unreachable"
            className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <Small className="leading-relaxed">{w.unreachable}</Small>
          </div>
        )}
      </SettingsCard>

      {/* ── 2. Бот №1 — агент автоматизации ─────────────────────────────── */}
      <SettingsCard
        mark={{ "data-agent-bot-card": "automation" }}
        icon={<Bot className="size-4 text-muted-foreground" />}
        title={w.botAutomationTitle}
        open={!state.telegram.present}
        status={
          state.telegram.present ? (
            <span
              data-agent-bot-state="configured"
              className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[length:var(--fs-small)] text-emerald-800 dark:text-emerald-200"
            >
              <CheckCircle2 className="size-3.5" />
              {w.bot.configured}
            </span>
          ) : (
            <span
              data-agent-bot-state="empty"
              className="text-[length:var(--fs-small)] text-muted-foreground"
            >
              {w.bot.notConfigured}
            </span>
          )
        }
        bodyClassName="flex flex-col gap-3 p-3"
      >
        <Small className="leading-relaxed text-muted-foreground">{w.botAutomationLead}</Small>

        <AgentBotForm
          labels={w.bot}
          masked={state.telegram.masked}
          present={state.telegram.present}
        />

        {/* 🔒 ЧИСЛА ПРИВЯЗКИ ПОКАЗАНЫ, А ИДЕНТИФИКАТОРЫ СОБЕСЕДНИКОВ — НЕТ.
            Наружу отдаётся ответ на вопрос «сколько», а не «кто»: закон 115-2. */}
        <Small className="text-muted-foreground">
          {w.allowed.replace("{n}", String(state.telegram.allowed))}
          {" · "}
          {w.pending.replace("{n}", String(state.telegram.pending))}
        </Small>
      </SettingsCard>

      {/* ── 3. Бот №2 — агент разработки, место под будущее ─────────────── */}
      <SettingsCard
        mark={{ "data-agent-bot-card": "development" }}
        icon={<Bot className="size-4 text-muted-foreground" />}
        title={w.botDevTitle}
        status={
          <span className="text-[length:var(--fs-small)] text-muted-foreground">{w.botDevSoon}</span>
        }
        bodyClassName="p-3"
      >
        <InProgress where="agent-bot-development" label={w.botDevTitle} lead={w.botDevLead} />
      </SettingsCard>
    </>
  )
}
