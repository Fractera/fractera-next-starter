import { ToolLoopAgent, isStepCount, type StopCondition, type ToolSet, type LanguageModel } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { activeFacts } from "@/lib/facts/registry"
import { openAiKey } from "@/lib/openai-key"
import { factTools, toolableFacts, type Finding } from "./tools"
import { nowMs } from "./store"
import type { Fact } from "@/lib/facts/types"
import type { TaskRow } from "./types"

// ПРОЕКЦИЯ ЗАПРОСА НА РЕЕСТР ПРИЗНАКОВ (91-4).
//
// 🔒 АГЕНТ, А НЕ ЦИКЛ ПО ПРИЗНАКАМ. `ToolLoopAgent` сам ведёт петлю «спросил —
// позвал инструмент — решил, звать ли ещё»; наш прежний способ — двенадцать
// файлов, зовущих `v1/chat/completions` руками, — здесь не повторяется.
//
// 🔒 ЦЕНА ОБЪЯВЛЕНА ПОТОЛКОМ, А НЕ НАДЕЖДОЙ. Человек ждёт ответа в мессенджере:
// это ограничение жёстче любой глубины рассуждения. Потолок двойной — шаги и
// токены, — потому что один длинный шаг стоит дороже трёх коротких.

/** Сколько шагов агенту позволено. Меньше глубины, больше предсказуемости. */
const MAX_STEPS = 6
/** Потолок токенов на один разбор: втрое дороже обычного — уже не «разбор». */
const MAX_TOKENS = 12_000

/**
 * Имя модели — ОДНО место на этот слой.
 *
 * 🔒 МОДЕЛЬ — НАСТРОЙКА, А НЕ ЛИТЕРАЛ (`use-ai-generation` §2.2). Значение ставит
 * человек на экране бота; код знает только имя переменной.
 * 🛑 УМОЛЧАНИЕ ЗДЕСЬ — ЧАСТЬ ИЗВЕСТНОГО ДОЛГА: тот же `gpt-4o-mini` повторён по
 * памяти в двенадцати файлах. Новых копий не завожу, старые лечатся отдельным
 * шагом, а не по дороге.
 */
export function taskModelName(kind: "cheap" | "strong"): string {
  const cheap = process.env.OPENAI_TEXT_MODEL || process.env.TGDESK_MODEL || "gpt-4o-mini"
  if (kind === "cheap") return cheap
  return process.env.OPENAI_STRONG_MODEL || cheap
}

function model(kind: "cheap" | "strong"): LanguageModel {
  return createOpenAI({ apiKey: openAiKey() })(taskModelName(kind))
}

/** Потолок расхода: считается по всем шагам разом, а не по последнему. */
function budget<T extends ToolSet>(): StopCondition<T> {
  return ({ steps }) => {
    const spent = steps.reduce(
      (n, s) => n + (s.usage?.inputTokens ?? 0) + (s.usage?.outputTokens ?? 0),
      0,
    )
    return spent >= MAX_TOKENS
  }
}

const INSTRUCTIONS = [
  "Тебе дают ОДИН запрос человека целиком и набор инструментов.",
  "Каждый инструмент — это признак: он описывает, что именно он узнаёт и по каким словам.",
  "Спроси у инструментов, что из этого запроса им принадлежит: вызови КАЖДЫЙ, которому в запросе",
  "есть что взять, и передай ему только его значения. Один и тот же кусок запроса может",
  "принадлежать нескольким инструментам сразу — это нормально.",
  "Не вызывай инструмент, которому нечего взять: пустой вызов хуже отсутствия вызова.",
  "Ничего не выдумывай: значение либо сказано, либо прямо следует из сказанного.",
  "Когда все подходящие инструменты вызваны — ответь одной строкой, ничего не пересказывая.",
].join(" ")

/** Что дал один прогон агента. */
export type Projection = {
  findings: Finding[]
  /** Сколько шагов сделал агент — по одному числу на прогон. */
  steps: number
  /** Признаки, предъявленные модели: без этого «ноль находок» неотличим от «нечего было спрашивать». */
  offered: number
  /** Почему не вышло. Пусто — вышло. */
  failed?: string
}

/**
 * Прогнать один набор инструментов одной моделью.
 *
 * 🔒 ОТДЕЛЬНАЯ ФУНКЦИЯ РАДИ ПРОВЕРЯЕМОСТИ: модель приходит параметром, значит
 * потолок шагов доказывается подложенной моделью, без единого обращения наружу.
 */
