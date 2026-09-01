// СОСТОЯНИЕ КАНАЛА СВЯЗИ — СЕРВЕРНОЕ ЧТЕНИЕ (77-3, 2026-09-01).
//
// Перенесено из панели (`app/[lang]/channels/_lib/channels.ts`, 42 строки) с
// единственной содержательной правкой — АДРЕСОМ.
//
// 🔒 ГОСТЬ ХОДИТ В СЛУЖБУ НАПРЯМУЮ, А НЕ ЧЕРЕЗ ПАНЕЛЬ. Панельный файл спрашивал
// свою же дверь по `ADMIN_INTERNAL_URL`; перенеси этот прыжок — и приложение
// человека стало бы зависеть от панели в рантайме, то есть перенос убил бы
// собственную причину: право владельца отвязаться от контура управления.
//
// 🔒 ПРАВДА О БОТЕ ЖИВЁТ В СЛУЖБЕ `:3500`, А НЕ ЗДЕСЬ, И ЭТО ГЛАВНОЕ ОТЛИЧИЕ ОТ
// СПОСОБОВ ВХОДА (78-3). Там панель сама читала и писала файл окружения; здесь
// служба — единственный читатель бота: она хранит `config.json` с правами `0600`,
// она одна знает токен, она проверяет его формат и зажимает расписание. Отсюда
// закон: НИКАКОЙ второй копии этих правил в проекте. Мы спрашиваем и показываем.
//
// 🔒 ТОКЕН СЮДА НЕ ПРИХОДИТ ВООБЩЕ. `/status` отдаёт `configured: true|false`, но
// не значение. Поэтому здесь нечего маскировать — и не должно появиться: «показать
// хвостик для узнаваемости» означает вернуть секрет в браузер.
//
// 🔒 ТРИ СОСТОЯНИЯ РАЗЛИЧАЮТСЯ НАМЕРЕННО, потому что лечение у них разное:
//   • служба не запущена      → `available: false`  → её надо поднять;
//   • токен не сохранён       → `configured: false` → взять у @BotFather;
//   • токен есть, но Telegram его не узнаёт → `reachable: false` → токен отозван.
// Панель до переезда показывала третье припиской в подписи поля, где его легко
// пропустить; здесь это отдельное состояние.

const CHANNELS_URL = process.env.CHANNELS_URL ?? "http://127.0.0.1:3500"

export type TelegramState = {
  /** Токен сохранён в службе. Само значение наружу не выходит никогда. */
  configured: boolean
  /** Telegram ответил на этот токен: служба спросила `getMe`. */
  reachable: boolean
  /** Имя бота без «@», каким его знает Telegram. */
  bot: string | null
  /** Привязанный чат — появляется только после рукопожатия. */
  chatId: string | null
  who: string | null
  enabled: boolean
  /** Шаг расписания в секундах; 0 — выключено. Поле молодое, потому необязательное. */
  tickSeconds?: number
}

export type ChannelsState = {
  /** Служба каналов ответила. `false` — это НОРМАЛЬНОЕ состояние на ноутбуке. */
  available: boolean
  telegram: TelegramState | null
}

/**
 * Спросить службу каналов о состоянии бота.
 *
 * 🔒 ТАЙМАУТ ОБЯЗАТЕЛЕН. Служба ходит в Telegram за именем бота, и зависший
 * внешний вызов без предела повесил бы всю страницу целиком, а не одну карточку.
 *
 * 🔒 ОТКАЗ — НЕ ИСКЛЮЧЕНИЕ, А ОТВЕТ. `available: false` означает «службы здесь
 * нет», и страница обязана сказать это словами: на машине человека `:3500` не
 * запущен, и это норма, а не поломка его проекта.
 */
export async function readChannels(): Promise<ChannelsState> {
  try {
    const r = await fetch(`${CHANNELS_URL}/status`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    })
    if (!r.ok) return { available: false, telegram: null }
    const d = (await r.json()) as { telegram?: TelegramState }
    return { available: true, telegram: d.telegram ?? null }
  } catch {
    return { available: false, telegram: null }
  }
}

/**
 * ЗАПИСЬ СКЛАДА ВХОДЯЩИХ — ФОРМА ЗАДАНА СЛУЖБОЙ (77-5, 2026-09-01).
 *
 * Служба кладёт сюда ВСЁ, что услышал бот, независимо от режима, и хранит
 * последние 500 записей на диске (`INBOX_MAX`), чтобы перезапуск не потерял те,
 * которых никто не прочитал.
 *
 * 🔒 ПОЛЯ НЕ ПРИДУМАНЫ ЗДЕСЬ, А СПИСАНЫ С `pushInbox()` СЛУЖБЫ. Наш тип — это
 * описание чужого формата, и расширять его «на будущее» нельзя: поле, которого
 * служба не пишет, будет вечно пустым и однажды объявится способностью.
 */
export type InboxMessage = {
  id: number
  /**
   * Кто сказал: `in` — человек, `out` — бот (77-11).
   *
   * 🔒 НЕОБЯЗАТЕЛЬНОЕ, И ЭТО НЕ НЕБРЕЖНОСТЬ. Поле добавлено службой позже, а
   * склад к тому времени уже был полон. Записи без него — входящие: правка
   * формата не имеет права сделать прежние сообщения невидимыми или чужими.
   * Тот же закон, что у поздних колонок схемы данных.
   */
  direction?: "in" | "out"
  /** ISO-время прихода. */
  at: string
  chatId: string
  /** `@имя`, либо имя и фамилия, либо идентификатор чата — что нашлось. У бота пусто. */
  who: string | null
  kind: string
  text: string
  objectType?: string | null
  fileId?: string | null
  forwardedFrom?: string | null
  lat?: number | null
  lon?: number | null
}

export type InboxPage = {
  available: boolean
  messages: InboxMessage[]
  lastId: number
}

/**
 * Прочитать склад входящих службы.
 *
 * 🔒 ЭТО ЧТЕНИЕ, И ТОЛЬКО ЧТЕНИЕ. Ни ответа, ни пересылки, ни удаления здесь нет
 * и не появится мимоходом: склад — журнал службы, а не почтовый ящик проекта.
 *
 * 🔒 ПУСТОЙ СКЛАД — НОРМАЛЬНОЕ СОСТОЯНИЕ, А НЕ ОТКАЗ. Он пуст у каждого, кому
 * ещё не писали, и раздел обязан сказать это словами.
 */
export async function readInbox(after = 0, limit = 50): Promise<InboxPage> {
  try {
    const r = await fetch(
      `${CHANNELS_URL}/telegram/inbox?after=${encodeURIComponent(String(after))}&limit=${encodeURIComponent(String(limit))}`,
      { cache: "no-store", signal: AbortSignal.timeout(8000) },
    )
    if (!r.ok) return { available: false, messages: [], lastId: 0 }
    const d = (await r.json()) as { messages?: InboxMessage[]; lastId?: number }
    return {
      available: true,
      messages: Array.isArray(d.messages) ? d.messages : [],
      lastId: Number(d.lastId ?? 0),
    }
  } catch {
    return { available: false, messages: [], lastId: 0 }
  }
}

export { CHANNELS_URL }
