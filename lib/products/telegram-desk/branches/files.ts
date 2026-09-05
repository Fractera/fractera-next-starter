import { openAiKey } from "@/lib/openai-key"
import { dataFetch, dataService } from "@/lib/fractera/data-service"
import { db } from "@/lib/db"
import { mediaByName } from "@/lib/media/by-name"

// ВЕТВЬ «ФАЙЛЫ»: забрать вложение, положить в медиатеку, ПРОЧИТАТЬ его.
//
// 🔒 ФАЙЛ БЕЗ ОПИСАНИЯ — ЭТО ФАЙЛ, КОТОРОГО НЕТ. Снимок чека, лежащий в
// медиатеке молча, не найдётся ни поиском по смыслу, ни вопросом «сколько я
// отдал»: искать нечего, у картинки нет слов. Поэтому загрузка и чтение здесь —
// одна операция, а не две: сохранили — значит описали.
//
// ✗ 2026-08-23: фотография с описанием услуг фотографа была принята, подпись
// сохранена, файл — нет. На вопрос «как звали фотографа» продукт честно ответил
// «ничего не записано», хотя имя было на снимке.

/** Что мы умеем читать. Видео — намеренно НЕ здесь (решение владельца). */
export type FileKind = "image" | "audio" | "document"

export type StoredFile = {
  /** Имя в медиатеке. Ссылка на файл — ИМЕНЕМ, id разный на каждом сервере. */
  name: string
  kind: FileKind
  /** Что на нём: описание картинки, расшифровка звука, суть документа. */
  text: string
  /** Почему не прочитали, если не прочитали. Пусто — прочитали. */
  failed: string
}

const EXT_KIND: Record<string, FileKind> = {
  jpg: "image", jpeg: "image", png: "image", webp: "image", gif: "image", heic: "image",
  ogg: "audio", oga: "audio", mp3: "audio", m4a: "audio", wav: "audio", opus: "audio",
  pdf: "document", txt: "document", csv: "document", md: "document",
}

function kindOf(name: string, declared?: string): FileKind | null {
  const ext = (name.split(".").pop() ?? "").toLowerCase()
  if (EXT_KIND[ext]) return EXT_KIND[ext]
  if (declared === "image" || declared === "audio") return declared
  if (declared === "document") return "document"
  return null
}

/** Байты у службы каналов: она единственная, у кого есть токен бота. */
// 🔒 ИМЯ НЕ ЗАВИСИТ ОТ ЗАГОЛОВКА. ✗ 2026-08-23: служба честно слала
// X-File-Name, но до приложения он не дошёл — по дороге стоит сквозной
// прокси слоя данных, и свои заголовки он не обязан переносить. Файл лёг в
// медиатеку как «.file», и по расширению его больше не прочитать.
// Род объекта служба присылает В ТЕЛЕ, и он переживает любой прокси.
const EXT_BY_KIND: Record<string, string> = { image: "jpg", audio: "ogg", document: "txt" }

async function fetchFromChannel(
  fileId: string,
  declaredKind?: string,
): Promise<{ bytes: Buffer; name: string } | null> {
  try {
    const r = await dataFetch(`/service/channels/telegram/file?id=${encodeURIComponent(fileId)}`)
    if (!r.ok) return null
    const header = r.headers.get("x-file-name") || ""
    const name = header.includes(".")
      ? header
      : `file.${EXT_BY_KIND[declaredKind ?? ""] ?? "bin"}`
    return { bytes: Buffer.from(await r.arrayBuffer()), name }
  } catch {
    return null
  }
}

/** В медиатеку. Имя делаем своим: телеграмовское живёт в его каталогах. */
async function toMedia(bytes: Buffer, name: string, messageId: number): Promise<string | null> {
  const ext = (name.split(".").pop() ?? "bin").toLowerCase()
  const own = `tg-${messageId}-${Date.now()}.${ext}`
  try {
    const form = new FormData()
    form.append("file", new Blob([new Uint8Array(bytes)]), own)
    const { url, key } = dataService()
    const res = await fetch(`${url}/media/upload`, {
      method: "POST",
      headers: key ? { "X-Data-Secret": key } : {},
      body: form,
    })
    if (!res.ok) return null
    const d = (await res.json()) as { ok?: boolean; item?: { id?: string; name?: string } }
    return d.ok ? (d.item?.name ?? own) : null
  } catch {
    return null
  }
}

