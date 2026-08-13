import "server-only";
import { readFileSync } from "fs";
import { join } from "path";
import { cache } from "react";

// ЧИТАТЕЛЬ ВЫКЛЮЧАТЕЛЕЙ ВОЗМОЖНОСТЕЙ — недостающая половина механизма.
//
// 🔒 ЧТО ЭТО ЛЕЧИТ. Панель управления давно писала эти девять флагов в
// `PLATFORM-CONFIG/platform-config.json`, но в приложении не было ни файла,
// который бы их читал, ни самой папки. То есть владелец переключал «Верхнее
// меню» и «Авторизация», видел изменение на экране панели — и оно не доходило
// до сайта никогда. Выключатель, который ничего не выключает, хуже
// отсутствующего: человек считает задачу решённой.
//
// Приёмы намеренно те же, что у `config/app-config.ts` (соседний файл): чтение с
// диска, слияние поверх кодовых значений, `cache()` на один проход рендера.
// Два читателя конфигов, ведущие себя по-разному, — источник вопросов «почему
// здесь применилось, а там нет».
//
// 🔒 ПРИМЕНЯЕТСЯ БЕЗ ПЕРЕСБОРКИ. Файл читается на рендере, а `[lang]`-макет
// живёт под ISR (`revalidate`), поэтому сохранение в панели видно на следующей
// перегенерации; панель дополнительно зовёт `/api/revalidate`, и тогда — сразу.
// Страницы при этом остаются статическими: динамическими их делает не чтение
// файла, а `force-dynamic`, которого здесь нет.
//
// 🔒 НИКОГДА НЕ ИМПОРТИРОВАТЬ ИЗ КЛИЕНТСКОГО КОМПОНЕНТА — здесь `fs`. Значения
// уезжают в островки пропсами из серверного компонента.

export type FeatureKey =
  | "auth"
  | "breadcrumbs"
  | "faq"
  | "themeToggle"
  | "widthToggle"
  | "languageSwitcher"
  | "topMenu"
  | "footerPages"
  | "cookieBanner"
  | "offlineCache";

/**
 * Состояние проекта, который ещё ни разу не настраивали.
 *
 * 🔒 ЗНАЧЕНИЯ ПРОДУБЛИРОВАНЫ, А НЕ ИМПОРТИРОВАНЫ из панели намеренно: панель —
 * чужой репозиторий, её здесь нет и не будет. Дублируется девять булевых
 * значений; связь держится тем, что источник назван прямо здесь.
 * Источник: `bridges/app/lib/platform-features.shared.ts` (`FEATURE_DEFAULTS`).
 */
export const FEATURE_DEFAULTS: Record<FeatureKey, boolean> = {
  topMenu: true,
  footerPages: true,
  cookieBanner: false,
  offlineCache: true,
  auth: false,
  breadcrumbs: false,
  faq: false,
  themeToggle: true,
  widthToggle: true,
  languageSwitcher: true,
};

export type PlatformConfig = {
  features: Record<FeatureKey, boolean>;
  /**
   * Решал ли владелец судьбу возможности САМ.
   *
   * 🔒 ЗАЧЕМ ЭТО ОТДЕЛЬНО ОТ `features`. «Выключено по умолчанию» и «владелец
   * выключил» — разные вещи, и путать их значит ломать работающие серверы.
   * Авторизация до этого механизма жила сборочной переменной; будь у нас только
   * `features.auth === false`, каждый такой сервер молча потерял бы кнопку входа
   * при первом же развёртывании. Поэтому запасное значение применяется, ПОКА
   * владелец не высказался, и перестаёт — как только он тронул выключатель.
   */
  explicit: Record<FeatureKey, boolean>;
  /** Параллельная маршрутизация — читается двумя историческими именами. */
  parallel: boolean;
};

const CONFIG_PATH =
  process.env.PLATFORM_CONFIG_PATH ??
  join(process.cwd(), "PLATFORM-CONFIG", "platform-config.json");

/**
 * Живое состояние возможностей.
 *
 * Отсутствующий файл — НОРМА, а не сбой: он означает «владелец ещё ничего не
 * настраивал», и тогда действуют значения по умолчанию. Нечитаемый файл ведёт
 * себя так же: показать приложение со значениями по умолчанию честнее, чем
 * уронить страницу из-за одной сломанной скобки в настройках.
 */
export const getPlatformConfig = cache((): PlatformConfig => {
  let raw: Record<string, unknown> = {};
  try {
    raw = JSON.parse(readFileSync(CONFIG_PATH, "utf8")) as Record<string, unknown>;
  } catch {
    raw = {};
  }

  const saved = (raw.features ?? {}) as Record<string, unknown>;
  const features = {} as Record<FeatureKey, boolean>;
  const explicit = {} as Record<FeatureKey, boolean>;
  for (const key of Object.keys(FEATURE_DEFAULTS) as FeatureKey[]) {
    const own = typeof saved[key] === "boolean";
    explicit[key] = own;
    features[key] = own ? (saved[key] as boolean) : FEATURE_DEFAULTS[key];
  }

  return {
    features,
    explicit,
    parallel: raw.routingMode === "parallel" || raw.parallelRouting === true,
  };
});

/** Включена ли возможность. Единственная форма вопроса, которую стоит задавать. */
export function featureOn(key: FeatureKey): boolean {
  return getPlatformConfig().features[key];
}

/** Высказывался ли владелец об этой возможности — см. `explicit` выше. */
export function featureDecided(key: FeatureKey): boolean {
  return getPlatformConfig().explicit[key];
}
