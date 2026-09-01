import { openAiKey } from "@/lib/openai-key"
import { ask as askKnowledge } from "@/lib/fractera/knowledge"
import type { FactFn, FactFnResult } from "./fn-types"

// ИСПОЛНИТЕЛЬ ОПИСАННЫХ ФУНКЦИЙ (81-8).
//
// 🔒 ОДИН ИСПОЛНИТЕЛЬ НА ВСЕ ПРИЗНАКИ, СОБРАННЫЙ ЗАРАНЕЕ. Он умеет конечное
// число операций и потому безопасен: он не выполняет чужой код, он делает то,
// что умеет, по названным параметрам.
//
// 🛑 ЗДЕСЬ НЕТ И НЕ БУДЕТ `eval`, `new Function`, `import()` по строке и любого
// другого способа исполнить пришедший текст. Это не стиль, а граница: описание
// признака рождается из свободных слов человека через модель, и всё, что она
// напишет, попадает сюда. Единственная защита — не уметь исполнять.

/**
 * 🔒 БЕЛЫЙ СПИСОК ХОСТОВ — ГЛАВНАЯ ЗАЩИТА ЭТОГО ФАЙЛА.
 *
 * Без него описанная функция становится способом заставить наш сервер стучаться
 * куда угодно: во внутреннюю сеть, где слой данных и граф знаний слушают без
 * внешнего замка, или к метаданным машины. Список объявляется здесь; расширяет
 * его агент по слову владельца, а не запись в базе.
 */
const ALLOWED_HOSTS = ["api.open-meteo.com", "api.frankfurter.app", "worldtimeapi.org"]

const MAX_VALUE = 400

/** Хост разрешён? Сравнение по ТОЧНОМУ имени, а не по вхождению. */
function hostAllowed(url: string): boolean {
  try {
    const u = new URL(url)
    // 🔒 ТОЛЬКО HTTPS: обычный http отдаёт запрос и ответ любому по дороге, а
    // сюда однажды поедет ключ в параметре.
    if (u.protocol !== "https:") return false
    // 🔒 СРАВНИВАЕМ ЦЕЛИКОМ. Проверка «содержит api.open-meteo.com» пропустила бы
    // `api.open-meteo.com.evil.example` — классическая дыра в белых списках.
    return ALLOWED_HOSTS.includes(u.hostname)
  } catch {
    return false
  }
}

/**
 * Подстановка именованных значений.
 *
 * 🔒 ИМЕНА ЗАКРЫТЫ, ВЫРАЖЕНИЙ НЕТ. `{lat}`, `{lon}`, `{date}`, `{text}` — и
 * ничего больше. Позволь я произвольное выражение, это снова стало бы
 * исполнением чужого текста, только записанным иначе.
 */
function fill(template: string, ctx: Record<string, string>): string {
  return template.replace(/\{(lat|lon|date|text)\}/g, (_, k: string) =>
    encodeURIComponent(ctx[k] ?? ""),
  )
}

/** Достать поле по пути `current.temperature_2m`. */
function pickField(data: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, data)
}

/**
 * Выполнить описанную функцию признака.
 *
 * 🔒 ОТКАЗ — ЗАКОННЫЙ ИСХОД, А НЕ ПОЛОМКА. Погода не ответила: признак пуст,
 * отказ записан, сообщение принято целиком. Разбор не падает из-за чужого
 * сервера, и это причина, по которой вызывающий получает результат, а не
 * исключение.
 */
export async function runFactFn(
  fn: FactFn,
  ctx: Record<string, string>,
): Promise<FactFnResult> {
  switch (fn.kind) {
    case "http": {
      if (!fn.url || !fn.pick) return { ok: false, reason: "bad-fn" }
      const url = fill(fn.url, ctx)
      if (!hostAllowed(url)) return { ok: false, reason: "host-not-allowed" }
      try {
        const r = await fetch(url, { signal: AbortSignal.timeout(8000) })
        if (!r.ok) return { ok: false, reason: "source-silent" }
        const data = (await r.json()) as unknown
        const v = pickField(data, fn.pick)
        if (v === undefined || v === null) return { ok: false, reason: "no-field" }
        return { ok: true, value: String(v).slice(0, MAX_VALUE) }
      } catch {
        return { ok: false, reason: "source-silent" }
      }
    }

    case "model": {
      if (!fn.prompt) return { ok: false, reason: "bad-fn" }
      const key = openAiKey()
      if (!key) return { ok: false, reason: "no-key" }
      try {
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
          body: JSON.stringify({
            model: process.env.OPENAI_TEXT_MODEL ?? "gpt-4o-mini",
            temperature: 0,
            messages: [
              // 🔒 ПРОМПТ ЧЕЛОВЕКА — ЭТО ДАННЫЕ, А НЕ ИНСТРУКЦИЯ НАМ. Он едет
              // ролью `user`; системную роль держим мы, иначе описание признака
              // стало бы способом переписать поведение продукта.
              {
                role: "system",
                content:
                  "Answer with a single short value and nothing else. No prose, no explanation.",
              },
              { role: "user", content: `${fn.prompt}\n\n${ctx.text ?? ""}`.slice(0, 2000) },
            ],
          }),
          signal: AbortSignal.timeout(20_000),
        })
        if (!r.ok) return { ok: false, reason: "source-silent" }
        const d = (await r.json()) as { choices?: { message?: { content?: string } }[] }
        const v = d.choices?.[0]?.message?.content?.trim() ?? ""
        return v ? { ok: true, value: v.slice(0, MAX_VALUE) } : { ok: false, reason: "no-field" }
      } catch {
        return { ok: false, reason: "source-silent" }
      }
    }

    case "rag": {
      if (!fn.prompt) return { ok: false, reason: "bad-fn" }
      try {
        // 🔒 ГРАФ РАЗЛИЧАЕТ «МЕНЯ НЕТ» И «НЕ ЗНАЮ», И МЫ ТОЖЕ ОБЯЗАНЫ. Служба
        // может быть не установлена вовсе (`available: false`) — это не отказ
        // источника, а его отсутствие; путать их значит однажды искать поломку
        // там, где просто не поставили службу.
        const res = await askKnowledge(`${fn.prompt}\n\n${ctx.text ?? ""}`)
        if (!res.available) return { ok: false, reason: "source-silent" }
        return res.answer
          ? { ok: true, value: res.answer.slice(0, MAX_VALUE) }
          : { ok: false, reason: "no-field" }
      } catch {
        return { ok: false, reason: "source-silent" }
      }
    }
  }
}

/** Список разрешённых хостов — для экрана и для проверки описания. */
export function allowedHosts(): readonly string[] {
  return ALLOWED_HOSTS
}
