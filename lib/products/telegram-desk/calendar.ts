import { db } from "@/lib/db"
import { dataFetch } from "@/lib/fractera/data-service"
import { utcToLocal, timezoneOf, localToUtcIso } from "./timezone"

// КАЛЕНДАРЬ: постановка напоминаний, подтверждение времени, срабатывание.
//
// 🔒 ВРЕМЯ ПОДТВЕРЖДАЕТСЯ ВСЕГДА, ДАЖЕ КОГДА МОДЕЛЬ УВЕРЕНА. «Завтра на десять» —
// это утро или вечер, и в каком часовом поясе живёт человек, продукт не знает.
// Ошибка здесь стоит не «неточности», а пропущенной встречи, поэтому предложенное
// время сначала произносится вслух, и только услышанное «да» делает его активным.

export type Repeat = "daily" | "weekdays" | "weekly" | "monthly" | null

export type Proposal = {
  kind: "event" | "reminder"
  title: string
  /** ISO без зоны: 2026-08-24T10:00 — то, что модель прочитала в словах. */
  when: string
  repeat: Repeat
  /** За сколько минут предупредить заранее. 0 — не предупреждать. */
  remindBefore: number
}

const HUMAN_REPEAT: Record<string, string> = {
  daily: "каждый день",
  weekdays: "каждый рабочий день",
  weekly: "каждую неделю",
  monthly: "каждый месяц",
}

/** Как продукт произносит предложенное время, чтобы человек мог возразить. */
export function speak(p: Proposal): string {
  // Человеку время произносится ЕГО часами — иначе он подтверждает цифру,
  // которой не понимает, и обнаруживает ошибку уже пропущенной встречей.
  const tz = timezoneOf()
  const shown = utcToLocal(Math.floor(Date.parse(p.when + ":00Z") / 1000), tz)
  const day = shown.slice(0, 10)
  const time = shown.slice(11, 16)
  const parts = [`${p.kind === "event" ? "Встреча" : "Напоминание"}: ${p.title}.`]
  parts.push(p.repeat ? `Когда: ${HUMAN_REPEAT[p.repeat]} в ${time}, начиная с ${day}.` : `Когда: ${day} в ${time}.`)
  if (p.remindBefore > 0) parts.push(`Предупрежу за ${p.remindBefore} мин.`)
  if (!tz) parts.push("Время по Гринвичу: часовой пояс мне ещё не назвали.")
  parts.push("Ставлю? Ответьте «да» или назовите другое время.")
  return parts.join(" ")
}

