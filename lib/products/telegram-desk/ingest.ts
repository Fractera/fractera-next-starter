import { db } from "@/lib/db"
import { remember } from "@/lib/fractera/vectors"
import { learn } from "@/lib/fractera/knowledge"
import { understand, type Understanding } from "./understand"
import { takeFile } from "./branches/files"
import { getAppConfig } from "@/config/app-config"
import { waitingLabel } from "./calendar"
import { timezoneOf } from "./timezone"

// ПРИЁМ СООБЩЕНИЯ — здесь сообщение расходится по складам и собирается обратно.
//
// Живёт в lib/, а не в маршруте: дверь принимает пуш, страница может позвать то
// же самое рукой, и завтра это же понадобится добору из ящика. Логика в
// обработчике маршрута не переиспользуется ничем.

export const VECTOR_COLLECTION = "tgdesk"

// 🔒 ИСТОЧНИК ГРАФА НАЧИНАЕТСЯ С ПРОСТРАНСТВА ИМЁН, И ЭТО НЕ УКРАШЕНИЕ.
// В один граф пишут все: этот продукт, будущие продукты сервера, документы,
// которые владелец грузит руками в панели. Без приставки они смешиваются, и
// на вопрос о покупке всплывает абзац из чужой инструкции — похожий по словам
// и не имеющий отношения к жизни человека.
//
// Приставка работает в обе стороны: по ней документы канала находятся списком
// и удаляются одной операцией, когда человек просит забыть переписку.
export const RAG_NAMESPACE = "telegram"
const ragSource = (messageId: number) => `${RAG_NAMESPACE}/msg-${messageId}`
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
function envelope(
  msg: Incoming,
  u: { summary: string; facets: string[]; happenedAt: string | null },
  files: { kind: string; text: string }[],
  before: string,
): string {
  const when = new Date(msg.at || Date.now())
  const said = when.toISOString().slice(0, 16).replace("T", " ")
  const lines = [
    `Источник: ${RAG_NAMESPACE}. От пользователя ${msg.who || msg.chatId} через канал Telegram ${said} UTC поступило сообщение.`,
  ]
  // 🔒 АВТОР СЛОВ И ТОТ, КТО ИХ ПРИСЛАЛ, — РАЗНЫЕ ЛЮДИ. Пересланное голосовое
  // сказал не владелец; записать его как слова владельца значит потерять
  // человека, о котором потом и спросят: «что мне говорил Ковальчук».
  if (msg.forwardedFrom) lines.push(`Это сообщение ПЕРЕСЛАНО. Автор слов: ${msg.forwardedFrom}.`)
  if (before) lines.push(`Связано с предыдущим сообщением: ${before}`)
  if (u.happenedAt) lines.push(`Событие произошло ${u.happenedAt}.`)
  if (u.facets.length) lines.push(`Признаки: ${u.facets.join(", ")}.`)
  if (msg.objectType) lines.push(`К сообщению приложен объект рода: ${msg.objectType}.`)
  // Прочитанное из файла идёт в граф ВМЕСТЕ с сообщением, а не отдельным
  // документом: снимок чека и слова о нём — одно событие, и разорванные
  // надвое они перестают находиться друг через друга.
  for (const f of files) {
    if (f.text) lines.push(`Содержимое вложения (${f.kind}): ${f.text}`)
  }
  if (msg.lat != null && msg.lon != null) lines.push(`Место: ${msg.lat}, ${msg.lon}.`)
  if (u.summary) lines.push(`Суть: ${u.summary}`)
  if (msg.text) lines.push(`Текст сообщения: ${msg.text}`)
  else lines.push("Своих слов человек не написал — смысл на вложении.")
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
  /** Файл у Telegram. */
  fileId?: string
  /** От кого переслано. Пусто — человек написал это сам. */
  forwardedFrom?: string
}

