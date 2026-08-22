import "server-only"
import { readFileSync } from "fs"
import { join } from "path"
import { cache } from "react"
import { DEFAULT_DESIGN_CONFIG, type DesignConfig } from "./design-config.defaults"
import { designConfigSchema } from "./design-config.schema"
import { validateConfig } from "./config-validate"

// Читатель живого оформления. Приёмы намеренно те же, что у соседей
// (`app-config.ts`, `platform-config.ts`): чтение с диска, `cache()` на один
// проход рендера, отсутствующий файл — норма.
//
// 🔒 НИКОГДА НЕ ИМПОРТИРОВАТЬ ИЗ КЛИЕНТСКОГО КОМПОНЕНТА — здесь `fs`.
//
// 🔒 ПРИМЕНЯЕТСЯ БЕЗ ПЕРЕСБОРКИ. Файл читается на рендере, `[lang]`-макет живёт
// под ISR, панель после сохранения зовёт `/api/revalidate`. Страницы при этом
// остаются статическими: динамическими их делает `force-dynamic`, а не чтение
// файла.

const CONFIG_PATH =
  process.env.DESIGN_CONFIG_PATH ?? join(process.cwd(), "DESIGN-CONFIG", "design-config.json")

/**
 * Живое оформление.
 *
 * Отсутствующий или нечитаемый файл — НОРМА: значит владелец ничего не менял, и
 * действует тема проекта. Показать сайт темой честнее, чем уронить страницу
 * из-за одной сломанной скобки в настройках.
 *
 * 🔒 СЛИЯНИЕ ПОВЕРХНОСТНОЕ, И ЭТОГО ДОСТАТОЧНО. У настройки ровно четыре ветки
 * известной формы; глубокое слияние здесь дало бы лишь возможность прислать
 * половину ветки и получить смесь двух решений владельца.
 */
export const getDesignConfig = cache((): DesignConfig => {
  try {
    const raw = JSON.parse(readFileSync(CONFIG_PATH, "utf8")) as Partial<DesignConfig>
    const merged: DesignConfig = {
      colors: {
        light: raw.colors?.light ?? {},
        dark: raw.colors?.dark ?? {},
      },
      fonts: raw.fonts ?? {},
      type: raw.type ?? {},
      shape: raw.shape ?? {},
      // 🔒 ПЯТАЯ ВЕТКА ПЕРЕЧИСЛЯЕТСЯ ЗДЕСЬ ЯВНО, И ЭТО НЕ ФОРМАЛЬНОСТЬ (шаг 538).
      // Слияние собрано руками, поэтому ключ, не названный в этом объекте,
      // ИСЧЕЗАЕТ молча: файл на диске верен, схема его пропускает, а читатель
      // отдаёт умолчание. Поймано живьём — `customDesign: true` лежал в конфиге,
      // а свободный слой продолжал отвечать 404.
      customDesign: raw.customDesign ?? DEFAULT_DESIGN_CONFIG.customDesign,
    }
    // Проверка по схеме — после слияния: до него объект заведомо неполон, и каждая
    // отсутствующая ветка выглядела бы нарушением. Неверный ТИП значения (число
    // вместо строки в `radius`) лечится умолчанием этой ветки; цвет строкой не
    // проверяется вовсе — см. комментарий схемы.
    return validateConfig(designConfigSchema, merged, DEFAULT_DESIGN_CONFIG, "DESIGN-CONFIG")
  } catch {
    return DEFAULT_DESIGN_CONFIG
  }
})

export function getDesignConfigPath(): string {
  return CONFIG_PATH
}
