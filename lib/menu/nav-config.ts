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

/**
 * Слот меню, которым управляет владелец из панели.
 *
 * Их ровно два, и это не заготовка на будущее: верхняя полоса и подвал — разные
 * места с разным смыслом, но одной машиной. Боковые ящики (`left`/`right`)
 * по-прежнему живут манифестами групп на диске: их наполняет разработчик, а не
 * владелец, и тащить их в настройки значило бы дать владельцу рычаг от того,
 * чего он не создавал.
 */
export type NavSlot = "top" | "footer";

type RawItem = {
  id?: unknown;
  href?: unknown;
  order?: unknown;
  label?: unknown;
  children?: unknown;
};

/**
 * 🔒 ПРЕДЕЛ ДЛИНЫ — ТОЛЬКО У КНОПОК В ПОЛОСЕ (владелец, 2026-08-12).
 *
 * Полоса меню одна и горизонтальна: один длинный пункт разносит её на телефоне,
 * поэтому кнопки верхнего уровня режутся до двенадцати знаков с многоточием.
 *
 * 🔒 ПУНКТЫ ВЫПАДАЮЩЕГО СПИСКА НЕ РЕЖУТСЯ (уточнение владельца 2026-08-12).
 * Список вертикальный, места по высоте сколько угодно, и обрезанный там текст —
 * чистая потеря смысла: человек уже открыл список, чтобы ПРОЧИТАТЬ названия.
 * За ширину отвечает вёрстка списка, а не обрезка строки.
 *
 * Ограничение стоит здесь, на рендере, а не только в поле ввода панели: подпись
 * может приехать из перевода или из конфига, набранного руками.
 */
const LABEL_MAX = 12;

function clamp(text: string): string {
  const t = text.trim();
  // Многоточие — один знак, поэтому режем до предела и добавляем его: строка
  // ровно предельной длины остаётся целой и без «хвоста».
  return t.length <= LABEL_MAX ? t : `${t.slice(0, LABEL_MAX - 1).trimEnd()}…`;
}

/** Подпись пункта на языке: перевод, иначе базовое значение, иначе адрес. */
function labelFor(slot: NavSlot, id: string, base: string, href: string, lang: string, full = false): string {
  const cut = (t: string) => (full ? t.trim() : clamp(t));
  const translated = configValueForLang(`nav.${slot}.${id}.label`, lang);
  if (translated.trim() !== "") return cut(translated);
  if (base.trim() !== "") return cut(base);
  // Пункт без подписи вообще — показываем его адрес, а не пустую кнопку:
  // пустая кнопка выглядит поломкой вёрстки, а адрес хотя бы объясняет себя.
  return clamp(href.replace(/^\//, "") || id);
}

function toChild(slot: NavSlot, raw: RawItem, lang: string): MenuChild | null {
  const id = typeof raw.id === "string" ? raw.id : "";
  const href = typeof raw.href === "string" ? raw.href : "";
  if (!id || !href) return null;
  return {
    slug: id,
    href,
    title: labelFor(slot, id, typeof raw.label === "string" ? raw.label : "", href, lang, true),
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
/**
 * Страницы подвала, которые проект показывает БЕЗ всякой настройки.
 *
 * 🔒 СВЕЖИЙ ПРОЕКТ ОБЯЗАН ВЫГЛЯДЕТЬ ГОТОВЫМ (владелец, 2026-08-12). Три страницы
 * лежат в дереве с первой минуты, и подвал без ссылок на них выглядел бы
 * поломкой: страницы есть, а дойти до них неоткуда. Владелец откроет раздел
 * панели — его набор станет главным, и этот список больше не применяется.
 *
 * Подписи берутся из тех же ключей перевода, что и у настроенных пунктов,
 * поэтому ничего специального для языков здесь нет.
 */
const DEFAULT_FOOTER: { id: string; href: string; label: string }[] = [
  { id: "privacy", href: "/privacy", label: "Privacy" },
  { id: "terms", href: "/terms", label: "Terms" },
  { id: "cookies", href: "/cookies", label: "Cookies" },
];

export function defaultFooterGroups(lang: string): MenuGroup[] {
  return DEFAULT_FOOTER.map((p, i) => ({
    slug: p.id,
    href: p.href,
    label: labelFor("footer", p.id, p.label, p.href, lang),
    order: (i + 1) * 10,
    childrenAsDropdown: false,
    roles: "public",
    children: [],
  }));
}

export function navGroupsFromConfig(slot: NavSlot, lang: string): MenuGroup[] | null {
  const nav = (getAppConfig() as { nav?: Record<string, unknown> }).nav;
  const list = nav?.[slot];
  if (!nav || !Array.isArray(list)) return null;

  const groups: MenuGroup[] = [];
  for (const entry of list as RawItem[]) {
    if (!entry || typeof entry !== "object") continue;
    const id = typeof entry.id === "string" ? entry.id : "";
    if (!id) continue;

    const href = typeof entry.href === "string" ? entry.href : "";
    const children = Array.isArray(entry.children)
      ? (entry.children as RawItem[]).map((c) => toChild(slot, c, lang)).filter((c): c is MenuChild => c !== null)
      : [];

    // Группа без собственного адреса ведёт на первого ребёнка: заголовок,
    // ведущий в никуда, — обещание, которого интерфейс не сдержит.
    const target = href || children[0]?.href || "";
    if (!target) continue;

    groups.push({
      slug: id,
      href: target,
      label: labelFor(slot, id, typeof entry.label === "string" ? entry.label : "", target, lang),
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
