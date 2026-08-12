import "server-only";
import { getAppConfig, configValueForLang } from "@/config/app-config";
import type { MenuGroup, MenuChild } from "./group-menus";

// ВЕРХНЕЕ МЕНЮ ИЗ НАСТРОЕК ПАНЕЛИ (2026-08-12).
//
// 🔒 ЧТО ИЗМЕНИЛОСЬ. Раньше пункты меню брались только из манифестов групп на
// диске (`lib/menu/group-menus.ts`), то есть менялись правкой репозитория и
// пересборкой. Теперь их источник — ветка `nav` в `APP-CONFIG/app-config.json`,
// которую пишет панель управления.
//
// 🔒 ПОЧЕМУ ХРАНИЛИЩЕ ИМЕННО `APP-CONFIG`, а не `PLATFORM-CONFIG`. Во-первых,
// `APP-CONFIG` принадлежит панели и лежит ВНЕ git — развёртывание его не
// затрёт, тогда как соседний `PLATFORM-CONFIG` отслеживается git и рискует
// потерять правки при слиянии. Во-вторых, в `APP-CONFIG` уже живёт механизм
// переводов `i18n.<путь>.<язык>` — ровно то, что нужно подписям кнопок, и
// значит их переводит тот же диалог, что и остальные поля настроек.
//
// 🔒 СТАТИКА СОХРАНЯЕТСЯ. Чтение файла динамической страницу не делает: меню
// живёт в `[lang]`-макете под ISR (`revalidate`), а панель после сохранения
// зовёт `/api/revalidate`, который сбрасывает кэш именно этого макета. Значит
// изменение видно на следующей загрузке, без пересборки и без `force-dynamic`.

type RawItem = {
  id?: unknown;
  href?: unknown;
  order?: unknown;
  label?: unknown;
  children?: unknown;
};

/** Подпись пункта на языке: перевод, иначе базовое значение, иначе адрес. */
function labelFor(id: string, base: string, href: string, lang: string): string {
  const translated = configValueForLang(`nav.top.${id}.label`, lang);
  if (translated.trim() !== "") return translated;
  if (base.trim() !== "") return base;
  // Пункт без подписи вообще — показываем его адрес, а не пустую кнопку:
  // пустая кнопка выглядит поломкой вёрстки, а адрес хотя бы объясняет себя.
  return href.replace(/^\//, "") || id;
}

function toChild(raw: RawItem, lang: string): MenuChild | null {
  const id = typeof raw.id === "string" ? raw.id : "";
  const href = typeof raw.href === "string" ? raw.href : "";
  if (!id || !href) return null;
  return {
    slug: id,
    href,
    title: labelFor(id, typeof raw.label === "string" ? raw.label : "", href, lang),
  };
}

/**
 * Пункты верхнего меню из настроек. `null` — ветки `nav.top` в конфиге НЕТ.
 *
 * 🔒 «НЕТ» И «ПУСТО» — РАЗНЫЕ ОТВЕТЫ, и различать их обязательно. Пустой массив
 * значит «владелец убрал все кнопки», и меню обязано стать пустым. Отсутствие
 * ветки значит «владелец ещё не открывал раздел», и тогда работает прежний
 * источник — манифесты на диске. Не различай мы их, каждый существующий проект
 * потерял бы своё меню в момент обновления, молча.
 */
export function navGroupsFromConfig(lang: string): MenuGroup[] | null {
  const nav = (getAppConfig() as { nav?: { top?: unknown } }).nav;
  if (!nav || !Array.isArray(nav.top)) return null;

  const groups: MenuGroup[] = [];
  for (const entry of nav.top as RawItem[]) {
    if (!entry || typeof entry !== "object") continue;
    const id = typeof entry.id === "string" ? entry.id : "";
    if (!id) continue;

    const href = typeof entry.href === "string" ? entry.href : "";
    const children = Array.isArray(entry.children)
      ? (entry.children as RawItem[]).map((c) => toChild(c, lang)).filter((c): c is MenuChild => c !== null)
      : [];

    // Группа без собственного адреса ведёт на первого ребёнка: заголовок,
    // ведущий в никуда, — обещание, которого интерфейс не сдержит.
    const target = href || children[0]?.href || "";
    if (!target) continue;

    groups.push({
      slug: id,
      href: target,
      label: labelFor(id, typeof entry.label === "string" ? entry.label : "", target, lang),
      order: typeof entry.order === "number" ? entry.order : 0,
      childrenAsDropdown: children.length > 0,
      // Кандидатами в меню становятся только публичные маршруты — отбор делает
      // панель, поэтому роль здесь всегда публичная.
      roles: "public",
      children,
    });
  }

  return groups.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));
}
