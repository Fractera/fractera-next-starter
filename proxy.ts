import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { shouldBypassAuthEdge } from "@/lib/auth/auth-bypass.edge";
import { getSession } from "@/lib/auth/get-session";
import { authBaseFromHost, projectsBaseFromHost } from "@/lib/auth-base-server";
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  SINGLE_LANG_MODE,
} from "@/config/translations/translations.config";

// Auth-service routes that must NEVER be served by this app. The login /
// registration / guest forms belong to the auth service (auth.<domain> in Secure
// mode, <ip>:3001 in IP mode). If anything navigates the browser to a relative
// "/login" or "/register" on the app domain, the language router below would
// rewrite it to "/<lang>/register" — a page this app does not have → white
// screen. This guard rescues any such stray link by redirecting to the auth host
// (a different host, so there is no redirect loop). See
// reports/errors/relative-auth-path-langprefix-whitescreen.md.
// /logout (step 169): the account drawer's sign-out is a relative /logout link, routed to the
// auth service the same way — the auth service clears the session cookie and redirects back
// here (Job 0 attaches the absolute redirectUrl, since the auth host can't guess this origin).
const AUTH_FORM_PATHS = new Set(["/login", "/register", "/guest-login", "/logout"]);

// ──────────────────────────────────────────────────────────────────────────
// This proxy does TWO jobs, branched by path:
//   1. /api/*        → the auth gate (session cookie + admin-role for service APIs)
//   2. everything else → language routing ([lang] prefix), with the architect
//      SERVICE PAGES kept at the root (no language prefix) as proxy exceptions.
// Next.js 16.2 convention: this file is `proxy.ts` (the proxy() function +
// `export const config`), never `middleware.ts`.
// ──────────────────────────────────────────────────────────────────────────

// The architect SERVICE pages and their APIs moved out of this slot into the admin
// app (:3002/service/*) in step 170 — the slot no longer serves any admin-only API
// namespace. The APIs that remain here are shared/product ones any signed-in (or IP
// mode) user reaches: /api/health, /api/me, /api/media/*, the Dashboard's
// /api/project/default/products, and /api/revalidate. So no path needs the extra
// architect-role gate; a valid session (or x-agent-identity / IP bypass) is enough.
const ADMIN_API_PREFIXES: string[] = [];

// 🔒 ПУБЛИЧНЫЕ ДВЕРИ — ИХ НАДО НАЗЫВАТЬ, ИНАЧЕ ИХ ЗАКРОЕТ ГЕЙТ (найдено 2026-08-19).
//
// Гейт ниже закрывает /api/* целиком, и в режиме обхода это незаметно: локально и
// на голом IP вход отключён, всё отвечает. На домене та же дверь отдаёт 401 —
// проверено живьём: кнопка «показать ещё» в каталоге получала Unauthorized, то
// есть каталог за первой партией товаров переставал существовать для посетителя.
//
// Признак публичной двери один: она отдаёт то, что и так лежит в разметке
// публичной страницы. Прятать за сессией нечего, а прятать — значит ломать.
//
// Дверь, работающая для гостя, обязана быть НАЗВАНА здесь. Забыли назвать —
// возможность работает у разработчика и падает у покупателя.
const PUBLIC_API_PREFIXES = [
  "/api/health",
  "/api/catalogue",   // догрузка витрины: те же товары, что в статическом HTML
  "/api/i18n",        // строки интерфейса — они и так в разметке
  "/api/project-types",
  // Служба каналов толкает сюда сообщение бота: у неё нет сессии, поэтому дверь
  // стережёт общий секрет, а не роль. Без этой строки гейт закрыл бы её от самой платформы.
  "/api/telegram/hook",
  // Часовая стрелка: та же служба, тот же секрет. ✗ префикс сначала забыли, и
  // дверь честно отвечала 401 самой платформе — гейт закрывает /api/* целиком,
  // а «соседний маршрут» для него не родня: сверка идёт по точному префиксу.
  "/api/telegram/tick",
  // Дверь ПРИЁМА первой волны (133): принимает сообщение во все хранилища и
  // возвращает текст для агента, не сочиняя ответа. Стучится машина — предзагрузчик
  // MCP, — и стережёт её тот же общий секрет, что и две двери выше.
  "/api/intake",
];

