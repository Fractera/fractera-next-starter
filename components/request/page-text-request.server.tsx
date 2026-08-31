import { ArchitectOnly } from "./architect-only.client"
import { PreStepRequest } from "./pre-step-request.client"
import { appDialogUi } from "@/components/dialog/app-dialog.i18n"
import { noticeUi } from "@/lib/pages/notice.i18n"
import { blockRequestUi } from "@/lib/pages/page-request.i18n"

// КНОПКА «ПОПРОСИТЬ ПРОЕКТ НАПИСАТЬ ЭТОТ ТЕКСТ» (шаг 69, 2026-08-31).
//
// Владелец: «вместо текста „что здесь должно быть“, а лучше после этого текста,
// добавить кнопку такую же, как мы добавили в дизайне для блоков, и использовать
// ту же самую логику».
//
// 🔒 СЕРВЕРНАЯ ОБЁРТКА, А НЕ ЧЕТЫРЕ ОДИНАКОВЫХ КУСКА В СТРАНИЦАХ. Резолв слов —
// работа сервера: клиентский файл, импортирующий словарь значением, увёз бы в
// браузер все его языки. Здесь слова резолвятся один раз и уезжают пропсами.
//
// 🔒 ВИДИМОСТЬ РЕШАЕТ `ArchitectOnly`, И ТОЛЬКО ПОСЛЕ ГИДРАТАЦИИ. Страница
// остаётся полностью статической: сервер не спрашивает сессию, HTML одинаков для
// всех. Кнопки в нём нет вовсе — она появляется в браузере у того, чья роль это
// подтвердила.
//
// 🔒 ЭТО ЧАСТЬ ЗАГЛУШКИ, А НЕ ЧАСТЬ СТРАНИЦЫ. Владелец заменил текст своим —
// исчезает вместе с заглушкой и она, и кнопка, и запрос к `/api/me`. Готовый сайт
// за неё не платит ничем.
export function PageTextRequest({ lang, slug, title }: { lang: string; slug: string; title: string }) {
  const n = noticeUi(lang)
  return (
    <div className="mt-8">
      <ArchitectOnly>
        <PreStepRequest
          ui={blockRequestUi(lang)}
          dialogUi={appDialogUi(lang)}
          pageSlug={slug}
          pageTitle={title}
          pageUi={{ label: n.requestLabel, title: n.requestTitle, lead: n.requestLead }}
          page={`/${lang}/${slug}`}
        />
      </ArchitectOnly>
    </div>
  )
}
