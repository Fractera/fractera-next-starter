"use client"

import * as React from "react"
import { AppDialog } from "@/components/dialog/app-dialog.client"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"
import type { ProjectTypeCard, ProjectTypeEntry } from "@/lib/i18n/project-types.i18n"
import type { ProjectTypeMarqueeUi } from "@/sections/project-type-marquee.i18n"

// Островок ленты направлений: пауза по нажатию и окно с описанием.
//
// 🔒 ДВИЖЕНИЕ — CSS, И ЭТО НЕ ОПТИМИЗАЦИЯ, А ТРЕБОВАНИЕ. Страница обязана
// работать с выключенным JavaScript: без него лента едет по-прежнему (анимация в
// `styles/globals.css`), карточки стоят на месте и читаются, а нажатие просто
// ничего не делает. Отдай движение скрипту — и без него секция превратилась бы в
// молчаливый обрубок.
//
// 🔒 ТЕЛО ОКНА НЕ ЛЕЖИТ В СТРАНИЦЕ, А ПРИЕЗЖАЕТ ПО НАЖАТИЮ. Заголовки с
// подписями всех двадцати двух направлений весят 1.8 КБ, полные описания —
// 107 КБ на язык. Положить их в разметку главной значит утроить её ради
// содержимого, которое большинство посетителей не откроет. Маршрут
// `/api/project-types/<язык>/<id>` статический: файлы рождаются на сборке.
//
// 🔒 ЧТО ПРИВЕЗЛИ — ОСТАЁТСЯ В ПАМЯТИ. Человек открывает соседние карточки
// подряд, сравнивая; повторный запрос за тем же описанием — это мигание на
// пустом месте.

type Props = {
  cards: ProjectTypeCard[]
  lang: string
  ui: ProjectTypeMarqueeUi
  dialogUi: AppDialogUi
}

export function ProjectTypeMarquee({ cards, lang, ui, dialogUi }: Props) {
  const [openId, setOpenId] = React.useState<string | null>(null)
  // Пауза ПОМНИТСЯ отдельно от окна: владелец просил, чтобы закрытие окна
  // возвращало ленту в движение, поэтому одного состояния «окно открыто» хватило
  // бы — но курсор над лентой тоже её останавливает, и это делает CSS. Здесь
  // живёт только пауза от нажатия.
  const [paused, setPaused] = React.useState(false)
  const [body, setBody] = React.useState<Record<string, ProjectTypeEntry>>({})
  const [failed, setFailed] = React.useState(false)

  function openCard(id: string) {
    setPaused(true)
    setOpenId(id)
    if (body[id]) return
    setFailed(false)
    fetch(`/api/project-types/${lang}/${id}`)
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((e: ProjectTypeEntry) => setBody(prev => ({ ...prev, [id]: e })))
      .catch(() => setFailed(true))
  }

  const card = openId ? cards.find(c => c.id === openId) : undefined
  const entry = openId ? body[openId] : undefined

  return (
    <>
      <div className={`pt-marquee relative overflow-hidden${paused ? " is-paused" : ""}`}>
        <ul className="pt-track flex w-max items-stretch gap-3 px-3">
          {[0, 1].map(copy =>
            cards.map(c => (
              <li key={`${copy}-${c.id}`} className="flex" aria-hidden={copy === 1 || undefined}>
                <button
                  type="button"
                  // Вторая копия дорожки для читалки экрана лишняя: её карточки
                  // те же самые, и озвучивать их дважды значит удвоить список.
                  tabIndex={copy === 1 ? -1 : undefined}
                  onClick={() => openCard(c.id)}
                  title={ui.openCard}
                  className="pt-card flex flex-col items-start gap-1 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-left transition-colors hover:bg-primary/20"
                >
                  <span className="text-sm font-medium text-foreground">{c.title}</span>
                  <span className="text-xs leading-snug text-muted-foreground">{c.tagline}</span>
                </button>
              </li>
            )),
          )}
        </ul>

        {/* Полосы ухода в размытие. `aria-hidden` и без событий: это оформление,
            и перехватывать нажатия по карточкам под ними им нельзя. */}
        <span aria-hidden className="pt-fade pt-fade-left" />
        <span aria-hidden className="pt-fade pt-fade-right" />
      </div>

      <AppDialog
        open={Boolean(openId)}
        onOpenChange={v => {
          if (v) return
          setOpenId(null)
          // Закрыли окно — лента поехала. Решение владельца: состояния «стоит и
          // ждёт» у ленты нет, иначе человек, закрывший окно, остаётся перед
          // неподвижной лентой и не понимает, почему она замерла.
          setPaused(false)
        }}
        ui={dialogUi}
        size="lg"
        title={card?.title ?? ""}
        description={card?.tagline}
      >
        {/* Кнопок у этого окна нет НАМЕРЕННО (заказ владельца): здесь нечего
            подтверждать — это справка о направлении, и закрывают её крестиком. */}
        {failed ? (
          <p className="text-sm text-muted-foreground">{ui.failed}</p>
        ) : !entry ? (
          <p className="text-sm text-muted-foreground">{ui.loading}</p>
        ) : (
          <div className="space-y-4 text-sm leading-relaxed">
            <p className="text-foreground">{entry.definition}</p>

            <Section title={ui.examples}>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                {entry.examples.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </Section>

            <Section title={ui.signals}>
              <ul className="space-y-1 rounded-lg border border-border bg-muted/40 p-3 text-muted-foreground">
                {entry.signals.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </Section>

            {entry.questions.length > 0 && (
              <Section title={ui.questions}>
                <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                  {entry.questions.map((x, i) => <li key={i}>{x}</li>)}
                </ol>
              </Section>
            )}
          </div>
        )}
      </AppDialog>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
      {children}
    </div>
  )
}
