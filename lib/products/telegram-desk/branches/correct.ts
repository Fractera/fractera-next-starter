import { openAiKey } from "@/lib/openai-key"

// ВЕТВЬ «ПОПРАВКА»: человек исправляет то, что продукт ему прочитал.
//
// 🔒 ЗДЕСЬ ВОЗВРАЩАЕТСЯ ТОЛЬКО НАЗВАННОЕ. Поле, которого человек не касался,
// обязано остаться пустым, а не «подтвердиться заново»: поправив дату, он не
// перепроверял сумму, и переписать её значит потерять правку молча.

export type Correction = {
  /** YYYY-MM-DD, если названа новая дата. */
  date: string | null
  /** YYYY-MM-DDTHH:MM, если названо новое время (для напоминаний). */
  when: string | null
  amount: number | null
  currency: string | null
  vendor: string | null
  title: string | null
}

const EMPTY: Correction = { date: null, when: null, amount: null, currency: null, vendor: null, title: null }

export async function extractCorrection(text: string, proposed: string): Promise<Correction> {
  const key = openAiKey()
  if (!key) return EMPTY

  const now = new Date().toISOString().slice(0, 16).replace("T", " ")
  const sys = [
    "A person is CORRECTING something an assistant read back to them. Answer JSON only:",
    '{"date":"YYYY-MM-DD"|null,"when":"YYYY-MM-DDTHH:MM"|null,"amount":number|null,',
    '"currency":string|null,"vendor":string|null,"title":string|null}',
    "",
    `Right now it is ${now} UTC — that is the date AND the clock.`,
    `This is what was read back to them: ${proposed}`,
    "",
    "🔒 Fill ONLY the fields they actually corrected. Everything they did not mention stays null.",
    'Currency as a three-letter code: "евро" is EUR, "долларов" is USD.',
    '"date" is for a receipt or an event that already happened; "when" is for a reminder time.',
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
          { role: "user", content: text.slice(0, 1000) },
        ],
      }),
      signal: AbortSignal.timeout(45_000),
    })
    if (!res.ok) return EMPTY
    const d = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const p = JSON.parse(d.choices?.[0]?.message?.content ?? "{}") as Record<string, unknown>

    const date = String(p.date ?? "")
    const when = String(p.when ?? "").replace(" ", "T")
    const amount = Number(p.amount)
    return {
      date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null,
      when: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(when) ? when.slice(0, 16) : null,
      amount: Number.isFinite(amount) && amount !== 0 ? amount : null,
      currency: /^[A-Za-z]{3}$/.test(String(p.currency ?? "")) ? String(p.currency).toUpperCase() : null,
      vendor: p.vendor ? String(p.vendor).slice(0, 120) : null,
      title: p.title ? String(p.title).slice(0, 120) : null,
    }
  } catch {
    return EMPTY
  }
}
