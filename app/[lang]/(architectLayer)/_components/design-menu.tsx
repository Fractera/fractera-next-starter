import Link from "next/link"
import { H3 } from "@/components/ui/typography"
import { DESIGN_SECTIONS, hrefOfDesignSection, type DesignSection } from "../_lib/design-sections"
import type { DesignUi } from "../_i18n/design.i18n"

// ЛЕВОЕ МЕНЮ СЛОЯ ДИЗАЙНА (шаг 41, 2026-08-29). Серверный компонент.
//
// 🔒 СВОЁ МЕНЮ, А НЕ ВЛОЖЕННЫЙ СПИСОК В МЕНЮ НАСТРОЕК — ПРЯМОЕ УКАЗАНИЕ ВЛАДЕЛЬЦА,
// ОТМЕНИВШЕЕ МОЁ РЕШЕНИЕ ТОГО ЖЕ ДНЯ. Дословно: «ты создал дизайн внутри кнопки
// настройка проекта — это не то, что я хотел; я хотел, чтобы здесь была ещё одна
// кнопка, которая называется дизайн, и в этой кнопке были свои вкладки… чтобы они
// не были в одной огромной вкладке настройки проекта, которая уже сильно
// перегружена».
//
// Довод владельца сильнее моего: десять групп настроек и шесть разделов дизайна в
// одном столбце — это шестнадцать строк, из которых человек каждый раз выбирает
// одну. Разделение по входу, а не по вложенности, оставляет в каждом меню столько
// пунктов, сколько глаз охватывает разом.
//
// 🔒 ФОРМА ПОВТОРЯЕТ `layer-menu.tsx` ДОСЛОВНО — те же классы, то же поведение на
// узком экране (горизонтальная лента), та же липкость на широком. Второе меню,
// ведущее себя иначе, читалось бы как другой продукт; здесь оно другое ТОЛЬКО
// содержимым.

export function DesignMenu({
  lang,
  active,
  ui,
  title,
}: {
  lang: string
  active: DesignSection
  ui: DesignUi
  /** Заголовок меню — имя самого слоя, а не первого раздела. */
  title: string
}) {
  return (
    <nav
      data-design-menu
      aria-label={title}
      className="shrink-0 border-b border-border pb-3 md:sticky md:top-20 md:z-10 md:max-h-[calc(100dvh-6rem)] md:w-60 md:self-start md:overflow-y-auto md:border-r md:border-b-0 md:pr-6"
    >
      <H3 variant="ui" className="mb-3">{title}</H3>
      <ul className="slim-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:flex-col md:overflow-x-visible">
        {DESIGN_SECTIONS.map(id => {
          const isActive = id === active
          return (
            <li key={id} className="shrink-0 md:shrink">
              <Link
                href={hrefOfDesignSection(lang, id)}
                data-design-section={id}
                aria-current={isActive ? "page" : undefined}
                className={
                  "block whitespace-nowrap rounded-md px-3 py-2 text-[length:var(--fs-body)] transition-colors md:truncate" +
                  (isActive
                    ? " bg-muted font-medium text-foreground"
                    : " text-muted-foreground hover:bg-muted/60 hover:text-foreground")
                }
              >
                {ui.pages[id].title}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
