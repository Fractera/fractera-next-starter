import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { AppConfig, DEFAULT_APP_CONFIG } from "./app-config.defaults";
import { getAppConfig, getConfigPath } from "./app-config";

// AGENT VIEW of the site config — the English (base) slice, small enough to read at session start.
//
// WHY THIS EXISTS. The app's identity — its name, description, brand, SEO, author, organization —
// is NOT in the code: it lives in APP-CONFIG/app-config.json on the server, outside git. An agent
// that never reads it does not know what application it is developing.
//
// WHY NOT JUST READ THE FILE. Since step 501 the config also carries TRANSLATIONS under the `i18n`
// branch (`i18n.<path>.<lang>`), and the owner may enable up to 82 languages. Five translated
// fields x 82 languages is a wall of text that says nothing new about the project — the same five
// sentences again and again — and it would eat the context window that the actual work needs.
// So this view keeps the base (English) values and DROPS the `i18n` branch outright, reporting only
// the fact that translations exist and how many.
//
// Server/CLI only (fs). The pure part — buildAgentConfigView / renderAgentConfigView — takes a
// config object and can be reused anywhere. Read the file itself only if you need a single
// translated value; for that there is configValueForLang() in app-config.ts.

/** One "path: value" fact about the app. */
export interface AgentConfigLine {
  path: string;
  value: string;
}

export interface AgentConfigView {
  /** "live-file" = the owner's saved settings; "committed-defaults" = fresh server, nothing saved yet. */
  source: "live-file" | "committed-defaults";
  configPath: string;
  languages: { codes: string[]; defaultLocale: string; origin: string };
  lines: AgentConfigLine[];
  /** Settings the owner has NOT filled in — names only, no empty values printed. */
  unset: string[];
  /** Presence summary of the dropped `i18n` branch, or null when the app has no translations. */
  translations: { fields: string[]; languages: string[] } | null;
}

// Top-level branches that never help an agent understand the project:
//   i18n  — translations of five fields; the whole point of this view is to leave them out.
//   menus — documented in app-config.defaults.ts as a deprecated no-op kept for file back-compat.
const SKIP_ROOT_KEYS = new Set(["i18n", "menus"]);

// A value longer than this is a payload, not a fact. Nothing in this config legitimately needs
// more (URLs, hex colors, one-sentence descriptions all fit); a data:-URI logo is ~50 000 chars.
const MAX_VALUE_CHARS = 160;

function summarizeString(value: string): string {
  if (value.startsWith("data:")) {
    const head = value.slice(0, Math.max(value.indexOf(","), 0) || 24);
    return `<${head} — ${value.length} chars, omitted>`;
  }
  if (value.length > MAX_VALUE_CHARS) {
    return `${value.slice(0, MAX_VALUE_CHARS)}… (${value.length} chars)`;
  }
  return value;
}

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value as object).length === 0;
  return false; // `false` and `0` are answers, not blanks — robotsIndex:false is a real fact.
}

// A record of slots most of which are usually null (images: 11 slots, icons: 7). Printing each
// null would cost more lines than the whole rest of the view, and printing nothing would hide the
// fact that the app has no branding yet — which an agent must know. So: one line naming the slots
// that ARE filled, with the total.
function summarizeSlots(path: string, record: Record<string, unknown>, lines: AgentConfigLine[]): void {
  const total = Object.keys(record).length;
  const set = Object.entries(record)
    .filter(([, v]) => !isEmpty(v))
    .map(([k]) => k);
  lines.push({
    path,
    value: set.length === 0 ? `none of ${total} set` : `${set.join(", ")} (${set.length} of ${total} set)`,
  });
}

function walk(node: unknown, prefix: string, lines: AgentConfigLine[], unset: string[]): void {
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (!prefix && SKIP_ROOT_KEYS.has(key)) continue;

    if (path === "images" || path === "icons") {
      summarizeSlots(path, (value ?? {}) as Record<string, unknown>, lines);
      continue;
    }
    if (path === "iconSet") {
      // A generated PWA icon set: its `files` map is ~8 machine paths that tell an agent nothing
      // beyond "a set exists".
      const set = value as AppConfig["iconSet"];
      if (!set) unset.push(path);
      else lines.push({ path, value: `generated set ${set.id} (${Object.keys(set.files ?? {}).length} files)` });
      continue;
    }

    // The FACT that a setting is blank matters (an unnamed author, no keywords, no address), but
    // an empty value printed in full costs a line each. Names are collected and reported once.
    if (isEmpty(value)) {
      unset.push(path);
      continue;
    }

    if (Array.isArray(value)) {
      lines.push({ path, value: summarizeString(value.map(String).join(", ")) });
      continue;
    }
    if (typeof value === "object") {
      walk(value, path, lines, unset);
      continue;
    }
    lines.push({ path, value: typeof value === "string" ? summarizeString(value) : String(value) });
  }
}

