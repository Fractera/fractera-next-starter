// Типы cookie-баннера.
//
// 🔒 ЧТО ОТСЮДА УБРАНО И ПОЧЕМУ (шаг 508). Файл описывал правовой слой шага 305:
// ПЯТЬ документов (`privacy, cookies, terms, imprint, accessibility`), чей текст
// приходил JSON-конфигом на десяти языках, плюс свой безопасный разметчик
// (`markup.tsx`) для тела этих конфигов.
//
// Ничего этого больше нет: правовых страниц три, они живут в
// `app/[lang]/(publicLayer)/(footerPages)/` языковыми ячейками с блоками — как
// пост блога, — а разметку внутри текста делает общий `lib/content/blocks/inline`.
// Экспорты `LEGAL_LANGS`, `CONTENT_DOCS`, `ALL_DOCS`, `LegalConfig`,
// `LegalLangEntry`, `isContentDoc` не звал НИКТО; `markup.tsx` удалён целиком.
//
// Мёртвое описание опаснее пустоты: следующая сессия читает его как действующий
// механизм и заводит шестой документ по несуществующему конвейеру.
//
// Осталось ровно то, чем пользуется баннер согласия. Сам он не снесён и сноситься
// не может: согласие, написанное не на языке посетителя, юридически не состоялось,
// поэтому его словарь держится на всех 82 языках (`npm run check:i18n`), а
// выключается баннер в панели, а не удалением компонента.

/** Строки баннера согласия на одном языке. */
export type BannerLangEntry = { message: string; policyLinkLabel: string; accept: string; reject: string }

export type BannerConfig = {
  document: "cookie-banner"
  help: string
  updatedAt?: string
  languages: Record<string, BannerLangEntry>
}