export type IngestResult = {
  messageId: number
  duplicate: boolean
  artifacts: { kind: string; ref: string }[]
  /** Сводка, которая ЛЕГЛА В БАЗУ. Её же показывает карточка — это одно и то же. */
  summary: string
  kind: string | null
  payload: Record<string, unknown> | null
  happenedAt: string | null
  /** Валюта записи и признак того, что она подставлена из настроек. */
  currency: string
  currencyFromConfig: boolean
  /** Дату не прочитали и поставили сегодняшнюю — человек обязан это увидеть. */
  dateFromToday: boolean
  /** ТОТ САМЫЙ конверт, что ушёл в граф знаний. Его же видит человек. */
  envelope: string
  /** Что прочитано с вложения, дословно. */
  fileText: string
  /** От кого переслано — чтобы карточка назвала автора слов. */
  forwardedFrom: string
  /** Что стало с вложением, человеческими словами. Пусто — вложения не было. */
  fileRead: string
  /** Денежная запись ждёт согласия. */
  needsConfirm: boolean
  understood: boolean
  /** Ветвь, по которой пошло сообщение: дверь строит ответ по ней. */
  intent: Understanding["intent"]
  /** Просят поставить напоминание — с временем, прочитанным из слов. */
  schedule: Understanding["schedule"]
  /** Ответ на предыдущий вопрос продукта: «да» или «нет». */
  confirmation: Understanding["confirmation"]
  notes: string[]
}

// 🔒 ТРИ МИНУТЫ — ОКНО СВЯЗКИ, И ЧИСЛО ВЫБРАНО НЕ НАУГАД.
// Больше — и в одну связку попадёт вся переписка за вечер; меньше — не попадёт
// пересылка, перед которой человек набирал пояснение руками.
//
// Связь по времени, а не по `reply_to`: Telegram умеет точную ссылку, но люди
// ею не пользуются — они шлют подряд.
const BUNDLE_WINDOW_SEC = 180

type Neighbour = { id: number; bundle: number | null; summary: string; text: string }

/** Предыдущее сообщение того же чата, если оно пришло только что. */
async function previousNear(chatId: string, atUnix: number): Promise<Neighbour | null> {
  const row = (await db
    .prepare(
      `SELECT id, bundle, ai_summary, text FROM tgdesk_messages
        WHERE chat_id = ? AND direction = 'in' AND at_unix >= ?
        ORDER BY id DESC LIMIT 1`,
    )
    .get(chatId, atUnix - BUNDLE_WINDOW_SEC)) as
    | { id?: number; bundle?: number | null; ai_summary?: string | null; text?: string }
    | undefined
  if (!row?.id) return null
  return {
    id: row.id,
    bundle: row.bundle ?? null,
    summary: String(row.ai_summary ?? ""),
    text: String(row.text ?? ""),
  }
}

/** Метка вопроса о поясе: узнаётся по тексту нашего же последнего ответа. */
// Рода артефактов переехали в свой лист (81-1) — `ingest.ts` тянет базу, а имена
// родов нужны и тем, кому база не нужна. Реэкспорт оставлен: сюда за ними ходят.
export { ARTIFACT_KINDS, type ArtifactKind } from "./artifact-kinds"
import type { ArtifactKind } from "./artifact-kinds"

export const WHERE_MARK = "часовой пояс"

async function lastWasWhereQuestion(chatId: string): Promise<boolean> {
  const row = (await db
    .prepare(
      `SELECT text FROM tgdesk_messages
        WHERE chat_id = ? AND direction = 'out' ORDER BY id DESC LIMIT 1`,
    )
    .get(chatId)) as { text?: string } | undefined
  return String(row?.text ?? "").includes(WHERE_MARK)
}

/** Пояс известен? Дверь спрашивает об этом до того, как ставить напоминание. */
export function timezoneKnown(): boolean {
  return Boolean(timezoneOf())
}

/** Секунды, а не миллисекунды: по этому полю считают периоды и режут выборки. */
function unix(at: string): number {
  const ms = Date.parse(at)
  return Math.floor((Number.isFinite(ms) ? ms : Date.now()) / 1000)
}