// Non-content root pages that live at the ROOT and never take a language prefix
// (an operator visits /dashboard, not /en/dashboard). The language router below
// skips any path whose first segment is one of these. The architect service pages
// (architecture, glossary, documents, …) moved to the admin app in step 170; only
// the Dashboard and per-project workspaces remain rooted in the slot. Only
// user-facing CONTENT (the home page and pages the user builds) goes under [lang].
// Keep in sync with the app/(service) folders.
// 🪦 EMPTY SINCE 2026-08-11 — and the emptiness is the decision.
//
// `dashboard` moved into the protected layer under `[lang]`, so it takes a
// language prefix like every other page: a signed-in person reads their own
// language, and there is no reason their dashboard should be the one screen in
// the product that is English-only. `project` had already stopped existing as a
// page; the entry outlived it.
//
// Keep the mechanism: a root page that genuinely must never be prefixed (a
// webhook landing, a health page) belongs here. Adding a normal page to this set
// is how a surface silently loses its languages.
const SERVICE_ROOTS = new Set<string>([]);

const LOCALE_COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

function withLangCookie(response: NextResponse, lang: string): NextResponse {
  response.cookies.set(LOCALE_COOKIE, lang, {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
  return response;
}

function detectLang(request: NextRequest): string {
  // Priority 1: cookie
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && SUPPORTED_LANGUAGES.includes(cookie)) return cookie;

  // Priority 2: Accept-Language header
  const acceptLang = request.headers.get("accept-language") ?? "";
  const matched = acceptLang
    .split(",")
    .map((l) => ({
      code: l.split(";")[0].trim().split("-")[0].toLowerCase(),
      q: parseFloat(l.split(";q=")[1] ?? "1"),
    }))
    .sort((a, b) => b.q - a.q)
    .find((l) => SUPPORTED_LANGUAGES.includes(l.code));

  return matched?.code ?? DEFAULT_LANGUAGE;
}

// ── Job 1: API auth gate (unchanged behavior) ──────────────────────────────
async function apiAuthGate(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Generated favicon / PWA icon assets are public brand files referenced by the
  // manifest and <head> (fetched by the browser before login) — never gate them.
  if (pathname.startsWith("/api/media/icons/")) {
    return NextResponse.next();
  }

  // 🔒 ЧТЕНИЕ ФАЙЛА МЕДИА — ПУБЛИЧНО (найдено владельцем на живом сайте 2026-08-13).
  //
  // Картинки товаров и материалов живут в хранилище, а посетитель каталога — не
  // авторизован по определению. Пока этот путь был закрыт, ЛЮБОЕ изображение из
  // хранилища отвечало посетителю 401, оптимизатор поверх него 400, и на странице
  // оставались пустые квадраты. Не всплывало это лишь потому, что показывали
  // статические файлы из `public/`; в тот день, когда каталог перевели на
  // хранилище, витрина осталась без картинок.
  //
  // Открыт РОВНО ОДИН глагол — чтение конкретного файла по его идентификатору
  // (`/api/media/<id>/file`). Ни список хранилища, ни загрузка, ни удаление,
  // ни правка сюда не попадают: они остаются за сессией, как и были. Тот, кто
  // знает идентификатор, и так получает картинку через страницу, на которой она
  // стоит, — прятать её содержимое, показывая его же на публичной витрине, значит
  // защищать не тайну, а собственную видимость.
  if (/^\/api\/media\/[^/]+\/file\/?$/.test(pathname)) {
    return NextResponse.next();
  }

  // 🔒 КАРТИНКА СТРАНИЦЫ-ЗАГЛУШКИ — ПУБЛИЧНА, И ИНАЧЕ БЫТЬ НЕ МОЖЕТ (2026-08-15).
  //
  // Тот же класс дефекта, что абзацем выше, и найден он тем же способом — живым
  // запросом, а не чтением кода: дверь отвечала 401 всем, включая посетителя,
  // ради которого её и завели. Границы ошибок Next обязаны быть клиентскими,
  // читать настройки они не могут и берут картинку по этому адресу; человек,
  // попавший на страницу «что-то пошло не так», по определению не авторизован —
  // а чаще всего именно СЛОМАВШАЯСЯ авторизация его туда и привела. Закрытая
  // дверь означала бы: на экране ошибки ещё и битая картинка.
  //
  // Открыто РОВНО чтение слота по имени. Отдаётся при этом не файл, а
  // перенаправление на него; сами файлы — заглушки из `public/` или картинки
  // хранилища, чьё чтение уже публично по правилу выше.
  if (/^\/api\/config-image\/[A-Za-z0-9-]+\/?$/.test(pathname)) {
    return NextResponse.next();
  }

  // 🔒 ОПИСАНИЕ НАПРАВЛЕНИЯ — ПУБЛИЧНО, И ЭТО ТРЕТИЙ СЛУЧАЙ ТОГО ЖЕ КЛАССА
  // (найдено живым запросом 2026-08-17, сразу после включения домена).
  //
  // Лента направлений стоит на ГЛАВНОЙ, где посетитель не авторизован по
  // определению, а тело окна она берёт по нажатию с этого адреса. Пока путь был
  // закрыт, окно открывалось и показывало «описание не загрузилось» — каждому,
  // ради кого лента и сделана.
  //
  // 🔒 ПОЧЕМУ ЭТОГО НЕ БЫЛО ВИДНО ДО СЕГОДНЯ. Сервер работал в режиме без домена,
  // где авторизация обходится целиком (`shouldBypassAuth`), и адрес отвечал 200 —
  // я проверил его живьём и увидел зелёное. С включением HTTPS и домена режим
  // сменился на строгий, и та же проверка стала давать 401. Пруф, снятый в режиме
  // обхода, ничего не говорит о защищённом режиме — вот дословный пример.
  //
  // Отдаётся статический файл, собранный на сборке из корпуса, который целиком
  // лежит в разметке публичной страницы: прятать за сессией нечего.
  if (/^\/api\/project-types\/[a-z]{2}\/[a-z0-9-]+\/?$/.test(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/") && !PUBLIC_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (!shouldBypassAuthEdge()) {
      const agentIdentity = request.headers.get("x-agent-identity");
      if (!agentIdentity) {
        const sessionToken =
          request.cookies.get("authjs.session-token") ??
          request.cookies.get("__Secure-authjs.session-token");

        if (!sessionToken) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Admin-gate the service-page API namespaces (role, not just a cookie).
        if (ADMIN_API_PREFIXES.some((p) => pathname.startsWith(p))) {
          const session = await getSession(request);
          if (!session?.roles?.includes("architect")) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
          }
        }
      }
    }
  }

  return NextResponse.next();
}

