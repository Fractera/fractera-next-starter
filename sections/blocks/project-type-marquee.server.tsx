import type { SectionRenderer } from '@/sections/contract'
import { H2 } from '@/components/ui/typography'
import { appDialogUi } from '@/components/dialog/app-dialog.i18n'
import { projectTypeCards } from '@/lib/i18n/project-types.i18n'
import { projectTypeMarqueeUi } from '@/sections/project-type-marquee.i18n'
import { ProjectTypeMarquee } from '@/components/project-types/project-type-marquee.client'

// Лента направлений: двадцать две карточки того, что на этом продукте можно
// построить, — от посадочной страницы до мозга компании.
//
// 🔒 ЧТО ОНА ДОКАЗЫВАЕТ. «Соберите что угодно» — заявление, которое ничего не
// значит. Лента показывает конкретику в лицо: имя направления и одна строка о
// том, чем оно отличается от соседнего. Тот же приём, что у ленты языков внизу
// страницы, и намеренно та же порода секции.
//
// 🔒 НАПРАВЛЕНИЯ ИЗ КАТАЛОГА, А НЕ ИЗ ДАННЫХ СТРАНИЦЫ. Список живёт в
// `config/project-types.ts` и совпадает с тем, по которому владелец выбирает
// структуру своего проекта в панели. Вторая копия в языковой ячейке разошлась бы
// с панелью на первом же добавленном направлении.
//
// 🔒 СЛОВАРИ РЕЗОЛВЯТСЯ ЗДЕСЬ, НА СЕРВЕРЕ. В браузер уезжают заголовки и подписи
// ОДНОГО языка — 1.8 КБ; полный корпус описаний весит 306 КБ и остаётся на
// сервере. Островок получает готовые строки пропсами и импортирует только типы.
//
// 🔒 РЕНДЕРЕР ОСТАЁТСЯ СЕРВЕРНЫМ. Под `sections/` нет ни одного `"use client"` —
// это свойство слоя, а не случайность. Секция просто рисует островок, который
// живёт в `components/`.

export const projectTypeMarquee: SectionRenderer<'projectTypeMarquee'> = (b, { key: k, lang }) => (
  // 🔒 СВЕРХУ ОТСТУПА НЕТ ВОВСЕ, И ЭТО СЧИТАНО, А НЕ НА ГЛАЗ. Между первым
  // экраном и лентой складывались ТРИ величины: нижний отступ героя (40px),
  // верхний отступ колонки страницы (64px) и собственный отступ этой секции
  // (24px) — 128 пикселей пустоты, из которых видно было только последние 24.
  // Колонка урезана до 40px там, где шапки страницы нет (`standard-content-page`),
  // здесь снят весь верхний отступ: итого 80px вместо 128.
  <section key={k} aria-labelledby={b.title ? `${k}-t` : undefined} className="pt-0 pb-6">
    {b.title && (
      <div className="mb-6 px-6 text-center">
        <H2 id={`${k}-t`}>{b.title}</H2>
        {b.note && <p className="mt-2 text-sm text-muted-foreground">{b.note}</p>}
      </div>
    )}

    <ProjectTypeMarquee
      cards={projectTypeCards(lang)}
      lang={lang}
      ui={projectTypeMarqueeUi(lang)}
      dialogUi={appDialogUi(lang)}
    />
  </section>
)
