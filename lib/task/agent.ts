import { ToolLoopAgent, isStepCount, type StopCondition, type ToolSet, type LanguageModel } from "ai"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { createOpenAI } from "@ai-sdk/openai"
import { activeFacts } from "@/lib/facts/registry"
import { openAiKey } from "@/lib/openai-key"
import { factTools, toolableFacts, type Finding } from "./tools"
import { phraseOf } from "./phrase"
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

/**
 * До какого шага доводить разбор. Пусто — до конца.
 *
 * 🔒 ЧИТАЕТСЯ ИЗ ФАЙЛА ПО ТОЙ ЖЕ ПРИЧИНЕ, ЧТО И ПАУЗА: приложение собрано
 * отдельным сервером и `.env.local` в окружение процесса не подтягивает.
 */
export function stepLimit(): number {
  const raw = process.env.TASK_DEBUG_STEPS
  if (raw) return Number(raw) || 99
  try {
    const m = readFileSync(join(process.cwd(), ".env.local"), "utf8").match(/^TASK_DEBUG_STEPS=(d+)s*$/m)
    return m ? Number(m[1]) : 99
  } catch {
    return 99
  }
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

/**
 * Наставление агенту.
 *
 * 🛑 «СЕЙЧАС» НАЗЫВАЕТСЯ ВСЛУХ, И ЭТО ОПЛАЧЕНО ИЗМЕРЕНИЕМ 91-5. На «вчера купил
 * чайник за 900 рублей» модель вернула дату **2023-10-06**: текущего дня она не
 * знает и берёт его из своего обучения. **Неверная дата хуже отсутствующей** —
 * запись уезжает в чужой месяц и портит подсчёт, не сообщая об этом ничем.
 *
 * 🔒 ПОЯС ПРИХОДИТ ПАРАМЕТРОМ, А НЕ ЧИТАЕТСЯ ЗДЕСЬ. Этот слой не знает имени
 * своего продукта; пояс знает продукт, он же его и настраивает.
 */
function instructions(now: Date, timeZone: string): string {
  const day = new Intl.DateTimeFormat("ru-RU", {
    timeZone: timeZone || "UTC",
    dateStyle: "full",
    timeStyle: "short",
  }).format(now)
  return [
    `Сейчас ${day} (${timeZone || "UTC"}).`,
    "Относительные сроки — вчера, в воскресенье, через неделю — считай от этого момента",
    "и возвращай полной датой.",
    ...BASE,
  ].join(" ")
}

const BASE = [
  "Тебе дают ОДИН запрос человека целиком и набор инструментов.",
  "Каждый инструмент — это признак: он описывает, что именно он узнаёт и по каким словам.",
  "Спроси у инструментов, что из этого запроса им принадлежит: вызови КАЖДЫЙ, которому в запросе",
  "есть что взять, и передай ему только его значения. Один и тот же кусок запроса может",
  "принадлежать нескольким инструментам сразу — это нормально.",
  "Не вызывай инструмент, которому нечего взять: пустой вызов хуже отсутствия вызова.",
  "Ничего не выдумывай: значение либо сказано, либо прямо следует из сказанного.",
  "Когда все подходящие инструменты вызваны — ответь одной строкой, ничего не пересказывая.",
]

/** Когда и в каком поясе идёт разбор. Пусто — сейчас и UTC. */
export type When = { now?: Date; timeZone?: string }

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
  when: When = {},
): Promise<Projection> {
  const findings: Finding[] = []
  const tools = factTools(facts, f => findings.push(f))

  const agent = new ToolLoopAgent({
    model: llm,
    instructions: instructions(when.now ?? new Date(), when.timeZone ?? ""),
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
/** Короткое имя того, чем спрашивали. Для колонки «Инструкция». */
const INSTRUCTION_LABEL = "Спросить у инструментов реестра, что из запроса им принадлежит"

export async function projectRequest(
  request: string,
  when: When = {},
  from = "",
): Promise<TaskRow[]> {
  if (!request.trim()) return []

  const facts = toolableFacts(await activeFacts())
  // Признак нужен и при сборке фразы: единицы, подписи слотов и их порядок
  // живут в реестре, а не в строке.
  const byKey = new Map(facts.map(f => [f.key, f]))
  const cheap = facts.filter(f => f.model !== "strong")
  const strong = facts.filter(f => f.model === "strong")

  const runs: Projection[] = []
  if (cheap.length) runs.push(await runProjection(request, cheap, model("cheap"), when))
  if (strong.length) runs.push(await runProjection(request, strong, model("strong"), when))

  const findings = runs.flatMap(r => r.findings)
  const failed = runs.find(r => r.failed)?.failed
  const offered = runs.reduce((n, r) => n + r.offered, 0)

  const at = nowMs()
  const rows: TaskRow[] = []

  // 🔒 СТРОКА ПЛАНА ЕСТЬ ВСЕГДА, ДАЖЕ КОГДА НАХОДОК НОЛЬ. «Признаков не
  // нашлось» — законный исход и содержательный ответ (закон владельца,
  // сформулированный отрицанием); молчание на его месте читается как поломка.
  // 🔒 ВТОРАЯ СТРОКА ТАБЛИЦЫ — ПОИСК СООТВЕТСТВИЯ РЕЕСТРУ, И ЕЁ ФОРМУ ЗАДАЛ
  // ВЛАДЕЛЕЦ ДОСЛОВНО: «сообщение от {инструмент строки 1} + {сообщение},
  // соответствует следующим элементам из реестра признаков: {перечисление}».
  // Строка есть ВСЕГДА — даже когда не нашлось ничего: «ничего не подошло» есть
  // содержательный ответ, а пустое место читается как поломка.
  const found = [...new Set(findings.map(f => f.fact))]
  rows.push({
    id: 1,
    kind: "plan",
    phrase: failed
      ? `Разбор не выполнен: ${failed}`
      : `Сообщение от ${from} «${request}» соответствует следующим элементам из реестра признаков: ${found.length ? found.join(", ") : "ни одному из " + offered}.`,
    source: "model",
    instruction: INSTRUCTION_LABEL,
    // 🔒 СЛЕДУЮЩЕЕ ДЕЙСТВИЕ ЕСТЬ ВСЕГДА, И ПЕРВОЕ В НЁМ — СВЯЗЬ С ДРУГИМ
    // СООБЩЕНИЕМ. Слово владельца: «всегда во всех случаях будет действие,
    // которое исследует, было ли в тексте прямое или косвенное указание на то,
    // что это сообщение нужно исследовать в контексте с другим». Остальное
    // зависит от того, что нашлось.
    next: found.length
      ? `Проверить связь с другим сообщением; извлечь значения признаков: ${found.join(", ")}.`
      : "Проверить связь с другим сообщением.",
    at,
  })

  // 🔒 ПО СТРОКЕ НА НАХОДКУ, А НЕ НА ПРИЗНАК. Признак, ничего не взявший, строки
  // не получает: таблица показывает, что НАЙДЕНО, а не что существует, — для
  // второго есть реестр.
  // 🔒 ШАГОВЫЙ ПРЕДЕЛ ОТЛАДКИ. Владелец идёт по разбору шаг за шагом и хочет
  // видеть, как строки появляются по одной. `TASK_DEBUG_STEPS=2` останавливает
  // разбор сразу после строки соответствия реестру.
  if (stepLimit() <= 2) return rows

  findings.forEach((f, i) => {
    rows.push({
      id: rows.length + 1,
      kind: "reveal",
      fact: f.fact,
      payload: f.values,
      // 🔒 ФРАЗА СОБИРАЕТСЯ ИЗ НАЧИНКИ (91-5), А НЕ ПРИХОДИТ ОТ МОДЕЛИ. Второго
      // источника у неё нет: поля `phrase` нет в схеме инструмента, и схема
      // строгая — значит разойтись с данными фраза не может по устройству.
      phrase: phraseOf(byKey.get(f.fact), f.values),
      source: "model",
      confidence: f.confidence,
      at,
    })
    void i
  })

  return rows
}
