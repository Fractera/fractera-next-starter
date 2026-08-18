// Схема `PRODUCTS-CONFIG/products-config.json` — форма ДАННЫХ.
//
// 🔒 `type` ПРОВЕРЯЕТСЯ ПО КАТАЛОГУ, А `id` И `route` — НЕТ. Структура проекта —
// закрытый список из двадцати двух направлений, и значение вне его означает, что
// панель и слот разошлись версиями; такое честнее вылечить умолчанием. Наоборот,
// `id` и `route` — свободные строки по своей природе: первый вечен и ничего не
// значит, второй владелец меняет когда угодно.
//
// 🔒 ЧЕГО В СХЕМЕ НЕТ — самих кейсов. Они файлы в `development-docs/USE-CASES/<id>/`;
// этот файл лишь оглавление, и класть в конфиг, читаемый на каждый запрос, тексты
// сценариев значило бы заставить рантайм разбирать документ.

import { z } from "zod";
import { PROJECT_TYPES } from "./project-types";
import { DEV_STATUSES, type ProductsConfig } from "./products-config.defaults";

const productSchema = z.looseObject({
  id: z.string(),
  title: z.string(),
  type: z.enum(PROJECT_TYPES),
  surface: z.enum(["public", "private", "headless"]),
  /** Пусто у `private` и `headless`: адреса у них нет и быть не должно. */
  route: z.string(),
  status: z.enum(["draft", "building", "live"]),
  createdAt: z.string(),
  titleAuto: z.boolean().optional(),
  /** Единственное поле конфигов на языке владельца — его читает человек. */
  description: z.string().optional(),
  devStatus: z.enum(DEV_STATUSES).optional(),
  /** Номера шагов, а не их содержимое. */
  steps: z.array(z.number()).optional(),
});

export const productsConfigSchema = z.looseObject({
  version: z.number(),
  products: z.array(productSchema),
  /** Наибольший выданный номер — включая удалённые продукты: `id` вечен. */
  maxId: z.number().optional(),
});

export const __productsConfigSchemaMatchesType: z.infer<
  typeof productsConfigSchema
> extends ProductsConfig
  ? true
  : never = true;
