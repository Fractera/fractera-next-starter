import TOOLS from "@/_tools/TOOLS.json"
import { H3, H4 } from "@/components/ui/typography"
import { KindBadge } from "@/components/catalogue/kind-badge"
import { PreStepRequest } from "@/components/request/pre-step-request.client"
import type { AppDialogUi } from "@/components/dialog/app-dialog.i18n"
import type { DesignUi } from "../_i18n/design.i18n"

// ВИТРИНА ИНСТРУМЕНТОВ ПРОЕКТА (76-3, 2026-08-31).
//
// 🔒 СПИСОК БЕРЁТСЯ ИЗ ПОРОЖДЁННОЙ КАРТЫ, А НЕ ИЗ ПЕРЕЧИСЛЕНИЯ В КОДЕ. Тот же
// закон, что у каталога блоков, и здесь он уже оплачен: `CLAUDE.md` стартера
// говорил «Five ready pieces», а папок в `_tools/` шесть — `socials-ai` приехал
// позже и не был назван ни разу. Список руками показал бы пять инструментов из
// шести и выглядел бы исправным. Карту стережёт `check:tools-map`.
//
// 🔒 ОПИСАНИЯ ЖИВУТ РЯДОМ С ИНСТРУМЕНТОМ (`_tools/<id>/tool.json`), А НЕ В
// СЛОВАРЕ ЭТОЙ СТРАНИЦЫ. Текст, оторванный от кода, устаревает в день правки
// инструмента и устаревает молча. В словаре остались только подписи полей — они
// про страницу, а не про инструмент.
//
// 🔒 КОМПОНЕНТ СЕРВЕРНЫЙ, И ЭТО НЕ МЕЛОЧЬ. Карта несёт тексты на двух языках у
// шести инструментов; клиентский островок увёз бы их в браузер целиком на каждой
// странице слоя. Сюда приезжает готовая разметка.
//
// 🔒 ВИТРИНА НИЧЕГО НЕ НАСТРАИВАЕТ И НИКУДА НЕ ПИШЕТ. Кнопки «установить» здесь
// нет: инструменты уже лежат в репозитории, ставить их некуда. Она отвечает на
// один вопрос — «что у меня есть и когда это брать».
//
// 🔒 ТРЕБОВАНИЯ — НЕ УКРАШЕНИЕ. `voice-input` не работает по `http://<IP>`:
// микрофон браузер отдаёт только в защищённом контексте, и панель клиента до
// назначения домена живёт именно так. Человек обязан прочитать это раньше, чем
// попробует, — иначе он читает исправный отказ как поломку.

type ToolText = { title: string; what: string; how: string; value: string }
type ToolEntry = {
  id: string
  dir: string
  entry: string
  needs: string[]
  npmDeps: string[]
  usedBy: string[]
  en: ToolText
  ru: ToolText
}

const LIST = (TOOLS as { tools: ToolEntry[] }).tools

