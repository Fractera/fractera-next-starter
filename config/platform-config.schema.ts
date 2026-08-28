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
  // Одиннадцатый (шаг 523). Без строки ЗДЕСЬ проверка молча вычищает ключ, и
  // читатель падает на умолчание: выключатель выглядит нерабочим при верном файле.
  socials: z.boolean().optional(),
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
  /** Режим разработки: классический · шаги · кейсы · переезд. */
  developmentMode: z.enum(["classic", "steps", "cases", "migration"]).optional(),
  /**
   * Откуда берётся чужой проект в режиме `migration` (шаг 533).
   *
   * Здесь лежит РЕШЕНИЕ владельца, а не сам чужой код: адрес репозитория либо
   * отметка «проект у меня на машине». Токена тут нет и не будет — на время
   * переезда репозиторий держат открытым, и это сказано на публичной странице.
   * Секрет в конфиге, который читает приложение, был бы секретом только на вид.
   */
  migration: z
    .looseObject({
      source: z.enum(["repository", "local"]).optional(),
      repositoryUrl: z.string().optional(),
      localPath: z.string().optional(),
      declaredAt: z.string().optional(),
    })
    .optional(),
  /**
   * Области раскладки параллельного режима (31-12).
   *
   * 🔒 БЕЗ ЭТОЙ СТРОКИ КЛЮЧ ПРОХОДИЛ ЛИШЬ ПОТОМУ, ЧТО СХЕМА `looseObject`, — то
   * есть держался на свойстве, которое никто не обещал сохранять. Тот же дефект
   * уже оплачен здесь одиннадцатым выключателем (`socials`): не названный в
   * схеме ключ проверка вычищает молча, и настройка выглядит нерабочей при
   * совершенно верном файле.
   */
  slots: z.record(z.string(), z.boolean()).optional(),
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
