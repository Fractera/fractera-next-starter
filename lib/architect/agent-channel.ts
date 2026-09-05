// КАНАЛ АГЕНТА: ПОДПИСКА CLAUDE CODE И ТОКЕН ЕГО БОТА (шаг 117, 2026-09-05).
//
// 🔒 ХОЗЯИН ПРАВДЫ — ЧАТ `:3600`, А НЕ ЭТОТ ФАЙЛ, И ЭТО ТА ЖЕ КОНСТРУКЦИЯ, ЧТО У
// СЛУЖБЫ КАНАЛОВ. Дверь `/api/fractera/agent-setup` чата пишет токен в файл, из
// которого его читает плагин каналов Anthropic (`/root/.claude/channels/telegram/`),
// знает состояние подписки и ведёт список привязанных собеседников. Здесь —
// тонкий читатель, и он намеренно тонкий: вторая копия этих правил разошлась бы с
// чатом на первой его правке.
//
// ✗ ЧЕМ ОПЛАЧЕНА САМА НЕОБХОДИМОСТЬ ЭТОГО ФАЙЛА. Экран настроек слоя архитектора
// писал токен в службу каналов `:3500`, а плагин читал СОВСЕМ ДРУГОЙ файл. Два
// хранилища, ноль связи: владелец вводил бота на экране и не понимал, почему
// терминал его не видит. Измерено 2026-09-05: `config.json` службы содержал
// `{"telegramBots": []}` при живом работающем боте у плагина.
//
// 🔒 ЗАМОК НЕ ДУБЛИРУЕТСЯ — ПЕРЕСЫЛАЮТСЯ КУКИ. Дверь чата сама требует роль
// `architect`. Проверять роль ещё и здесь значило бы завести второе место, где
// решается один вопрос; они разойдутся, и правой окажется та копия, которую
// человек открыл первой.

import { headers } from "next/headers"

/** Адрес чата с точки зрения СЕРВЕРА: петля, а не публичный хост. */
const CHAT_URL = process.env.CHAT_URL ?? "http://127.0.0.1:3600"

export const AGENT_SETUP_URL = `${CHAT_URL}/api/fractera/agent-setup`

export type AgentChannelState = {
  /** Ответил ли чат вообще. `false` — законное состояние машины человека. */
  available: boolean
  subscription: { loggedIn: boolean; method: string | null }
  telegram: {
    /** Токен бота лежит там, откуда его читает плагин. */
    present: boolean
    /** Маска, а не токен: отвечает на вопрос «тот ли», не отдавая значения. */
    masked: string | null
    /** Сколько собеседников привязано и сколько кодов ждут подтверждения. */
    allowed: number
    pending: number
  }
}

export const EMPTY_AGENT_CHANNEL: AgentChannelState = {
  available: false,
  subscription: { loggedIn: false, method: null },
  telegram: { present: false, masked: null, allowed: 0, pending: 0 },
}

/**
 * Число из того, что дверь отдала списком ИЛИ числом.
 *
 * 🔒 ФОРМА СОСЕДНЕЙ ДВЕРИ ИЗМЕРЯЕТСЯ, А НЕ УГАДЫВАЕТСЯ, и это уже оплачено в
 * шаге 96: чат ждал `id` сверху, а служба отдавала `{ok, item}`. Здесь дешевле
 * принять оба вида, чем однажды показать «0 собеседников» при живой привязке.
 */
function count(v: unknown): number {
  if (Array.isArray(v)) return v.length
  if (typeof v === "number" && Number.isFinite(v)) return v
  return 0
}

/** Состояние канала агента. Чат не ответил — законный исход, не ошибка. */
export async function readAgentChannel(): Promise<AgentChannelState> {
  try {
    const cookie = (await headers()).get("cookie") ?? ""
    const r = await fetch(AGENT_SETUP_URL, {
      cache: "no-store",
      headers: cookie ? { cookie } : undefined,
    })
    if (!r.ok) return EMPTY_AGENT_CHANNEL

    const j = (await r.json()) as Record<string, unknown>
    const sub = (j.subscription ?? {}) as Record<string, unknown>
    const tg = (j.telegram ?? {}) as Record<string, unknown>

    return {
      available: true,
      subscription: {
        loggedIn: Boolean(sub.loggedIn),
        method: typeof sub.method === "string" ? sub.method : null,
      },
      telegram: {
        present: Boolean(tg.present),
        masked: typeof tg.masked === "string" ? tg.masked : null,
        allowed: count(tg.allowed),
        pending: count(tg.pending),
      },
    }
  } catch {
    return EMPTY_AGENT_CHANNEL
  }
}
