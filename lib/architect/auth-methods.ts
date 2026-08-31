import "server-only"
import { readEnvValue } from "./env-writer"

// СОСТОЯНИЕ СПОСОБОВ ВХОДА — ПЕРЕНЕСЕНО ИЗ ПАНЕЛИ (78-3, 2026-08-31).
//
// 🔒 ЭТО ПЕРЕНОС ПОВЕДЕНИЯ, А НЕ ВИДА. Панель держала ту же правду в двери
// `api/config/auth-methods`, и оттуда сюда переехало ВСЁ, что там решало: режим
// безопасности, маскирование, вычисление адреса возврата, признак «настроено».
// ✗ 31-18 оплачен ровно обратным: «чертёж и подписи забрал, а `WRITE_ENABLED =
// false` оставил в панели». Здешний аналог той строки — `isSecureMode()` ниже, и
// он называется иначе; ищущий по имени не нашёл бы его вовсе.
//
// 🔒 ГОСТЬ ЧИТАЕТ ФАЙЛ САМ И НЕ ХОДИТ В ПАНЕЛЬ. Панельная страница шла в свою же
// дверь по `ADMIN_INTERNAL_URL`; перенеси этот прыжок сюда — и приложение начало
// бы зависеть от панели в рантайме, то есть право владельца отвязаться умерло бы
// вместе с зависимостью. Здесь тот же файл читается напрямую.
//
// 🔒 ФАЙЛ ПРИНАДЛЕЖИТ ПЛАТФОРМЕ, А НЕ РЕПОЗИТОРИЮ. На сервере он рядом; на
// машине человека его нет вовсе — и это НЕ поломка, а честное состояние, о
// котором страница обязана сказать словами (`reachable: false`). Молчаливый
// отказ там прочитался бы как сломанный проект.

/** Окружение службы входа. Переопределяется ради проверок, а не ради гибкости. */
const AUTH_ENV = process.env.AUTH_ENV_PATH ?? "/opt/fractera/services/auth/.env.local"

/**
 * Четыре файла, в которых режим обязан быть выключен ОДНОВРЕМЕННО.
 *
 * 🔒 СПИСОК ПЕРЕЕХАЛ ЦЕЛИКОМ И НЕ СОКРАЩЁН. Соблазн проверить один свой файл
 * силён и неверен: режим — свойство ВСЕЙ установки, и сервер, у которого домен
 * настроен наполовину, обязан считаться незащищённым. Тот же список и то же
 * правило у мастера домена в панели.
 */
const MODE_FILES = [
  "/opt/fractera/services/auth/.env.local",
  "/opt/fractera/bridges/app/.env.local",
  "/opt/fractera/app/.env.local",
  "/opt/fractera/services/data/.env",
]

export type AuthMethods = {
  /** Дотянулись ли мы до окружения службы входа вообще. */
  reachable: boolean
  /** Защищённый режим: домен настроен, HTTPS работает. Только в нём можно править. */
  secure: boolean
  google: { configured: boolean; clientIdMasked: string | null }
  resend: { configured: boolean; keyMasked: string | null; from: string }
  /** Адрес возврата OAuth. `null`, пока домена нет. */
  googleCallbackUrl: string | null
}

/**
 * Защищённый режим — условие правки.
 *
 * 🔒 САМАЯ ДОРОГАЯ ФУНКЦИЯ ЭТОГО ФАЙЛА. Google OAuth требует HTTPS-адреса
 * возврата, вход по ссылке из письма — настоящего домена. В режиме «IP без
 * домена» оба способа не заработают, как бы верно ни были введены ключи. Дать
 * сохранить их там значит отправить человека искать ошибку в ключах, которых он
 * не портил.
 */
export function isSecureMode(): boolean {
  for (const f of MODE_FILES) {
    if (readEnvValue("FRACTERA_IP_NODOMAIN_MODE", f) !== "false") return false
  }
  return true
}

/**
 * Маска секрета.
 *
 * 🔒 МАСКИРУЕТ СЕРВЕР, И ЭТО НЕ ПЕРЕСТРАХОВКА. Замаскировать на клиенте значило
 * бы сначала отправить секрет в браузер — то есть отдать его вкладке
 * разработчика, расширениям и истории. Наружу уходит только результат этой
 * функции.
 */
export function mask(v: string): string {
  if (!v) return ""
  return v.length <= 8 ? "•".repeat(v.length) : `${v.slice(0, 4)}…${v.slice(-4)}`
}

/**
 * Адрес возврата OAuth.
 *
 * 🔒 СЧИТАЕТСЯ ОТ ДОМЕНА, А НЕ ПИШЕТСЯ СТРОКОЙ, И `null` ЗДЕСЬ ОСМЫСЛЕН. Домена
 * нет — адреса не существует, и показать шаблон с плейсхолдером было бы хуже
 * молчания: человек скопировал бы его в консоль Google и получил отказ входа без
 * объяснимой причины.
 *
 * 🔒 ДОМЕН БЕРЁТСЯ ИЗ ОКРУЖЕНИЯ, А НЕ ИЗ БАЗЫ ПАНЕЛИ. Панель читала его прямо из
 * `app.db` (`site_settings.custom_domain`) — ей можно, она стоит рядом с базой.
 * Гостю открывать чужую базу файлом нельзя: это обход слоя данных, единственной
 * двери к ним. Адрес сайта у гостя уже есть в его собственном окружении.
 */
export function googleCallbackUrl(): string | null {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? ""
  try {
    const host = new URL(site).hostname
    // IP-адрес доменом не является: у OAuth он не примет адрес возврата.
    if (!host || /^\d+\.\d+\.\d+\.\d+$/.test(host) || host === "localhost") return null
    const bare = host.replace(/^www\./, "")
    return `https://auth.${bare}/api/auth/callback/google`
  } catch {
    return null
  }
}

/** Полное состояние для страницы. Секреты сюда не попадают — только маски. */
export function readAuthMethods(): AuthMethods {
  const clientId = readEnvValue("GOOGLE_CLIENT_ID", AUTH_ENV) ?? ""
  const clientSecret = readEnvValue("GOOGLE_CLIENT_SECRET", AUTH_ENV) ?? ""
  const resendKey = readEnvValue("RESEND_API_KEY", AUTH_ENV) ?? ""
  const from = readEnvValue("AUTH_RESEND_FROM", AUTH_ENV) ?? ""

  // 🔒 «НЕ ДОТЯНУЛИСЬ» И «НЕ НАСТРОЕНО» — РАЗНЫЕ СОСТОЯНИЯ, И ЛЕЧЕНИЕ У НИХ
  // РАЗНОЕ. Первое значит «вы не на сервере», второе — «введите ключи». Панель
  // этой развилки не знала, потому что жила только на сервере; у гостя проект
  // уезжает на ноутбук, и там первое состояние — обычное дело.
  const reachable = readEnvValue("FRACTERA_IP_NODOMAIN_MODE", AUTH_ENV) !== null

  return {
    reachable,
    secure: reachable && isSecureMode(),
    google: {
      configured: Boolean(clientId && clientSecret),
      clientIdMasked: clientId ? mask(clientId) : null,
    },
    resend: {
      configured: Boolean(resendKey),
      keyMasked: resendKey ? mask(resendKey) : null,
      from,
    },
    googleCallbackUrl: googleCallbackUrl(),
  }
}
