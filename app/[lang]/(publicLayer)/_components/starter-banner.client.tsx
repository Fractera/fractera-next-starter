'use client'

import { useEffect, useState } from 'react'
import type { StarterBannerStrings } from './starter-banner.i18n'

// БАННЕР СТАРТОВОГО ШАБЛОНА (шаг 38-1, 2026-08-29) — полоса во всю ширину экрана,
// выезжающая из-под шапки при прокрутке.
//
// Просьба владельца дословно: «баннер, который как Push-уведомления будет иметь
// ширину от левого края экрана до правого края экрана и будет отпускаться от
// нижней части хайдера вниз каждый раз, когда мы прокрутим больше чем 300
// пикселей страницу экрана, и будет исчезать каждый раз, когда мы будем
// возвращаться к началу страницы».
//
// 🔒 ОСТРОВОК, А НЕ СТРАНИЦА. Главная предрендерена (`revalidate = 300`), и
// слушатель прокрутки обязан жить здесь. Подними его на страницу — и главная
// уедет в динамику, а вместе с ней поисковая выдача.
//
// 🔒 `top-14` — ЭТО НИЖНЯЯ ГРАНИЦА ШАПКИ, А НЕ КРАСИВОЕ ЧИСЛО. Шапка объявлена
// `sticky top-0` высотой `h-14` (`components/menu/top/top-menu.server.tsx`).
// Полоса висит ПОД ней и потому не закрывает меню; поедет высота шапки — поедет
// и это число, поэтому связь названа здесь словами.
//
// 🔒 ПОРОГ И ВОЗВРАТ — РАЗНЫЕ ЧИСЛА НАМЕРЕННО НЕ СДЕЛАНЫ. Владелец описал одно
// поведение: больше 300 — показать, вернулись к началу — убрать. Гистерезис
// (показать на 300, прятать на 200) выглядит умнее и ведёт себя не так, как
// сказано, а «как начало страницы» человек читает буквально.
//
// 🔒 СЛУШАТЕЛЬ ПАССИВНЫЙ: `{ passive: true }` снимает с браузера обязанность
// ждать возможной отмены прокрутки — иначе полоса, добавленная ради подсказки,
// платит за себя дёрганой прокруткой на телефоне.
const SHOW_AFTER_PX = 300

export function StarterBanner({
  strings,
  href,
}: {
  strings: StarterBannerStrings
  /** Адрес раздела запуска в панели. Пустая строка = ссылки нет (см. монтаж). */
  href: string
}) {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      // Разметка отдаётся сервером ВСЕГДА, а прячется классом: полоса, которой
      // нет в HTML, не может выехать плавно — она появляется рывком после
      // гидратации.
      data-starter-banner
      aria-hidden={!shown}
      className={[
        'fixed inset-x-0 top-14 z-30 border-b border-border bg-background/95 backdrop-blur-sm',
        'transition-all duration-300 ease-out',
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0',
      ].join(' ')}
    >
      <div className="w-full px-6 py-2.5 md:px-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
        <span className="text-sm leading-relaxed text-muted-foreground">{strings.lead}</span>
        {href ? (
          <a
            href={`${href}`}
            className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
          >
            {strings.linkLabel}
          </a>
        ) : null}
        {strings.tail ? (
          <span className="text-sm leading-relaxed text-muted-foreground">{strings.tail}</span>
        ) : null}
      </div>
    </div>
  )
}
