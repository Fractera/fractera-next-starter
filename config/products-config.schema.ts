// Схема ДОСЬЕ продукта — `PRODUCTS-CONFIG/<id>.json`.
//
// 🔒 СХЕМА ОПИСЫВАЕТ ОДИН ПРОДУКТ, А НЕ РЕЕСТР (2026-08-18). Прежде здесь лежала
// форма общего файла со списком записей; теперь у каждого продукта свой файл, и
// он несёт всё: вопросы, ответы, кейсы с подтверждениями, шаги, план страниц,
// фазу и историю переходов. Рядом с досье лежит `registry.json` — распределитель
// вечных номеров, у него своя маленькая схема ниже.
//
// 🔒 `type` ПРОВЕРЯЕТСЯ ПО КАТАЛОГУ, А `id`, `route` И СЛАГИ — НЕТ. Структура —
// закрытый список из двадцати двух направлений, и значение вне его означает, что
// панель и слот разошлись версиями. Наоборот, `id` вечен и ничего не значит, а
// адрес и слаги владелец меняет когда угодно.

import { z } from "zod";
import { PROJECT_TYPES } from "./project-types";
import { PHASES, STAGES, STEP_STATUSES, STEP_IMPORTANCE, type ProductDossier } from "./products-config.defaults";

const useCaseSchema = z.looseObject({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  confirmed: z.boolean(),
  confirmedAt: z.string().nullable(),
  updatedAt: z.string(),
});

const stepSchema = z.looseObject({
  number: z.number(),
  title: z.string(),
  status: z.enum(STEP_STATUSES),
  importance: z.enum(STEP_IMPORTANCE),
  kind: z.enum(["work", "decomposition"]),
  cases: z.array(z.string()),
  plan: z.string(),
  result: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const productDossierSchema = z.looseObject({
  id: z.string(),
  title: z.string(),
  titleAuto: z.boolean().optional(),
  type: z.enum(PROJECT_TYPES),
  /** Единственное поле на языке владельца: его читает человек, не машина. */
  description: z.string().optional(),
  surface: z.enum(["public", "private", "headless"]),
  route: z.string(),
  published: z.boolean(),
  phase: z.enum(PHASES),
  stage: z.enum(STAGES),
  createdAt: z.string(),
  updatedAt: z.string(),
  intake: z.looseObject({
    questions: z.array(z.string()),
    answers: z.array(z.string()),
    seed: z.string(),
  }),
  cases: z.array(useCaseSchema),
  steps: z.array(stepSchema),
  pages: z.array(z.looseObject({
    path: z.string(),
    purpose: z.string(),
    /** Слаги кейсов страницы: хранятся слаги, показываются заголовки. */
    cases: z.array(z.string()).optional(),
  })),
  history: z.array(z.looseObject({
    at: z.string(),
    phase: z.enum(PHASES),
    stage: z.enum(STAGES),
    by: z.enum(["owner", "system"]),
  })),
});

/** Распределитель вечных номеров: фактов о продукте в нём нет ни одного. */
export const productsRegistrySchema = z.looseObject({
  version: z.number(),
  ids: z.array(z.string()),
  maxId: z.number(),
});

export const __productDossierSchemaMatchesType: z.infer<
  typeof productDossierSchema
> extends ProductDossier
  ? true
  : never = true;
