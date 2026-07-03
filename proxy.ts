import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { shouldBypassAuth } from "@/lib/auth/auth-bypass";
import { getSession } from "@/lib/auth/get-session";
import { authBaseFromHost } from "@/lib/auth-base-server";
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
const AUTH_FORM_PATHS = new Set(["/login", "/register", "/guest-login"]);

// ──────────────────────────────────────────────────────────────────────────
// This proxy does TWO jobs, branched by path:
//   1. /api/*        → the auth gate (session cookie + admin-role for service APIs)
//   2. everything else → language routing ([lang] prefix), with the architect
//      SERVICE PAGES kept at the root (no language prefix) as proxy exceptions.
// Next.js 16.2 convention: this file is `proxy.ts` (the proxy() function +
// `export const config`), never `middleware.ts`.
// ──────────────────────────────────────────────────────────────────────────

// API namespaces behind the admin-only service pages (AI Core, Architecture,
// Development steps, Patterns, Glossary, Documents, AI Draft Settings, Debug).
// Calls to these require the admin role. Deliberately EXCLUDED (shared / needed by
// the public app or non-admin users): /api/health, /api/me, /api/media/*, and the
// Dashboard's /api/project/default/products. Agents (x-agent-identity) and IP mode
// (shouldBypassAuth) are always allowed — agents must keep writing these files.
const ADMIN_API_PREFIXES = [
  "/api/glossary",
  "/api/patterns",
  "/api/development-steps",
  "/api/ai-draft-settings",
  "/api/documents",
  "/api/projects",
  "/api/project/default/architecture",
  "/api/project/default/source",
  "/api/project/default/routing",
];

// Architect service pages — they live at the ROOT and never take a language
// prefix (a workspace operator visits /architecture, not /en/architecture). The
// language router below skips any path whose first segment is one of these.
// Only user-facing CONTENT (the home page and pages the user builds) goes under
// [lang]. Keep in sync with the app/ service-page folders.
const SERVICE_ROOTS = new Set([
  "ai-core",
  "architecture",
  "ai-draft-settings",
  "development-steps",
  "patterns",
  "documents",
  "glossary",
  "dashboard",
  "debug",
  "project",
]);

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

  if (pathname.startsWith("/api/") && pathname !== "/api/health") {
    if (!shouldBypassAuth()) {
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
    const target = `${authBaseFromHost(host, proto)}${pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(target);
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
