import { openAiKey } from "@/lib/openai-key"

// РАЗБОР СООБЩЕНИЯ — единственное место, где продукт думает моделью.
//
// Он отвечает на один вопрос: что человек сказал и куда это положить. Всё
// остальное в двери — механика: записать строку, разложить по складам, ответить.
//
// 🔒 ОДИН ВЫЗОВ, А НЕ ПЯТЬ. Сводка, род записи, заголовок, признак денег и поля
// нужны одновременно и об одном тексте. Пять вызовов дали бы пять оплат и пять
// поводов разойтись во мнениях об одной фразе.
//
// 🔒 ОТКАЗ МОДЕЛИ НЕ ТЕРЯЕТ СООБЩЕНИЕ. Нет ключа, кончились деньги, служба молчит —
// возвращается пустой разбор, и сообщение всё равно ложится в базу и в векторный
// склад. Потерянная заметка человека дороже несделанной сводки, и заметно это
// становится через месяц, когда искать уже нечего.

/** Роды записей образца. Агент клиента меняет этот список под своё дело. */
export const ENTRY_KINDS = ["note", "task", "receipt", "place", "idea"] as const
export type EntryKind = (typeof ENTRY_KINDS)[number]

export type Understanding = {
  /** Пересказ одной фразой — его читает человек в ленте, а не модель. */
  summary: string
  kind: EntryKind | null
  title: string
  /** Поля рода: у чека сумма и продавец, у места адрес. JSON намеренно. */
  payload: Record<string, unknown> | null
  hasFinancial: boolean
  /** Разбор не состоялся — причина названа, а не спрятана за пустотой. */
  failed: string
}

const EMPTY: Understanding = {
  summary: "",
  kind: null,
  title: "",
  payload: null,
  hasFinancial: false,
  failed: "",
}

const SYSTEM = [
  "You sort short personal messages a person dictates or types to their own assistant.",
  "Answer with JSON only, no prose, using exactly these keys:",
  '{"summary":string,"kind":string|null,"title":string,"payload":object|null,"has_financial":boolean}',
  `"kind" is one of: ${ENTRY_KINDS.join(", ")} — or null when nothing fits.`,
  '"summary" is one sentence in the SAME language the person used.',
  '"title" is at most six words.',
  '"has_financial" is true when money is mentioned: a price, a payment, a receipt, a salary.',
  '"payload" carries the fields of that kind and nothing else — a receipt has amount and vendor,',
  "a place has address, a task has due when it was said. Never invent a value that was not said.",
].join("\n")

export async function understand(text: string): Promise<Understanding> {
  const key = openAiKey()
  if (!key) return { ...EMPTY, failed: "no-key" }
  if (!text.trim()) return EMPTY

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.TGDESK_MODEL ?? "gpt-4o-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: text.slice(0, 8000) },
        ],
      }),
      signal: AbortSignal.timeout(60_000),
    })
    if (!res.ok) return { ...EMPTY, failed: `model-${res.status}` }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const raw = data.choices?.[0]?.message?.content ?? ""
    const parsed = JSON.parse(raw) as Record<string, unknown>

    // Род принимается ТОЛЬКО из списка: модель однажды ответит "expense", и
    // дашборд, фильтрующий по "receipt", молча покажет пустоту.
    const kind = ENTRY_KINDS.includes(parsed.kind as EntryKind) ? (parsed.kind as EntryKind) : null

    return {
      summary: String(parsed.summary ?? "").slice(0, 500),
      kind,
      title: String(parsed.title ?? "").slice(0, 120),
      payload:
        parsed.payload && typeof parsed.payload === "object"
          ? (parsed.payload as Record<string, unknown>)
          : null,
      hasFinancial: parsed.has_financial === true,
      failed: "",
    }
  } catch (e) {
    return { ...EMPTY, failed: e instanceof SyntaxError ? "bad-json" : "unreachable" }
  }
}
