import type { SectionRenderer } from '@/sections/contract'
import type { ChatAttachment, ChatMessage } from '@/_tools/chat/types/chat'
import type { ChatBlockMessage } from '@/lib/content/blocks/types'
import { H2 } from '@/components/ui/typography'
import { chatUi } from '@/sections/chat.i18n'
import Chat from '@/_tools/chat/client/chat.client'

// ВИД `chat` — ТОНКАЯ ОБЁРТКА НАД ИНСТРУМЕНТОМ `_tools/chat` (шаг 80-4а).
//
// 🔒 ЗДЕСЬ НЕТ НИ ОДНОГО ПРАВИЛА РИСОВАНИЯ ЛЕНТЫ. Сообщение, пузырь, прокрутка и
// ряд вложений принадлежат островку инструмента; этот файл переводит поля блока
// в его пропсы и ставит вокруг заголовок секции. Тот же приём, что у диаграмм
// (шаг 58) и у рабочего экрана: раскладка живёт в компоненте, вид знает лишь
// материал. Второй вёрстки ленты в проекте больше не заводится — ради этого и
// затеян шаг 80.
//
// 🔒 БЕЗ `"use client"` — свойство слоя, а не выбор. Ни один файл под `sections/`
// не бывает клиентским: это ловит `check:static`.
//
// 🔒 ЛЕНТА ЗДЕСЬ ВСЕГДА БЕЗ ПОЛЯ ВВОДА, И ПРИЧИНА МЕХАНИЧЕСКАЯ, А НЕ ВКУСОВАЯ.
// Поле ввода появляется у инструмента, когда дан `onSend`; `onSend` — функция, а
// функцию серверный рендерер в островок не передаёт. Работающий чат ставит
// потребитель со своим клиентским владельцем состояния — так это делают «Логи».
// Сказано вслух намеренно: молчаливое отсутствие поля ввода читается как дефект
// вида, а не как его граница.
//
// 🔒 ПЕРЕВОД ФОРМ, А НЕ ПРОБРОС ССЫЛКОЙ. Материал страницы носит свою форму
// (`ChatBlockMessage` — лист графа импортов, без единого импорта), инструмент —
// свою. Перевод стоит одну функцию и держится типами: разойдись договоры,
// упадёт `tsc` здесь, а не разъедется лента у трёх потребителей молча.

/** Высота ленты: секция страницы обязана иметь конец, иначе прокрутке не за что держаться. */
const HEIGHT = { compact: 'h-[320px]', tall: 'h-[560px]' } as const

export const chat: SectionRenderer<'chat'> = (b, { key: k, lang }) => (
  <section key={k} aria-labelledby={b.title ? `${k}-t` : undefined} className="py-6">
    {b.title && (
      <div className="mb-4">
        <H2 id={`${k}-t`}>{b.title}</H2>
        {b.note && <p className="mt-2 text-sm text-muted-foreground">{b.note}</p>}
      </div>
    )}
    <div className={`rounded-lg border border-border bg-card p-3 ${b.size ? HEIGHT[b.size] : 'h-[420px]'}`}>
      <Chat messages={b.messages.map(toToolMessage)} ui={chatUi(lang)} className="h-full" />
    </div>
  </section>
)

/** Сообщение материала → сообщение инструмента. Единственное место перевода. */
function toToolMessage(m: ChatBlockMessage): ChatMessage {
  return {
    id: m.id,
    from: m.from,
    text: m.text ?? null,
    at: m.at ?? null,
    who: m.who ?? null,
    source: m.source ?? null,
    forwardedFrom: m.forwardedFrom ?? null,
    attachments: m.attachments?.map(toToolAttachment),
  }
}

function toToolAttachment(a: NonNullable<ChatBlockMessage['attachments']>[number]): ChatAttachment {
  return a.type === 'place'
    ? { kind: 'place', lat: a.lat, lon: a.lon, label: a.label ?? null }
    : a.type === 'event'
      ? { kind: 'event', at: a.at, title: a.title, note: a.note ?? null }
      : { kind: a.type, url: a.url, mediaType: a.mediaType, name: a.name }
}
