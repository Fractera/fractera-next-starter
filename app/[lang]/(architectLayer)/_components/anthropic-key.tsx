import { AlertTriangle, CheckCircle2, KeyRound } from "lucide-react"
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
// 🪦 «ВХОД ПО ПОДПИСКЕ НЕВОЗМОЖЕН» — ОТМЕНЕНО 2026-09-05 И ЭТО ВАЖНЕЕ САМОЙ
// КАРТОЧКИ. Здесь стояло: Anthropic не разрешает сторонним продуктам предлагать
// вход claude.ai, и предписан ключ API. Утверждение было верно про ЭТО ПОЛЕ и
// ложно про проект: шагом 115 подписка заработала ОФИЦИАЛЬНЫМ плагином каналов, и
// с 2026-09-05 она основной и единственный путь бота к ИИ. ✗ прежний текст,
// оставленный на экране, сказал бы человеку «подписка не годится» ровно тогда,
// когда весь бот на ней и работает.
//
// 🛑 ПРЕДУПРЕЖДЕНИЕ О РАСХОДЕ — ТРЕБОВАНИЕ ВЛАДЕЛЬЦА 2026-09-05, И ОНО СТОИТ ДО
// ПОЛЯ ВВОДА. Ключ оплачивается по токенам, подписка — нет; человек, узнавший об
// этом после того, как вставил ключ, читает не предупреждение, а объяснение счёта.

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
      {/* 🛑 ПРЕДУПРЕЖДЕНИЕ О ДЕНЬГАХ СТОИТ ДО ПОЛЯ ВВОДА, А НЕ ПОСЛЕ НЕГО
          (прямое требование владельца 2026-09-05). Предупреждение, прочитанное
          после того, как ключ уже вставлен, не предупреждение, а объяснение
          счёта. */}
      <div
        data-anthropic-warning
        className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2"
      >
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <Small className="leading-relaxed">
          <strong className="text-foreground">Этот ключ тратит деньги, и заметно.</strong> Подписка
          Claude Code, которой бот пользуется по умолчанию, входит в вашу месячную плату и сверх неё
          не берёт ничего. Ключ — другое: оплата идёт по расходу токенов, за каждый вопрос и каждый
          ответ отдельно, и счёт растёт тем быстрее, чем больше бот работает. Заводите его, только
          если знаете, зачем он вам, и следите за расходом в консоли Anthropic.
        </Small>
      </div>

      <Small className="leading-relaxed text-muted-foreground">
        Ключ нужен не боту, а тем частям проекта, которые обращаются к моделям Anthropic напрямую,
        минуя подписку. <strong className="text-foreground">Без ключа бот работает</strong> — он
        думает через вашу подписку Claude Code, и это основной путь.
      </Small>

      <AnthropicKeyForm configured={state.configured} />

      <Small className="leading-relaxed text-muted-foreground">
        Ключ действует <strong className="text-foreground">со следующего вопроса</strong>:
        перезапускать ничего не нужно. Взять его — в консоли Anthropic,{" "}
        <span className="font-mono">platform.claude.com</span>.
      </Small>

      {/* 🪦 ЗДЕСЬ СТОЯЛО «ПОДПИСКА CLAUDE PRO ИЛИ MAX СЮДА НЕ ПОДХОДИТ» — и это
          устарело 2026-09-05. Утверждение было верно про ЭТО поле и ложно про проект:
          шагом 115 подписка заработала официальным плагином каналов, и она стала
          ОСНОВНЫМ путём. Оставить прежний текст значило бы сказать человеку, что
          подписка не годится, — ровно тогда, когда весь бот на ней и работает. */}
      <Small className="leading-relaxed text-muted-foreground">
        Подписку в это поле вписать нельзя, и это ограничение поля, а не проекта: Anthropic
        предписывает здесь ключ API. Вход по подписке — первой карточкой этого раздела, и бот
        работает именно через неё.
      </Small>
    </SettingsCard>
  )
}
