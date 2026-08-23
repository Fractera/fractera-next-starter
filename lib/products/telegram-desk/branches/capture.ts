import { openAiKey } from "@/lib/openai-key"
import { nowLocal, timezoneOf } from "../timezone"

// ВЕТВЬ «РАССКАЗ»: человек сообщает, что случилось. Вынуть смысл и разложить.
//
// 🔒 ЗДЕСЬ БОЛЬШЕ НЕТ НИ РАСПИСАНИЯ, НИ ПОДТВЕРЖДЕНИЯ, НИ ПРИЗНАКА ВОПРОСА.
// Их забрал маршрутизатор. Вернуть сюда «заодно ещё одно поле» — значит вернуть
// и болезнь: одна просьба на шесть дел исполняется на пять.

/** Роды записей образца. Агент клиента меняет этот список под своё дело. */
export const ENTRY_KINDS = ["memo", "note", "task", "receipt", "place", "idea"] as const
export type EntryKind = (typeof ENTRY_KINDS)[number]

export type Capture = {
  summary: string
  kind: EntryKind | null
  title: string
  payload: Record<string, unknown> | null
  hasFinancial: boolean
  /** Когда СОБЫТИЕ произошло, YYYY-MM-DD. Пусто — времени в фразе не было. */
  happenedAt: string | null
  /** Признаки: продавец, покупка, стоимость. То, на чём граф строит связи. */
  facets: string[]
  failed: string
}

export const EMPTY_CAPTURE: Capture = {
  summary: "",
  kind: null,
  title: "",
  payload: null,
  hasFinancial: false,
  happenedAt: null,
  facets: [],
  failed: "",
}

function systemPrompt(now: string): string {
  return [
    "You sort one message a person told their own assistant. Answer with JSON only:",
    '{"summary":string,"kind":string|null,"title":string,"payload":object|null,',
    '"has_financial":boolean,"happened_at":string|null,"facets":string[]}',
    "",
    `"kind" is one of: ${ENTRY_KINDS.join(", ")} — or null when nothing fits.`,
    'Use "memo" when they explicitly ask to REMEMBER something ("запомни", "не забудь"):',
    "that is a promise, not a note.",
    '"summary" is one sentence in the SAME language they used.',
    '"title" is at most six words.',
    '"has_financial" is true when money is mentioned: a price, a payment, a salary.',
    '"payload" carries the fields of that kind and nothing else — a receipt has amount',
    "and vendor, a place has an address. Never invent a value that was not said.",
    "",
    `"happened_at" is WHEN IT HAPPENED, as YYYY-MM-DD. Right now it is ${now} UTC.`,
    '"yesterday" is the day before that; "in March" is that month of the nearest past year.',
    "Nothing was said about time — null. Never copy today in just to fill the field:",
    "a wrong date is worse than an empty one, because a wrong one is believable.",
    "",
    '"facets" are two to six short tags naming what this is ABOUT, in their language:',
    "a vendor, a purchase, a price, a city, a promise. They are what a knowledge graph",
    "links on, so name THINGS and ROLES, not feelings.",
    "",
    "🔒 A message starting with [Переслано от: NAME] carries SOMEBODY ELSE'S words.",
    'Put NAME into facets and name them in the summary (NAME told me that...).',
    'Otherwise the question about what NAME said finds nothing later — and that is',
    'the whole reason it was forwarded to you.',
  ].join(String.fromCharCode(10))
}

export async function capture(text: string): Promise<Capture> {
  const key = openAiKey()
  if (!key) return { ...EMPTY_CAPTURE, failed: "no-key" }
  if (!text.trim()) return EMPTY_CAPTURE

  // «Вчера» у человека и «вчера» на сервере расходятся ровно в те часы, когда
  // он чаще всего и пишет: поздно вечером и рано утром.
  const now = nowLocal(timezoneOf())

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.TGDESK_MODEL ?? "gpt-4o-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt(now) },
          { role: "user", content: text.slice(0, 8000) },
        ],
      }),
      signal: AbortSignal.timeout(60_000),
    })
    if (!res.ok) return { ...EMPTY_CAPTURE, failed: `model-${res.status}` }

    const d = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const parsed = JSON.parse(d.choices?.[0]?.message?.content ?? "{}") as Record<string, unknown>

    // Род принимается ТОЛЬКО из списка: модель однажды ответит "expense", и
    // дашборд, фильтрующий по "receipt", молча покажет пустоту.
    const kind = ENTRY_KINDS.includes(parsed.kind as EntryKind) ? (parsed.kind as EntryKind) : null
    const day = String(parsed.happened_at ?? "")

    return {
      summary: String(parsed.summary ?? "").slice(0, 500),
      kind,
      title: String(parsed.title ?? "").slice(0, 120),
      payload:
        parsed.payload && typeof parsed.payload === "object"
          ? (parsed.payload as Record<string, unknown>)
          : null,
      hasFinancial: parsed.has_financial === true,
      happenedAt: /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null,
      facets: Array.isArray(parsed.facets)
        ? parsed.facets.map((f) => String(f).slice(0, 40)).filter(Boolean).slice(0, 8)
        : [],
      failed: "",
    }
  } catch (e) {
    return { ...EMPTY_CAPTURE, failed: e instanceof SyntaxError ? "bad-json" : "unreachable" }
  }
}
