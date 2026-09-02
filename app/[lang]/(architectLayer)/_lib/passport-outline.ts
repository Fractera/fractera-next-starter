// РАЗБОР ПАСПОРТА НА РАЗДЕЛЫ — одна функция на страницу и на тело документа.
//
// 🔒 ЯКОРЬ СЧИТАЕТСЯ ОДНИМ МЕСТОМ ДЛЯ МЕНЮ И ДЛЯ ЗАГОЛОВКА. Две сборки якоря
// дают ссылку в никуда, и заметно это не сразу: страница просто не
// прокручивается. Поэтому и меню (липкая полоса раздела), и текст документа
// зовут отсюда.
//
// 🔒 ТОЛЬКО ПЕРВЫЙ УРОВЕНЬ (`##`) — слово владельца. Меню из всех четырёх
// уровней перестаёт быть меню: в нём столько же строк, сколько в документе.

export type PassportItem = { id: string; title: string }

/** Якорь из заголовка: буквы и цифры, остальное — дефисы. */
export function passportAnchor(title: string): string {
  return (
    "p-" +
    title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "")
  )
}

/** Разделы первого уровня в порядке документа. */
export function passportOutline(text: string): PassportItem[] {
  const items: PassportItem[] = []
  for (const line of text.split(/\r?\n/)) {
    const m = /^##\s+(.+?)\s*$/.exec(line)
    if (m) items.push({ id: passportAnchor(m[1]), title: m[1] })
  }
  return items
}

/**
 * Текст с якорями перед заголовками первого уровня.
 *
 * 🔒 ЯКОРЯ СТАВЯТСЯ В ТЕКСТ ЗАРАНЕЕ: разметка Markdown их сама не расставляет, а
 * искать узлы в отрисованном дереве значило бы подпирать чужой рендерер.
 */
export function passportWithAnchors(text: string): string {
  return text
    .split(/\r?\n/)
    .map(line => {
      const m = /^##\s+(.+?)\s*$/.exec(line)
      return m ? `<a id="${passportAnchor(m[1])}"></a>\n\n${line}` : line
    })
    .join("\n")
}