// ── Job 2: language routing for content pages ──────────────────────────────
function languageRouter(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  // Service pages stay at the root — never prefixed with a language.
  if (SERVICE_ROOTS.has(firstSegment)) return NextResponse.next();

  // Single-language mode: hide the lang prefix from public URLs.
  // /en/about → 301 /about ; internally rewrite /about → /en/about.
  if (SINGLE_LANG_MODE) {
    const singleLang = SUPPORTED_LANGUAGES[0];
    if (SUPPORTED_LANGUAGES.includes(firstSegment)) {
      const without = pathname.replace(`/${singleLang}`, "") || "/";
      const url = request.nextUrl.clone();
      url.pathname = without;
      return withLangCookie(NextResponse.redirect(url, 301), singleLang);
    }
    const url = request.nextUrl.clone();
    url.pathname = `/${singleLang}${pathname}`;
    return withLangCookie(NextResponse.rewrite(url), singleLang);
  }

  // Multi-language mode: language already present in the URL → pass through.
  if (SUPPORTED_LANGUAGES.includes(firstSegment)) {
    const res = NextResponse.next();
    res.headers.set("x-lang", firstSegment);
    return withLangCookie(res, firstSegment);
  }

  // No language prefix → detect and route.
  const lang = detectLang(request);

  // Keep the bare root `/` REWRITING (not redirecting) to `/<DEFAULT_LANGUAGE>`
  // when the detected lang IS the default, so crawlers and direct links to `/`
  // receive real HTML at the root instead of a redirect.
  if (pathname === "/" || pathname === "") {
    if (lang === DEFAULT_LANGUAGE) {
      const url = request.nextUrl.clone();
      url.pathname = `/${DEFAULT_LANGUAGE}`;
      const res = NextResponse.rewrite(url);
      res.headers.set("x-lang", lang);
      res.headers.set("Vary", "Cookie, Accept-Language");
      return withLangCookie(res, lang);
    }
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}`;
    return withLangCookie(NextResponse.redirect(url), lang);
  }

  // Non-root content path without a language prefix → redirect to /<lang>/… .
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname}`;
  return withLangCookie(NextResponse.redirect(url), lang);
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Job 0 — rescue stray auth-form links to the auth host (before language
  // routing, which would otherwise rewrite "/register" → "/<lang>/register").
  if (AUTH_FORM_PATHS.has(pathname)) {
    const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    const search = new URLSearchParams(request.nextUrl.search);
    // /logout (step 169): the auth service clears the cookie and then must land the visitor
    // BACK on this site — but it cannot derive this origin (IP mode: different port; secure
    // mode: different subdomain). Attach the absolute return URL for it, language-aware.
    if (pathname === "/logout" && !search.has("redirectUrl") && host) {
      const lang = search.get("lang")
        ?? request.cookies.get(LOCALE_COOKIE)?.value
        ?? DEFAULT_LANGUAGE;
      const backLang = SUPPORTED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
      search.set("redirectUrl", `${proto === "https" ? "https" : "http"}://${host}/${backLang}`);
    }
    const qs = search.toString();
    const target = `${authBaseFromHost(host, proto)}${pathname}${qs ? `?${qs}` : ""}`;
    return NextResponse.redirect(target);
  }

  // Job 0.5 — bridge the Projects layer to its own service (step 211). The Projects
  // layer (§3.12) left this slot in step 197 and runs in fractera-projects (:3003 /
  // projects.<apex>). A request that still lands here for /projects — the owner's
  // muscle-memory URL, a stale link, or a /[lang]/projects hit — is redirected to
  // that service instead of 404-ing (projects are NOT under [lang] on the slot, so
  // the language router would rewrite /projects → /<lang>/projects and 404). This is
  // future-proof: EVERY project path (including projects not yet created) bridges
  // automatically, so a newly composed project is reachable the moment it deploys —
  // no per-project wiring. Projects are monolingual → strip any leading /<lang>.
  {
    const segs = pathname.split("/").filter(Boolean);
    const langLess = segs[0] && SUPPORTED_LANGUAGES.includes(segs[0]) ? segs.slice(1) : segs;
    if (langLess[0] === "projects") {
      const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
      const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
      const projPath = "/" + langLess.join("/");
      const qs = request.nextUrl.search;
      return NextResponse.redirect(`${projectsBaseFromHost(host, proto)}${projPath}${qs}`);
    }
  }

  // Job 1 — API auth gate.
  if (pathname.startsWith("/api")) {
    return apiAuthGate(request);
  }

  // Job 2 — language routing for everything else.
  return languageRouter(request);
}

// Match API routes (for the auth gate) AND content pages (for language routing).
// Exclude Next internals and any file with an extension (static assets, the
// webmanifest, favicons) — those are served directly.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)"],
};
