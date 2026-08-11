// Идентификаторы записей — читаемое имя плюс короткий случайный хвост.
//
// 🔒 ПОЧЕМУ НЕ UUID И НЕ ГОЛЫЙ SLUG. Идентификатор попадает в АДРЕС страницы, а
// адрес читают люди: его пересылают, вставляют в переписку, узнают в журнале.
//
//   `8f3e1c4a-…`        — ничего не сообщает; в списке из двадцати ссылок все
//                          двадцать выглядят одинаково.
//   `apple`             — сообщает всё, но второй «Apple» уже не создать, а
//                          переименование товара ломает ссылку.
//   `apple-DerT45`      — сообщает, и остаётся уникальным навсегда.
//
// Хвост — шесть знаков из 62-символьного алфавита: 56 миллиардов вариантов на
// одно имя. Столкновение возможно теоретически, поэтому вызывающий обязан
// обрабатывать конфликт первичного ключа, а не считать его невозможным.
//
// Хвост берётся у `crypto.getRandomValues`, а не у `Math.random`: второй
// предсказуем, а идентификатор попадает в адрес страницы, которую иначе можно
// перебрать.

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const TAIL = 6

// Транслитерация кириллицы: имя, набранное по-русски, обязано дать читаемый
// адрес, а не превратиться в пустую строку. Прочие письменности отбрасываются
// и падают на `item` — честнее, чем адрес из вопросительных знаков.
const CYRILLIC: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i",
  й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t",
  у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "",
  э: "e", ю: "yu", я: "ya",
}

export function slugify(input: string): string {
  const lowered = input.toLowerCase().trim()
  let out = ""
  for (const ch of lowered) out += CYRILLIC[ch] ?? ch
  const slug = out
    // Диакритика снимается разложением: «café» → «cafe», а не «caf».
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
  return slug || "item"
}

/** Случайный хвост идентификатора. */
export function idTail(length = TAIL): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  let out = ""
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length]
  return out
}

/**
 * Идентификатор записи: `apple-DerT45`.
 *
 * `prefix` помечает происхождение записи — им пользуется посев стартера
 * (`seed-apple-DerT45`), чтобы демонстрационные строки было видно в адресе и в
 * журнале, не заглядывая в базу.
 */
export function entityId(name: string, prefix?: string): string {
  const head = prefix ? `${prefix}-${slugify(name)}` : slugify(name)
  return `${head}-${idTail()}`
}
