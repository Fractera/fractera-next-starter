import { db } from "@/lib/db"
import { remember } from "@/lib/fractera/vectors"
import { learn } from "@/lib/fractera/knowledge"
import { understand } from "./understand"

// ПРИЁМ СООБЩЕНИЯ — здесь сообщение расходится по складам и собирается обратно.
//
// Живёт в lib/, а не в маршруте: дверь принимает пуш, страница может позвать то
// же самое рукой, и завтра это же понадобится добору из ящика. Логика в
// обработчике маршрута не переиспользуется ничем.

export const VECTOR_COLLECTION = "tgdesk"
// 🔒 В ГРАФ ЗНАНИЙ ИДЁТ КАЖДОЕ СООБЩЕНИЕ, И ИДЁТ ОНО КОНВЕРТОМ
// (решение владельца 2026-08-23, отменяет порог в 280 знаков).
//
// Здесь стоял порог: короткая реплика в граф не попадала, потому что документ из
// пяти слов раздувает граф и ничего не объясняет. Рассуждение было верным ровно
// до тех пор, пока в граф клали ГОЛЫЙ ТЕКСТ. Владелец предложил другое, и это
// лучше: сообщение оборачивается в конверт, который называет отправителя, канал,
// дату и признаки. Граф питается сущностями и связями между ними — конверт даёт
// ему ровно это, и заодно перестаёт быть коротким.
//
// Цена решения названа честно: каждое сообщение теперь стоит построения графа, и
// на тысяче реплик это заметные деньги. Владелец выбрал полноту.
function envelope(msg: Incoming, u: { summary: string; facets: string[]; happenedAt: string | null }): string {
  const when = new Date(msg.at || Date.now())
  const said = when.toISOString().slice(0, 16).replace("T", " ")
  const lines = [
    `От пользователя ${msg.who || msg.chatId} через канал Telegram ${said} UTC поступило сообщение.`,
  ]
  if (u.happenedAt) lines.push(`Событие произошло ${u.happenedAt}.`)
  if (u.facets.length) lines.push(`Признаки: ${u.facets.join(", ")}.`)
  if (msg.objectType) lines.push(`К сообщению приложен объект рода: ${msg.objectType}.`)
  if (msg.lat != null && msg.lon != null) lines.push(`Место: ${msg.lat}, ${msg.lon}.`)
  if (u.summary) lines.push(`Суть: ${u.summary}`)
  lines.push(`Текст сообщения: ${msg.text}`)
  // Перевод строки кодом, а не escape-последовательностью: этот файл не раз
  // проезжал через цепочку оболочек, и каждая съедала обратный слэш по-своему.
  return lines.join(String.fromCharCode(10))
}

export type Incoming = {
  externalId: string
  at: string
  chatId: string
  who: string
  /** text | voice — чем сообщение БЫЛО до расшифровки. */
  kind: string
  text: string
  lat?: number
  lon?: number
  objectType?: string
  /** Файл у Telegram. Продукт его пока не забирает — долг записан в BACKLOG. */
  fileId?: string
}

export type IngestResult = {
  messageId: number
  duplicate: boolean
  artifacts: { kind: string; ref: string }[]
  understood: boolean
  /** Вопрос это был или рассказ — дверь строит ответ по-разному. */
  isQuestion: boolean
  notes: string[]
}

/** Секунды, а не миллисекунды: по этому полю считают периоды и режут выборки. */
function unix(at: string): number {
  const ms = Date.parse(at)
  return Math.floor((Number.isFinite(ms) ? ms : Date.now()) / 1000)
}

