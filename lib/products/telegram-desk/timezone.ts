import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { getAppConfig } from "@/config/app-config"

// ЧАСОВОЙ ПОЯС ЧЕЛОВЕКА — и всё, что из него следует.
//
// 🔒 СЕРВЕР ЖИВЁТ В UTC И О ЧЕЛОВЕКЕ НЕ ЗНАЕТ НИЧЕГО. Ни Telegram, ни браузер
// часового пояса не сообщают. Пока он неизвестен, «напомни завтра в десять»
// ставится по Гринвичу — то есть не тогда; и человек заметит это ровно один раз,
// проспав встречу. Поэтому продукт спрашивает пояс сам и записывает ответ.
//
// 🔒 ПРЕОБРАЗОВАНИЕ БЕЗ БИБЛИОТЕК, ЧЕРЕЗ `Intl`. Заводить зависимость ради
// смещения не нужно: платформа знает все зоны IANA и знает про переход на летнее
// время, а библиотека полугодовой давности — уже нет.

/** Смещение зоны в минутах в КОНКРЕТНЫЙ момент: летом и зимой оно разное. */
function offsetMinutes(tz: string, at: Date): number {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    const p: Record<string, string> = {}
    for (const part of dtf.formatToParts(at)) p[part.type] = part.value
    const asUtc = Date.UTC(
      Number(p.year),
      Number(p.month) - 1,
      Number(p.day),
      Number(p.hour === "24" ? "0" : p.hour),
      Number(p.minute),
      Number(p.second),
    )
    return Math.round((asUtc - at.getTime()) / 60000)
  } catch {
    return 0
  }
}

export function timezoneOf(): string {
  try {
    return String(getAppConfig().timezone ?? "").trim()
  } catch {
    return ""
  }
}

export function isKnownZone(tz: string): boolean {
  if (!tz || !tz.includes("/")) return false
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz })
    return true
  } catch {
    return false
  }
}

/** «Сейчас» глазами человека: `2026-08-23 16:49`. Пояса нет — отдаём UTC. */
export function nowLocal(tz: string): string {
  const now = new Date()
  if (!isKnownZone(tz)) return now.toISOString().slice(0, 16).replace("T", " ")
  const shifted = new Date(now.getTime() + offsetMinutes(tz, now) * 60000)
  return shifted.toISOString().slice(0, 16).replace("T", " ")
}

/**
 * Местное время человека → мгновение в UTC.
 *
 * 🔒 СМЕЩЕНИЕ БЕРЁТСЯ НА ТУ ЖЕ ДАТУ, А НЕ НА СЕГОДНЯ. Напоминание на конец
 * октября, поставленное в августе, иначе уедет на час: переход на зимнее время
 * случится между этими днями.
 */
export function localToUtcIso(local: string, tz: string): string {
  const clean = local.trim().replace(" ", "T").slice(0, 16)
  if (!isKnownZone(tz)) return clean
  // Приближение в два шага: берём смещение на предполагаемый момент, поправляем,
  // затем пересчитываем смещение уже на полученную дату. Второго шага хватает
  // всегда — сдвиг не превышает суток, а смещение меняется не чаще раза в полгода.
  const guess = new Date(clean + ":00Z")
  const first = offsetMinutes(tz, guess)
  const better = new Date(guess.getTime() - first * 60000)
  const second = offsetMinutes(tz, better)
  return new Date(guess.getTime() - second * 60000).toISOString().slice(0, 16)
}

/** UTC → местное, для показа человеку. */
export function utcToLocal(unix: number, tz: string): string {
  const at = new Date(unix * 1000)
  if (!isKnownZone(tz)) return at.toISOString().slice(0, 16).replace("T", " ")
  return new Date(at.getTime() + offsetMinutes(tz, at) * 60000)
    .toISOString()
    .slice(0, 16)
    .replace("T", " ")
}

// 🔒 ПРИЛОЖЕНИЕ ПИШЕТ В APP-CONFIG — ОТСТУПЛЕНИЕ ОТ ЗАКОНА, И ОНО НАЗВАНО.
//
// Закон продукта: панель пишет, приложение читает. Здесь приложение пишет — по
// прямому решению владельца 2026-08-23: «до поля в настройках мало кто дойдёт,
// поэтому записывай сразу». Довод сильный: пояс, о котором человека не спросили,
// остаётся пустым навсегда, а напоминания при этом молча врут.
//
// Отступление сужено до предела: правится ОДИН ключ, файл читается и
// перезаписывается целиком со слиянием, схема не трогается. Одновременная правка
// из панели всё же может затереть запись — тогда продукт спросит пояс снова, и
// это худшее, что здесь случится.
export function saveTimezone(tz: string): boolean {
  if (!isKnownZone(tz)) return false
  const file = join(process.cwd(), "APP-CONFIG", "app-config.json")
  try {
    let current: Record<string, unknown> = {}
    try {
      current = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>
    } catch {
      // Файла нет или он пуст — законное состояние свежего сервера.
    }
    current.timezone = tz
    writeFileSync(file, JSON.stringify(current, null, 2) + String.fromCharCode(10), "utf8")
    return true
  } catch {
    return false
  }
}
