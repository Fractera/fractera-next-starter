import "server-only";
import { readFileSync } from "fs";
import { join } from "path";
import { cache } from "react";
import {
  DEFAULT_PRODUCTS_CONFIG,
  type Product,
  type ProductsConfig,
} from "./products-config.defaults";
import { productsConfigSchema } from "./products-config.schema";
import { validateConfig } from "./config-validate";

// ЧИТАТЕЛЬ РЕЕСТРА ПРОДУКТОВ — недостающая половина четвёртого конфига.
//
// 🔒 ЧТО ЭТО ЛЕЧИТ. Панель писала `PRODUCTS-CONFIG/products-config.json` с
// августа, а в приложении не было ничего, что бы его открывало: ни типа, ни
// читателя. Реестр существовал только для человеческих глаз, и любая работа с
// продуктом опиралась на то, что агент правильно прочитал JSON руками.
//
// 🔒 ПРИЁМЫ ТЕ ЖЕ, ЧТО У ТРЁХ СОСЕДЕЙ (`app-config.ts`, `platform-config.ts`,
// `design-config.ts`): чтение с диска, `cache()` на один проход рендера,
// отсутствующий файл = норма, проверка по схеме с щадящей деградацией.
// Четыре читателя, ведущие себя по-разному, — источник вопросов «почему здесь
// применилось, а там нет».
//
// 🔒 НИКОГДА НЕ ИМПОРТИРОВАТЬ ИЗ КЛИЕНТСКОГО КОМПОНЕНТА — здесь `fs`.

const CONFIG_PATH =
  process.env.PRODUCTS_CONFIG_PATH ??
  join(process.cwd(), "PRODUCTS-CONFIG", "products-config.json");

/**
 * Живой реестр продуктов сервера.
 *
 * Отсутствующий или нечитаемый файл — НОРМА: значит продуктов ещё не заводили.
 * Пустой реестр честнее упавшей страницы: он и есть правда о таком сервере.
 */
export const getProductsConfig = cache((): ProductsConfig => {
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  } catch {
    return DEFAULT_PRODUCTS_CONFIG;
  }
  return validateConfig(
    productsConfigSchema,
    { ...DEFAULT_PRODUCTS_CONFIG, ...(raw as object) },
    DEFAULT_PRODUCTS_CONFIG,
    "PRODUCTS-CONFIG",
  );
});

/** Все продукты сервера в порядке их записи. */
export function getProducts(): Product[] {
  return getProductsConfig().products;
}

/** Продукт по вечному `id`, или `null`. Имя для поиска не годится: владелец его меняет. */
export function getProductById(id: string): Product | null {
  return getProducts().find((p) => p.id === id) ?? null;
}

/**
 * Продукты, которые видит посетитель.
 *
 * `private` живёт вкладкой панели, `headless` — каналами и расписанием; ни у
 * того, ни у другого публичного адреса нет, и печатать их в навигации значит
 * обещать страницу, которой не существует.
 */
export function getPublicProducts(): Product[] {
  return getProducts().filter((p) => p.surface === "public" && p.status === "live");
}

export function getProductsConfigPath(): string {
  return CONFIG_PATH;
}
