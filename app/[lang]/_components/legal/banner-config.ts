import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { BannerConfig } from "./types";

// Настройки cookie-баннера — узкий читатель ТОЛЬКО под баннер (2026-08-12).
//
// 🔒 ПОЧЕМУ ОТДЕЛЬНЫЙ ФАЙЛ. Прежний `legal-config.ts` обслуживал пять страниц
// legal и баннер разом. Страницы снесены: они объявляли `force-dynamic`, то есть
// нарушали главный канон проекта и для поиска почти не существовали. Баннер
// остался — у него своё основание (требование ЕС) и свой выключатель в панели, —
// и утащить его следом было бы уничтожением работающего ради чистоты.
//
// 🔒 ЗАПИСИ ЗДЕСЬ НЕТ. Прежний модуль умел ещё и писать конфиг; это право ушло
// вместе со страницами. Настройки баннера правит панель, приложение их читает —
// один писатель, как у `APP-CONFIG/app-config.json`.

const DIR = process.env.LEGAL_CONFIG_DIR ?? join(process.cwd(), "APP-CONFIG", "legal");

/** Пустой набор языков: сам баннер подставляет свои строки, когда конфига нет. */
function fallback(): BannerConfig {
  return { document: "cookie-banner", help: "", languages: {} };
}

/**
 * Прочитать настройки баннера, слив их поверх пустого набора.
 *
 * Файла нет — норма: владелец не менял тексты, и баннер показывает свои. Битый
 * файл ведёт себя так же: показать баннер со стандартными словами честнее, чем
 * уронить каждую страницу сайта из-за одной скобки в настройках.
 */
export function readBannerConfig(): BannerConfig {
  const base = fallback();
  try {
    const parsed = JSON.parse(readFileSync(join(DIR, "cookie-banner.json"), "utf8")) as Partial<BannerConfig>;
    const languages = { ...base.languages };
    for (const [lang, e] of Object.entries(parsed.languages ?? {})) {
      if (!e) continue;
      languages[lang] = {
        message: e.message ?? languages[lang]?.message ?? "",
        policyLinkLabel: e.policyLinkLabel ?? languages[lang]?.policyLinkLabel ?? "",
        accept: e.accept ?? languages[lang]?.accept ?? "",
        reject: e.reject ?? languages[lang]?.reject ?? "",
      };
    }
    return { document: "cookie-banner", help: parsed.help ?? base.help, updatedAt: parsed.updatedAt, languages };
  } catch {
    return base;
  }
}
