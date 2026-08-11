// Author identity of THIS project — the person a post is attributed to.
//
// Used twice, and the two uses must never disagree: the visible byline under a
// quote block, and the `author` (Person) node of the article's structured data.
// Search engines consolidate a person into ONE entity through `sameAs`; two
// different spellings of the same author split that entity in half.
//
// 🔒 READ, NEVER HARDCODE. The values come from `APP-CONFIG` (control panel →
// App settings → Author + Social). The version this was ported from carried the
// platform founder's name and eight of his profile links as constants — shipping
// that in a starter would attribute every customer's article to someone else.
//
// WHERE THE VALUES COME FROM: control panel → App settings → Author. That form
// writes `APP-CONFIG/app-config.json`, which is the same file this reads — name,
// job title, photo and the three profile links all have fields there.
//
// Empty is a legitimate state: a project whose owner has not filled the author
// section gets no byline and no Person node. Better no attribution than a false
// one.

import { getAppConfig } from "@/config/app-config"
import { socialUrls } from "@/config/app-config.defaults"

export type Author = {
  name: string
  /** Job title shown under the byline. Empty when the owner left it blank. */
  role: string
  /** Photo URL, or null — the byline then renders without an avatar. */
  photo: string | null
  url: string
  /** Stable id for structured data: the site origin + a fragment. */
  id: string
}

function siteOrigin(): string {
  return (getAppConfig().url ?? "").replace(/\/+$/, "")
}

export function author(): Author {
  const cfg = getAppConfig()
  const site = siteOrigin()
  return {
    name: cfg.author?.name ?? "",
    role: cfg.author?.jobTitle ?? "",
    photo: cfg.author?.image ?? null,
    url: cfg.author?.url || site,
    id: `${site}/#author`,
  }
}

/** True when the owner filled in an author at all. */
export function hasAuthor(): boolean {
  return Boolean(getAppConfig().author?.name)
}

/** Profile URLs that consolidate the author into one entity (JSON-LD sameAs). */
export function authorSameAs(): string[] {
  const cfg = getAppConfig()
  const own = [cfg.author?.linkedin, cfg.author?.twitter, cfg.author?.facebook, cfg.author?.url]
  return [...new Set([...socialUrls(cfg.seo?.social), ...own].filter(Boolean) as string[])]
}

/** Labelled subset shown under a quote (rel="me author"). */
export function authorSocialLinks(): { label: string; href: string }[] {
  const a = getAppConfig().author
  if (!a) return []
  const out: { label: string; href: string }[] = []
  if (a.linkedin) out.push({ label: "LinkedIn", href: a.linkedin })
  if (a.twitter) out.push({ label: "X", href: a.twitter })
  if (a.facebook) out.push({ label: "Facebook", href: a.facebook })
  return out
}
