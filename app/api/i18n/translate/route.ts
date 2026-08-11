import { NextRequest, NextResponse } from "next/server"
import { requireRoles } from "@/lib/auth/require-roles"
import { PROTECTED_GROUP_ROLES } from "@/lib/roles"
import { openAiKey } from "@/lib/openai-key"

// Перевод полей записи — дверь для диалога добавления переводов.
//
// 🔒 ОТДЕЛЬНАЯ ДВЕРЬ, А НЕ ВЫЗОВ ИЗ КОМПОНЕНТА. Ключ OpenAI не попадает в
// браузер ни при каких обстоятельствах: всё, что уходит клиенту, читается любым
// посетителем через вкладку разработчика.
//
// 🔒 МОДЕЛЬ ЗАШИТА ЗДЕСЬ, и это решение владельца: выбирать модель ради перевода
// одного слова — работа вместо ценности. Меняется она в одном месте — этой
// строке.
//
// БЫСТРАЯ, А НЕ РАССУЖДАЮЩАЯ. Перевод — преобразование, а не размышление:
// рассуждающая модель обдумывает каждую строку и платит за это временем и
// токенами владельца. Замер 2026-08-11: прогон двух словарей на 81 язык через
// gpt-5 занял больше двадцати минут там, где хватало минут.
//
// Имя модели сверено с живым списком ключа (2026-08-11): у него есть gpt-5,
// gpt-5-mini, gpt-5-nano, gpt-5-pro. Версии 5.1 в списке НЕТ — зашитое имя
// несуществующей модели даёт отказ на первом же переводе, и отказ этот
// достаётся владельцу, а не тому, кто её вписал. Меняя модель, сверяйтесь со
// списком: /api/openai-models отдаёт его живым.
//
// Роль проверяется: перевод стоит денег ровно как расшифровка речи.

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const MODEL = "gpt-5-mini"
const API = "https://api.openai.com/v1/chat/completions"

type Body = {
  /** Поля как есть: { name: "Apple", description: "…" }. */
  texts?: Record<string, string>
  /** Язык исходных значений. */
  from?: string
  /** Языки, на которые переводим. */
  to?: string[]
}

export async function POST(req: NextRequest) {
  const denied = await requireRoles(req, PROTECTED_GROUP_ROLES.staff)
  if (denied) return denied

  const key = openAiKey()
  // Причина отказа называется КОДОМ, а не прозой: интерфейс по нему показывает
  // нужную подсказку со ссылкой, а не общее «не удалось», после которого
  // человеку некуда идти.
  if (!key) return NextResponse.json({ error: "no-key" }, { status: 503 })

  const body = (await req.json().catch(() => null)) as Body | null
  const texts = body?.texts ?? {}
  const from = body?.from ?? "en"
  const to = (body?.to ?? []).filter(l => l && l !== from)
  if (!Object.keys(texts).length || !to.length) {
    return NextResponse.json({ error: "texts and to are required" }, { status: 400 })
  }

  // Один запрос на ВСЕ языки и ВСЕ поля. Запрос на каждую пару «поле × язык» —
  // это десятки вызовов на одну запись: дороже, дольше и разваливается частично,
  // оставляя половину переводов.
  const prompt = [
    `Translate the values of this JSON object from ${from} into each of these languages: ${to.join(", ")}.`,
    `Return ONLY a JSON object shaped { "<lang>": { "<field>": "<translation>" } } with no commentary.`,
    `Keep the meaning and the register of the original. Do not translate proper names, product codes or URLs.`,
    `Source: ${JSON.stringify(texts)}`,
  ].join("\n")

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
      signal: AbortSignal.timeout(120_000),
    })
    if (!res.ok) {
      // Разбираем ответ OpenAI: «кончились деньги» и «ключ не тот» — разные беды
      // с разными действиями, и человек обязан видеть, какая из них случилась.
      // Общее «не удалось» оставляет его без следующего шага.
      const detail = await res.json().catch(() => null)
      const code = String(detail?.error?.code ?? "")
      if (res.status === 401) return NextResponse.json({ error: "bad-key" }, { status: 401 })
      if (code === "insufficient_quota") return NextResponse.json({ error: "no-funds" }, { status: 402 })
      if (res.status === 429) return NextResponse.json({ error: "rate-limit" }, { status: 429 })
      return NextResponse.json({ error: "upstream", upstreamStatus: res.status }, { status: 502 })
    }
    const data = await res.json()
    const raw = data?.choices?.[0]?.message?.content ?? "{}"
    const parsed = JSON.parse(raw) as Record<string, Record<string, string>>

    // Отдаём только запрошенные языки и только запрошенные поля: модель иногда
    // добавляет от себя, и лишний ключ уехал бы в базу как настоящий перевод.
    const out: Record<string, Record<string, string>> = {}
    for (const lang of to) {
      const got = parsed[lang]
      if (!got) continue
      out[lang] = {}
      for (const field of Object.keys(texts)) {
        if (typeof got[field] === "string") out[lang][field] = got[field]
      }
    }
    return NextResponse.json({ translations: out })
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 })
  }
}
