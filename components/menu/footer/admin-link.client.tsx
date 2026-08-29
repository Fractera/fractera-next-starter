"use client"

import { useEffect, useState } from "react"
import { ExternalLink } from "lucide-react"
import { adminBase } from "@/lib/runtime-urls"
import { buttonVariants } from "@/components/ui/button"

// ВХОД В ПАНЕЛЬ УПРАВЛЕНИЯ — ОСТРОВОК, А НЕ СЕРВЕРНАЯ ССЫЛКА (2026-08-29).
//
// ✗ ЧЕМ ОПЛАЧЕНО. Владелец развернул новый сервер, открыл сайт и спросил прямо:
// «почему у меня на старте, когда я нахожусь в IP-режиме, отсутствует кнопка
// перейти в админпанель?». Кнопка рисовалась только при непустом
// `adminUrlFromSite(APP-CONFIG.url)`, а на свежем сервере настройки ещё не
// сохраняли — файл пуст, адреса нет, кнопки нет.
//
// 🔒 ТО ЕСТЬ ССЫЛКА ИСЧЕЗАЛА РОВНО ТОГДА, КОГДА ОНА НУЖНЕЕ ВСЕГО. Человек, который
// ещё ничего не настроил, — единственный, кому нужно попасть в панель немедленно;
// он же и оставался без входа. Закон «выдуманный адрес хуже отсутствующего» верен,
// но он запрещает ВЫДУМЫВАТЬ, а не ВЫЧИСЛЯТЬ.
//
// 🔒 ДВА ИСТОЧНИКА, И НИ ОДИН НЕ УГАДЫВАЕТ. Сервер даёт адрес из настроек, когда
// они есть, — тогда ссылка стоит уже в статическом HTML и работает без скриптов.
// Настроек нет — островок после гидратации выводит адрес из СОБСТВЕННОГО адреса
// окна: IP → `<хост>:3002`, домен → `admin.<апекс>`. Это тот же расчёт, которым
// пользуется весь остальной клиентский код (`lib/runtime-urls.ts`).
//
// 🔒 ПОДВАЛ ПО-ПРЕЖНЕМУ НЕ ЧИТАЕТ СЕССИЮ И НЕ УХОДИТ В ДИНАМИКУ. Островок ничего
// не спрашивает у сервера: он смотрит на адресную строку. Одна строка с `cookies()`
// сделала бы динамическим весь публичный слой и убила бы поиск.

export function AdminLink({
  /** Адрес, посчитанный сервером из настроек. Пусто — считает островок. */
  href,
  label,
}: {
  href: string
  label: string
}) {
  const [fallback, setFallback] = useState("")

  useEffect(() => {
    if (!href) setFallback(adminBase())
  }, [href])

  const target = href || fallback
  if (!target) return null

  return (
    <a
      href={target}
      rel="nofollow"
      data-admin-link={href ? "from-settings" : "from-window"}
      className={buttonVariants({ variant: "ghost", size: "sm" }) + " gap-1.5 text-muted-foreground hover:text-foreground"}
    >
      <ExternalLink className="hidden size-3.5 sm:inline-block" />
      {label}
    </a>
  )
}
