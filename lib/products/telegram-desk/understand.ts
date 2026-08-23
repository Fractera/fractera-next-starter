import { openAiKey } from "@/lib/openai-key"

// РАЗБОР СООБЩЕНИЯ — единственное место, где продукт думает моделью.
//
// Он отвечает на один вопрос: что человек сказал и куда это положить. Всё
// остальное в двери — механика: записать строку, разложить по складам, ответить.
//
// 🔒 ОДИН ВЫЗОВ, А НЕ ПЯТЬ. Сводка, род записи, заголовок, признак денег, дата
// события и «вопрос это или утверждение» нужны одновременно и об одном тексте.
// Пять вызовов дали бы пять оплат и пять поводов разойтись во мнениях об одной
// фразе.
//
// 🔒 ОТКАЗ МОДЕЛИ НЕ ТЕРЯЕТ СООБЩЕНИЕ. Нет ключа, кончились деньги, служба молчит —
// возвращается пустой разбор, и сообщение всё равно ложится в базу и в векторный
// склад. Потерянная заметка человека дороже несделанной сводки, и заметно это
// становится через месяц, когда искать уже нечего.

/** Роды записей образца. Агент клиента меняет этот список под своё дело. */
// 🔒 РОД memo СТОИТ ПЕРВЫМ, И ЭТО НЕ АЛФАВИТ. Человек, сказавший «запомни»,
// просит не заметку, а обещание: он рассчитывает, что это всплывёт само,
// когда понадобится. В инструкции агента то же слово — команда памяти;
// в продукте личной эффективности оно обязано значить не меньше.
// ✗ 2026-08-23: «Запомни что я бы хотел создать свой Harness» пролежало в
// кольце службы и не попало никуда.
export const ENTRY_KINDS = ["memo", "note", "task", "receipt", "place", "idea"] as const
export type EntryKind = (typeof ENTRY_KINDS)[number]

export type Understanding = {
  /** Пересказ одной фразой — его читает человек в ленте, а не модель. */
  summary: string
  kind: EntryKind | null
  title: string
  /** Поля рода: у чека сумма и продавец, у места адрес. JSON намеренно. */
  payload: Record<string, unknown> | null
  hasFinancial: boolean
  /** Когда СОБЫТИЕ произошло, YYYY-MM-DD. Пусто — времени в фразе не было. */
  happenedAt: string | null
  /** Вопрос к своей истории или рассказ о жизни: ответ строится по-разному. */
  isQuestion: boolean
  /** Признаки сообщения одним-двумя словами: продавец, покупка, стоимость, оргтехника. */
  facets: string[]
  /** Просит поставить напоминание или встречу — с временем, прочитанным из слов. */
  schedule: {
    kind: "event" | "reminder"
    title: string
    when: string
    repeat: "daily" | "weekdays" | "weekly" | "monthly" | null
    remindBefore: number
  } | null
  /** yes — подтверждает предложенное, no — отклоняет, null — не про это. */
  confirmation: "yes" | "no" | null
  /** Разбор не состоялся — причина названа, а не спрятана за пустотой. */
  failed: string
}

const EMPTY: Understanding = {
  summary: "",
  kind: null,
  title: "",
  payload: null,
  hasFinancial: false,
  happenedAt: null,
  isQuestion: false,
  facets: [],
  schedule: null,
  confirmation: null,
  failed: "",
}