/** Предложение ложится в календарь неактивным и ждёт слова человека. */
export async function propose(chatId: string, messageId: number, p: Proposal): Promise<number> {
  // 🔒 ОДНО ОЖИДАНИЕ ЗА РАЗ. ✗ 2026-08-23: две неотвеченные встречи повисли
  // одновременно, и «да» ушло бы в ту, о которой спрашивали раньше.
  await db
    .prepare("UPDATE tgdesk_calendar SET status = 'cancelled' WHERE chat_id = ? AND status = 'pending'")
    .run(chatId)

  const due = Math.floor(Date.parse(p.when + ":00Z") / 1000)
  await db
    .prepare(
      `INSERT INTO tgdesk_calendar
         (message_id, chat_id, kind, title, due_unix, repeat, remind_before, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
    )
    .run(messageId, chatId, p.kind, p.title, due, p.repeat, p.remindBefore)
  const row = (await db
    .prepare("SELECT MAX(id) AS id FROM tgdesk_calendar WHERE chat_id = ? AND status = 'pending'")
    .get(chatId)) as { id?: number } | undefined
  return Number(row?.id ?? 0)
}

/** Ждёт ли что-то подтверждения прямо сейчас — и что именно. */
export async function pending(chatId: string): Promise<{ id: number; title: string; due: number } | null> {
  const row = (await db
    .prepare(
      `SELECT id, title, due_unix FROM tgdesk_calendar
        WHERE chat_id = ? AND status = 'pending' ORDER BY id DESC LIMIT 1`,
    )
    .get(chatId)) as { id?: number; title?: string; due_unix?: number } | undefined
  return row?.id ? { id: row.id, title: String(row.title), due: Number(row.due_unix) } : null
}

// 🔒 ЖДАТЬ МОГУТ ОБА: и напоминание, и чек. «Да» обязано попасть в то, о чём
// спрашивали ПОСЛЕДНИМ, — решает время, а не порядок проверок в коде.
// ✗ иначе согласие с суммой молча подтвердило бы вчерашнее напоминание.
export type Waiting =
  | { what: "calendar"; id: number; title: string; at: string }
  | { what: "entry"; id: number; title: string; at: string }

// 🔒 ПРАВИЛА СВЯЗНОСТИ — почему ответ находит свой вопрос (владелец 2026-08-23).
//
// 1. ОТКРЫТОЕ ОЖИДАНИЕ СИЛЬНЕЕ ВРЕМЕНИ. Продукт спросил «ставлю?» — значит
//    ответ относится к этому вопросу, сколько бы ни прошло: человек отвлёкся,
//    а не передумал. ✗ «Да» через пять минут стало отдельной заметкой, потому
//    что связь искали окном в три минуты — а окно тут вообще ни при чём.
// 2. ОКНО В ТРИ МИНУТЫ — про сообщения, идущие ПОДРЯД (пересылка с пояснением).
//    Это другой род связи, и он не заменяет первый.
// 3. ОЖИДАНИЕ НЕ ВЕЧНО. Через сутки вопрос протух: человек уже не помнит, о чём
//    его спрашивали, и «да» будет значить что-то другое.
// 4. ОЖИДАНИЕ ОДНО. Новое предложение отменяет прежнее неотвеченное — иначе
//    «да» уходит в то, о чём спрашивали позавчера.
const WAITING_TTL_SEC = 24 * 3600

export async function waitingNow(chatId: string): Promise<Waiting | null> {
  const cal = (await db
    .prepare(
      `SELECT id, title, created_at FROM tgdesk_calendar
        WHERE chat_id = ? AND status = 'pending' ORDER BY id DESC LIMIT 1`,
    )
    .get(chatId)) as { id?: number; title?: string; created_at?: string } | undefined

  const ent = (await db
    .prepare(
      `SELECT id, title, created_at FROM tgdesk_entries
        WHERE status = 'pending' ORDER BY id DESC LIMIT 1`,
    )
    .get()) as { id?: number; title?: string; created_at?: string } | undefined

  // Протухшее ожидание — то же, что его отсутствие.
  const fresh = (t?: string) =>
    Boolean(t) && Date.now() - Date.parse(String(t)) < WAITING_TTL_SEC * 1000

  const a =
    cal?.id && fresh(cal.created_at)
      ? { what: "calendar" as const, id: cal.id, title: String(cal.title), at: String(cal.created_at ?? "") }
      : null
  const b =
    ent?.id && fresh(ent.created_at)
      ? { what: "entry" as const, id: ent.id, title: String(ent.title), at: String(ent.created_at ?? "") }
      : null
  if (a && b) return a.at >= b.at ? a : b
  return a ?? b
}

/** Применить поправку к ожидающей записи. Пустые поля не трогаются. */
export async function applyEntryCorrection(
  id: number,
  c: { date: string | null; amount: number | null; currency: string | null; vendor: string | null; title: string | null },
): Promise<{ payload: Record<string, unknown>; currency: string; title: string; date: string }> {
  const row = (await db
    .prepare("SELECT message_id, title, payload, currency FROM tgdesk_entries WHERE id = ?")
    .get(id)) as { message_id?: number; title?: string; payload?: string; currency?: string } | undefined

  const payload = ((): Record<string, unknown> => {
    try { return JSON.parse(String(row?.payload ?? "{}")) as Record<string, unknown> } catch { return {} }
  })()
  if (c.amount !== null) payload.amount = c.amount
  if (c.vendor) payload.vendor = c.vendor

  const title = c.title ?? String(row?.title ?? "")
  const currency = c.currency ?? String(row?.currency ?? "")

  await db
    .prepare("UPDATE tgdesk_entries SET payload = ?, title = ?, currency = ? WHERE id = ?")
    .run(JSON.stringify(payload), title, currency || null, id)

  // 🔒 ДАТА ЧЕКА ЖИВЁТ У СООБЩЕНИЯ, А НЕ У ЗАПИСИ. Второе место для одного
  // факта разошлось бы при первой же правке: поиск по периоду читает сообщение.
  let date = ""
  if (c.date && row?.message_id) {
    const unix = Math.floor(Date.parse(c.date + "T12:00:00Z") / 1000)
    await db.prepare("UPDATE tgdesk_messages SET happened_unix = ? WHERE id = ?").run(unix, row.message_id)
    date = c.date
  }
  return { payload, currency, title, date }
}

/** Одной строкой: что именно предложено и ждёт ответа. Идёт в подсказку модели. */
export async function waitingLabel(chatId: string): Promise<string> {
  const w = await waitingNow(chatId)
  if (!w) return ""
  if (w.what === "entry") return `запись «${w.title}» — подтвердить сумму и дату`
  const row = (await db
    .prepare("SELECT due_unix FROM tgdesk_calendar WHERE id = ?")
    .get(w.id)) as { due_unix?: number } | undefined
  const when = row?.due_unix ? utcToLocal(row.due_unix, timezoneOf()) : ""
  return `«${w.title}»${when ? ` на ${when}` : ""} — подтвердить время`
}

export async function confirmEntry(id: number): Promise<void> {
  await db.prepare("UPDATE tgdesk_entries SET status = 'confirmed' WHERE id = ?").run(id)
}

export async function cancelEntry(id: number): Promise<void> {
  await db.prepare("UPDATE tgdesk_entries SET status = 'cancelled' WHERE id = ?").run(id)
}

/** Поправка времени у ожидающего напоминания. */
export async function applyCalendarCorrection(id: number, whenIso: string): Promise<string> {
  // Поправка приходит местным временем — как и всё, что человек называет.
  const due = Math.floor(Date.parse(localToUtcIso(whenIso, timezoneOf()) + ":00Z") / 1000)
  if (!Number.isFinite(due)) return ""
  await db.prepare("UPDATE tgdesk_calendar SET due_unix = ? WHERE id = ?").run(due, id)
  return whenIso.replace("T", " ")
}

export async function confirm(id: number): Promise<void> {
  await db.prepare("UPDATE tgdesk_calendar SET status = 'active' WHERE id = ?").run(id)
}

export async function cancel(id: number): Promise<void> {
  await db.prepare("UPDATE tgdesk_calendar SET status = 'cancelled' WHERE id = ?").run(id)
}

// 🔒 СЛЕДУЮЩЕЕ СРАБАТЫВАНИЕ СЧИТАЕТСЯ ОТ ПРОШЛОГО, А НЕ ОТ «СЕЙЧАС». Иначе
// напоминание, показанное с опозданием на час, навсегда сдвигает своё время на
// час — и через неделю «в девять утра» превращается в полдень.
function nextDue(due: number, repeat: Repeat): number | null {
  if (!repeat) return null
  const d = new Date(due * 1000)
  if (repeat === "daily") d.setUTCDate(d.getUTCDate() + 1)
  else if (repeat === "weekly") d.setUTCDate(d.getUTCDate() + 7)
  else if (repeat === "monthly") d.setUTCMonth(d.getUTCMonth() + 1)
  else if (repeat === "weekdays") {
    do {
      d.setUTCDate(d.getUTCDate() + 1)
    } while (d.getUTCDay() === 0 || d.getUTCDay() === 6)
  }
  return Math.floor(d.getTime() / 1000)
}

type DueRow = {
  id: number
  chat_id: string
  kind: string
  title: string
  due_unix: number
  repeat: Repeat
  remind_before: number
  pre_sent: number
}

async function send(chatId: string, text: string): Promise<boolean> {
  try {
    const r = await dataFetch("/service/channels/telegram/send", {
      method: "POST",
      body: JSON.stringify({ chatId, text }),
    })
    return r.ok
  } catch {
    return false
  }
}

/**
 * Что наступило — то и отправляется. Зовётся тиком службы каждую минуту.
 *
 * 🔒 ИЩУТСЯ ПРОСРОЧЕННЫЕ, А НЕ «РОВНО ЭТА МИНУТА». Служба могла лежать, сервер —
 * перезагружаться; напоминание, привязанное к точной минуте, в таком случае
 * исчезает бесследно. Условие `due <= now` догоняет пропущенное само.
 */
export async function fireDue(): Promise<{ fired: number; pre: number }> {
  const now = Math.floor(Date.now() / 1000)
  const rows = (await db
    .prepare(
      `SELECT id, chat_id, kind, title, due_unix, repeat, remind_before, pre_sent
         FROM tgdesk_calendar
        WHERE status = 'active' AND (due_unix <= ? OR (remind_before > 0 AND pre_sent = 0 AND due_unix - remind_before * 60 <= ?))
        ORDER BY due_unix LIMIT 50`,
    )
    .all(now, now)) as unknown as DueRow[]

  let fired = 0
  let pre = 0

  for (const r of rows) {
    // Предупреждение заранее — если время ещё не наступило.
    if (r.remind_before > 0 && !r.pre_sent && r.due_unix > now) {
      const at = utcToLocal(r.due_unix, timezoneOf()).slice(11, 16)
      if (await send(r.chat_id, `Через ${r.remind_before} мин: ${r.title} (в ${at}).`)) {
        await db.prepare("UPDATE tgdesk_calendar SET pre_sent = 1 WHERE id = ?").run(r.id)
        pre++
      }
      continue
    }
    if (r.due_unix > now) continue

    const label = r.kind === "event" ? "Сейчас" : "Напоминание"
    if (!(await send(r.chat_id, `${label}: ${r.title}`))) continue
    fired++

    const next = nextDue(r.due_unix, r.repeat)
    if (next) {
      await db
        .prepare("UPDATE tgdesk_calendar SET due_unix = ?, last_fired = ?, pre_sent = 0 WHERE id = ?")
        .run(next, now, r.id)
    } else {
      await db.prepare("UPDATE tgdesk_calendar SET status = 'done', last_fired = ? WHERE id = ?").run(now, r.id)
    }
  }

  return { fired, pre }
}
