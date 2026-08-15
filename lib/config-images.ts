import "server-only";
import { getAppConfig } from "@/config/app-config";
import { DEFAULT_APP_CONFIG, type RegularImageType } from "@/config/app-config.defaults";

// Картинки страниц-заглушек — ОДНА дверь к слотам `images.*` настроек.
//
// 🔒 ЧТО ЭТО ЛЕЧИТ. Механизм был собран наполовину: панель управления предлагала
// владельцу восемь картинок (404, 500, загрузка, главная), а гостевое приложение
// не читало ни одной — `getImagePath()` была экспортирована и не вызывалась
// НИОТКУДА. Владелец грузил файл, панель говорила «сохранено», и картинка не
// появлялась нигде. Тот же класс дефекта, что уже описан у выключателей
// возможностей: настройка, которая ничего не настраивает, хуже отсутствующей —
// человек считает задачу решённой.
//
// При этом одна картинка на сайте всё-таки была: знак на странице 404 жил путём
// `/404-logo.png`, вписанным прямо в компонент. То есть слот `notFound-*`
// существовал в панели, а страница показывала не его.
//
// 🔒 ПОЧЕМУ ПАРА, А НЕ ОДНА КАРТИНКА. Тема переключается классом `.dark` на
// `<html>`, и тон картинки обязан идти за ней: знак Fractera нарисован белым по
// непрозрачному чёрному поле — на светлой странице это чёрный квадрат.
//
// 🔒 СВЕТЛЫЙ ВАРИАНТ — ОСНОВНОЙ, И ЭТО НЕ ВКУСОВЩИНА. Класс `.dark` ставит
// инлайн-скрипт (`components/theme-init.tsx`); с ВЫКЛЮЧЕННЫМ JavaScript он не
// появляется никогда, и страница остаётся светлой. Поэтому светлая картинка
// показывается по умолчанию, а тёмная — вариантом под `dark:`. Сделай наоборот —
// и посетитель без JS получит чёрный прямоугольник на белой странице, ровно на
// том экране, который и так означает «что-то сломалось».

/** Слоты, у которых есть тёмный и светлый вариант. */
export type ImageSlot = "loading" | "notFound" | "error500" | "homePage";

export type ImagePair = { light: string | null; dark: string | null };

function slotValue(cfg: ReturnType<typeof getAppConfig>, key: RegularImageType): string | null {
  const value = cfg.images?.[key];
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

/**
 * Пара картинок слота: что показать на светлой теме и что на тёмной.
 *
 * Пустой слот отдаётся как `null`, а не подменяется вторым вариантом: слот,
 * который владелец очистил намеренно, обязан остаться пустым. Пустоту место
 * вызова рисует как отсутствие картинки, а не как дыру в вёрстке.
 */
export function configImagePair(slot: ImageSlot): ImagePair {
  const cfg = getAppConfig();
  return {
    light: slotValue(cfg, `${slot}-light` as RegularImageType),
    dark: slotValue(cfg, `${slot}-dark` as RegularImageType),
  };
}

/**
 * Один вариант слота — для мест, где выбрать тему нельзя.
 *
 * Такое место в проекте одно: `app/global-error.tsx`. Next заменяет им корневой
 * макет целиком, поэтому глобальный CSS там не гарантирован, а вместе с ним не
 * работают ни `dark:`, ни классы вообще. Страница нарисована инлайн-стилями по
 * белому фону — значит и картинка ей нужна светлая, ровно одна.
 */
export function configImageSingle(slot: ImageSlot, tone: "light" | "dark" = "light"): string | null {
  const pair = configImagePair(slot);
  return pair[tone] ?? pair[tone === "light" ? "dark" : "light"];
}

/**
 * Умолчание слота — то, что показывает проект, которого ещё не настраивали.
 *
 * Нужно двери `/api/config-image/[slot]`: она обязана ответить картинкой даже
 * когда файл настроек нечитаем, иначе страница ошибки сама останется с битым
 * изображением.
 */
export function defaultSlotImage(slot: ImageSlot, tone: "light" | "dark"): string | null {
  return DEFAULT_APP_CONFIG.images[`${slot}-${tone}` as RegularImageType] ?? null;
}
