import { openAiKey } from "@/lib/openai-key"
import { PERSONA } from "../persona"

// ВЕТВЬ «О СЕБЕ»: кто ты, что умеешь, как работаешь.
//
// 🔒 ЭТА ВЕТВЬ НЕ ХОДИТ В БАЗУ, И В ЭТОМ ВЕСЬ СМЫСЛ ЕЁ СУЩЕСТВОВАНИЯ.
// ✗ раньше «кто ты такой» шло общим путём: поднимались двадцать последних
// сообщений, искались вектора, опрашивался граф — и ассистент отвечал «ничего
// об этом не было записано», потому что искал СЕБЯ в чужих заметках.

export async function meta(question: string): Promise<string> {
  const key = openAiKey()
  // Нет ключа — личность всё равно известна: она в коде, а не в модели.
  if (!key) return PERSONA.split(String.fromCharCode(10))[0]

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.TGDESK_MODEL ?? "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: [
              PERSONA,
              "",
              "Человек спрашивает о ТЕБЕ. Ответь из сказанного выше, коротко, своими словами.",
              "Ничего не добавляй сверх: возможности, которых здесь нет, ты не умеешь.",
            ].join(String.fromCharCode(10)),
          },
          { role: "user", content: question.slice(0, 500) },
        ],
      }),
      signal: AbortSignal.timeout(45_000),
    })
    if (!res.ok) return PERSONA.split(String.fromCharCode(10))[0]
    const d = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    return d.choices?.[0]?.message?.content?.trim() || PERSONA.split(String.fromCharCode(10))[0]
  } catch {
    return PERSONA.split(String.fromCharCode(10))[0]
  }
}
