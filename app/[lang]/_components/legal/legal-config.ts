import "server-only";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import {
  LEGAL_LANGS,
  isContentDoc,
  type BannerConfig,
  type ContentDoc,
  type LegalConfig,
  type LegalDoc,
} from "./types";
import { buildDefaultConfig, buildDefaultBannerConfig } from "./default-content";

// Runtime-writable store, same pattern as config/app-config.ts (APP-CONFIG/… at the project working dir =
// /opt/fractera/app). Overridable via LEGAL_CONFIG_DIR. The architect's uploaded configs land here and
// survive redeploys (the folder is outside the built .next output).
const DIR = process.env.LEGAL_CONFIG_DIR ?? join(process.cwd(), "APP-CONFIG", "legal");
const pathFor = (doc: LegalDoc) => join(DIR, `${doc}.json`);

// Read a content document's config, MERGED over the shipped default so every language key always exists
// (a partially-filled upload never leaves a language undefined). Missing file → the pure default.
export function readLegalConfig(doc: ContentDoc): LegalConfig {
  const fallback = buildDefaultConfig(doc);
  try {
    const parsed = JSON.parse(readFileSync(pathFor(doc), "utf8")) as Partial<LegalConfig>;
    const languages = { ...fallback.languages };
    for (const [lang, entry] of Object.entries(parsed.languages ?? {})) {
      if (!entry) continue;
      languages[lang] = {
        title: entry.title || languages[lang]?.title || "",
        description: entry.description || languages[lang]?.description || "",
        body: Array.isArray(entry.body) ? entry.body.filter((s) => typeof s === "string") : languages[lang]?.body ?? [],
      };
    }
    return { document: doc, help: parsed.help ?? fallback.help, updatedAt: parsed.updatedAt, languages };
  } catch {
    return fallback;
  }
}

// Read the cookie-banner config, merged over the default the same way.
export function readBannerConfig(): BannerConfig {
  const fallback = buildDefaultBannerConfig();
  try {
    const parsed = JSON.parse(readFileSync(pathFor("cookie-banner"), "utf8")) as Partial<BannerConfig>;
    const languages = { ...fallback.languages };
    for (const [lang, e] of Object.entries(parsed.languages ?? {})) {
      if (!e) continue;
      languages[lang] = {
        message: e.message ?? languages[lang]?.message ?? "",
        policyLinkLabel: e.policyLinkLabel ?? languages[lang]?.policyLinkLabel ?? "",
        accept: e.accept ?? languages[lang]?.accept ?? "",
        reject: e.reject ?? languages[lang]?.reject ?? "",
      };
    }
    return { document: "cookie-banner", help: parsed.help ?? fallback.help, updatedAt: parsed.updatedAt, languages };
  } catch {
    return fallback;
  }
}

// Validate + normalize an uploaded config before it is written (architect-gated route). Returns the object
// to persist, or an error string. Accepts partial language coverage (merged on read) but rejects a wrong
// shape so a bad paste can never corrupt the store.
export function normalizeUpload(doc: LegalDoc, data: unknown): { ok: true; value: unknown } | { ok: false; error: string } {
  if (!data || typeof data !== "object") return { ok: false, error: "not an object" };
  const obj = data as Record<string, unknown>;
  const langs = obj.languages;
  if (!langs || typeof langs !== "object") return { ok: false, error: "missing `languages` object" };

  const cleanLangs: Record<string, unknown> = {};
  for (const [lang, entry] of Object.entries(langs as Record<string, unknown>)) {
    if (!(LEGAL_LANGS as readonly string[]).includes(lang)) continue; // ignore unknown language keys
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Record<string, unknown>;
    if (doc === "cookie-banner") {
      cleanLangs[lang] = {
        message: String(e.message ?? ""),
        policyLinkLabel: String(e.policyLinkLabel ?? ""),
        accept: String(e.accept ?? ""),
        reject: String(e.reject ?? ""),
      };
    } else {
      cleanLangs[lang] = {
        title: String(e.title ?? ""),
        description: String(e.description ?? ""),
        body: Array.isArray(e.body) ? e.body.map((s) => String(s)) : [],
      };
    }
  }
  if (Object.keys(cleanLangs).length === 0) return { ok: false, error: "no valid language entries" };

  return {
    ok: true,
    value: {
      document: doc,
      help: typeof obj.help === "string" ? obj.help : undefined,
      updatedAt: new Date().toISOString(),
      languages: cleanLangs,
    },
  };
}

export function writeConfig(doc: LegalDoc, data: unknown): void {
  mkdirSync(DIR, { recursive: true });
  writeFileSync(pathFor(doc), JSON.stringify(data, null, 2), "utf8");
}

// The download payload = the current merged config (complete: every language present, ready to fill/translate).
export function downloadPayload(doc: LegalDoc): LegalConfig | BannerConfig {
  return doc === "cookie-banner" ? readBannerConfig() : readLegalConfig(doc as ContentDoc);
}

export { isContentDoc };
