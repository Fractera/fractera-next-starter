import "server-only"
import { readFileSync, writeFileSync, renameSync, existsSync, unlinkSync } from "fs"
import { dirname, join } from "path"

// ЕДИНСТВЕННОЕ МЕСТО, ГДЕ ЭТОТ СЛОЙ ПИШЕТ `.env.local` (шаг 31-16, 2026-08-29).
//
// 🔒 ЭТОТ ФАЙЛ УСТРОЕН ИНАЧЕ, ЧЕМ ДВА КОНФИГА, И РАЗНИЦА НЕ ТЕХНИЧЕСКАЯ.
// `APP-CONFIG` и `PLATFORM-CONFIG` читаются на КАЖДОМ запросе: правка видна на
// следующей загрузке страницы. `.env.local` запекается в сборку — записанное
// здесь не значит ничего, пока проект не пересобран. Сказать об этом человеку
// обязана страница; знать об этом обязан каждый, кто сюда пишет.
//
// 🔒 В ЭТОМ ФАЙЛЕ ЖИВЁТ ЧУЖОЕ, И ЧАСТЬ ЕГО — СЕКРЕТЫ. Ключи доступа к серверу,
// адрес слоя данных с ключом, состояние мастера запуска (`USER_LAUNCH_*`, которое
// правит панель и которое нам трогать запрещено). Поэтому здесь нет и не будет
// «записать файл целиком»: правится ОДНА названная строка, остальные байты
// переносятся как есть — включая комментарии, пустые строки и их порядок.
//
// 🔒 ЗАПИСЬ АТОМАРНА. Оборванная запись оставила бы половину файла, и следующая
// сборка не нашла бы ни ключей сервера, ни адреса данных — то есть проект потерял
// бы связь со своей платформой целиком.

export type EnvWriteResult =
  | { ok: true }
  | { ok: false; reason: "write-failed"; detail: string }

// 🔒 ПУТЬ СТАЛ НЕОБЯЗАТЕЛЬНЫМ ПАРАМЕТРОМ, А НЕ СМЕНИЛСЯ (78-3, 2026-08-31).
//
// Появился второй файл окружения, который правит этот слой: у службы входа свой
// `.env.local`, и лежит он в дереве ПЛАТФОРМЫ, а не проекта. Написать ради него
// второй писатель значило бы завести два места, пишущих `.env`, — они разошлись
// бы на первой же правке формата, и разошлись бы молча.
//
// 🔒 УМОЛЧАНИЕ ПРЕЖНЕЕ, ПОЭТОМУ НИ ОДИН СУЩЕСТВУЮЩИЙ ВЫЗОВ НЕ МЕНЯЕТСЯ. Правка
// аддитивная по построению: вызов без второго аргумента ведёт себя ровно так же,
// как вёл до этой строки.
function envPath(path?: string): string {
  return path ?? process.env.SLOT_ENV_PATH ?? join(process.cwd(), ".env.local")
}

/**
 * Значение одной переменной из файла — не из `process.env`.
 *
 * `path` не задан — файл слота, как было всегда.
 */
export function readEnvValue(key: string, path?: string): string | null {
  try {
    const raw = readFileSync(envPath(path), "utf8")
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eq = trimmed.indexOf("=")
      if (eq < 0) continue
      if (trimmed.slice(0, eq).trim() !== key) continue
      // Кавычки вокруг значения снимаются: их ставят руками, и `"en,ru"` должно
      // читаться так же, как `en,ru`.
      return trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "")
    }
    return null
  } catch {
    return null
  }
}

/**
 * Записать одну переменную, сохранив файл во всём остальном.
 *
 * 🔒 СТРОКА ЗАМЕНЯЕТСЯ НА МЕСТЕ, А НЕ ДОПИСЫВАЕТСЯ В КОНЕЦ. Две строки с одним
 * ключом — законный синтаксис, и побеждает последняя: дописывание работало бы
 * ровно до того дня, когда кто-нибудь прочитает файл глазами и удалит «лишнюю»
 * верхнюю строку, вернув старое значение.
 */
export function writeEnvValue(key: string, value: string, file?: string): EnvWriteResult {
  const path = envPath(file)
  let lines: string[] = []
  let eol = "\n"

  try {
    if (existsSync(path)) {
      const raw = readFileSync(path, "utf8")
      // Переводы строк сохраняются такими, какими были: файл правят и руками, и
      // редакторами Windows, и менять их значило бы показывать чужую правку
      // в каждой строке при сравнении.
      eol = raw.includes("\r\n") ? "\r\n" : "\n"
      lines = raw.split(/\r?\n/)
    }
  } catch (e) {
    return { ok: false, reason: "write-failed", detail: String(e) }
  }

  const line = `${key}=${value}`
  let replaced = false
  const next = lines.map(l => {
    const trimmed = l.trim()
    if (trimmed.startsWith("#")) return l
    const eq = trimmed.indexOf("=")
    if (eq < 0) return l
    if (trimmed.slice(0, eq).trim() !== key) return l
    replaced = true
    return line
  })
  if (!replaced) {
    // Хвостовая пустая строка у файла обычно есть — вставляем перед ней, чтобы
    // не плодить пустых строк при каждом добавлении.
    if (next.length > 0 && next[next.length - 1].trim() === "") next.splice(next.length - 1, 0, line)
    else next.push(line)
  }

  const tmp = join(dirname(path), `.env.local.${process.pid}.${Date.now()}.tmp`)
  try {
    writeFileSync(tmp, next.join(eol), "utf8")
    renameSync(tmp, path)
    return { ok: true }
  } catch (e) {
    if (existsSync(tmp)) {
      try { unlinkSync(tmp) } catch { /* уже нет — тем лучше */ }
    }
    return { ok: false, reason: "write-failed", detail: String(e) }
  }
}
