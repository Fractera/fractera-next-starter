"use client"

import remarkGfm from "remark-gfm"
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
//
// 🛑 `remarkGfm` ЗДЕСЬ ОБЯЗАТЕЛЕН, И ЭТО ОПЛАЧЕНО СЛОМАННЫМ ПАСПОРТОМ.
// Переданный список `remarkPlugins` **заменяет** умолчание разметчика, а в
// умолчании живёт GFM — то есть таблицы. Я прочёл минифицированную сборку и
// решил, что списки складываются; на живой странице таблиц стало **ноль** там,
// где их было две. **Чужую сборку читают как подсказку, а проверяют
// измерением.** Порядок важен: GFM первым, наши плагины после него.
export function PassportBody({ text }: { text: string }) {
  return (
    <article data-passport-text className="max-w-none">
      <MessageResponse
        remarkPlugins={[remarkGfm, remarkPassportMarks, remarkPassportAnchors]}
      >
        {text}
      </MessageResponse>
    </article>
  )
}
