import type { SectionRenderer } from '@/sections/contract'
import { ConfigImage } from '@/components/media/config-image.server'
import { inline } from '@/lib/content/blocks/inline'

// Первый экран лендинга: слово слева, иллюстрация справа.
//
// 🔒 ПОЧЕМУ ЭТО СЕКЦИЯ, А НЕ ПРАВКА ШАБЛОНА СТРАНИЦЫ. Шаблон один на семь
// страниц — главную, два поста, три правовые и каталог. Двухколоночная шапка
// нужна ровно лендингу; вписать её в общий шаблон значит изменить шесть страниц,
// которым она не нужна, причём МОЛЧА: сборка зелёная, типы целы, а вёрстка
// разъехалась, и увидеть это можно только глазами на каждой. Секция же — вид,
// который страница берёт, когда он ей нужен, и не берёт, когда нет. В этом и
// состоит устройство каталога блоков: не хватает вида — добавляется вид.
//
// 🔒 H1 ЗДЕСЬ, И ЭТО ОСОЗНАННОЕ ИСКЛЮЧЕНИЕ. Смотри разбор в каталоге
// (`lib/content/blocks/types.ts`, вид `heroSplit`): заголовок обязан стоять в
// левой колонке, а снаружи сетки он туда не попадает. Страница, использующая эту
// секцию, объявляет `titleInBody` — тогда фабрика своего H1 не печатает и на
// странице остаётся ровно один.
//
// 🔒 НА ТЕЛЕФОНЕ КОЛОНКИ СКЛАДЫВАЮТСЯ, И КАРТИНКА УХОДИТ ВНИЗ. Порядок в разметке
// — слово, потом иллюстрация: на узком экране первым обязан идти текст, ради
// которого человек пришёл, а не картинка высотой в пол-экрана, которую надо
// пролистать.
export const heroSplit: SectionRenderer<'heroSplit'> = (b, { key: k }) => (
  <section
    key={k}
    className="mt-6 grid items-center gap-8 border-b border-border pb-10 md:grid-cols-2 md:gap-12"
  >
    <div className="flex flex-col gap-5">
      {b.pill && (
        /* Каёмка живёт в styles/globals.css (.pill-ai): один элемент, две темы. */
        <span className="pill-ai inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground">
          {b.pill}
        </span>
      )}
      {/* Свечение и обводка — из токена темы (класс `.h1-glow`), а не фиолетовым
          числом: цвет заголовка обязан идти за темой проекта, а не за нашей. */}
      <h1 className="h1-glow font-serif text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
        {b.title}
      </h1>
      <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
        {inline(b.description, `${k}-d`)}
      </p>
    </div>

    <div className="md:justify-self-end">
      <ConfigImage
        slot={b.image}
        alt={b.imageAlt}
        // Первый экран — грузить сразу: по этой картинке поисковик меряет
        // скорость появления страницы.
        priority
        sizes="(max-width: 768px) 100vw, 32rem"
        className="h-auto w-full rounded-2xl border border-border"
      />
    </div>
  </section>
)