export async function runProjection(
  request: string,
  facts: Fact[],
  llm: LanguageModel,
): Promise<Projection> {
  const findings: Finding[] = []
  const tools = factTools(facts, f => findings.push(f))

  const agent = new ToolLoopAgent({
    model: llm,
    instructions: INSTRUCTIONS,
    tools,
    // 🔒 ДВА УСЛОВИЯ, А НЕ ОДНО: шаги ловят зацикливание, токены — один
    // непомерно дорогой шаг. Любое из них останавливает петлю.
    stopWhen: [isStepCount(MAX_STEPS), budget<typeof tools>()],
  })

  try {
    const result = await agent.generate({ prompt: request })
    return { findings, steps: result.steps.length, offered: facts.length }
  } catch (e) {
    // 🛑 ОТКАЗ МОДЕЛИ — ЗАКОННЫЙ ИСХОД, А НЕ ПАДЕНИЕ РАЗБОРА. Нет ключа, нет
    // денег на счёте, сеть не ответила: сообщение всё равно принято, а экран
    // обязан сказать, ПОЧЕМУ строк нет.
    return {
      findings,
      steps: 0,
      offered: facts.length,
      failed: e instanceof Error ? e.message.slice(0, 120) : "failed",
    }
  }
}

/**
 * Разложить запрос по признакам реестра и вернуть строки таблицы разбора.
 *
 * 🔒 ДОРОГАЯ МОДЕЛЬ ВКЛЮЧАЕТСЯ ТОЛЬКО ТЕМИ ПРИЗНАКАМИ, КОТОРЫЕ ЕЁ ПОПРОСИЛИ
 * (настройка 8 второго слоя). Признаки делятся на две группы, и дорогой прогон
 * случается, лишь когда в реестре есть хоть один признак с `model: "strong"`.
 * Гонять весь разбор сильной моделью из-за одного признака значило бы сделать
 * дорогим каждое сообщение — согласие давали не на это.
 */
export async function projectRequest(request: string): Promise<TaskRow[]> {
  if (!request.trim()) return []

  const facts = toolableFacts(await activeFacts())
  const cheap = facts.filter(f => f.model !== "strong")
  const strong = facts.filter(f => f.model === "strong")

  const runs: Projection[] = []
  if (cheap.length) runs.push(await runProjection(request, cheap, model("cheap")))
  if (strong.length) runs.push(await runProjection(request, strong, model("strong")))

  const findings = runs.flatMap(r => r.findings)
  const failed = runs.find(r => r.failed)?.failed
  const offered = runs.reduce((n, r) => n + r.offered, 0)

  const at = nowMs()
  const rows: TaskRow[] = []

  // 🔒 СТРОКА ПЛАНА ЕСТЬ ВСЕГДА, ДАЖЕ КОГДА НАХОДОК НОЛЬ. «Признаков не
  // нашлось» — законный исход и содержательный ответ (закон владельца,
  // сформулированный отрицанием); молчание на его месте читается как поломка.
  rows.push({
    id: 1,
    kind: "plan",
    phrase: failed
      ? `Разбор не выполнен: ${failed}`
      : findings.length
        ? `Признаков в запросе: ${findings.length} из ${offered} предложенных.`
        : `Признаков не нашлось: ни один из ${offered} к этому запросу не подошёл.`,
    source: "model",
    at,
  })

  // 🔒 ПО СТРОКЕ НА НАХОДКУ, А НЕ НА ПРИЗНАК. Признак, ничего не взявший, строки
  // не получает: таблица показывает, что НАЙДЕНО, а не что существует, — для
  // второго есть реестр.
  findings.forEach((f, i) => {
    rows.push({
      id: rows.length + 1,
      kind: "reveal",
      fact: f.fact,
      payload: f.values,
      // 🛑 ФРАЗА ЗДЕСЬ ЧЕРНОВАЯ И НАЗВАНА ТАКОЙ: человеческую собирает 91-5 из
      // начинки. Пустая строка на её месте выглядела бы поломкой вида.
      phrase: Object.entries(f.values)
        .map(([k, v]) => (k === "value" ? v : `${k}: ${v}`))
        .join("; "),
      source: "model",
      confidence: f.confidence,
      at,
    })
    void i
  })

  return rows
}
