import Link from "next/link"
import { PostBody } from "@/components/content-page/post-body"
import { SPECIMEN, SPECIMEN_CODES } from "@/app/[lang]/(protectedLayer)/(admin)/blocks/_data/specimen"
import { KindBadge } from "@/components/catalogue/kind-badge"
import SECTIONS from "@/sections/SECTIONS.json"
import type { DesignUi } from "../_i18n/design.i18n"

// КАТАЛОГ БЛОКОВ ВНУТРИ СЛОЯ АРХИТЕКТОРА (39-5, 2026-08-29).
//
// 🔒 КАТАЛОГ НЕ СКОПИРОВАН. Образцы (`SPECIMEN`) и рендерер (`PostBody`) — те же,
// что на странице `/{lang}/blocks`. Витрина, перерисовывающая блоки по-своему,
// показывала бы СЕБЯ, а не продукт, и дефект вроде «текст цвета страницы на
// цветной заливке» остался бы в ней невидимым — ровно так, как это уже было
// однажды с кнопкой `docref`.
//
// 🔒 ТИПЫ БЕРУТСЯ ИЗ ПОРОЖДЁННОЙ КАРТЫ, А НЕ ИЗ СПИСКА В КОДЕ. `sections/SECTIONS.json`
// стережётся гейтом `check:blocks-map`, и второй список типов разошёлся бы с ним
// на первом же новом виде — молча, потому что лишний тип в ряду выглядит как ещё
// одна кнопка, а не как ошибка.
//
// 🔒 ПЕРВАЯ КНОПКА — «ВСЕ», И ЭТО ЗАКАЗ ВЛАДЕЛЬЦА ДОСЛОВНО: «в нём каждому типу
// соответствует своя кнопка, первая кнопка „все“». Она не фильтр «ничего не
// выбрано», а полноценный выбор: человек, пришедший посмотреть, ЧТО вообще есть,
// не должен для этого угадывать тип.
//
// 🔒 НЕИЗВЕСТНЫЙ ТИП ПОКАЗЫВАЕТ ВСЁ, А НЕ ПУСТОЙ ЭКРАН. Адрес приходит из строки
// браузера; «ничего не найдено» человек читает как поломку каталога.

type SectionType = { id: string; order: number; title: Record<string, string> }
type SectionKind = { kind: string; type: string }

const TYPES = (SECTIONS.types as SectionType[]).slice().sort((a, b) => a.order - b.order)
const TYPE_OF = new Map((SECTIONS.kinds as SectionKind[]).map(k => [k.kind, k.type]))

