"use client"

import { MessageResponse } from "@/components/ai-elements/message"
import { remarkPassportAnchors, remarkPassportMarks } from "../_lib/passport-marks"

// ТЕЛО ПАСПОРТА: ТЕКСТ С MARKDOWN-РАЗМЕТКОЙ.
//
// 🔒 ЛИПКОЕ МЕНЮ ЗДЕСЬ НЕ РИСУЕТСЯ — ЭТО ПРАВКА ВЛАДЕЛЬЦА 2026-09-02: «в правой
// вкладке сделай липкое меню так же, как на вкладке логи». Значит меню — это
// ПОЛОСА РАЗДЕЛА (`WorkspaceShell tabs`), та же, что несёт виды «Логов», а не
// второе меню своей конструкции рядом с ней. Разделы в неё кладёт страница.
//
// 🔒 ЯКОРЬ И ПОДСВЕТКА СТАВЯТСЯ В ДЕРЕВЕ РАЗМЕТКИ, А НЕ СТРОКОЙ В ТЕКСТЕ
// (шаг 98). ✗ прежний способ — вписать `<a id="…">` прямо в Markdown — не
// работал НИКОГДА: `Streamdown` сырой HTML не пропускает, и меню наверху
// ссылалось в пустоту. Владелец нашёл это как «нет прокрутки к разделу».
// Оба плагина живут в `_lib/passport-marks.ts` рядом с объяснением.

export function PassportBody({ text }: { text: string }) {
  return (
    <article data-passport-text className="max-w-none">
      <MessageResponse
        components={{
          // 🔒 ЦВЕТ ФОНА — РОЛЬ ПАЛИТРЫ, А НЕ ЛИТЕРАЛ. Закон проекта: цвет,
          // вписанный в компонент, переживёт смену палитры и останется
          // последней заплатой прежнего вида. Здесь взяты токены темы, и
          // подсветка читается в светлой и тёмной одинаково.
          mark: ({ children }) => (
            <mark
              data-passport-new
              className="rounded-[0.2em] bg-primary/15 px-[0.25em] py-[0.05em] text-foreground"
            >
              {children}
            </mark>
          ),
        }}
        remarkPlugins={[remarkPassportMarks, remarkPassportAnchors]}
      >
        {text}
      </MessageResponse>
    </article>
  )
}
