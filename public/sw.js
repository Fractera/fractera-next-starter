/* Сервис-воркер приложения (шаг 504).
 *
 * 🔒 ГЛАВНОЕ РЕШЕНИЕ ЭТОГО ФАЙЛА — СТРАТЕГИЯ, А НЕ КОД.
 *
 * Сервис-воркер даёт офлайн и мгновенное повторное открытие, и он же — источник
 * самой дорогой жалобы в таких проектах: «я поменял текст на сайте, а в
 * приложении он старый». Причина всегда одна: воркер отдаёт СТРАНИЦУ из кеша.
 * У нас это недопустимо вдвойне — панель управления меняет настройки и тексты БЕЗ
 * пересборки, то есть кешированная страница расходится с настоящей в ту же минуту.
 *
 * Поэтому здесь стратегия, при которой устаревшая страница невозможна по
 * построению:
 *
 *   • ДОКУМЕНТЫ (HTML) — только из сети. Кеш используется ИСКЛЮЧИТЕЛЬНО когда
 *     сети нет: тогда открывается последняя виденная версия вместо экрана ошибки
 *     браузера. Пока сеть есть, пользователь всегда видит настоящую страницу.
 *   • СТАТИКА ПО ХЕШУ (`/_next/static/…`) — из кеша. Её адрес меняется при каждой
 *     сборке, поэтому устареть она не может физически: новый код = новый адрес.
 *   • ВСЁ ОСТАЛЬНОЕ (api, изображения, шрифты) — воркер не трогает.
 *
 * Отдельной офлайн-страницы нет намеренно: она потребовала бы слов на всех
 * языках, а слова — это партия перевода. Страница, которую посетитель уже
 * открывал, откроется из кеша и так; страница, которую он не открывал, честно
 * покажет ошибку сети.
 */

const VERSION = "v1";
const PAGES = `pages-${VERSION}`;
const ASSETS = `assets-${VERSION}`;

self.addEventListener("install", () => {
  // Ждать нечего: ничего не предзагружаем — предзагрузка означала бы решать за
  // пользователя, какие страницы ему понадобятся.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Кеши прошлых версий воркера удаляются целиком: держать их — значит
      // копить на устройстве мусор, который никто никогда не прочитает.
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== PAGES && k !== ASSETS).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Статика по хешу — из кеша, иначе из сети с сохранением.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(ASSETS).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      }),
    );
    return;
  }

  // Документы — сеть первой. Кеш только как замена экрану ошибки.
  const isDocument = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
  if (!isDocument) return;

  event.respondWith(
    (async () => {
      try {
        const res = await fetch(req);
        if (res.ok) {
          const cache = await caches.open(PAGES);
          cache.put(req, res.clone());
        }
        return res;
      } catch {
        const cached = await caches.match(req);
        if (cached) return cached;
        throw new Error("offline and not cached");
      }
    })(),
  );
});