async function describeImage(bytes: Buffer, mime: string): Promise<{ text: string; why: string }> {
  const key = openAiKey()
  if (!key) return { text: "", why: "no-key" }
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.TGDESK_VISION_MODEL ?? "gpt-4o-mini",
        temperature: 0,
        messages: [
          {
            role: "system",
            content: [
              // 🔒 ТЕКСТ ПЕРЕЧИСЛЯЕТСЯ ПЕРВЫМ, И ЭТО НЕ ПОРЯДОК СЛОВ, А ПОРЯДОК РАБОТЫ.
              // ✗ 2026-08-23: на скриншоте рекламы YouTube («МОЯ ОСНОВНАЯ РАБОТА»,
              // «EASY Инвест», 45:05) модель написала «женщина с длинными светлыми
              // волосами выглядит удивлённой» и не прочитала НИ ОДНОЙ надписи.
              // Просьба стояла последней, ответ короткий — и он весь ушёл на человека.
              // Описание вышло красивым и бесполезным: «где я видел рекламу про
              // инвестиции» не найдёт по нему ничего.
              "You prepare a picture for SEARCH inside someone's personal notes.",
              "",
              "FIRST, transcribe every piece of text you can read on it, verbatim and in its",
              "own language: headlines, captions, brand and channel names, prices, totals,",
              "dates, durations, plate numbers, buttons. This part matters most — it is what",
              "they will search by. Do not paraphrase it and do not translate it.",
              "",
              "THEN, in one or two sentences, say what the picture IS: a receipt, a screenshot",
              "of an ad, a photo of a place, a document. Name the people or objects only if",
              "they carry meaning.",
              "",
              "Never guess what you cannot see. No text on it — say so plainly.",
            ].join(String.fromCharCode(10)),
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Что на этом изображении?" },
              {
                type: "image_url",
                // 🔒 РАЗРЕШЕНИЕ ЯВНО ВЫСОКОЕ. По умолчанию действует «auto», и для
                // картинки такого размера модель выбирает низкое: мелкий текст в нём
                // физически не читается, сколько его ни проси. Это про то, что модель
                // ВИДИТ, а не про то, как её просят, — и промпт тут бессилен.
                image_url: {
                  url: `data:${mime};base64,${bytes.toString("base64")}`,
                  detail: "high",
                },
              },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(90_000),
    })
    if (!res.ok) return { text: "", why: `vision-${res.status}: ${(await res.text()).slice(0, 200)}` }
    const d = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    return { text: String(d.choices?.[0]?.message?.content ?? "").trim(), why: "" }
  } catch (e) {
    return { text: "", why: `vision-threw: ${String((e as Error).message ?? e).slice(0, 120)}` }
  }
}

async function transcribe(bytes: Buffer, name: string): Promise<string> {
  const key = openAiKey()
  if (!key) return ""
  try {
    const form = new FormData()
    form.append("file", new Blob([new Uint8Array(bytes)]), name)
    form.append("model", process.env.TRANSCRIBE_MODEL ?? "whisper-1")
    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
      signal: AbortSignal.timeout(180_000),
    })
    if (!res.ok) return ""
    const d = (await res.json()) as { text?: string }
    return String(d.text ?? "").trim()
  } catch {
    return ""
  }
}

/** Текстовые документы читаются как есть; PDF — отдельный разговор, см. ниже. */
function readDocument(bytes: Buffer, name: string): string {
  const ext = (name.split(".").pop() ?? "").toLowerCase()
  if (ext === "txt" || ext === "csv" || ext === "md") {
    return bytes.toString("utf8").slice(0, 20_000)
  }
  // 🔒 PDF ЗДЕСЬ НЕ РАЗБИРАЕТСЯ, И ЭТО НАЗВАНО ВСЛУХ. Библиотеки чтения PDF в
  // проекте нет, а завести её — это зависимость, сборка и решение владельца.
  // Файл при этом СОХРАНЁН: потерять его было бы хуже, чем не прочитать.
  return ""
}

const MIME: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
  webp: "image/webp", gif: "image/gif", heic: "image/heic",
}

/**
 * Забрать, сохранить, прочитать. Любой шаг может не удаться по отдельности, и
 * тогда работает то, что удалось: файл без описания полезнее отсутствия файла.
 */
/**
 * Общая часть приёма файла: медиатека, затем перевод в текст по роду.
 *
 * 🔒 ВЫНЕСЕНА ИЗ `takeFile` (133, 2026-09-05), ПОТОМУ ЧТО ИСТОЧНИКОВ БАЙТОВ СТАЛО
 * ДВА. Прежде байты приходили только от службы каналов по `fileId`; теперь файл
 * может лежать локально — плагин каналов Claude Code кладёт присланное человеком
 * в свой склад на диске. **Разбор при этом обязан быть один и тот же:** второй
 * путь, повторяющий эти двадцать строк, разошёлся бы с первым на первой правке
 * промпта, и разошёлся бы молча.
 *
 * 🔒 МЕДИАТЕКА ПЕРВОЙ, ДО РАЗБОРА (§ 11.2 паспорта): разбор может не удаться, а
 * файл, положенный первым, переживает отказ следующих шагов — и именно он делает
 * возможной вторую волну, переописание.
 */
