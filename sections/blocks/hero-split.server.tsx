import type { SectionRenderer } from '@/sections/contract'
import { ConfigImage } from '@/components/media/config-image.server'
import { StaticImage } from '@/components/media/static-image.server'
import { getAppConfig } from '@/config/app-config'
import { getLogoPath } from '@/config/app-config.defaults'
import { inline } from '@/lib/content/blocks/inline'
import { H1 } from '@/components/ui/typography'

// Первый экран лендинга: знак и лейбл по центру, под ними слово слева и
// иллюстрация справа.
//
// 🔒 ПОЧЕМУ ЭТО СЕКЦИЯ, А НЕ ПРАВКА ШАБЛОНА СТРАНИЦЫ. Шаблон один на семь
// страниц — главную, два поста, три правовые и каталог. Двухколоночная шапка
// нужна ровно лендингу; вписать её в общий шаблон значит изменить шесть страниц,
// которым она не нужна, причём МОЛЧА: сборка зелёная, типы целы, а вёрстка
// разъехалась. Секция же — вид, который страница берёт, когда он ей нужен.
//
// 🔒 H1 ЗДЕСЬ, И ЭТО ОСОЗНАННОЕ ИСКЛЮЧЕНИЕ. Разбор — в каталоге
// (`lib/content/blocks/types.ts`, вид `heroSplit`): заголовок обязан стоять в
// левой колонке, а снаружи сетки он туда не попадает. Страница, использующая эту
// секцию, объявляет `titleInBody`, и на ней остаётся ровно один H1.
//
// 🔒 У СЕКЦИИ СВОЙ ПРЕДЕЛ ШИРИНЫ — 56rem, И ЭТО СМЫСЛОВОЕ РЕШЕНИЕ (владелец,
// 2026-08-15). Стоит она во всю ширину экрана и переключателю не подчиняется, но
// РАСТЯГИВАТЬ её содержимое на всю ширину нельзя: на мониторе в 2500 пикселей
// заголовок с картинкой, разъехавшиеся по краям, читаются как сломанная
// страница. Предел живёт ЗДЕСЬ, в самой секции, а не в шаблоне — так он виден
// тому, кто эту секцию правит, и меняется одним числом под свой вкус.
//
// Сравнить с завершающей секцией (`language-marquee.server.tsx`): там предела
// нет намеренно — лента обязана идти от края до края. Две секции, два разных
// закона ширины, и оба записаны в них самих.
//
// 🔒 НА ТЕЛЕФОНЕ КОЛОНКИ СКЛАДЫВАЮТСЯ, И КАРТИНКА УХОДИТ ВНИЗ: в разметке
// сначала слово, ради которого человек пришёл, потом иллюстрация.

/** Размер знака. 72 = 120 − 40% (заказ владельца 2026-08-15). */
const MARK_PX = 72

export const heroSplit: SectionRenderer<'heroSplit'> = (b, { key: k }) => {
  // Знак берётся из настроек; не загрузили — стоит заглушка, та же, что на
  // страницах ошибок. Она не выдаёт себя за бренд клиента, а показывает МЕСТО:
  // «сюда встанет ваш знак». Пустота на этом месте вопроса не задаёт, и владелец
  // так и не узнаёт, что знак вообще предусмотрен.
  const logo = getLogoPath(getAppConfig())
  const markClass = 'size-full object-cover'

  return (
    <section key={k} className="py-10">
      {/* Предел — переменная `--hero-w` (styles/globals.css), не утилита:
          размер обязан быть виден числом. Классом `max-w-4xl` здесь уже был
          посажен дефект — 896px против 1024px у ленты, отчего первый экран
          оказался уже содержимого под ним. */}
      <div className="mx-auto w-full px-6" style={{ maxWidth: 'var(--hero-w)' }}>
        {/* Знак и лейбл — по центру ВСЕЙ секции, над обеими колонками. */}
        <div className="flex flex-col items-center gap-4 text-center">
          {(b.mark ?? true) && (
            <span
              className="block overflow-hidden rounded-full border border-border bg-background"
              style={{ width: MARK_PX, height: MARK_PX }}
            >
              {logo ? (
                <StaticImage src={logo} alt="" sizes={`${MARK_PX}px`} priority className={markClass} />
              ) : (
                <>
                  <span className="contents dark:hidden">
                    <StaticImage src="/placeholders/logo-light.png" alt="" sizes={`${MARK_PX}px`} priority className={markClass} />
                  </span>
                  <span aria-hidden className="hidden dark:contents">
                    <StaticImage src="/placeholders/logo-dark.png" alt="" sizes={`${MARK_PX}px`} priority className={markClass} />
                  </span>
                </>
              )}
            </span>
          )}
          {b.pill && (
            /* Каёмка живёт в styles/globals.css (.pill-ai): один элемент, две темы. */
            <span className="pill-ai inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground">
              {b.pill}
            </span>
          )}
        </div>

        <div className="mt-8 grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col gap-5">
            {/* Свечение и обводка — из токена темы (класс `.h1-glow`), а не
                фиолетовым числом: цвет заголовка идёт за темой проекта. */}
            {/* Размер и шрифт — из примитива типографики: заголовок первого
                экрана обязан совпадать с заголовком любой другой страницы.
                Здесь остаётся только свечение. */}
            <H1 className="h1-glow">{b.title}</H1>
            <p className="text-base leading-relaxed text-muted-foreground">
              {inline(b.description, `${k}-d`)}
            </p>
          </div>

          {/* 🔒 КАРТИНКА ЗАНИМАЕТ КОЛОНКУ ЦЕЛИКОМ (2026-08-15). Здесь стояло
              `md:justify-self-end`, и на широких экранах оно давало ровно
              обратное задуманному: элемент прижимался к правому краю и брал
              СВОЮ ширину, а не ширину колонки — картинка оставалась мелкой, а
              вокруг копился воздух. Высоте расти при этом можно и нужно:
              пропорции важнее одинаковой высоты колонок. */}
          <div className="w-full">
            <ConfigImage
              slot={b.image}
              alt={b.imageAlt}
              // Первый экран — грузить сразу: по этой картинке поисковик меряет
              // скорость появления страницы.
              priority
              // Половина ширины окна на широком экране — именно столько занимает
              // колонка. Прежние 26rem заставляли браузер брать файл заведомо
              // мельче отведённого места и растягивать его.
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-auto w-full rounded-2xl border border-border"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