export async function ingest(msg: Incoming): Promise<IngestResult> {
  const notes: string[] = []
  const artifacts: { kind: string; ref: string }[] = []
  // Вложение названо честно даже когда файл не забран: пустая запись о том,
  // что фотография БЫЛА, дороже молчания — по ней видно, чего не хватает.
  if (msg.fileId) notes.push(`file:${msg.objectType ?? "unknown"}:not-fetched`)
  const at = msg.at || new Date().toISOString()

  // 🔒 ИДЕМПОТЕНТНОСТЬ ПЕРВОЙ СТРОКОЙ. Служба повторит доставку, если дверь не
  // ответила вовремя, — а голос, легший в базу дважды, вычищается потом руками.
  const seen = (await db
    .prepare("SELECT id FROM tgdesk_messages WHERE channel = ? AND external_id = ?")
    .get("telegram", msg.externalId)) as { id?: number } | undefined
  if (seen?.id) {
    return {
      messageId: seen.id,
      duplicate: true,
      artifacts: [],
      understood: false,
      isQuestion: false,
      notes: ["duplicate"],
    }
  }

  // 🔒 ИДЕНТИФИКАТОР ЧИТАЕТСЯ ОБРАТНО, А НЕ БЕРЁТСЯ ИЗ ОТВЕТА ВСТАВКИ.
  // Локальная база отдаёт lastInsertRowid, слой данных — только { ok, changes }.
  // Код, написанный по локальной, на сервере молча получил бы NaN и связал
  // артефакты с несуществующим сообщением. Проверено чтением remote-client.
  await db
    .prepare(
      `INSERT INTO tgdesk_messages
         (at_unix, at, direction, channel, chat_id, who, external_id, raw_kind, text, lat, lon, object_type)
       VALUES (?, ?, 'in', 'telegram', ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      unix(at), at, msg.chatId, msg.who, msg.externalId,
      msg.kind === "voice" ? "voice" : "text",
      msg.text, msg.lat ?? null, msg.lon ?? null, msg.objectType ?? null,
    )
  const born = (await db
    .prepare("SELECT id FROM tgdesk_messages WHERE channel = ? AND external_id = ?")
    .get("telegram", msg.externalId)) as { id?: number } | undefined
  const messageId = Number(born?.id ?? 0)
  if (!messageId) throw new Error("tgdesk: строка записана, но не читается обратно")

  // Разбор моделью. Не удался — сообщение уже сохранено, и это главное.
  const u = await understand(msg.text)
  if (u.failed) notes.push(`understand:${u.failed}`)
  if (!u.failed) {
    await db
      .prepare(
        "UPDATE tgdesk_messages SET ai_summary = ?, has_financial = ?, happened_unix = ? WHERE id = ?",
      )
      .run(
        u.summary,
        u.hasFinancial ? 1 : 0,
        // Дата события в секундах — рядом с датой рассказа, а не вместо неё.
        u.happenedAt ? Math.floor(Date.parse(u.happenedAt + "T12:00:00Z") / 1000) : null,
        messageId,
      )
    if (u.kind) {
      await db
        .prepare("INSERT INTO tgdesk_entries (message_id, kind, title, payload) VALUES (?, ?, ?, ?)")
        .run(messageId, u.kind, u.title, u.payload ? JSON.stringify(u.payload) : null)
    }
  }

  // ── Веер по складам ────────────────────────────────────────────────────────
  //
  // 🔒 КАЖДЫЙ СКЛАД — ОТДЕЛЬНАЯ ПОПЫТКА. Векторный склад лежит, граф ещё строится,
  // ключа нет — это не повод потерять остальное. Отказ становится строкой в
  // notes, а не исключением: дверь обязана ответить службе, иначе та повторит
  // доставку и мы будем разбирать одно сообщение вечно.
  const searchable = [u.summary, msg.text].filter(Boolean).join("\n")

  try {
    const v = await remember({
      collection: VECTOR_COLLECTION,
      text: searchable,
      refTable: "tgdesk_messages",
      refId: String(messageId),
    })
    artifacts.push({ kind: "vector", ref: v.id })
  } catch {
    notes.push("vector:failed")
  }

  {
    const r = await learn(envelope(msg, u), `tgdesk/${messageId}`)
    if (r.accepted) {
      // 🔒 Ссылка на граф — ИМЯ источника, а не id документа: движок строит его в
      // фоне и выдаёт свой идентификатор позже. Имя мы задали сами, и по нему
      // документ находится в списке в любой момент.
      artifacts.push({ kind: "rag", ref: `tgdesk/${messageId}` })
    } else {
      notes.push("rag:refused")
    }
  }

  for (const a of artifacts) {
    await db
      .prepare("INSERT OR IGNORE INTO tgdesk_artifacts (message_id, kind, ref) VALUES (?, ?, ?)")
      .run(messageId, a.kind, a.ref)
  }

  return {
    messageId,
    duplicate: false,
    artifacts,
    understood: !u.failed,
    isQuestion: u.isQuestion,
    notes,
  }
}

/** Ответ продукта — такая же строка истории: без неё «последние двадцать» однобоки. */
export async function recordOutgoing(chatId: string, text: string): Promise<void> {
  const now = new Date().toISOString()
  await db
    .prepare(
      `INSERT INTO tgdesk_messages (at_unix, at, direction, channel, chat_id, text)
       VALUES (?, ?, 'out', 'telegram', ?, ?)`,
    )
    .run(unix(now), now, chatId, text)
}
