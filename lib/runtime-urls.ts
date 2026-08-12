"use client";

// Client-side service URL derivation for the Shell app, based on the host the
// browser is actually on. Mirrors bridges/app/lib/runtime-urls.ts. We do NOT
// read NEXT_PUBLIC_* here: those are baked at build time and stay empty/stale
// across the IP→domain (Secure mode) switch, which has no app rebuild. Deriving
// from window.location works in both modes with one build.
//
// - IP / localhost (insecure mode): same host, service-specific ports.
// - Domain (Secure mode): sibling subdomains on 443, no ports. Building
//   `<host>:3001` on a domain yields https://admin.<domain>:3001 →
//   ERR_SSL_PROTOCOL_ERROR (3001 has no TLS).

// Помощники живут в `lib/site-urls.ts` — модуле БЕЗ `"use client"`, потому что
// они нужны и серверу тоже. Держать здесь вторую копию значит однажды починить
// одну и забыть другую.
import { isIpHost, apexFrom } from "./site-urls";

// Public base URL of the Auth service as the BROWSER must reach it.
export function authBase(): string {
  if (typeof window === "undefined") return "http://localhost:3001";
  const { protocol, hostname } = window.location;
  if (isIpHost(hostname)) return `${protocol}//${hostname}:3001`;
  return `${protocol}//auth.${apexFrom(hostname)}`;
}

// Public base URL of the Admin/Bridges service as the BROWSER must reach it.
export function adminBase(): string {
  if (typeof window === "undefined") return "http://localhost:3002";
  const { protocol, hostname } = window.location;
  if (isIpHost(hostname)) return `${protocol}//${hostname}:3002`;
  return `${protocol}//admin.${apexFrom(hostname)}`;
}

// Public base URL of the Projects service (fractera-projects :3003, step 197) — the automations
// layer that moved out of this slot into its own process. IP → <host>:3003 ; domain → projects.<apex>.
export function projectsBase(): string {
  if (typeof window === "undefined") return "http://localhost:3003";
  const { protocol, hostname } = window.location;
  if (isIpHost(hostname)) return `${protocol}//${hostname}:3003`;
  return `${protocol}//projects.${apexFrom(hostname)}`;
}

// Public base URL of the Design service (fractera-design :3004, step 197) — the future design-system
// surface on its own process. IP → <host>:3004 ; domain → design.<apex>.
export function designBase(): string {
  if (typeof window === "undefined") return "http://localhost:3004";
  const { protocol, hostname } = window.location;
  if (isIpHost(hostname)) return `${protocol}//${hostname}:3004`;
  return `${protocol}//design.${apexFrom(hostname)}`;
}

// Build the auth redirect for an unauthorized click on a protected destination.
// `requireRole` lets the auth form know whether the target needs architect (Start
// Coding → admin panel) or just any authenticated user (Dashboard).
export function registerRedirectUrl(callbackUrl: string, requireRole: "user" | "architect"): string {
  const url = new URL(`${authBase()}/register`);
  url.searchParams.set("callbackUrl", callbackUrl);
  url.searchParams.set("requireRole", requireRole);
  return url.toString();
}

// `adminUrlFromSite()` переехала в `lib/site-urls.ts`: её вызывает СЕРВЕРНЫЙ
// компонент главной, а отсюда, из-под `"use client"`, серверу её брать нельзя.
