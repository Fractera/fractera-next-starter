import { db } from "@/lib/db"
import { dataJson } from "@/lib/fractera/data-service"
import { ingest, type Incoming } from "./ingest"

// ДОБОРКА ИЗ ЯЩИКА СЛУЖБЫ — вторая дорога, и без неё первая лжёт.
//
// 🔒 ЧЕМ ОПЛАЧЕНО (2026-08-23). Ящик задумывался страховкой: «приложение лежало —
// доберёт курсором». Добирать было НЕКОМУ: этот файл не был написан, и три
// сообщения владельца, пришедшие до соединения службы с дверью, остались в
// кольце навсегда. Среди них было «запомни, я хотел бы создать свой Harness» —
// то есть ровно то, ради чего продукт существует.
//
// 🔒 КУРСОР НЕ ХРАНИТСЯ ОТДЕЛЬНО. Он ВЫВОДИТСЯ: наибольший external_id среди
// принятых строк. Отдельное поле курсора — это второй источник правды, который
// разойдётся с базой в первый же сбой на середине.

type InboxRow = {
  id: number
  at: string
  chatId: string
  who: string
  kind: string
  text: string
  objectType?: string | null
  fileId?: string | null
  lat?: number | null
  lon?: number | null
}

/** Что уже принято. `0`, когда база пуста, — тогда добирается весь ящик. */
async function cursor(): Promise<number> {
  const row = (await db
    .prepare(
      `SELECT MAX(CAST(external_id AS INTEGER)) AS last
         FROM tgdesk_messages
        WHERE direction = 'in' AND external_id IS NOT NULL`,
    )
    .get()) as { last?: number | null } | undefined
  return Number(row?.last ?? 0)
}

export type BackfillResult = { from: number; taken: number; ids: number[]; error: string }

/**
 * Забрать всё, что служба сохранила, а продукт пропустил.
 *
 * Отвечать человеку здесь НЕ нужно и вредно: доборка идёт пачкой, и пять
 * подтверждений подряд на сообщения недельной давности выглядят как поломка.
 */
export async function backfill(limit = 200): Promise<BackfillResult> {
  const from = await cursor()
  const ids: number[] = []
  try {
    const data = await dataJson<{ messages?: InboxRow[] }>(
      `/service/channels/telegram/inbox?after=${from}&limit=${limit}`,
    )
    for (const m of data.messages ?? []) {
      const incoming: Incoming = {
        externalId: String(m.id),
        at: m.at,
        chatId: String(m.chatId ?? ""),
        who: String(m.who ?? ""),
        kind: String(m.kind ?? "text"),
        text: String(m.text ?? ""),
        objectType: m.objectType ?? undefined,
        fileId: m.fileId ?? undefined,
        lat: m.lat ?? undefined,
        lon: m.lon ?? undefined,
      }
      if (!incoming.text || !incoming.chatId) continue
      const r = await ingest(incoming)
      if (!r.duplicate) ids.push(r.messageId)
    }
    return { from, taken: ids.length, ids, error: "" }
  } catch (e) {
    // Служба недоступна — это не поломка продукта. Следующий заход доберёт.
    return { from, taken: ids.length, ids, error: e instanceof Error ? e.message : "unreachable" }
  }
}
