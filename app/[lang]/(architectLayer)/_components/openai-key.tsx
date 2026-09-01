import { KeyRound, CheckCircle2, AlertTriangle } from "lucide-react"
import { H4, Small } from "@/components/ui/typography"
import { OpenAiKeyForm } from "./openai-key.client"
import { readOpenAiKeyState } from "@/lib/architect/openai-key"
import type { TelegramUi } from "../_i18n/telegram.i18n"

// БЛОК «КЛЮЧ OPENAI» НА ЭКРАНЕ НАСТРОЕК БОТА (77-8, 2026-09-01).
//
// 🔒 ОН СТОИТ ЗДЕСЬ, А НЕ В СВОЁМ РАЗДЕЛЕ, ПО СЛОВУ ВЛАДЕЛЬЦА: «работа бота
// невозможна без работы ключа — значит в одной настройке мы должны пробросить
// сразу две». Человек, настраивающий бота, не должен искать вторую половину
// настройки в другом месте.
//
// 🔒 ЗЕЛЁНАЯ ПЛАШКА ТОЛЬКО ТОГДА, КОГДА КЛЮЧ ЕСТЬ У ВСЕХ ЖИВЫХ ПОТРЕБИТЕЛЕЙ.
// Их трое: сам проект, слой данных и граф знаний. ✗ панель оплатила днём отладки
// случай, когда ключ доехал до одного и не доехал до другого: приём документа
// отвечал 200 и молча ничего не встраивал. Один индикатор на трёх потребителей
// скрывает ровно две трети правды, поэтому при неполной раздаче плашка жёлтая и
// называет тех, у кого ключа нет.
//
// 🔒 «СЛУЖБЫ НЕТ» И «У СЛУЖБЫ НЕТ КЛЮЧА» — РАЗНЫЕ СОСТОЯНИЯ. Граф знаний может
// быть не установлен вовсе, и требовать от него ключ бессмысленно: такой
// потребитель в счёт не идёт.

export function OpenAiKeySection({ ui }: { ui: TelegramUi }) {
  const w = ui.openai
  const state = readOpenAiKeyState()

  const living = [
    { name: w.consumerApp, ...state.app },
    { name: w.consumerData, ...state.data },
    { name: w.consumerGraph, ...state.graph },
  ].filter(c => c.present)

  const missing = living.filter(c => !c.configured).map(c => c.name)
  const anyKey = living.some(c => c.configured)
  const complete = anyKey && missing.length === 0

  return (
    <div data-openai-key className="rounded-lg border border-border">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <span className="flex flex-1 items-center gap-2">
          <KeyRound className="size-4 text-muted-foreground" />
          <H4 variant="ui">{w.title}</H4>
        </span>

        {complete ? (
          <span
            data-openai-state="ok"
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[length:var(--fs-small)] text-emerald-800 dark:text-emerald-200"
          >
            <CheckCircle2 className="size-3.5" />
            {w.exists}
            {state.tail && <span className="font-mono opacity-70">…{state.tail}</span>}
          </span>
        ) : anyKey ? (
          <span
            data-openai-state="partial"
            className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[length:var(--fs-small)] text-amber-800 dark:text-amber-200"
          >
            <AlertTriangle className="size-3.5" />
            {w.partial}: {missing.join(", ")}
          </span>
        ) : (
          <span
            data-openai-state="missing"
            className="text-[length:var(--fs-small)] text-muted-foreground"
          >
            {w.missing}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 p-3">
        <Small className="leading-relaxed text-muted-foreground">{w.lead}</Small>

        <OpenAiKeyForm
          configured={anyKey}
          labels={{
            keyLabel: w.keyLabel,
            keyPlaceholder: w.keyPlaceholder,
            keyReplace: w.keyReplace,
            save: w.save,
            saving: w.saving,
            saved: w.saved,
            failed: w.failed,
            badFormat: w.badFormat,
            check: w.check,
            checking: w.checking,
            valid: w.valid,
            invalid: w.invalid,
            funded: w.funded,
            noFunds: w.noFunds,
            fundsUnknown: w.fundsUnknown,
            balanceNote: w.balanceNote,
            restartNote: w.restartNote,
          }}
        />
      </div>
    </div>
  )
}
