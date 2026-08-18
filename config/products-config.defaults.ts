// Реестр продуктов сервера — ТИПЫ И УМОЛЧАНИЯ (чистые данные, без `fs` и без env).
//
// 🔒 ПОЧЕМУ ЭТОТ ФАЙЛ ПОЯВИЛСЯ ПОЗЖЕ ТРЁХ СОСЕДЕЙ. `PRODUCTS-CONFIG` был
// единственным конфигом без своей половины в приложении: панель писала JSON, а
// прочитать его было нечем — ни типа, ни умолчаний, ни читателя. Агент открывал
// файл глазами, то есть форма реестра держалась на его внимательности.
//
// 🔒 ФОРМА ЗЕРКАЛИТСЯ, А НЕ ИМПОРТИРУЕТСЯ. Оригинал — `bridges/app/lib/products-config.ts`
// в репозитории панели: это другая сборка на другом порту, общего кода у нас нет
// и не будет. Тот же приём и по той же причине применён к `FEATURE_DEFAULTS` и к
// `PROJECT_TYPES`; связь держится тем, что источник назван прямо здесь.

import type { ProjectTypeId } from "./project-types";

/** Где продукт живёт: своим адресом, вкладкой панели или вовсе без экрана. */
export type ProductSurface = "public" | "private" | "headless";

/** `draft` — его ещё описывают · `building` — строят · `live` — отдают посетителям. */
export type ProductStatus = "draft" | "building" | "live";

/**
 * Состояние РАЗРАБОТКИ продукта. Порядок значим — это очередь, а не набор:
 * по нему считается «что дальше» и рисуется полоса продвижения.
 *
 * 🔒 ЭТО НЕ ТО ЖЕ, ЧТО `status`. `status` отвечает «видят ли его посетители» и
 * обратим одним нажатием; `devStatus` отвечает «где мы в работе» и движется в
 * одну сторону. Продукт бывает `live` и при этом в `extra-tasks`.
 */
export const DEV_STATUSES = [
  "not-started",
  "decomposition",
  "skeleton",
  "revision",
  "building",
  "acceptance",
  "extra-tasks",
  "done",
] as const;

export type ProductDevStatus = (typeof DEV_STATUSES)[number];

/** Предел описания — тот же, что в панели: обрезает тот, кто хранит. */
export const DESCRIPTION_MAX = 200;

export type Product = {
  /**
   * Вечный идентификатор (`p1`, `p2`). Ничего не значит и не меняется никогда:
   * на нём висят пути логики, имена таблиц и папка кейсов. Выводить его из
   * названия или структуры нельзя — владелец меняет и то и другое.
   */
  id: string;
  /** Имя для машины: отчёты, планы страниц, разговор с агентом. Английское. */
  title: string;
  type: ProjectTypeId;
  surface: ProductSurface;
  /** Публичный адрес. Пусто у `private` и `headless` — у них его нет и не должно быть. */
  route: string;
  status: ProductStatus;
  createdAt: string;
  /** Имя поставлено машиной и потому может быть переписано ею же. Имя человека — никогда. */
  titleAuto?: boolean;
  /**
   * Две фразы о продукте НА ЯЗЫКЕ ВЛАДЕЛЬЦА — единственное поле конфигов не на
   * английском, и исключение осознанное: его читает человек и никто больше.
   */
  description?: string;
  devStatus?: ProductDevStatus;
  /** Номера шагов разработки этого продукта — оглавление, а не их содержимое. */
  steps?: number[];
};

export type ProductsConfig = {
  version: number;
  products: Product[];
  /**
   * Наибольший выданный номер — включая продукты, которых уже нет: без него `id`
   * переиспользуется после удаления и новый продукт получает таблицы прежнего.
   */
  maxId?: number;
};

/** Сервер, на котором ещё не завели ни одного продукта. */
export const DEFAULT_PRODUCTS_CONFIG: ProductsConfig = { version: 1, products: [] };

/** Продукт, владеющий корнем сайта: у него `route` пустой или `/`. */
export function isRootProduct(p: Product): boolean {
  return p.surface === "public" && (p.route === "" || p.route === "/");
}

/** Четыре корня продукта — выводятся из записи, никогда не выдумываются. */
export function productRoots(p: Product): {
  pages: string;
  logic: string;
  tables: string;
  cases: string;
} {
  const segment = p.route.replace(/^\/+|\/+$/g, "");
  return {
    pages: segment ? `app/[lang]/(publicLayer)/${segment}/` : "app/[lang]/(publicLayer)/",
    logic: `lib/products/${p.id}/`,
    tables: `${p.id}_*`,
    cases: `development-docs/USE-CASES/${p.id}/`,
  };
}
