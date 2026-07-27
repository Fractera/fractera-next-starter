// PUBLIC CATALOG CLIENT (step 304) — the public app surface (this slot, port 3000) mirrors the Projects
// layer's categories + automations WITHOUT any cockpit, and it has no filesystem access to those folders
// (they live in the separate fractera-projects app, :3003). So it reads them over HTTP from that service's
// public read-only endpoint /api/projects/public-catalog. SERVER-ONLY module, always no-store: these pages
// are dynamic by the owner's decision (step 304).
//
// The base is the CO-LOCATED service on the same host — always http://localhost:3003 (overridable via
// PROJECTS_SERVICE_URL). We deliberately do NOT use runtime-urls.ts projectsBase(): that module is
// "use client" and throws when called from a server component ("projectsBase is on the client"). An internal
// server→server call never needs the public hostname anyway.
const PROJECTS_BASE = process.env.PROJECTS_SERVICE_URL ?? "http://localhost:3003";

export type AccessTier = "guest" | "user" | "architect";

export type CatalogAutomation = {
  slug: string;
  title: string;
  description: string;
  access: AccessTier;
};

export type CatalogCategory = {
  slug: string;
  titleI18n: Record<string, string>;
  descriptionI18n: Record<string, string>;
  automations: CatalogAutomation[];
};

export type CatalogAutomationHero = { category: string } & CatalogAutomation;

async function fetchCatalog(qs = ""): Promise<Record<string, unknown> | null> {
  const url = `${PROJECTS_BASE}/api/projects/public-catalog${qs}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// Every category with its automations — the home page.
export async function getCatalog(): Promise<CatalogCategory[]> {
  const data = await fetchCatalog();
  return (data?.categories as CatalogCategory[] | undefined) ?? [];
}

// One category with its automations — the category page. null = unknown category (→ notFound()).
export async function getCategory(category: string): Promise<CatalogCategory | null> {
  const data = await fetchCatalog(`?category=${encodeURIComponent(category)}`);
  return (data?.category as CatalogCategory | undefined) ?? null;
}

// One automation's hero (title + description) + access tier — the automation page.
// null = unknown category/automation (→ notFound()).
export async function getAutomation(
  category: string,
  automation: string,
): Promise<CatalogAutomationHero | null> {
  const data = await fetchCatalog(
    `?category=${encodeURIComponent(category)}&automation=${encodeURIComponent(automation)}`,
  );
  if (!data || data.error) return null;
  return data as unknown as CatalogAutomationHero;
}

// Pick a localized string from a {lang: value} map, falling back to English then any available value.
export function pickI18n(map: Record<string, string> | undefined, lang: string): string {
  if (!map) return "";
  return map[lang] ?? map[lang.slice(0, 2)] ?? map.en ?? Object.values(map)[0] ?? "";
}
