// Проверка конфига НА ЧТЕНИИ — одна на все четыре.
//
// 🔒 ЧТО ЭТО ЛЕЧИТ. Форму конфигов проверял только компилятор, то есть на сборке.
// Сам файл сочиняется ПОСЛЕ неё: его пишет панель, его правят руками, он приезжает
// со старого сервера. До 2026-08-18 такой файл разбирался как есть, и значение
// неверного типа доходило до рендера — там, где повезло, страницей с пустым
// местом, где не повезло — исключением на каждый запрос.
//
// 🔒 ПРОВЕРКА ЩАДЯЩАЯ, И ЭТО ПРИНЦИПИАЛЬНО. Строгая проверка на настройках
// означала бы белый экран из-за одной неверной буквы в файле, который читатель не
// пишет и починить не может. Поэтому:
//
//   1. неизвестный ключ ПРОПУСКАЕТСЯ — панель может оказаться новее слота, и
//      выбросить её поле значит потерять решение владельца (схемы объявлены
//      `loose` именно ради этого);
//   2. известный ключ неверного типа падает на СВОЁ умолчание — по одному ключу,
//      а не файлом целиком;
//   3. файл никогда не переписывается по итогам проверки: пишет только панель.
//
// Прецедент того же рода уже был в `config/app-config.ts` — `normalize()` лечит
// непригодный адрес и код валюты, потому что `Intl.NumberFormat` на строке
// «доллары» роняет каждую страницу с ценой.

import type { ZodType } from "zod";

/** Значение по пути `["seo","social","twitter"]`; `undefined`, если пути нет. */
function getPath(source: unknown, path: readonly PropertyKey[]): unknown {
  let cur: unknown = source;
  for (const key of path) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = (cur as Record<PropertyKey, unknown>)[key];
  }
  return cur;
}

/** Присвоение по пути с копированием только тронутой ветки. */
function setPath<T>(source: T, path: readonly PropertyKey[], value: unknown): T {
  if (path.length === 0) return value as T;
  const [head, ...rest] = path;
  if (Array.isArray(source)) {
    const copy = [...source] as unknown[];
    const idx = Number(head);
    copy[idx] = setPath(copy[idx], rest, value);
    return copy as unknown as T;
  }
  const base = (source && typeof source === "object" ? source : {}) as Record<PropertyKey, unknown>;
  return { ...base, [head]: setPath(base[head], rest, value) } as unknown as T;
}

/**
 * Проверить значение по схеме, вылечив каждое несоответствие его умолчанием.
 *
 * `label` попадает в предупреждение, чтобы по логу было видно, КАКОЙ файл
 * оказался испорчен: четыре одинаковых сообщения без имени бесполезны.
 */
export function validateConfig<T>(
  schema: ZodType<T>,
  value: unknown,
  defaults: T,
  label: string,
): T {
  const first = schema.safeParse(value);
  if (first.success) return first.data;

  let patched = value;
  const healed: string[] = [];
  for (const issue of first.error.issues) {
    if (issue.path.length === 0) return defaults;
    patched = setPath(patched, issue.path, getPath(defaults, issue.path));
    healed.push(issue.path.join("."));
  }

  const second = schema.safeParse(patched);
  warnOnce(label, healed, second.success);
  return second.success ? second.data : defaults;
}

// Предупреждение печатается ОДИН РАЗ на набор одних и тех же ключей: конфиг
// читается на каждый запрос, и без этого один испорченный файл залил бы лог
// сервера тысячами одинаковых строк за минуту.
const warned = new Set<string>();

function warnOnce(label: string, keys: string[], recovered: boolean): void {
  const mark = `${label}:${keys.join(",")}:${recovered}`;
  if (warned.has(mark)) return;
  warned.add(mark);
  const where = keys.length ? keys.join(", ") : "весь файл";
  console.warn(
    recovered
      ? `[config] ${label}: значения не по схеме заменены умолчаниями — ${where}. Файл не изменён; поправить в панели.`
      : `[config] ${label}: файл не разобран по схеме, приложение работает на умолчаниях. Поправить в панели.`,
  );
}
