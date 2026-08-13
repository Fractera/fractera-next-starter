import type { Block, FaqPair } from '@/lib/content/blocks/types'

// Блоки страницы → markdown (шаг 505, AIO).
//
// ЗАЧЕМ. Публичная страница существует в двух видах: HTML для человека и markdown
// для машины. Второй нужен затем, что модель, пришедшая за содержимым сайта,
// разбирает разметку страницы вместе с меню, подвалом, баннером согласия и
// скриптами — и половину контекста тратит на то, что к содержимому отношения не
// имеет. Markdown отдаёт ровно текст.
//
// 🔒 ИСТОЧНИК ОДИН. Обе формы собираются из ОДНИХ И ТЕХ ЖЕ блоков, поэтому
// разойтись не могут: отредактировал текст — изменились обе. Отдельный файл с
// «версией для ИИ» разошёлся бы с сайтом на первой же правке, и никто бы этого
// не заметил, потому что в браузере его никто не открывает.
//
// Инлайновая разметка (`**жирный**`, `[метка](адрес)`) в наших блоках УЖЕ
// markdown — переносится как есть, без преобразования.

function lines(block: Block): string[] {
  switch (block.kind) {
    case 'h2':
      return [`## ${block.text}`]
    case 'h3':
      return [`### ${block.text}`]
    case 'p':
      return [block.text]
    case 'note':
      return [block.text]
    case 'quote':
      // Цитата вместе с источником: без него утверждение теряет автора, а это
      // ровно то, ради чего цитату и приводят.
      return [`> ${block.text}`, ...(block.cite ? [`>`, `> — ${block.cite}`] : [])]
    case 'founder':
      return [`> ${block.text}`]
    case 'list':
      return block.items.map(i => `- ${i}`)
    case 'olist':
      return block.items.map((i, n) => `${n + 1}. ${i}`)
    case 'code':
      return ['```', block.text, '```']
    case 'cta':
      return [`${block.text} — [${block.label}](${block.href})`]
    case 'callout':
      return [`**${block.title}** ${block.text}`]
    case 'docref':
      return [`**${block.title}** — ${block.summary}: [${block.label ?? 'документ'}](${block.href})`]
    case 'figure':
      // Изображение описывается СЛОВАМИ. Модель картинку не увидит, а `alt` и
      // подпись — это то, ради чего её поставили.
      return [`![${block.alt}](${block.src})`, ...(block.caption ? [`*${block.caption}*`] : [])]
    case 'table': {
      const head = `| ${block.headers.join(' | ')} |`
      const sep = `| ${block.headers.map(() => '---').join(' | ')} |`
      const body = block.rows.map(r => `| ${r.join(' | ')} |`)
      return [...(block.caption ? [block.caption, ''] : []), head, sep, ...body]
    }
    case 'columns':
    case 'group':
      // Контейнер — раскладка, а не содержимое: разворачиваем детей.
      return block.children.flatMap(child => [...lines(child), ''])
    default:
      return []
  }
}

export function blocksToMarkdown(blocks: Block[]): string {
  return blocks
    .flatMap(b => [...lines(b), ''])
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Вопросы и ответы отдельным разделом.
 *
 * Форма пары — `{ q, a }` из общего каталога блоков (`FaqPair`), а не
 * `{ question, answer }`: типы поймали это на сборке, и подгонять надо код под
 * каталог, а не наоборот — каталог читают ещё и разметка страницы, и JSON-LD.
 */
export function faqToMarkdown(faq?: FaqPair[]): string {
  if (!faq?.length) return ''
  return ['## FAQ', '', ...faq.flatMap(f => [`### ${f.q}`, '', f.a, ''])].join('\n').trim()
}
