import { openAiKey } from "@/lib/openai-key"
import { isKnownZone } from "../timezone"

// ВЕТВЬ «ГДЕ ВЫ»: превратить сказанное человеком в имя зоны IANA.
//
// 🔒 СПРАШИВАЕМ ГОРОД, А НЕ ЗОНУ. «Europe/Madrid» знают программисты; человек
// знает, что живёт в Мадриде. Просить его назвать зону — просить работу, которую
// умеет сделать модель, и получать в ответ «UTC+2», которое врёт полгода из
// двенадцати: со сменой летнего времени сдвиг меняется, а имя зоны — нет.

export async function cityToZone(text: string): Promise<string> {
  const key = openAiKey()
  if (!key) return ""
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.TGDESK_MODEL ?? "gpt-4o-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: [
              "A person names where they live, or their timezone. Answer JSON only:",
              '{"zone":"Area/City"|null}',
              "",
              'Use an IANA zone name: "Мадрид" is Europe/Madrid, "Чикаго" is America/Chicago,',
              '"МСК" is Europe/Moscow, "UTC+2" — pick the most populous zone with that offset now.',
              'If they did not name a place or an offset at all, answer {"zone":null}.',
            ].join(String.fromCharCode(10)),
          },
          { role: "user", content: text.slice(0, 300) },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    })
    if (!res.ok) return ""
    const d = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const zone = String(
      (JSON.parse(d.choices?.[0]?.message?.content ?? "{}") as { zone?: string }).zone ?? "",
    )
    // Имя проверяется платформой, а не доверием: выдуманная зона сломала бы
    // каждое последующее преобразование, и молча.
    return isKnownZone(zone) ? zone : ""
  } catch {
    return ""
  }
}