// 🔒 СЕГОДНЯШНЯЯ ДАТА ПЕРЕДАЁТСЯ МОДЕЛИ ЯВНО. Без неё «вчера» разрешить не во
// что: модель не знает, какой сегодня день, и либо промолчит, либо угадает год
// обучения. Оплачено первым же живым сообщением — «вчера купил» легло в базу
// временем РАЗГОВОРА, и вопрос «в каком месяце я покупал» отвечался бы неверно.
function systemPrompt(todayIso: string): string {
  return [
    "You sort short personal messages a person dictates or types to their own assistant.",
    "Answer with JSON only, no prose, using exactly these keys:",
    '{"summary":string,"kind":string|null,"title":string,"payload":object|null,',
    '"has_financial":boolean,"happened_at":string|null,"is_question":boolean,"facets":string[],' +
      '"schedule":object|null,"confirmation":"yes"|"no"|null}',
    `"kind" is one of: ${ENTRY_KINDS.join(", ")} — or null when nothing fits.`,
    'Use "memo" when the person explicitly asks to REMEMBER something',
    '("запомни", "remember this", "не забудь") — that is a promise, not a note.',
    '"summary" is one sentence in the SAME language the person used.',
    '"title" is at most six words.',
    '"has_financial" is true when money is mentioned: a price, a payment, a receipt, a salary.',
    '"payload" carries the fields of that kind and nothing else — a receipt has amount and vendor,',
    "a place has address, a task has due when it was said. Never invent a value that was not said.",
    "",
    '"happened_at" is WHEN THE EVENT HAPPENED, as YYYY-MM-DD.',
    `Today is ${todayIso}. "yesterday" is the day before that, "last Monday" is a real date,`,
    '"in March" is that month of the nearest past year. Nothing was said about time — null.',
    "Never copy today into it just to fill the field: a wrong date is worse than an empty one,",
    "because a wrong one is believable.",
    "",
    '"facets" are two to six short tags naming what the message is ABOUT, in the language',
    'the person used: a vendor, a purchase, a price, a city, office equipment, a promise.',
    'They are what a knowledge graph links on, so name THINGS and ROLES, not feelings.',
    '',
    '"schedule" is set ONLY when the person asks to be reminded or to book something:',
    '{"kind":"reminder"|"event","title":string,"when":"YYYY-MM-DDTHH:MM",',
    '"repeat":"daily"|"weekdays"|"weekly"|"monthly"|null,"remind_before":number}.',
    '"when" is your best reading of the words; it will be read back for confirmation,',
    'so read it as precisely as you can — but never leave it empty, guess the likely one.',
    '"remind_before" is minutes of advance warning when asked ("напомни за час" = 60), else 0.',
    '',
    '"confirmation" is "yes" when the whole message is agreement ("да", "ставь", "верно"),',
    '"no" when it is refusal ("нет", "отмени"), null otherwise.',
    '',
    '"is_question" is true when the person ASKS about their own history',
    '("what did I promise", "how much did I spend"), false when they TELL you something happened.',
  ].join("\n")
}

// Расписание принимается только в строгой форме: время прозой («на неделе»)
// не поставишь в календарь, а половинчатая запись хуже отсутствующей.
const REPEATS = ["daily", "weekdays", "weekly", "monthly"] as const
function readSchedule(v: unknown): Understanding["schedule"] {
  if (!v || typeof v !== "object") return null
  const o = v as Record<string, unknown>
  const when = String(o.when ?? "")
  if (!/^d{4}-d{2}-d{2}Td{2}:d{2}$/.test(when)) return null
  const repeat = REPEATS.includes(o.repeat as (typeof REPEATS)[number])
    ? (o.repeat as (typeof REPEATS)[number])
    : null
  return {
    kind: o.kind === "event" ? "event" : "reminder",
    title: String(o.title ?? "").slice(0, 200) || "без названия",
    when,
    repeat,
    remindBefore: Math.max(0, Math.min(1440, Number(o.remind_before ?? 0) || 0)),
  }
}

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
          { role: "system", content: systemPrompt(new Date().toISOString().slice(0, 10)) },
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

    // Дата принимается только в строгой форме. Проза вроде "на прошлой неделе"
    // легла бы в колонку строкой и сломала бы любое сравнение по времени.
    const day = String(parsed.happened_at ?? "")
    const happenedAt = /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null

    return {
      summary: String(parsed.summary ?? "").slice(0, 500),
      kind,
      title: String(parsed.title ?? "").slice(0, 120),
      payload:
        parsed.payload && typeof parsed.payload === "object"
          ? (parsed.payload as Record<string, unknown>)
          : null,
      hasFinancial: parsed.has_financial === true,
      happenedAt,
      isQuestion: parsed.is_question === true,
      facets: Array.isArray(parsed.facets)
        ? parsed.facets.map((f) => String(f).slice(0, 40)).filter(Boolean).slice(0, 8)
        : [],
      schedule: readSchedule(parsed.schedule),
      confirmation:
        parsed.confirmation === "yes" || parsed.confirmation === "no" ? parsed.confirmation : null,
      failed: "",
    }
  } catch (e) {
    return { ...EMPTY, failed: e instanceof SyntaxError ? "bad-json" : "unreachable" }
  }
}
