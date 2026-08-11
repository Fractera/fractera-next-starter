import { readFileSync } from "node:fs"
import { join } from "node:path"

// Ключ OpenAI приложения — ОДНО место чтения на весь проект.
//
// Читался он в трёх маршрутах тремя почти одинаковыми функциями, и это ровно тот
// случай, когда «почти» дороже дубля: одна из копий однажды научится читать новый
// источник, а две другие продолжат отвечать «ключа нет» — и разбираться в этом
// будут по симптому «в одном месте работает, в другом нет».
//
// Порядок источников: окружение процесса, затем `.env.local` слота. Дальше не
// ищем — ключ службы RAG принадлежит панели, а не приложению клиента.
export function openAiKey(): string {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY
  try {
    const raw = readFileSync(join(process.cwd(), ".env.local"), "utf8")
    return (raw.match(/^OPENAI_API_KEY=(.+)$/m) ?? [])[1]?.trim() ?? ""
  } catch {
    return ""
  }
}
