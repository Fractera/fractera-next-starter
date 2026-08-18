// Схема `PLATFORM-CONFIG/platform-config.json` — форма ФАЙЛА.
//
// 🔒 ФАЙЛ И ОТВЕТ ЧИТАТЕЛЯ — РАЗНЫЕ ВЕЩИ, и только здесь среди четырёх конфигов
// это так. На диске лежат решения владельца: тронутые выключатели, режим
// маршрутизации, набор документов агента. Читатель отдаёт полную картину —
// значение каждой возможности плюс отдельный ответ «владелец высказался или это
// умолчание». Проверять на чтении можно лишь то, что действительно лежит в файле,
// поэтому схема описывает его, а не `PlatformConfig`.
//
// Все поля необязательные: отсутствующий файл и пустой `{}` — законное состояние
// «ничего ещё не решали».

import { z } from "zod";
import type { PlatformConfigFile } from "./platform-config.defaults";

const featureFlags = z.looseObject({
  auth: z.boolean().optional(),
  breadcrumbs: z.boolean().optional(),
  faq: z.boolean().optional(),
  themeToggle: z.boolean().optional(),
  widthToggle: z.boolean().optional(),
  languageSwitcher: z.boolean().optional(),
  topMenu: z.boolean().optional(),
  footerPages: z.boolean().optional(),
  cookieBanner: z.boolean().optional(),
  offlineCache: z.boolean().optional(),
});

export const platformConfigSchema = z.looseObject({
  features: featureFlags.optional(),
  /** Два исторических имени одного решения — читаются оба. */
  routingMode: z.string().optional(),
  parallelRouting: z.boolean().optional(),
  /** Выключатели документов корпуса: пишет панель, читает агент, приложение — нет. */
  instructions: z.record(z.string(), z.boolean()).optional(),
  instructionsSnapshot: z.record(z.string(), z.boolean()).nullable().optional(),
  commands: z.record(z.string(), z.unknown()).optional(),
});

export const __platformConfigSchemaMatchesType: z.infer<
  typeof platformConfigSchema
> extends PlatformConfigFile
  ? true
  : never = true;
