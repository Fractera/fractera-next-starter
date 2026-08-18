import "server-only";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { cache } from "react";
import {
  DEFAULT_PRODUCT_DOSSIER, DEFAULT_PRODUCTS_REGISTRY,
  type ProductDossier,
} from "./products-config.defaults";
import { productDossierSchema, productsRegistrySchema } from "./products-config.schema";
import { validateConfig } from "./config-validate";

// ЧИТАТЕЛЬ ПРОДУКТОВ — по файлу на продукт (2026-08-18).
//
// 🔒 ПОЧЕМУ НЕ ОДИН ФАЙЛ. Прежде реестр лежал одним `products-config.json`, а
// вопросы, ответы, кейсы и шаги — в трёх других местах. Теперь у продукта один
// дом: `PRODUCTS-CONFIG/<id>.json`. Список продуктов — это обход папки, а не
// второй файл со списком: файл-оглавление разошёлся бы с папкой в первую неделю.
//
// 🔒 ПРИЁМЫ ТЕ ЖЕ, ЧТО У ТРЁХ СОСЕДЕЙ (`app-config`, `platform-config`,
// `design-config`): `cache()` на один проход рендера, отсутствующий файл = норма,
// проверка по схеме с щадящей деградацией. Четыре читателя, ведущие себя
// по-разному, — источник вопросов «почему здесь применилось, а там нет».
//
// 🔒 НИКОГДА НЕ ИМПОРТИРОВАТЬ ИЗ КЛИЕНТСКОГО КОМПОНЕНТА — здесь `fs`.

const DIR = process.env.PRODUCTS_CONFIG_DIR ?? join(process.cwd(), "PRODUCTS-CONFIG");

/** Идентификаторы по файлам на диске — правда о том, какие продукты есть. */
function ids(): string[] {
  try {
    return readdirSync(DIR)
      .filter((f) => /^p\d+\.json$/.test(f))
      .map((f) => f.replace(/\.json$/, ""))
      .sort((a, b) => (Number(a.slice(1)) || 0) - (Number(b.slice(1)) || 0));
  } catch {
    return [];
  }
}

/** Порядок показа. Реестра нет — берётся порядок номеров: он предсказуем. */
const order = cache((): string[] => {
  const onDisk = ids();
  try {
    const raw = JSON.parse(readFileSync(join(DIR, "registry.json"), "utf8"));
    const reg = validateConfig(productsRegistrySchema, raw, DEFAULT_PRODUCTS_REGISTRY, "PRODUCTS-CONFIG/registry");
    return [...reg.ids.filter((id) => onDisk.includes(id)), ...onDisk.filter((id) => !reg.ids.includes(id))];
  } catch {
    return onDisk;
  }
});

/**
 * Один продукт целиком.
 *
 * Отсутствующий или нечитаемый файл — НОРМА: значит такого продукта нет. Пустой
 * ответ честнее упавшей страницы: он и есть правда о таком сервере.
 */
export const getProduct = cache((id: string): ProductDossier | null => {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(join(DIR, `${id}.json`), "utf8"));
  } catch {
    return null;
  }
  return validateConfig(
    productDossierSchema,
    { ...DEFAULT_PRODUCT_DOSSIER, ...(raw as object), id },
    { ...DEFAULT_PRODUCT_DOSSIER, id },
    `PRODUCTS-CONFIG/${id}`,
  );
});

export const getProducts = cache((): ProductDossier[] =>
  order().map((id) => getProduct(id)).filter((p): p is ProductDossier => p !== null));

/**
 * Продукты, которые видит посетитель.
 *
 * `private` живёт вкладкой панели, `headless` — каналами и расписанием; ни у того,
 * ни у другого публичного адреса нет, и печатать их в навигации значит обещать
 * страницу, которой не существует. Непубликованный продукт тоже не показывается:
 * `published` — это выключатель показа, отдельный от фазы работы.
 */
export function getPublicProducts(): ProductDossier[] {
  return getProducts().filter((p) => p.surface === "public" && p.published);
}

/** Продукт по вечному `id`. По имени не ищем: владелец его меняет. */
export function getProductById(id: string): ProductDossier | null {
  return getProduct(id);
}

export function getProductsDir(): string {
  return DIR;
}
