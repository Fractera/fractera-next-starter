import { openAiKey } from "@/lib/openai-key"

// ШАГ ПЕРВЫЙ: ЧТО ЭТО ЗА ПРОСЬБА. Один вызов, один ответ — имя ветви.
//
// 🔒 ЗАЧЕМ ОТДЕЛЬНЫЙ ШАГ (решение владельца 2026-08-23). Здесь стояла одна
// инструкция, просившая модель сделать шесть дел разом: пересказать, определить
// род, вынуть поля, поставить флаг денег, разрешить дату, распознать вопрос и
// подтверждение. Исполнялось на пять из шести.
//
// ✗ Четыре просьбы подряд «напомни через минуту» не доехали до календаря: модель
// не ошибалась и не отказывалась — она просто НЕ ЗАПОЛНЯЛА одно поле. Ни ошибки,
// ни отказа, просто отсутствующий ключ. Тот же вопрос коротким промптом
// отвечался безошибочно. Ветвление стало частью логики, а не строчкой в промпте.
//
// 🔒 МАРШРУТИЗАТОР ВОЗВРАЩАЕТ ТОЛЬКО ВЕТВЬ. Соблазн «заодно верни и сводку» и
// есть та самая болезнь: как только у вызова появляется второе дело, одно из двух
// начинает пропадать — и пропадает молча.

export const INTENTS = ["capture", "question", "schedule", "confirm", "meta", "command"] as const
export type Intent = (typeof INTENTS)[number]

const SYSTEM = [
  "Classify ONE message from a person to their personal assistant. Answer JSON only:",
  '{"intent":"capture"|"question"|"schedule"|"confirm"|"meta"|"command"}',
  "",
  '"schedule" — asks to be reminded or to put something in the calendar. Wins over',
  "everything else: a message can both tell you something and ask to be reminded.",
  '"confirm" — the message is NOTHING but agreement or refusal ("да", "нет", "ставь", "ok").',
  '"question" — asks about their own life: what they bought, promised, spent, when it was.',
  '"meta" — asks about YOU: who you are, what you can do, how you work.',
  '"command" — starts with a slash.',
  '"capture" — everything else: they are telling you something happened.',
].join("\n")

/**
 * Ветвь по тексту. Не удалось спросить — `capture`: рассказ сохраняется всегда,
 * а неверно угаданная ветвь стоит одного лишнего ответа, тогда как потерянное
 * сообщение стоит доверия.
 */
export async function routeIntent(text: string): Promise<Intent> {
  const t = text.trim()
  // Два случая решаются без модели: платить за них незачем.
  if (t.startsWith("/")) return "command"
  if (!t) return "capture"

  const key = openAiKey()
  if (!key) return "capture"

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
          { role: "user", content: t.slice(0, 1200) },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) return "capture"
    const d = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const parsed = JSON.parse(d.choices?.[0]?.message?.content ?? "{}") as Record<string, unknown>
    return INTENTS.includes(parsed.intent as Intent) ? (parsed.intent as Intent) : "capture"
  } catch {
    return "capture"
  }
}
