// Продукт — ТИПЫ И УМОЛЧАНИЯ (чистые данные, без `fs` и без env).
//
// 🔒 ФОРМА ИЗМЕНИЛАСЬ 2026-08-18: ПРОДУКТ — ЕДИНСТВЕННЫЙ ИСТОЧНИК ПРАВДЫ.
// Прежде реестр лежал одним файлом `PRODUCTS-CONFIG/products-config.json`, а
// вопросы, ответы, кейсы и шаги — в трёх других местах (папка `USE-CASES`,
// таблица `development_steps`). Теперь всё, чем продукт ЯВЛЯЕТСЯ, лежит в
// `PRODUCTS-CONFIG/<id>.json`; рядом `registry.json` — только распределитель
// вечных номеров, и `<id>.quiz.jsonl` — лента разговора (сырьё, не состояние).
//
// 🔒 ФОРМА ЗЕРКАЛИТСЯ, А НЕ ИМПОРТИРУЕТСЯ. Пишет досье панель
// (`bridges/app/lib/product-store.ts` в репозитории платформы) — это другая
// сборка на другом порту, общего кода у нас нет. Тот же приём и по той же причине
// применён к `FEATURE_DEFAULTS` и `PROJECT_TYPES`.

import type { ProjectTypeId } from "./project-types";

/** Где продукт живёт: своим адресом, вкладкой панели или вовсе без экрана. */
export type ProductSurface = "public" | "private" | "headless";

/**
 * Четыре фазы жизни продукта — путь, а не набор.
 *
 * `intake` — вопросы, ответы, Quiz, подтверждение кейсов · `decomposition` —
 * кейсы разбираются на шаги · `development` — шаги выполняются · `analysis` —
 * результат изучается, и из него рождается следующий круг.
 */
export const PHASES = ["intake", "decomposition", "development", "analysis"] as const;
export type ProductPhase = (typeof PHASES)[number];

/** Стадия внутри фазы. Вычисляется из данных досье, а не назначается мнением. */
export const STAGES = ["waiting", "in-progress", "review", "testing", "extra-cycle", "done"] as const;
export type ProductStage = (typeof STAGES)[number];

export type UseCaseRecord = {
  slug: string;
  title: string;
  summary: string;
  /** Подтверждает ТОЛЬКО владелец: неподтверждённый кейс — догадка модели. */
  confirmed: boolean;
  confirmedAt: string | null;
  updatedAt: string;
};

export const STEP_STATUSES = ["new", "in-progress", "blocked", "done", "cancelled"] as const;
export type StepStatus = (typeof STEP_STATUSES)[number];
export const STEP_IMPORTANCE = ["optional", "mandatory", "critical"] as const;
export type StepImportance = (typeof STEP_IMPORTANCE)[number];

export type StepRecord = {
  number: number;
  title: string;
  status: StepStatus;
  importance: StepImportance;
  kind: "work" | "decomposition";
  /** Слаги кейсов, которым служит шаг. Работа без кейса — работа, которую никто не заказывал. */
  cases: string[];
  plan: string;
  result: string;
  createdAt: string;
  updatedAt: string;
};

export type PlannedPage = { path: string; purpose: string };

export type ProductDossier = {
  /** Вечен и ничего не значит: на нём держатся логика, таблицы и кейсы. */
  id: string;
  /** Имя владельца на ЕГО языке. */
  title: string;
  titleAuto?: boolean;
  type: ProjectTypeId;
  description?: string;
  surface: ProductSurface;
  route: string;
  /** Показан ли посетителю. Это НЕ фаза: продукт бывает завершён и не опубликован. */
  published: boolean;
  phase: ProductPhase;
  stage: ProductStage;
  createdAt: string;
  updatedAt: string;
  intake: { questions: string[]; answers: string[]; seed: string };
  cases: UseCaseRecord[];
  steps: StepRecord[];
  pages: PlannedPage[];
  history: { at: string; phase: ProductPhase; stage: ProductStage; by: "owner" | "system" }[];
};

/** Продукт, о котором в файле не сказано ничего: минимальная правда о нём. */
export const DEFAULT_PRODUCT_DOSSIER: ProductDossier = {
  id: "p0",
  title: "p0",
  type: "custom",
  surface: "public",
  route: "",
  published: false,
  phase: "intake",
  stage: "waiting",
  createdAt: "",
  updatedAt: "",
  intake: { questions: [], answers: [], seed: "" },
  cases: [],
  steps: [],
  pages: [],
  history: [],
};

/** Сервер, на котором ещё не завели ни одного продукта. */
export const DEFAULT_PRODUCTS_REGISTRY: { version: number; ids: string[]; maxId: number } = {
  version: 1, ids: [], maxId: 0,
};

/** Четыре корня продукта — выводятся из записи, никогда не выдумываются. */
export function productRoots(p: Pick<ProductDossier, "id" | "route">): {
  pages: string; logic: string; tables: string; dossier: string;
} {
  const segment = p.route.replace(/^\/+|\/+$/g, "");
  return {
    pages: segment ? `app/[lang]/(publicLayer)/${segment}/` : "app/[lang]/(publicLayer)/",
    logic: `lib/products/${p.id}/`,
    tables: `${p.id}_*`,
    dossier: `PRODUCTS-CONFIG/${p.id}.json`,
  };
}
