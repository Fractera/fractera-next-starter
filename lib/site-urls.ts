// Адреса служб, выведенные ИЗ АДРЕСА САЙТА — без окна браузера.
//
// 🔒 ПОЧЕМУ ЭТО ОТДЕЛЬНЫЙ ФАЙЛ, А НЕ ЧАСТЬ `runtime-urls.ts`. Тот файл начинается
// с `"use client"`, а такая директива красит КЛИЕНТСКИМ весь экспорт модуля —
// включая функции, которые ничего клиентского не делают. Серверный компонент,
// импортировавший такую функцию, падает на рендере с «Attempted to call
// adminUrlFromSite() from the server but adminUrlFromSite is on the client», и
// падает МОЛЧА для сборки: типы сходятся, ошибка появляется только когда
// страницу открывают. Ровно это и случилось с главной — она отдавала 500, пока
// функция жила в клиентском модуле.
//
// Здесь директивы нет, поэтому модуль читается и с сервера, и с клиента. Чистые
// помощники (`isIpHost`, `apexFrom`) живут тут же: у них ровно один источник, и
// клиентский `runtime-urls.ts` берёт их отсюда, а не держит вторую копию.

// Префиксы служебных поддоменов — по ним из любого служебного хоста
// восстанавливается апекс (`admin.aifa.dev` → `aifa.dev`) в доменном режиме.
export const KNOWN_PREFIXES = ["www", "auth", "admin", "data", "hermes", "lightrag", "projects", "design"];

export function isIpHost(hostname: string): boolean {
  return /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname) || hostname === "localhost";
}

export function apexFrom(hostname: string): string {
  const labels = hostname.split(".");
  return KNOWN_PREFIXES.includes(labels[0]) ? labels.slice(1).join(".") : hostname;
}

// Адрес панели, выведенный из адреса сайта, а не из окна браузера.
//
// 🔒 ЗАЧЕМ ЭТА ФОРМА. `adminBase()` в клиентском модуле читает `window.location`
// и потому работает только после гидратации — а главная обязана отдать ссылку на
// панель в СТАТИЧЕСКОМ HTML: её читает и человек с выключенным JS, и поисковик.
// Здесь адрес берётся из настроек (`APP-CONFIG.url`), которые сервер знает на
// рендере, и страница остаётся статической.
//
// Пустой адрес — законный исход свежего сервера, где настройки ещё не сохраняли:
// возвращаем пустую строку, а вызывающий показывает шаг без ссылки. Выдуманный
// адрес панели хуже отсутствующего: он ведёт человека в никуда на первом же шаге.
export function adminUrlFromSite(siteUrl: string | undefined): string {
  if (!siteUrl) return "";
  try {
    const { protocol, hostname } = new URL(siteUrl);
    if (isIpHost(hostname)) return `${protocol}//${hostname}:3002`;
    return `${protocol}//admin.${apexFrom(hostname)}`;
  } catch {
    return "";
  }
}