export function ToolsCatalogue({
  lang,
  ui,
  dialogUi,
}: {
  lang: string
  ui: DesignUi
  /**
   * Слова самого окна заявки — резолвит сервер и передаёт пропсом.
   *
   * 🔒 Клиентский файл, импортирующий словарь окна значением, увёз бы в браузер
   * все его языки на каждой странице; это ловит `check:dialogs`.
   */
  dialogUi: AppDialogUi
}) {
  const w = ui.pages.tools
  // 🔒 НЕТ ПЕРЕВОДА — ПЕЧАТАЕТСЯ АНГЛИЙСКАЯ ОСНОВА, а не пустая карточка. То же
  // поключевое правило, которым живут языковые ячейки страниц: отсутствие
  // перевода деградирует до английского, а не до дыры.
  const text = (t: ToolEntry): ToolText => (lang === "ru" && t.ru ? t.ru : t.en)
  // Адрес страницы уезжает в заявку: агенту важно, откуда пришла просьба.
  const page = `/${lang}/architect/design?section=tools`

  return (
    <section data-tools-catalogue className="flex flex-col gap-4">
      <H3 variant="ui">{w.catalogueTitle}</H3>

      {/* 🔒 ОДНА КОЛОНКА НА ЛЮБОЙ ШИРИНЕ — прямая просьба владельца: «в одну
          колонку друг подружкой достаточно компактно». Сетка в два столбца на
          широком экране растянула бы карточки по высоте до самой длинной и
          заставила бы читать зигзагом. */}
      <div className="flex flex-col gap-3">
        {LIST.map(tool => {
          const t = text(tool)
          return (
            <article
              key={tool.id}
              data-tool-id={tool.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              {/* 🔒 МЕТКА ТА ЖЕ, ЧТО У КОДА ВИДА В КАТАЛОГЕ БЛОКОВ — заказ
                  владельца 2026-08-31. Взят САМ КОМПОНЕНТ `KindBadge`, а не его
                  классы: у метки уже было два каталога, они однажды разошлись
                  молча (`kind: 'workspace'` против `workspace`), и третья копия
                  классов разошлась бы снова.

                  🔒 СНАЧАЛА ИМЯ, ПОТОМ ПОЯСНЕНИЕ — тот же довод, которым метка
                  заведена: каталог это справочник, и по нему инструмент называют
                  в задаче. Пока путь набран серым наравне с описанием, взгляд
                  его не находит, и инструмент называют по смыслу — «тот, что
                  режет видео». */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <KindBadge code={tool.dir} />
                {/* 🔒 КАРАНДАШ СТОИТ У МЕТКИ, А НЕ НАД КАРТОЧКОЙ — тот же порядок,
                    что у образца блока, и по той же причине: в заявку уезжает
                    именно то, что написано на метке, и кнопка рядом с ней не
                    оставляет вопроса, ЧТО будет правиться. */}
                <PreStepRequest
                  tool
                  toolId={tool.dir}
                  toolUi={w.request}
                  ui={w.request}
                  dialogUi={dialogUi}
                  page={page}
                />
                <H4 variant="ui">{t.title}</H4>
              </div>

              <dl className="mt-3 flex flex-col gap-2">
                {([
                  [w.whatLabel, t.what],
                  [w.howLabel, t.how],
                  [w.valueLabel, t.value],
                ] as const).map(([label, body]) => (
                  <div key={label}>
                    <dt className="text-[length:var(--fs-small)] font-medium text-foreground">{label}</dt>
                    <dd className="text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">{body}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[length:var(--fs-small)] text-muted-foreground">{w.needsLabel}:</span>
                {tool.needs.map(n => (
                  <span
                    key={n}
                    data-tool-need={n}
                    className="rounded-md border border-border px-2 py-0.5 text-[length:var(--fs-small)] text-muted-foreground"
                  >
                    {w.needs[n as keyof typeof w.needs] ?? n}
                  </span>
                ))}
              </div>

              {/* 🔒 ПАКЕТ НАЗЫВАЕТСЯ ДО УСТАНОВКИ, А НЕ НА СБОРКЕ. Пакет, которого
                  у стартера нет, — решение владельца, а не сюрприз в логе. */}
              {tool.npmDeps.length > 0 && (
                <p data-tool-npm={tool.id} className="mt-2 text-[length:var(--fs-small)] text-muted-foreground">
                  {w.npmLabel} <code>{tool.npmDeps.join(", ")}</code>
                </p>
              )}

              {/* 🔒 «ПОКА НИКЕМ» ГОВОРИТСЯ СЛОВОМ, А НЕ МОЛЧАНИЕМ. Пустая строка
                  читается как недосмотр вёрстки; названное «никем» — как факт о
                  проекте, и это правда: `code-view` и `video-trim` в этом
                  приложении не зовёт пока никто. */}
              <p className="mt-1 text-[length:var(--fs-small)] text-muted-foreground">
                {tool.usedBy.length > 0 ? (
                  <>
                    {w.usedByLabel}{" "}
                    {tool.usedBy.map(u => (
                      <code key={u} className="mr-1.5">{u}</code>
                    ))}
                  </>
                ) : (
                  w.usedByNone
                )}
              </p>
            </article>
          )
        })}

        {/* 🔒 ТА ЖЕ КАРТОЧКА, ЧТО ВНИЗУ КАТАЛОГА БЛОКОВ — прямая просьба
            владельца: «внизу традиционно создать карточку такую же, как в
            блоках». Взят тот же островок заявки четвёртым РЕЖИМОМ, а не
            построен второй: три предмета уже живут в нём, и четвёртая копия
            разошлась бы с ними на первой правке формы.

            🔒 ЗАЯВКА НЕ ЗАПУСКАЕТ АГЕНТА. Приёмная — канал просьб, а не пульт
            исполнения; что с заявкой станет, решает владелец в разговоре.

            🔒 ТРЕБОВАНИЕ О ПАТТЕРНАХ `_tools` И НАВЫКЕ `use-tools` УЕЗЖАЕТ В ДВА
            АДРЕСА: в лид окна (его читает человек) и в сам файл заявки (его
            читает агент). Один адрес оставил бы вторую сторону в неведении. */}
        <PreStepRequest
          tool
          toolUi={w.request}
          ui={w.request}
          dialogUi={dialogUi}
          page={page}
        />
      </div>
    </section>
  )
}
