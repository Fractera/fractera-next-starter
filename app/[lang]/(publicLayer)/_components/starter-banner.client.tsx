'use client'

import { useEffect, useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import { adminBase } from '@/lib/runtime-urls'
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
// 🔒 ВИД — ПРЕДУПРЕЖДЕНИЕ (владелец 2026-08-29: «по задумке должен был бы быть в
// стиле Warning»). Янтарный тон здесь не украшение: это то же значение, каким
// панель помечает «сделать до старта». Баннер говорит человеку, что он смотрит
// ЧУЖОЙ шаблон, а не свой проект, — это состояние, которое надо снять, а не
// сообщение, которое приятно прочитать.
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
// 🔒 АДРЕС ПАНЕЛИ БЕРЁТСЯ ИЗ ДВУХ ИСТОЧНИКОВ, И ЭТО ОПЛАЧЕНО ПУСТОЙ ССЫЛКОЙ
// (владелец 2026-08-29: «сейчас вообще никакой ссылки нету»). Сервер знает адрес
// только из `APP-CONFIG.url`, а на свежем сервере настройки ещё не сохраняли —
// файл пуст, и ссылка исчезала совсем. Поэтому: сервер даёт адрес, когда он
// есть, а островок после гидратации выводит его из СОБСТВЕННОГО адреса окна
// (`adminBase()` — IP → `:3002`, домен → `admin.<апекс>`). Выдуманного адреса
// по-прежнему не появляется: оба источника считают, а не угадывают.
//
// 🔒 ПОРОГ И ВОЗВРАТ — РАЗНЫЕ ЧИСЛА НАМЕРЕННО НЕ СДЕЛАНЫ. Владелец описал одно
// поведение: больше 300 — показать, вернулись к началу — убрать. Гистерезис
// выглядит умнее и ведёт себя не так, как сказано.
//
// 🔒 СЛУШАТЕЛЬ ПАССИВНЫЙ: `{ passive: true }` снимает с браузера обязанность
// ждать возможной отмены прокрутки — иначе полоса, добавленная ради подсказки,
// платит за себя дёрганой прокруткой на телефоне.
const SHOW_AFTER_PX = 300

export function StarterBanner({
  strings,
  href,
  lang,
}: {
  strings: StarterBannerStrings
  /** Адрес раздела запуска, посчитанный сервером. Пусто — считает островок. */
  href: string
  lang: string
}) {
  const [shown, setShown] = useState(false)
  const [fallbackHref, setFallbackHref] = useState('')

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > SHOW_AFTER_PX)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!href) setFallbackHref(`${adminBase()}/${lang}/project-start`)
  }, [href, lang])

  const target = href || fallbackHref

  return (
    <div
      // Разметка отдаётся сервером ВСЕГДА, а прячется классом: полоса, которой
      // нет в HTML, не может выехать плавно — она появляется рывком после
      // гидратации.
      data-starter-banner
      role="status"
      aria-hidden={!shown}
      className={[
        'fixed inset-x-0 top-14 z-30 border-b border-tone-access/40',
        'bg-tone-access/15 backdrop-blur-sm',
        'transition-all duration-300 ease-out',
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0',
      ].join(' ')}
    >
      <div className="w-full px-6 py-2.5 md:px-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
        <TriangleAlert aria-hidden className="size-4 shrink-0 text-tone-access" />
        <span className="text-sm leading-relaxed text-foreground">{strings.lead}</span>
        {target ? (
          <a
            href={target}
            className="text-sm font-semibold text-tone-access underline underline-offset-4 hover:opacity-80"
          >
            {strings.linkLabel}
          </a>
        ) : null}
        {strings.tail ? (
          <span className="text-sm leading-relaxed text-foreground">{strings.tail}</span>
        ) : null}
      </div>
    </div>
  )
}
