import { readFileSync } from "fs";
import { join } from "path";
import { cache } from "react";
import { AppConfig, DEFAULT_APP_CONFIG } from "./app-config.defaults";

// Server-only loader for the live site config. The config is a REAL JSON file on disk
// (APP-CONFIG/app-config.json at the project working dir = /opt/fractera/app), edited via
// Admin -> Site Settings. It is read fresh per request (deduped within one render by React
// cache()), so a save shows up on the next page load — no rebuild, no NEXT_PUBLIC bake-in.
// Same source-of-truth-on-disk pattern as glossary-file.ts / crud-docs (steps 107-112).
//
// NEVER import this from a client component (it uses fs). Client code receives config
// values as props from a server component; the pure types/defaults live in
// app-config.defaults.ts which IS client-safe.

const CONFIG_PATH =
  process.env.APP_CONFIG_PATH ?? join(process.cwd(), "APP-CONFIG", "app-config.json");

// Recursively merge a partial on-disk object over the code defaults so a missing or stale
// key never breaks rendering (the file is allowed to hold only the keys the owner changed).
function deepMerge<T>(base: T, over: unknown): T {
  if (over === null || over === undefined) return base;
  if (typeof base !== "object" || Array.isArray(base) || typeof over !== "object") {
    return over as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(over as Record<string, unknown>)) {
    out[k] = k in out ? deepMerge((base as Record<string, unknown>)[k], v) : v;
  }
  return out as T;
}

// 🔒 THIS LAYER ONLY READS THE CONFIG. IT NEVER WRITES IT. (revision 2026-08-09)
//
// The single source of truth is the control panel (:3002 → api/config/site). It owns
// the file; the app renders from it. Before this revision a helper here created the
// file from the shipped defaults on first read, which meant the product layer could
// author configuration too — two writers, and the panel would no longer be the one
// answer to "what is this app called".
//
// A missing file is not a problem to fix: it means the owner has not saved settings
// yet, and the committed defaults are exactly what the app should serve until they do.
// Creating it here would also turn code defaults into "the owner's saved settings" the
// moment anyone rendered a page.

// Keep fields that feed `new URL(...)` valid so a blank value can never 500 a render.
function normalize(cfg: AppConfig): AppConfig {
  const isUrl = (v: unknown): v is string => typeof v === "string" && /^https?:\/\//.test(v);
  if (!isUrl(cfg.url)) cfg.url = DEFAULT_APP_CONFIG.url;
  if (cfg.seo.canonicalBase !== undefined && !isUrl(cfg.seo.canonicalBase)) {
    cfg.seo.canonicalBase = cfg.url;
  }
  if (!cfg.lang) cfg.lang = DEFAULT_APP_CONFIG.lang;

  // Валюта приходит из панели свободным текстом, а `Intl.NumberFormat` на коде не
  // формата ISO-4217 БРОСАЕТ исключение — то есть владелец, напечатавший
  // «доллары», уронил бы каждую страницу с ценой. Тот же случай, что и с адресом
  // выше: непригодное значение заменяется рабочим, а не доводится до рендера.
  const cur = cfg.commerce?.currency;
  if (typeof cur !== "string" || !/^[A-Za-z]{3}$/.test(cur)) {
    cfg.commerce = { ...cfg.commerce, currency: DEFAULT_APP_CONFIG.commerce.currency };
  } else {
    cfg.commerce = { ...cfg.commerce, currency: cur.toUpperCase() };
  }
  return cfg;
}

// Read + merge the live config. Cached per request render pass; fresh across requests.
export const getAppConfig = cache((): AppConfig => {
  try {
    const raw = readFileSync(CONFIG_PATH, "utf8");
    return normalize(deepMerge(DEFAULT_APP_CONFIG, JSON.parse(raw)));
  } catch {
    return DEFAULT_APP_CONFIG;
  }
});

export function getConfigPath(): string {
  return CONFIG_PATH;
}

// ── Значения настроек НА ЯЗЫК (шаг 501, 2026-08-09) ───────────────────────────
//
// ДЕФЕКТ, который это лечит: `generateMetadata` строила заголовок и описание из
// `config.name` / `config.description` и даже не принимала язык. При
// `NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,es` испанская страница получала АНГЛИЙСКУЮ
// мету. Для поиска это хуже отсутствия перевода: страница объявляет себя
// англоязычной, будучи испанской.
//
// ФОРМА ХРАНЕНИЯ. Основное значение остаётся тем же ключом, переводы лежат рядом:
//   { "name": "Fractera", "i18n": { "name": { "es": "Fractera ES" } } }
// Поэтому старые конфиги читаются без миграции, а код, который берёт `config.name`
// и про языки не знает, продолжает работать.
//
// Языковыми являются ровно пять полей — их правит панель управления: `name`,
// `description`, `seo.titleTemplate`, `seo.keywords`, `og.siteName`. Остальное от
// языка не зависит (логотип, цвета, координаты, идентификаторы), и перевод им не
// нужен.

type I18nMap = Record<string, Record<string, string>>;

function atPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>(
    (acc, key) => (acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined),
    obj,
  );
}

/**
 * Значение настройки для языка: перевод, иначе основное значение.
 * Правило то же, что у панели: нет перевода — берётся основной язык, а не пустота.
 */
export function configValueForLang(path: string, lang: string): string {
  const cfg = getAppConfig() as AppConfig & { i18n?: I18nMap };
  const translated = cfg.i18n?.[path]?.[lang];
  if (typeof translated === "string" && translated.trim() !== "") return translated;
  const base = atPath(cfg, path);
  return typeof base === "string" ? base : "";
}

/**
 * Готовые заголовок и описание для языка — то, что нужно каждой `generateMetadata`.
 * Собрано одной функцией, чтобы четыре места не расходились в правилах подстановки.
 */
export function metaForLang(lang: string): { title: string; description: string; siteName: string } {
  const cfg = getAppConfig();
  const name = configValueForLang("name", lang) || cfg.short_name || "";
  const description = configValueForLang("description", lang);
  const siteName = configValueForLang("og.siteName", lang) || name;
  const template = configValueForLang("seo.titleTemplate", lang);
  // Шаблон заголовка применяется, только если в нём есть место для названия:
  // шаблон без подстановки молча стёр бы имя приложения.
  const title = template.includes("%s") ? template.replace("%s", name) : name;
  return { title, description, siteName };
}
