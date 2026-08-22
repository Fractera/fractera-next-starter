// Схема `DESIGN-CONFIG/design-config.json` — форма ДАННЫХ.
//
// 🔒 ЦВЕТ НЕ ПРОВЕРЯЕТСЯ РАЗБОРОМ СТРОКИ. Значение подставляется в переменную CSS
// как есть, и допустимых форм много: `#0b0f19`, `oklch(0.2 0 0)`, `rgb(…)`,
// `color-mix(…)`. Проверка «похоже ли это на цвет» запретила бы половину из них,
// а выигрыш дала бы нулевой: неверный цвет виден на первой же странице, в отличие
// от неверного ТИПА, который роняет рендер.
//
// Все ветки необязательные: пустая настройка означает «владелец не высказался,
// берётся тема проекта» — умолчания оформления живут в CSS темы, а не здесь.

import { z } from "zod";
import type { DesignConfig } from "./design-config.defaults";

const colorRoles = z.looseObject({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  accent: z.string().optional(),
  background: z.string().optional(),
  foreground: z.string().optional(),
  muted: z.string().optional(),
  border: z.string().optional(),
  destructive: z.string().optional(),
});

const fontRole = z.looseObject({
  family: z.string(),
  /** Адрес подключения хранится ОТДЕЛЬНО от имени — склеенная строка однажды уедет в `font-family` целиком. */
  import: z.string().optional(),
});

export const designConfigSchema = z.looseObject({
  colors: z.looseObject({ light: colorRoles, dark: colorRoles }),
  fonts: z.looseObject({
    heading: fontRole.optional(),
    body: fontRole.optional(),
    mono: fontRole.optional(),
  }),
  type: z.looseObject({
    scale: z.number().optional(),
    leading: z.number().optional(),
  }),
  shape: z.looseObject({
    radius: z.string().optional(),
    borderWidth: z.string().optional(),
    spaceScale: z.number().optional(),
    appWidth: z.string().optional(),
    heroWidth: z.string().optional(),
  }),
});

export const __designConfigSchemaMatchesType: z.infer<
  typeof designConfigSchema
> extends DesignConfig
  ? true
  : never = true;
