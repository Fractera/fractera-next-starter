// Brand identity of THIS project — one module, read from APP-CONFIG.
//
// 🔒 WHY THIS IS A FUNCTION AND NOT A CONSTANT. The project's identity (name,
// site URL, logo) lives in `APP-CONFIG/app-config.json` on the server, OUTSIDE
// the repository, and the owner edits it in the control panel. A module-level
// constant would be frozen at import time and, worse, would tempt someone to
// hardcode a name here — the one thing §4 of `CODING-STANDARDS.md` forbids: the
// app must read its identity, never carry it.
//
// This module was ported from the platform's marketing site, where the same
// values came from environment variables with Fractera's own defaults. That is
// exactly what must NOT ship in a starter: every customer project would
// introduce itself as Fractera until someone noticed.
//
// Server-only: `getAppConfig()` reads a file. Client islands receive the values
// they need as props.

import { getAppConfig } from "@/config/app-config"
import { getLogoPath, resolveBrandName } from "@/config/app-config.defaults"

export type Brand = {
  /** Product name used in titles and breadcrumbs. */
  name: string
  /** Legal entity for structured data (Organization publisher). */
  legalName: string
  /** Canonical site origin, no trailing slash. */
  siteUrl: string
  /** Absolute logo URL, or null when the owner has not uploaded one. */
  logoUrl: string | null
}

export function brand(): Brand {
  const cfg = getAppConfig()
  const siteUrl = (cfg.url ?? "").replace(/\/+$/, "")
  const logo = getLogoPath(cfg)
  return {
    name: resolveBrandName(cfg) ?? cfg.short_name ?? cfg.name,
    // No separate legal-entity field in APP-CONFIG yet: the author name is the
    // closest honest answer, and inventing "<name>, Inc." would put a legal
    // claim into structured data that nobody made.
    legalName: cfg.author?.name || cfg.name,
    siteUrl,
    logoUrl: logo ? (logo.startsWith("http") ? logo : `${siteUrl}${logo}`) : null,
  }
}
