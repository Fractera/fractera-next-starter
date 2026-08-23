import { openAiKey } from "@/lib/openai-key"

// ВЕТВЬ «РАСПИСАНИЕ»: вынуть из слов момент, когда должно сработать.
//
// 🔒 ПРОМПТ ЗДЕСЬ КОРОТКИЙ НАМЕРЕННО, И ЭТО ДОКАЗАНО, А НЕ ВЫВЕДЕНО. Ровно этот
// текст, вызванный напрямую, разобрал «через одну минуту» до минуты; он же,
// вложенный в большую инструкцию, переставал заполнять поле вовсе.

export type Repeat = "daily" | "weekdays" | "weekly" | "monthly" | null

export type Schedule = {
  kind: "event" | "reminder"
  title: string
  /** ISO без зоны: 2026-08-24T10:00. */
  when: string
  repeat: Repeat
  /** За сколько минут предупредить заранее. 0 — не предупреждать. */
  remindBefore: number
}

const REPEATS = ["daily", "weekdays", "weekly", "monthly"] as const

/**
 * Приём терпимый к форме и строгий к смыслу.
 *
 * ✗ Модель верна по существу и вольна в записи: вернёт секунды, вернёт `Z`,
 * поставит пробел вместо `T`. Отбрасывать из-за этого целое намерение человека
 * значит менять его просьбу на молчание ради красоты регулярного выражения.
 */
export function readSchedule(v: unknown): Schedule | null {
  if (!v || typeof v !== "object") return null
  const o = v as Record<string, unknown>
  const raw = String(o.when ?? "").trim().replace(" ", "T")
  const m = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(raw)
  if (!m) return null
  return {
    kind: o.kind === "event" ? "event" : "reminder",
    title: String(o.title ?? "").slice(0, 200) || "без названия",
    when: `${m[1]}T${m[2]}`,
    repeat: REPEATS.includes(o.repeat as (typeof REPEATS)[number])
      ? (o.repeat as (typeof REPEATS)[number])
      : null,
    remindBefore: Math.max(0, Math.min(1440, Number(o.remind_before ?? 0) || 0)),
  }
}

export async function extractSchedule(text: string): Promise<Schedule | null> {
  const key = openAiKey()
  if (!key) return null

  // 🔒 ЧАСЫ, А НЕ ТОЛЬКО ДАТА. ✗ здесь стояла одна дата, и «через минуту» было
  // невычислимо: чтобы назвать час и минуту, надо знать, который час сейчас.
  const now = new Date().toISOString().slice(0, 16).replace("T", " ")

  const sys = [
    "You read one message and answer with JSON only.",
    `Right now it is ${now} UTC — that is the date AND the clock.`,
    'Answer {"schedule":{"kind":"reminder"|"event","title":string,"when":"YYYY-MM-DDTHH:MM",',
    '"repeat":"daily"|"weekdays"|"weekly"|"monthly"|null,"remind_before":number}}.',
    '"when" is the moment it must fire, computed from the clock above.',
    '"remind_before" is minutes of advance warning when asked ("за час" = 60), else 0.',
    '"title" is what has to be done, at most six words, in the person\'s language.',
    'If the message is not such a request, answer {"schedule":null}.',
  ].join(String.fromCharCode(10))

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.TGDESK_MODEL ?? "gpt-4o-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: sys },
          { role: "user", content: text.slice(0, 2000) },
        ],
      }),
      signal: AbortSignal.timeout(45_000),
    })
    if (!res.ok) return null
    const d = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const parsed = JSON.parse(d.choices?.[0]?.message?.content ?? "{}") as Record<string, unknown>
    return readSchedule(parsed.schedule)
  } catch {
    return null
  }
}