async function processBytes(
  bytes: Buffer,
  fileName: string,
  messageId: number,
  declaredKind?: string,
): Promise<StoredFile> {
  const kind = kindOf(fileName, declaredKind)
  if (!kind) return { name: "", kind: "document", text: "", failed: "unknown-kind" }

  const name = await toMedia(bytes, fileName, messageId)
  if (!name) return { name: "", kind, text: "", failed: "media-upload" }

  let text = ""
  let why = ""
  if (kind === "image") {
    const ext = (fileName.split(".").pop() ?? "jpg").toLowerCase()
    const seen = await describeImage(bytes, MIME[ext] ?? "image/jpeg")
    text = seen.text
    why = seen.why
  } else if (kind === "audio") {
    text = await transcribe(bytes, fileName)
  } else {
    text = readDocument(bytes, fileName)
  }

  return { name, kind, text, failed: text ? "" : why || "not-read" }
}

export async function takeFile(
  fileId: string,
  messageId: number,
  declaredKind?: string,
): Promise<StoredFile | null> {
  const got = await fetchFromChannel(fileId, declaredKind)
  if (!got) return null
  return processBytes(got.bytes, got.name, messageId, declaredKind)
}

/**
 * Тот же приём, но байты уже на руках — файл лежит локально, а не у службы.
 *
 * 🛑 ИМЯ ФАЙЛА ЗДЕСЬ НЕ УКРАШЕНИЕ, А ЕДИНСТВЕННЫЙ ИСТОЧНИК РОДА. По расширению
 * решается, звать ли зрение, расшифровку или чтение документа. Пустое имя
 * означает «род неизвестен», и это честный отказ, а не повод угадывать по байтам.
 */
export async function takeLocalFile(
  bytes: Buffer,
  fileName: string,
  messageId: number,
  declaredKind?: string,
): Promise<StoredFile> {
  return processBytes(bytes, fileName, messageId, declaredKind)
}

/**
 * Прислать человеку сохранённый файл обратно в чат.
 *
 * 🔒 БАЙТЫ ИДУТ ЧЕРЕЗ СЛУЖБУ, А НЕ ССЫЛКОЙ. Ссылка на медиатеку требует ключа,
 * а ключ в чате — это ключ, оставленный в чужой истории сообщений.
 */
export async function sendStoredFile(
  chatId: string,
  messageId: number,
  caption: string,
): Promise<boolean> {
  try {
    const row = (await db
      .prepare(
        `SELECT a.ref, m.raw_kind, m.object_type FROM tgdesk_artifacts a
           JOIN tgdesk_messages m ON m.id = a.message_id
          WHERE a.message_id = ? AND a.kind = 'media' LIMIT 1`,
      )
      .get(messageId)) as { ref?: string; raw_kind?: string; object_type?: string } | undefined
    if (!row?.ref) return false

    // 🔒 ИМЯ → ЗАПИСЬ → ФАЙЛ, В ТРИ ШАГА, И СРЕДНИЙ ПРОПУСТИТЬ НЕЛЬЗЯ.
    // ✗ здесь стоял выдуманный маршрут `/media/by-name/…/file`, которого у слоя
    // данных нет вовсе: он ответил 404, и «прислать запись» тихо не работало бы.
    // Хранилище адресует файл идентификатором, а содержимое ссылается ИМЕНЕМ —
    // между ними стоит поиск по списку, `mediaByName`, и он уже написан.
    const media = await mediaByName(String(row.ref))
    if (!media) return false
    const file = await dataFetch(`/media/${encodeURIComponent(media.id)}/file`)
    if (!file.ok) return false
    const bytes = Buffer.from(await file.arrayBuffer())

    const kind =
      row.raw_kind === "voice" || row.object_type === "audio"
        ? "audio"
        : row.object_type === "image"
          ? "image"
          : "document"

    const r = await dataFetch("/service/channels/telegram/sendFile", {
      method: "POST",
      body: JSON.stringify({
        chatId,
        kind,
        name: String(row.ref),
        caption,
        base64: bytes.toString("base64"),
      }),
    })
    return r.ok
  } catch {
    return false
  }
}