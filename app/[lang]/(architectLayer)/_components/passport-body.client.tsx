"use client"

import { useMemo } from "react"
import { MessageResponse } from "@/components/ai-elements/message"

// ТЕЛО ПАСПОРТА: ЛИПКОЕ МЕНЮ РАЗДЕЛОВ + ТЕКСТ С MARKDOWN-РАЗМЕТКОЙ.
//
// 🔒 МЕНЮ ПОРОЖДАЕТСЯ ИЗ САМОГО ТЕКСТА, А НЕ ПИШЕТСЯ РЯДОМ. Второй список
// разделов разошёлся бы с документом на первой же правке — это тот же закон,
// которым в проекте порождаются каталог блоков, витрина инструментов и реестр
// признаков.
//
// 🔒 ТОЛЬКО ПЕРВЫЙ УРОВЕНЬ (`##`) — слово владельца. Меню из всех четырёх
// уровней перестаёт быть меню: в нём столько же строк, сколько в документе.

type Item = { id: string; title: string }

/** Разделы первого уровня и якоря к ним. */
function outline(text: string): Item[] {
  const items: Item[] = []
  for (const line of text.split(/\r?\n/)) {
    const m = /^##\s+(.+?)\s*$/.exec(line)
    if (m) items.push({ id: anchor(m[1]), title: m[1] })
  }
  return items
}

/**
 * Якорь из заголовка.
 *
 * 🔒 СЧИТАЕТСЯ ОДНОЙ ФУНКЦИЕЙ ДЛЯ МЕНЮ И ДЛЯ ЗАГОЛОВКА. Две разные сборки якоря
 * дают ссылку в никуда, и заметно это не сразу: страница просто не прокручивается.
 */
function anchor(title: string): string {
  return (
    "p-" +
    title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "")
  )
}

export function PassportBody({ text }: { text: string }) {
  const items = useMemo(() => outline(text), [text])

  // 🔒 ЗАГОЛОВКИ ПОЛУЧАЮТ ЯКОРЯ ЗАРАНЕЕ, ПРЯМО В ТЕКСТЕ: разметка Markdown их
  // сама не расставляет, а искать узлы в отрисованном дереве значило бы
  // подпирать чужой рендерер.
  const withAnchors = useMemo(
    () =>
      text
        .split(/\r?\n/)
        .map(line => {
          const m = /^##\s+(.+?)\s*$/.exec(line)
          return m ? `<a id="${anchor(m[1])}"></a>\n\n${line}` : line
        })
        .join("\n"),
    [text],
  )

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {/* 🔒 ЛИПКОЕ МЕНЮ ПРИЛИПАЕТ К ВЕРХУ КОЛОНКИ, А НЕ К ОКНУ: рядом живёт шапка
          страницы, и вторая липкая полоса поверх неё закрыла бы заголовок. */}
      <nav
        data-passport-menu
        className="sticky top-0 z-10 -mx-1 flex flex-wrap gap-x-4 gap-y-1 rounded-md border bg-background/95 px-3 py-2 text-[length:var(--fs-small)] backdrop-blur"
      >
        {items.map(i => (
          <a key={i.id} href={`#${i.id}`} className="text-muted-foreground hover:text-foreground">
            {i.title}
          </a>
        ))}
      </nav>

      <article data-passport-text className="max-w-none">
        <MessageResponse>{withAnchors}</MessageResponse>
      </article>
    </div>
  )
}