export async function ingest(msg: Incoming): Promise<IngestResult> {
  const notes: string[] = []
  const artifacts: { kind: ArtifactKind; ref: string }[] = []
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
      summary: "",
      kind: null,
      payload: null,
      happenedAt: null,
      currency: "",
      currencyFromConfig: false,
      dateFromToday: false,
      envelope: "",
      fileText: "",
      forwardedFrom: "",
      fileRead: "",
      needsConfirm: false,
      artifacts: [],
      understood: false,
      intent: "capture",
      schedule: null,
      confirmation: null,
      notes: ["duplicate"],
    }
  }

  // 🔒 СОСЕД ИЩЕТСЯ ДО ВСТАВКИ. После неё запрос «последнее сообщение чата»
  // нашёл бы это же самое сообщение и связал бы его само с собой.
  const neighbour = await previousNear(msg.chatId, unix(at))

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

  // Своя связка, если соседа нет; иначе наследуем его.
  const bundle = neighbour ? (neighbour.bundle ?? neighbour.id) : messageId
  await db.prepare("UPDATE tgdesk_messages SET bundle = ? WHERE id = ?").run(bundle, messageId)

  // ── Вложение забирается ДО разбора ─────────────────────────────────────
  // Прочитанное с картинки — часть того, что человек сказал. Разобрать сперва
  // подпись, а картинку приложить потом значит понять половину: «вот чек»
  // без суммы это не запись о трате, а бессмысленная строка.
  const files: { kind: string; text: string }[] = []
  let fileRead = ""
  if (msg.fileId) {
    const f = await takeFile(msg.fileId, messageId, msg.objectType)
    if (f?.name) {
      artifacts.push({ kind: "media", ref: f.name })
      if (f.text) {
        files.push({ kind: f.kind, text: f.text })
        fileRead = f.kind === "image" ? "фотография прочитана" : f.kind === "audio" ? "звук расшифрован" : "документ прочитан"
      } else {
        // Файл сохранён, но не прочитан — это ПОЛОВИНА успеха, и человеку
        // говорят именно половину: «сохранил» без «прочитал» звучит иначе.
        fileRead = "сохранено, прочитать не удалось"
        notes.push(`file:${f.kind}:${f.failed || "not-read"}`)
      }
    } else {
      fileRead = "вложение не удалось забрать"
      notes.push(`file:${msg.objectType ?? "unknown"}:not-fetched`)
    }
  }

  // Разбор моделью видит и подпись, и прочитанное из вложения.
  const spoken = [
    // Автор идёт первой строкой: модель обязана понять, ЧЬИ это слова, прежде
    // чем начнёт их пересказывать.
    msg.forwardedFrom ? `[Переслано от: ${msg.forwardedFrom}]` : "",
    // Предыдущее сообщение связки — контекст, а не содержимое: оно объясняет,
    // ЧЬИ это слова и о чём речь, но само уже записано своей строкой.
    neighbour ? `[Предыдущее сообщение, ${BUNDLE_WINDOW_SEC} с назад: ${neighbour.summary || neighbour.text}]` : "",
    msg.text,
    ...files.map((f) => f.text),
  ]
    .filter(Boolean)
    .join(String.fromCharCode(10))
  // 🔒 МАРШРУТИЗАТОР ДОЛЖЕН ЗНАТЬ, ЧТО ЧЕГО-ТО ЖДУТ. «20 августа» само по себе —
  // заметка; оно же в ответ на «дату не разобрал» — поправка. Смысл фразы задаёт
  // не фраза, а вопрос, заданный секунду назад.
  // Не «ждёт ли что-то», а ЧТО именно ждёт: слабой модели нужен предмет, иначе
  // «12:00» заводит вторую встречу вместо поправки первой.
  const awaiting = await waitingLabel(msg.chatId)

  // 🔒 «Я в Мадриде» — это ответ на наш вопрос, только если вопрос был задан
  // последним. Иначе это заметка о поездке, и записать её поясом значило бы
  // переставить человеку все напоминания из-за одной фразы.
  const askedWhere = await lastWasWhereQuestion(msg.chatId)
  const u = await understand(spoken, awaiting, askedWhere)
  let currency = ""
  let currencyFromConfig = false
  let needsConfirm = false
  let dateFromToday = false
  let happenedAt = u.happenedAt
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
    // 🔒 ЕСЛИ ЭТО НАПОМИНАНИЕ — ЗАПИСЬ СМЫСЛА НЕ ЗАВОДИТСЯ. Иначе одно и то же
    // дело живёт в двух местах: строкой в списке задач и строкой в календаре, и
    // выполнить его придётся дважды, чтобы оба списка стали пустыми.
    if (u.kind && !u.schedule) {
      // 🔒 ВАЛЮТА: с чека, а не видно — из настроек проекта, и об этом
      // говорится вслух. Молча подставленная валюта превращает чужие доллары
      // в свои евро, и заметно это станет на годовом подсчёте.
      const onReceipt = String((u.payload?.currency as string) ?? "").trim().toUpperCase()
      const hasMoney = u.payload?.amount !== undefined && u.payload?.amount !== null
      if (hasMoney && !onReceipt) {
        currency = String(getAppConfig().commerce?.currency ?? "").toUpperCase()
        currencyFromConfig = Boolean(currency)
      } else {
        currency = onReceipt
      }
      // Деньги ждут согласия — та же дисциплина, что у времени в календаре.
      needsConfirm = Boolean(hasMoney)

      // 🔒 У ЧЕКА ДАТА ОБЯЗАТЕЛЬНА (решение владельца 2026-08-23). Трата без
      // даты не попадает ни в один подсчёт по периоду — то есть её как бы нет.
      // Не прочитали — ставим сегодняшнюю и ГОВОРИМ об этом: человек поправит
      // одной фразой, а молча поставленная дата тихо исказит месяц.
      if (hasMoney && !happenedAt) {
        happenedAt = at.slice(0, 10)
        dateFromToday = true
        await db
          .prepare("UPDATE tgdesk_messages SET happened_unix = ? WHERE id = ?")
          .run(Math.floor(Date.parse(happenedAt + "T12:00:00Z") / 1000), messageId)
      }
      await db
        .prepare(
          "INSERT INTO tgdesk_entries (message_id, kind, title, payload, status, currency) VALUES (?, ?, ?, ?, ?, ?)",
        )
        .run(
          messageId,
          u.kind,
          u.title,
          u.payload ? JSON.stringify(u.payload) : null,
          needsConfirm ? "pending" : "confirmed",
          currency || null,
        )
    }
  }

  // ── Веер по складам ────────────────────────────────────────────────────────
  //
  // 🔒 КАЖДЫЙ СКЛАД — ОТДЕЛЬНАЯ ПОПЫТКА. Векторный склад лежит, граф ещё строится,
  // ключа нет — это не повод потерять остальное. Отказ становится строкой в
  // notes, а не исключением: дверь обязана ответить службе, иначе та повторит
  // доставку и мы будем разбирать одно сообщение вечно.
  const searchable = [u.summary, msg.text, ...files.map((f) => f.text)]
    .filter(Boolean)
    .join(String.fromCharCode(10))

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

  const letter = envelope(msg, { ...u, happenedAt }, files, neighbour?.summary || neighbour?.text || "")
  {
    const r = await learn(letter, ragSource(messageId))
    if (r.accepted) {
      // 🔒 Ссылка на граф — ИМЯ источника, а не id документа: движок строит его в
      // фоне и выдаёт свой идентификатор позже. Имя мы задали сами, и по нему
      // документ находится в списке в любой момент.
      artifacts.push({ kind: "rag", ref: ragSource(messageId) })
    } else {
      notes.push("rag:refused")
    }
  }

  for (const a of artifacts) {
    await db
      .prepare("INSERT OR IGNORE INTO tgdesk_artifacts (message_id, kind, ref) VALUES (?, ?, ?)")
      .run(messageId, a.kind, a.ref)
  }

  // Заметки ложатся в строку сообщения: иначе отказ виден ровно один раз,
  // в ответе, который никто не читает.
  if (notes.length) {
    await db
      .prepare("UPDATE tgdesk_messages SET notes = ? WHERE id = ?")
      .run(notes.join("; "), messageId)
  }

  return {
    messageId,
    duplicate: false,
    artifacts,
    summary: u.summary,
    kind: u.kind,
    payload: u.payload,
    happenedAt,
    currency,
    dateFromToday,
    envelope: letter,
    fileText: files.map((f) => f.text).join(String.fromCharCode(10)),
    forwardedFrom: msg.forwardedFrom ?? "",
    currencyFromConfig,
    fileRead,
    needsConfirm,
    understood: !u.failed,
    intent: u.intent,
    schedule: u.schedule,
    confirmation: u.confirmation,
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
