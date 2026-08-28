import "server-only"
import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync, unlinkSync } from "fs"
import { dirname, join } from "path"
import { getConfigPath } from "@/config/app-config"
import { appConfigSchema } from "@/config/app-config.schema"
import { DEFAULT_APP_CONFIG } from "@/config/app-config.defaults"
import { validateConfig } from "@/config/config-validate"

// ЕДИНСТВЕННОЕ МЕСТО, ГДЕ ЭТОТ СЛОЙ ПИШЕТ `APP-CONFIG/app-config.json`
// (шаг 31-2, 2026-08-28).
//
// 🪦 ЗДЕСЬ ОТМЕНЁН ЗАКОН, СТОЯВШИЙ В `config/app-config.ts`: «этот слой ТОЛЬКО
// читает конфиг и никогда его не пишет; единственный писатель — панель». Отменил
// его владелец 2026-08-28, выбрав из двух путей второй: страница настроек внутри
// проекта пишет файл САМА, а не пересылает сохранение в панель.
//
// ✗ ЧЕМ БЫЛ ОПЛАЧЕН ОТМЕНЁННЫЙ ЗАКОН — знать обязательно, потому что цена никуда
// не делась. Двое писателей одного файла теряют сохранения так: вкладка A
// открылась и держит в памяти СНИМОК файла; вкладка B что-то сохранила; вкладка A
// сохраняет свой устаревший снимок и затирает работу B. Панель лечит это списком
// «чужих веток» (`FOREIGN_TOP_KEYS` в её `api/config/site`), которые она берёт с
// диска в момент записи.
//
// 🔒 ЗДЕСЬ ВЫБРАНО ЛЕЧЕНИЕ СИЛЬНЕЕ, И ЭТО НЕ УКРАШЕНИЕ. Мы принимаем не «весь
// конфиг», а ЗАПЛАТУ — только те ветки, которые человек действительно правил.
// Тогда чужие ветки защищены КОНСТРУКЦИЕЙ, а не списком: список надо помнить и
// дополнять при каждой новой ветке, а конструкция работает и для веток, которых
// ещё не существует. Список из панели повторять не нужно — он лечит следствие
// того, что она шлёт снимок целиком.
//
// 🔒 ДИСК ЧИТАЕТСЯ В МОМЕНТ ЗАПИСИ, а не при открытии страницы. Даже с заплатой
// это обязательно: между открытием и сохранением панель могла записать своё.
//
// 🔒 ЗАПИСЬ АТОМАРНА. Оборванная запись (питание, перезапуск, полный диск)
// оставила бы половину JSON, и `getAppConfig()` упал бы на разборе — то есть сайт
// потерял бы ИМЯ, АДРЕС и МЕТУ целиком, на каждой странице. Пишем во временный
// файл рядом и переименовываем: переименование в пределах одной файловой системы
// атомарно, читатель видит либо старый файл, либо новый, и никогда — половину.

/** Что вернулось из записи: успех или названная причина отказа. */
export type WriteResult =
  | { ok: true; config: Record<string, unknown> }
  | { ok: false; reason: "bad-body" | "write-failed"; detail?: string }

/** Простой объект — заплата обязана быть им, а не массивом и не строкой. */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

/**
 * Слияние заплаты поверх того, что уже лежит на диске.
 *
 * 🔒 `null` СТИРАЕТ КЛЮЧ, И ЭТО ЕДИНСТВЕННЫЙ СПОСОБ ЧТО-ЛИБО УДАЛИТЬ. Без него
 * заплата умеет только добавлять: человек, стерший поле в форме, увидел бы старое
 * значение обратно после перезагрузки — и решил бы, что сохранение не работает.
 * Пустая строка при этом остаётся пустой строкой: «поле есть и оно пустое» и
 * «поля нет» — разные состояния, и путать их значит терять решение владельца.
 */
function mergePatch(base: unknown, patch: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = isPlainObject(base) ? { ...base } : {}
  for (const [key, value] of Object.entries(patch)) {
    if (value === null) {
      delete out[key]
      continue
    }
    out[key] = isPlainObject(value) ? mergePatch(out[key], value) : value
  }
  return out
}

/**
 * Сырое содержимое файла — БЕЗ умолчаний.
 *
 * 🔒 ПОЧЕМУ НЕ `getAppConfig()`. Тот отдаёт файл, слитый с умолчаниями кода, и
 * запись такого результата заморозила бы все умолчания в файле навсегда: следующая
 * версия шаблона поменяла бы своё умолчание, а на диске лежало бы старое — и
 * выглядело бы как осознанное решение владельца. Файл обязан хранить ТОЛЬКО то,
 * что владелец действительно менял.
 */
export function readRawConfig(): Record<string, unknown> {
  try {
    const raw = readFileSync(getConfigPath(), "utf8")
    const parsed: unknown = JSON.parse(raw)
    return isPlainObject(parsed) ? parsed : {}
  } catch {
    // Файла нет — это не ошибка, а «владелец ещё ничего не сохранял».
    return {}
  }
}

/** Записать заплату поверх диска. Возвращает то, что теперь лежит в файле. */
export function writeConfigPatch(patch: unknown): WriteResult {
  if (!isPlainObject(patch)) {
    return { ok: false, reason: "bad-body", detail: "patch must be a JSON object" }
  }

  const path = getConfigPath()
  const next = mergePatch(readRawConfig(), patch)

  // 🔒 ПРОВЕРКА ЩАДЯЩАЯ, КАК И НА ЧТЕНИИ, И ЭТО СОЗНАТЕЛЬНО. Строгая проверка на
  // сохранении означала бы отказ целого файла из-за одного поля, которое панель
  // знает, а этот шаблон ещё нет. `validateConfig` роняет неверный ключ на его
  // умолчание, а незнакомый пропускает — то же поведение, что у читателя, и оба
  // конца ведут себя одинаково.
  //
  // Проверяем СЛИЯНИЕ с умолчаниями, но пишем — сырое: проверка отвечает на
  // вопрос «получится ли из этого рабочий конфиг», а не «что хранить».
  validateConfig(appConfigSchema, { ...DEFAULT_APP_CONFIG, ...next }, DEFAULT_APP_CONFIG, "APP-CONFIG")

  const tmp = join(dirname(path), `.app-config.${process.pid}.${Date.now()}.tmp`)
  try {
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(tmp, JSON.stringify(next, null, 2) + "\n", "utf8")
    renameSync(tmp, path)
    return { ok: true, config: next }
  } catch (e) {
    // Временный файл не оставляем: мусор рядом с конфигом однажды примут за него.
    if (existsSync(tmp)) {
      try { unlinkSync(tmp) } catch { /* уже нет — тем лучше */ }
    }
    return { ok: false, reason: "write-failed", detail: String(e) }
  }
}