/**
 * Pure builder: config object in, compact agent view out. `languages` is passed in because the
 * language set lives in the env (build-time), not in this file.
 */
export function buildAgentConfigView(
  cfg: AppConfig,
  opts: {
    source: AgentConfigView["source"];
    configPath: string;
    languages: { codes: string[]; defaultLocale: string; origin: string };
  },
): AgentConfigView {
  const lines: AgentConfigLine[] = [];
  const unset: string[] = [];
  walk(cfg, "", lines, unset);

  const i18n = (cfg as AppConfig & { i18n?: Record<string, Record<string, string>> }).i18n;
  const fields = i18n ? Object.keys(i18n) : [];
  const langs = new Set<string>();
  for (const perLang of Object.values(i18n ?? {})) for (const l of Object.keys(perLang)) langs.add(l);

  return {
    source: opts.source,
    configPath: opts.configPath,
    languages: opts.languages,
    lines,
    unset,
    translations: fields.length ? { fields, languages: [...langs].sort() } : null,
  };
}

/** Plain-text rendering — what the agent actually reads. */
export function renderAgentConfigView(view: AgentConfigView): string {
  const out: string[] = [];
  out.push("APP CONFIG — agent view (base/English values only; translations dropped)");
  out.push(
    view.source === "live-file"
      ? `source: ${view.configPath} (the owner's saved settings)`
      : `source: NO config file at ${view.configPath} — the app runs on the committed defaults shown below. ` +
          "This is normal on a fresh server; the owner's first save in Admin → App Settings replaces them.",
  );
  out.push(
    `languages: ${view.languages.codes.join(", ")} (${view.languages.codes.length}) · ` +
      `default ${view.languages.defaultLocale} · ${view.languages.origin}`,
  );
  if (view.translations) {
    // The codes are listed only while the list is short. At 82 languages the enumeration alone
    // would be the longest line in the view, and it adds nothing: what the app serves is the
    // `languages:` line above; here the fact that matters is "translations exist, this many".
    const langs = view.translations.languages;
    const detail = langs.length <= 12 ? ` [${langs.join(", ")}]` : "";
    out.push(
      `translations: ${view.translations.fields.length} field(s) × ${langs.length} language(s)${detail}` +
        " — omitted here on purpose (they repeat the values below).",
    );
  }
  out.push("");
  for (const { path, value } of view.lines) out.push(`${path}: ${value}`);
  if (view.unset.length) {
    out.push("");
    out.push(`not set by the owner: ${view.unset.join(", ")}`);
  }
  return out.join("\n");
}

// The language set is a build-time env value (NEXT_PUBLIC_SUPPORTED_LANGUAGES). A CLI run has no
// Next.js around it and therefore no loaded .env.local, so fall back to reading the file the way
// the pipeline in CLAUDE.md prescribes — a plain file read, no API.
function readEnvKey(key: string): { value: string; origin: string } {
  const fromProcess = process.env[key]?.trim();
  if (fromProcess) return { value: fromProcess, origin: "read from the process env" };
  for (const rel of [".env.local", "app/.env.local"]) {
    try {
      const file = readFileSync(join(process.cwd(), rel), "utf8");
      const match = file.match(new RegExp(`^\\s*${key}\\s*=\\s*(.+?)\\s*$`, "m"));
      if (match) return { value: match[1].trim().replace(/^["']|["']$/g, ""), origin: `read from ${rel}` };
    } catch {
      /* try the next location */
    }
  }
  // .env.local is gitignored, so a local clone often has none — say so instead of claiming "en".
  return { value: "", origin: `${key} not found here (no .env.local) — assuming en` };
}

function readLanguages(): AgentConfigView["languages"] {
  const supported = readEnvKey("NEXT_PUBLIC_SUPPORTED_LANGUAGES");
  const codes = supported.value
    .split(",")
    .map((l) => l.trim().toLowerCase())
    .filter(Boolean);
  const wanted = readEnvKey("NEXT_PUBLIC_DEFAULT_LOCALE").value.trim().toLowerCase();
  const list = codes.length ? codes : ["en"];
  return {
    codes: list,
    defaultLocale: wanted && list.includes(wanted) ? wanted : list[0],
    origin: supported.origin,
  };
}

/**
 * Read the live config (or the committed defaults when there is none) and return the agent view.
 * Entry point for both the CLI script and any server code that wants the same slice.
 */
export function getAgentConfigView(): AgentConfigView {
  const configPath = getConfigPath();
  const present = existsSync(configPath);
  // Deliberately NOT calling getAppConfig() when the file is absent: it seeds the file from the
  // defaults on first read, and an agent merely LOOKING at the config in a local clone must not
  // create server state — nor then report that state back as if the owner had saved it.
  const cfg: AppConfig = present ? getAppConfig() : DEFAULT_APP_CONFIG;
  return buildAgentConfigView(cfg, {
    source: present ? "live-file" : "committed-defaults",
    configPath,
    languages: readLanguages(),
  });
}
