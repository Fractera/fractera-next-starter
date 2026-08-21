import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'
import { CircleAlert, Lightbulb } from 'lucide-react'
import { H4, P } from '@/components/ui/typography'
import { SectionHead } from '@/sections/section-head.server'

// Разбор в две половины: слева перечень случаев, справа один разобранный — сверху
// «что требуется», снизу «почему это работает здесь».
//
// 🔒 НИ ОДНОЙ СТРОКИ СКРИПТА, И ЭТО ГЛАВНОЕ РЕШЕНИЕ ЭТОГО ВИДА. Образец, с
// которого он снят, переключает вкладки состоянием React: без JavaScript там нет
// ни одного случая, а краулеру достаётся отдельная невидимая копия текста —
// признание, что видимая версия для него не годится. Здесь переключение делает
// сам браузер: перечень — это переключатели `radio`, подписи — их ярлыки, а показ
// нужной половины — правило `:checked` в `styles/globals.css`.
//
// Что это покупает разом: весь текст ВСЕХ случаев лежит в серверной разметке;
// человек без скриптов пользуется секцией полностью, а не «терпимо»; клавиатура
// ходит по случаям стрелками, потому что группа переключателей умеет это сама, и
// объяснять диктору ничего не надо. Вторая копия текста «для робота» не нужна: он
// читает ту же, что и человек.
//
// 🔒 ПОЛОВИНЫ СТОЯТ ДРУГ ПОД ДРУГОМ, А НЕ РЯДОМ. Нижняя читается как ОТВЕТ
// верхней, и порядок здесь — содержание: «вот что требуется» → «вот почему это
// решено так». Поставь их в две колонки, и связь превратится в сравнение.
//
// 🔒 КАРТОЧКИ СЛОЖЕНЫ В ОДНУ ЯЧЕЙКУ СЕТКИ (`col-start-1 row-start-1`), а не
// спрятаны отступом. Высота секции равна самому длинному случаю и НЕ меняется при
// переключении: иначе страница подпрыгивала бы под курсором на каждом выборе.
// Тот же приём заменяет `absolute inset-0` — накладка во весь экран в этом
// проекте принадлежит окнам, и сторож `check:dialogs` следит за этим.
export const problemSolution: SectionRenderer<'problemSolution'> = (b, { key: k }) => (
  <section key={k} aria-labelledby={`${k}-t`} className="my-10">
    <SectionHead
      id={`${k}-t`}
      badge={b.badge}
      title={b.title}
      note={b.note ? inline(b.note, `${k}-n`) : undefined}
    />

    <div className="ps mt-8">
      {/* Переключатели стоят ПЕРЕД содержимым, потому что правило `:checked ~`
          смотрит только вперёд по соседям. Они видимы для клавиатуры и скрыты
          для глаза: роль выбора несут ярлыки слева. */}
      {b.items.map((_, i) => (
        <input
          key={`${k}-r${i}`}
          className="ps-r sr-only"
          type="radio"
          name={k}
          id={`${k}-r${i}`}
          defaultChecked={i === 0}
        />
      ))}

      <div className="ps-body flex flex-col gap-4 md:flex-row md:gap-6">
        <ul className="flex w-full list-none flex-col gap-1 p-0 md:w-[220px] md:shrink-0">
          {b.items.map((item, i) => (
            <li key={`${k}-l${i}`}>
              {/* Ярлык — настоящий `<label>`: нажатие по нему переключает свой
                  переключатель без нашей помощи, и то же делает клавиатура. */}
              <label
                htmlFor={`${k}-r${i}`}
                className="ps-tab block cursor-pointer border-l-[3px] py-2.5 pl-3.5 text-left text-[length:var(--fs-body)] font-medium leading-snug transition-colors"
              >
                {item.title}
              </label>
            </li>
          ))}
        </ul>

        <div className="grid w-full grow">
          {b.items.map((item, i) => (
            <div
              key={`${k}-p${i}`}
              className="ps-panel col-start-1 row-start-1 overflow-hidden rounded-2xl border border-border bg-card p-6"
            >
              <div className="mb-3 flex items-center gap-2">
                <CircleAlert size={20} className="shrink-0 text-primary" aria-hidden />
                <H4 variant="ui">{b.demandLabel}</H4>
              </div>
              <P>{inline(item.demand, `${k}-${i}-d`)}</P>

              {/* Черта между половинами: она делит, а не украшает, поэтому
                  бледнеет к краям — как и у образца. Цвет — токен рамки. */}
              <span aria-hidden className="my-4 block h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

              <div className="mb-3 flex items-center gap-2">
                <Lightbulb size={20} className="shrink-0 text-primary" aria-hidden />
                <H4 variant="ui">{b.answerLabel}</H4>
              </div>
              <P>{inline(item.answer, `${k}-${i}-a`)}</P>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)
