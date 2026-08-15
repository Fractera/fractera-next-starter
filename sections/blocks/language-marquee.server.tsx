import type { SectionRenderer } from '@/sections/contract'
import { H2 } from '@/components/ui/typography'
import { ALL_LANGUAGE_METADATA } from '@/config/translations/language-metadata'

// Завершающая секция страницы (outro): лента языков, ползущая слева направо.
//
// 🔒 ЧТО ОНА ДОКАЗЫВАЕТ. Восемьдесят два языка — заявление, которое ничего не
// значит списком в тексте. Лента показывает их в лицо: флаг и название на самом
// языке, подряд, дольше чем помещается на экран. Это же делает её примером
// секции, которой ширина экрана нужна целиком.
//
// 🔒 ВСЕ 82, А НЕ ВКЛЮЧЁННЫЙ НАБОР. Включено сегодня два языка, завтра десять —
// лента про возможность продукта, а не про сегодняшнюю настройку. Поэтому здесь
// `ALL_LANGUAGE_METADATA`, а не `SUPPORTED_LANGUAGES`.
//
// 🔒 ДВИЖЕНИЕ — CSS, БЕЗ ЕДИНОЙ СТРОКИ JS. Страница обязана работать с
// выключенным JavaScript; с ним лента едет, без него просто стоит списком —
// содержимое остаётся на месте в обоих случаях. Список выведен ДВАЖДЫ: анимация
// сдвигает дорожку ровно на половину её длины, и в момент возврата вторая копия
// стоит там же, где была первая, — шва не видно.
//
// 🔒 УВАЖЕНИЕ К `prefers-reduced-motion` — не вежливость, а требование
// доступности: у части людей движение на экране вызывает тошноту и мигрень.
// Остановка описана в `styles/globals.css` рядом с самой анимацией.

const LANGUAGES = Object.values(ALL_LANGUAGE_METADATA)

export const languageMarquee: SectionRenderer<'languageMarquee'> = (b, { key: k }) => (
  <section key={k} aria-labelledby={`${k}-t`} className="border-t border-border py-12">
    <div className="mb-8 px-6 text-center">
      <H2 id={`${k}-t`}>
        {b.title}
      </H2>
      {b.note && <p className="mt-2 text-sm text-muted-foreground">{b.note}</p>}
    </div>

    {/* Дорожка обрезается по краям экрана; наружу торчать ей нельзя, иначе
        появится горизонтальная прокрутка всей страницы. */}
    <div className="marquee group relative overflow-hidden">
      <ul className="marquee-track flex w-max gap-3 px-3">
        {[0, 1].map(copy =>
          LANGUAGES.map(l => (
            <li
              key={`${k}-${copy}-${l.code}`}
              // Вторая копия — то же самое ещё раз: для чтения с экрана она лишняя.
              aria-hidden={copy === 1 || undefined}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-2.5"
            >
              <span aria-hidden className="text-lg leading-none">{l.flag}</span>
              <span className="whitespace-nowrap text-sm font-medium text-foreground">{l.nativeName}</span>
            </li>
          )),
        )}
      </ul>
    </div>
  </section>
)
