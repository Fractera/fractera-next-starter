import Link from "next/link"
import { Small } from "@/components/ui/typography"
import { ALL_LANGUAGE_METADATA } from "@/config/translations/language-metadata"
import type { ArchitectLayerUi } from "../_i18n/architect-layer.i18n"

// ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА НАСТРОЕК (31-3, 2026-08-28).
//
// 🔒 ЭТО НЕ ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА СТРАНИЦЫ, И ПУТАТЬ ИХ НЕЛЬЗЯ. В подвале сайта
// стоит другой — он меняет язык, на котором человек ЧИТАЕТ. Этот меняет язык, для
// которого человек ПИШЕТ значения: у части полей конфига значение своё на каждый
// язык. Две одинаковые с виду кнопки, делающие разное, — поэтому у него есть
// подпись и пояснение, а не только флаг.
//
// 🔒 ВЫБОР ЖИВЁТ В АДРЕСЕ (`?edit=<код>`), А НЕ В ПАМЯТИ БРАУЗЕРА. Три причины, и
// каждая проверяема: адрес переживает перезагрузку, его можно прислать другому
// человеку, и — главное — СЕРВЕР знает, для какого языка рисовать значения, а
// значит поля приезжают уже правильными, без вспышки чужого текста после
// гидратации.
//
// 🔒 СПИСОК — ЯЗЫКИ ПРОЕКТА, А НЕ ВСЕ 82. Предлагать перевод на языки, с которыми
// приложение не собирается, — работа без смысла: такого значения не увидит никто.
//
// Один язык у проекта — переключать нечего, и переключателя нет вовсе: кнопка с
// единственным положением сообщает о выборе, которого не существует.
export function EditLangSwitch({
  lang,
  group,
  langs,
  active,
  ui,
}: {
  /** Язык самой страницы: он остаётся в адресе неизменным. */
  lang: string
  group: string
  /** Языки проекта из `NEXT_PUBLIC_SUPPORTED_LANGUAGES`. */
  langs: readonly string[]
  active: string
  ui: ArchitectLayerUi
}) {
  if (langs.length < 2) return null

  return (
    <div data-edit-lang className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <Small className="text-foreground">{ui.editLang}</Small>
        <div className="flex flex-wrap gap-1">
          {langs.map(code => {
            const meta = ALL_LANGUAGE_METADATA[code]
            const isActive = code === active
            return (
              <Link
                key={code}
                href={`/${lang}/architect/app-config?group=${group}&edit=${code}`}
                data-edit-option={code}
                aria-current={isActive ? "true" : undefined}
                className={
                  "rounded-md border px-2.5 py-1 text-[length:var(--fs-small)] transition-colors " +
                  (isActive
                    ? "border-foreground/30 bg-muted font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground")
                }
              >
                {meta ? `${meta.flag} ${meta.nativeName}` : code}
              </Link>
            )
          })}
        </div>
      </div>
      <Small>{ui.editLangHint}</Small>
    </div>
  )
}
