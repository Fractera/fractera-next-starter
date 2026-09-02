"use client"

import { useMemo } from "react"
import { MessageResponse } from "@/components/ai-elements/message"
import { passportWithAnchors } from "../_lib/passport-outline"

// ТЕЛО ПАСПОРТА: ТЕКСТ С MARKDOWN-РАЗМЕТКОЙ.
//
// 🔒 ЛИПКОЕ МЕНЮ ЗДЕСЬ НЕ РИСУЕТСЯ — ЭТО ПРАВКА ВЛАДЕЛЬЦА 2026-09-02: «в правой
// вкладке сделай липкое меню так же, как на вкладке логи». Значит меню — это
// ПОЛОСА РАЗДЕЛА (`WorkspaceShell tabs`), та же, что несёт виды «Логов», а не
// второе меню своей конструкции рядом с ней. Разделы в неё кладёт страница.
//
// 🔒 ЯКОРЯ СТАВИТ ОБЩАЯ ФУНКЦИЯ, ТА ЖЕ, ЧТО СТРОИТ МЕНЮ: две разные сборки якоря
// дают ссылку в никуда, и заметно это не сразу.

export function PassportBody({ text }: { text: string }) {
  const withAnchors = useMemo(() => passportWithAnchors(text), [text])

  return (
    <article data-passport-text className="max-w-none">
      <MessageResponse>{withAnchors}</MessageResponse>
    </article>
  )
}
