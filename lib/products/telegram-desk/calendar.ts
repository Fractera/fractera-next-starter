import { db } from "@/lib/db"
import { dataFetch } from "@/lib/fractera/data-service"

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
  const d = new Date(p.when + ":00Z")
  const day = d.toISOString().slice(0, 10)
  const time = d.toISOString().slice(11, 16)
  const parts = [`${p.kind === "event" ? "Встреча" : "Напоминание"}: ${p.title}.`]
  parts.push(p.repeat ? `Когда: ${HUMAN_REPEAT[p.repeat]} в ${time}, начиная с ${day}.` : `Когда: ${day} в ${time}.`)
  if (p.remindBefore > 0) parts.push(`Предупрежу за ${p.remindBefore} мин.`)
  parts.push("Ставлю? Ответьте «да» или назовите другое время.")
  return parts.join(" ")
}

/** Предложение ложится в календарь неактивным и ждёт слова человека. */
export async function propose(chatId: string, messageId: number, p: Proposal): Promise<number> {
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
      const at = new Date(r.due_unix * 1000).toISOString().slice(11, 16)
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
