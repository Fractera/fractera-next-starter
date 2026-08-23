import { db } from "@/lib/db"
import { openAiKey } from "@/lib/openai-key"
import { recall } from "@/lib/fractera/vectors"
import { ask } from "@/lib/fractera/knowledge"
import { VECTOR_COLLECTION } from "./ingest"

// ОТВЕТ НА ВОПРОС ПО СОБСТВЕННОЙ ИСТОРИИ.
//
// 🔒 ВЫБОРКА, А НЕ ПОЛНЫЙ ПРОХОД (решение владельца 2026-08-23). Прочитать месяц
// разговоров ради одной фразы можно, и это единственный способ ответить на «что я
// вообще делал в июле» — но платить так за каждый вопрос значит ждать минуты и
// платить десятки раз. Обычный путь собирает четыре дешёвых источника; дорогой
// проход живёт отдельной кнопкой и оседает в tgdesk_digests, чтобы второй раз не
// платить (фаза 556.3, ещё не построена).

/** Сколько последних реплик держат нить разговора. */
const WINDOW = 20
const NEAREST = 8

type Row = {
  direction: string
  text: string
  ai_summary: string | null
  at: string
  happened_unix: number | null
}

export async function answer(question: string): Promise<string> {
  const key = openAiKey()
  if (!key) {
    return "Мне нечем думать: владелец ещё не добавил ключ модели в панели."
  }

  // 1. Нить разговора. Обе стороны: без своих ответов бот переспрашивает то,
  //    что сам сказал минуту назад.
  const recent = (await db
    .prepare(
      `SELECT direction, text, ai_summary, at, happened_unix FROM tgdesk_messages
       ORDER BY at_unix DESC LIMIT ?`,
    )
    .all(WINDOW)) as unknown as Row[]

  // 2. Похожее по смыслу — там, где нить уже не достаёт.
  let similar: string[] = []
  try {
    const hits = await recall({ query: question, collection: VECTOR_COLLECTION, k: NEAREST })
    similar = hits.map((h) => String((h as { text?: string }).text ?? "")).filter(Boolean)
  } catch {
    // Склад молчит — отвечаем тем, что есть. Отказ склада не отменяет разговора.
  }

  // 3. Граф — только по длинным записям, и он может честно ничего не знать.
  let graph = ""
  try {
    const g = await ask(question, "hybrid")
    // "Недоступен" и "ничего не нашёл" — разные вещи, и обе законны: граф может
    // быть выключен, а может честно не знать. В контекст не идёт ни то ни другое.
    if (g.available && g.answer && !/no-context/i.test(g.answer)) graph = g.answer
  } catch {
    /* граф выключен — законное состояние */
  }

  // 4. Числа берутся SQL, а не пересказом модели: «сколько потрачено» — вопрос
  //    к колонке has_financial, и модель тут только мешала бы.
  const money = (await db
    .prepare("SELECT COUNT(*) AS n FROM tgdesk_messages WHERE has_financial = 1")
    .get()) as { n?: number } | undefined

  const context = [
    "RECENT (newest first):",
    ...recent.reverse().map((r) => {
      // 🔒 Дата СОБЫТИЯ, если она известна, важнее даты рассказа: человек говорит
      // "вчера купил", и без этой подстановки модель отвечает днём разговора.
      const when = r.happened_unix
        ? `happened ${new Date(r.happened_unix * 1000).toISOString().slice(0, 10)}, said ${r.at.slice(0, 10)}`
        : r.at.slice(0, 16)
      return `${when} ${r.direction}: ${r.ai_summary || r.text}`
    }),
    similar.length ? "\nRELATED BY MEANING:\n" + similar.join("\n") : "",
    graph ? "\nFROM THE KNOWLEDGE GRAPH:\n" + graph : "",
    `\nMessages mentioning money: ${money?.n ?? 0}`,
  ]
    .filter(Boolean)
    .join("\n")

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
              "You are the person's own assistant, answering from THEIR notes below.",
              "Answer in the language of the question, briefly.",
              "🔒 Never invent a fact that is not in the notes. If the notes do not contain the",
              "answer, say plainly that nothing about it was recorded — that is a useful answer,",
              "an invented one is not.",
            ].join(" "),
          },
          { role: "user", content: `${context}\n\nQUESTION: ${question}` },
        ],
      }),
      signal: AbortSignal.timeout(60_000),
    })
    if (!res.ok) return "Модель не отвечает. Попробуйте через минуту."
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    return data.choices?.[0]?.message?.content?.trim() || "Мне нечего добавить по этому вопросу."
  } catch {
    return "Модель не отвечает. Попробуйте через минуту."
  }
}