export function BlocksCatalogue({
  lang,
  kind,
  ui,
}: {
  lang: string
  /** Выбранный тип; пусто или неизвестное — показываются все. */
  kind: string | undefined
  ui: DesignUi
}) {
  const known = TYPES.some(t => t.id === kind)
  const active = known ? kind : ""
  // 🔒 КОД ПРИКРЕПЛЯЕТСЯ К ОБРАЗЦУ ДО ФИЛЬТРА, А НЕ ИЩЕТСЯ ПОСЛЕ НЕГО. Искать
  // индекс отфильтрованного образца в исходном списке — значит завести вторую
  // связь между теми же данными: она работает, пока образцы различимы по
  // ссылке, и ломается в тот день, когда два образца окажутся одинаковыми.
  const shown = SPECIMEN.map((section, i) => ({ section, code: SPECIMEN_CODES[i] })).filter(
    ({ section }) => !active || TYPE_OF.get(section.kind) === active,
  )
  const label = (t: SectionType) => t.title[lang] ?? t.title.en ?? t.id

  const href = (id: string) =>
    `/${lang}/architect/design?section=blocks${id ? `&kind=${id}` : ""}`

  const button =
    "shrink-0 whitespace-nowrap rounded-md border px-3 py-1.5 text-[length:var(--fs-small)] transition-colors"

  return (
    <div className="flex flex-col gap-6">
      {/* 🪦 СЧЁТЧИК ВИДОВ УБРАН 2026-08-30 ПО СЛОВУ ВЛАДЕЛЬЦА: «2 видов? remove it».
          Он стоял первой строкой раздела и отвечал на вопрос, которого никто не
          задавал: сколько образцов прошло текущий фильтр. Число это меняется от
          нажатия на ярлык типа и потому ничего не сообщает о проекте — а место
          занимало то самое, первое, куда падает взгляд. Теперь там объяснение,
          зачем эта страница вообще нужна.
          Ключ `countLabel` в словаре ОСТАВЛЕН: он ничего не стоит, а вернуть
          строку дешевле, чем заново переводить её на два языка. */}

      {/* 🔒 РЯД ПРОКРУЧИВАЕТСЯ, А НЕ ПЕРЕНОСИТСЯ. Двенадцать кнопок в две строки
          съедают верх экрана и отодвигают сам каталог; ряд с прокруткой держит
          высоту постоянной независимо от числа типов. Полоса прокрутки — тихая
          (`slim-scrollbar`): жёлоб и стрелки убраны, бегунок остался. */}
      {/* РЯД ТИПОВ ЛИПКИЙ С `md` — тем же приёмом и на той же высоте, что левое меню
          и ряд разделов оболочки (владелец 2026-08-30): «когда лента в правой секции
          очень большая, механизмы навигации уходят далеко вверх, что делает
          невозможным навигацию между вкладками до того, как я верну страницу».
          Каталог блоков — самая длинная лента в проекте, здесь это видно резче всего.

          🔒 ФОН ОБЯЗАТЕЛЕН: прозрачный ряд пропускает под собой уезжающие образцы. */}
      <nav
        data-blocks-types
        className="slim-scrollbar wsx-strip -mx-1 flex gap-1.5 overflow-x-auto bg-card px-1 pb-1 md:sticky wsx-sticky md:z-30 md:py-3"
      >
        <Link
          href={href("")}
          data-block-type="all"
          aria-current={active === "" ? "page" : undefined}
          className={
            button +
            (active === ""
              ? " border-primary/50 bg-primary/5 text-foreground"
              : " border-border text-muted-foreground hover:bg-muted/50")
          }
        >
          {ui.allTypes}
        </Link>
        {TYPES.map(t => (
          <Link
            key={t.id}
            href={href(t.id)}
            data-block-type={t.id}
            aria-current={active === t.id ? "page" : undefined}
            className={
              button +
              (active === t.id
                ? " border-primary/50 bg-primary/5 text-foreground"
                : " border-border text-muted-foreground hover:bg-muted/50")
            }
          >
            {label(t)}
          </Link>
        ))}
      </nav>

      <div data-blocks-list className="flex flex-col gap-10">
        {/* 🔒 КЛЮЧ БЕРЁТ ПОДПИСЬ, А НЕ ВИД (48-1, 2026-08-30). У `workspace` два
            образца, и ключ из одного лишь `kind` был бы у них ОДИНАКОВЫМ — React
            такой список ведёт непредсказуемо, а увидеть это глазами нельзя.
            Индекс добавлен третьей опорой: он не даёт совпасть даже двум
            образцам без подписи. */}
        {/* Ключ — код образца: он уникален по построению, и второй опоры ему не
            нужно. Прежний ключ строился из одного лишь `kind`, и два образца
            `workspace` получали ОДИН И ТОТ ЖЕ — React такой список ведёт
            непредсказуемо, а увидеть это глазами нельзя. */}
        {shown.map(({ section, code }) => (
          <section key={code} data-block-kind={section.kind} className="flex flex-col gap-3">
            <div>
              {/* Код вида — метка фирменного цвета: каталог сначала называет вид,
                  и только потом объясняет его. Подпись образца стоит рядом,
                  приглушённой: она различает образцы ОДНОГО вида и потому не
                  спорит с кодом за внимание. */}
              <div className="flex flex-wrap items-center gap-2">
                <KindBadge code={code} />
                {section.label && (
                  <span className="text-[length:var(--fs-small)] text-muted-foreground">
                    {section.label}
                  </span>
                )}
              </div>
              {/* 🔒 ОПИСАНИЕ ПЕРЕВОДИТСЯ, СОДЕРЖИМОЕ ОБРАЗЦА — НЕТ (решение
                  владельца 2026-08-30). Описание объясняет, когда вид уместен, и
                  читает его человек; содержимое образца — демонстрация вида, и
                  переводить её значило бы переводить макет. Нет перевода —
                  печатается английская основа: то же поключевое правило, которым
                  живут языковые ячейки страниц. */}
              <p className="text-[length:var(--fs-small)] leading-relaxed text-muted-foreground">
                {(lang === 'ru' && section.whenRu) || section.when}
              </p>
            </div>
            {/* Рисует НАСТОЯЩИЙ рендерер — тот же, что рисует статью. */}
            <div className="rounded-lg border border-border p-4">
              <PostBody blocks={section.blocks} lang={lang} />
            </div>
          </section>
        ))}

        {/* 🔒 КАРТОЧКА СОЗДАНИЯ ЗАМЫКАЕТ ЛЮБОЙ СПИСОК — заказ владельца дословно:
            «каждая секция блоков в каждом разе будет заканчиваться новой секцией
            „создать новый блок“, который пока ничего не будет делать».

            🔒 ОНА ВЫГЛЯДИТ НЕЗАВЕРШЁННОЙ НАМЕРЕННО и НЕ является кнопкой. Кнопка,
            молчащая в ответ на нажатие, читается как поломка; пунктирная рамка с
            прямой оговоркой «пока не построено» читается как обещание. */}
        <div
          data-create-block="placeholder"
          className="rounded-lg border border-dashed border-border p-6 text-center"
        >
          <p className="text-[length:var(--fs-body)] font-medium text-muted-foreground">{ui.createBlock}</p>
          <p className="mt-1 text-[length:var(--fs-small)] text-muted-foreground">{ui.createBlockHint}</p>
        </div>
      </div>
    </div>
  )
}
