import { CheckCircle2, KeyRound } from "lucide-react"
import { Small } from "@/components/ui/typography"
import { readAnthropicKeyState } from "@/lib/architect/anthropic-key"
import { AnthropicKeyForm } from "./anthropic-key.client"
import { SettingsCard } from "./settings-card"

// КАРТОЧКА «КЛЮЧ ANTHROPIC» — AUTH FLOW АГЕНТА (113-2, 2026-09-04).
//
// 🔒 ОДНА ПЛАШКА, А НЕ ТРИ, И ЭТО РАЗНИЦА С КЛЮЧОМ OPENAI. Там потребителей трое,
// и «задан» значит «задан у ВСЕХ живых» — иначе граф остаётся слепым молча. Здесь
// потребитель один: чат. Три плашки на одного означали бы обещание проверки,
// которой не существует.
//
// 🔒 «СОХРАНЕНО» РАВНО «ПРИМЕНЕНО», И КАРТОЧКА ГОВОРИТ ЭТО СЛОВАМИ. У соседней
// карточки написано обратное — там слот читает окружение при старте и нужен
// перезапуск. Промолчать здесь значило бы заставить человека ждать события,
// которого не будет, и решить, что настройка не работает.
//
// 🛑 ЧЕГО КАРТОЧКА НЕ ОБЕЩАЕТ: вход по подписке Claude Pro/Max. Измерено
// первоисточником 2026-09-04: Anthropic не разрешает сторонним продуктам
// предлагать вход claude.ai и лимиты подписки без предварительного согласования,
// и предписывает ключ API. Сказать это на экране дешевле, чем отвечать на вопрос
// «а почему нельзя войти подпиской» каждый раз заново.

export function AnthropicKeySection() {
  const state = readAnthropicKeyState()

  return (
    <SettingsCard
      mark={{ "data-anthropic-key": "" }}
      icon={<KeyRound className="size-4 text-muted-foreground" />}
      title="Ключ Anthropic"
      status={
        state.configured ? (
          <span
            data-anthropic-state="ok"
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[length:var(--fs-small)] text-emerald-800 dark:text-emerald-200"
          >
            <CheckCircle2 className="size-3.5" />
            задан
            {state.tail && <span className="font-mono opacity-70">…{state.tail}</span>}
          </span>
        ) : (
          <span
            data-anthropic-state="missing"
            className="text-[length:var(--fs-small)] text-muted-foreground"
          >
            не задан
          </span>
        )
      }
      bodyClassName="flex flex-col gap-3 p-3"
    >
      <Small className="leading-relaxed text-muted-foreground">
        Ключ нужен режиму <strong className="text-foreground">Claude Agent SDK</strong> — тому, что
        выбирается в разделе «Стратегия автоматизации» и в поле ввода чата. Без ключа этот режим
        отвечает отказом, а не молчанием.
      </Small>

      <AnthropicKeyForm configured={state.configured} />

      <Small className="leading-relaxed text-muted-foreground">
        Ключ действует <strong className="text-foreground">со следующего вопроса</strong>:
        перезапускать ничего не нужно. Взять его — в консоли Anthropic,{" "}
        <span className="font-mono">platform.claude.com</span>.
      </Small>

      {/* 🛑 ЧЕСТНАЯ ГРАНИЦА, НАЗВАННАЯ НА ЭКРАНЕ, А НЕ В КОДЕ. */}
      <Small className="leading-relaxed text-muted-foreground">
        Подписка Claude Pro или Max сюда не подходит: Anthropic не разрешает сторонним продуктам
        предлагать вход claude.ai и лимиты подписки без отдельного согласования и предписывает ключ
        API. Оплата идёт по расходу токенов.
      </Small>
    </SettingsCard>
  )
}
