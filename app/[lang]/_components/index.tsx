import { getAppConfig } from "@/config/app-config"
import { DEFAULT_APP_CONFIG, iconUrl } from "@/config/app-config.defaults"
import { adminUrlFromSite } from "@/lib/site-urls"
import { ALL_ROLES } from "@/lib/roles"
import { homeUi } from "../_data/home.i18n"

// Главная страница проекта.
//
// 🔒 ЗАГОЛОВОК ОТВЕЧАЕТ НА ВОПРОС «ЧЕЙ ЭТО САЙТ». Пока имя в настройках не
// менялось, здесь стоит «Это ваше приложение», а НЕ имя шаблона: свежий сервер,
// объявляющий себя «Fractera», рекламирует платформу на сайте клиента и вводит в
// заблуждение его посетителей. Сохранил владелец своё имя — оно и в заголовке, а
// приглашение исчезает само.
//
// 🔒 ВСЁ СЕРВЕРНОЕ И СТАТИЧЕСКОЕ. Ни одного запроса к базе, ни одной клиентской
// части: адрес панели выводится из настроек (`adminUrlFromSite`), которые сервер
// знает на рендере. Поэтому страница уезжает в предрендер целиком и читается с
// выключенным JS — а это первая страница, которую увидит и поисковик.

/** Один бейдж возможности: слово и его цвет. */
type Badge = { label: string; tone: string }

export default function HomeEntry({ lang }: { lang: string }) {
  const config = getAppConfig()
  const t = homeUi(lang)

  // Имя считается ЗАДАННЫМ, если оно отличается от того, что ставит шаблон.
  // Сравнение с дефолтом, а не проверка на пустоту: пустым оно не бывает —
  // код всегда подставляет своё, и «не трогали» выглядит как «Fractera».
  const named = Boolean(config.name) && config.name !== DEFAULT_APP_CONFIG.name
  const title = named ? config.name : t.untitled
  const subtitle = named ? config.description : t.untitledSub

  const admin = adminUrlFromSite(config.url)

  // Цвета бейджей — не украшение: они разбивают одиннадцать слов на группы,
  // которые глаз читает без чтения. Данные, поиск, доступ, код.
  const badges: Badge[] = [
    { label: t.badgeLanguages, tone: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
    { label: t.badgeSeo, tone: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
    { label: t.badgeDatabase, tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
    { label: t.badgeVectors, tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
    { label: t.badgeKnowledge, tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
    { label: t.badgeStorage, tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
    { label: t.badgeAuth, tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
    { label: t.badgeRoles.replace("{roles}", String(ALL_ROLES.length)), tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
    { label: t.badgeGithub, tone: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
    { label: t.badgeArchitecture, tone: "bg-violet-500/15 text-violet-700 dark:text-violet-300" },
    { label: t.badgeMore, tone: "bg-muted text-muted-foreground" },
  ]

  // Шаги. Ссылка появляется, только если адрес панели известен: на сервере без
  // сохранённых настроек шаг остаётся текстом, и это честнее ссылки в никуда.
  const steps: { text: string; href?: string; link?: string }[] = [
    { text: t.step1, href: admin || undefined, link: t.step1Link },
    { text: t.step2, href: admin ? `${admin}/${lang}/languages` : undefined, link: t.step2Link },
    { text: t.step3, href: admin ? `${admin}/${lang}/app-settings` : undefined, link: t.step3Link },
    { text: t.step4, href: admin ? `${admin}/${lang}/github` : undefined, link: t.step4Link },
    { text: t.step5 },
    { text: t.step6, href: admin ? `${admin}/${lang}/deployments` : undefined, link: t.step6Link },
  ]

  return (
    <main data-app-column className="flex-1 px-6 py-20" lang={lang}>
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          {/* 🔒 ЗНАК БРЕНДА ЕСТЬ ВСЕГДА (шаг 506.1, владелец 2026-08-13).
              Логотип и набор иконок живут в `APP-CONFIG` ВНЕ репозитория, поэтому
              проект, который ещё не брендировали, не имеет ни того, ни другого — и
              главная показывала НИ ОДНОЙ картинки. Владелец прочитал это как
              сломанную сборку, и был прав в том, что проверять было нечего.
              Запасной вариант — нейтральная заглушка, которая едет с проектом
              (`npm run icons:default`) и уже стоит в манифесте: главная и
              установленное приложение показывают один знак, а не спорят.
              Заглушка НЕ несёт чужого бренда: шаблон уезжает клиенту в его
              репозиторий.
              `width`/`height` обязательны — без них заголовок подпрыгивает, пока
              знак грузится, и этот прыжок измеряется поисковиком. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={config.logo ?? iconUrl(config, "icon_192") ?? "/icons/icon-192.png"}
            alt=""
            width={72}
            height={72}
            loading="eager"
            className="mx-auto mb-6 size-18 rounded-full object-contain p-1.5 ring-1 ring-border"
          />
          {/* 🔒 ЛЕЙБЛ МЕЖДУ ЗНАКОМ И ЗАГОЛОВКОМ (владелец 2026-08-13).
              Порядок задан им же: знак бренда → лейбл → заголовок. Смысл порядка
              в том, что сначала человек видит ЧЕЙ это сайт, и только потом — на
              чём он построен; обратный порядок читался бы как реклама платформы
              на чужой странице.

              ССЫЛКА ОБЫЧНАЯ, БЕЗ `nofollow`, и это осознанно: она передаёт вес
              платформе, и в этом её вторая задача. Стоит `rel="noopener"` —
              требование безопасности при `target="_blank"`, оно на передачу веса
              не влияет.

              Каёмка живёт в `styles/globals.css` (`.pill-ai`): один элемент, две
              псевдо-строки, ноль скриптов. */}
          <a
            href="https://www.fractera.ai"
            target="_blank"
            rel="noopener"
            className="pill-ai mx-auto mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:text-primary"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0 text-primary">
              <path d="M12 2l2.1 5.6L20 9.7l-5.9 2.1L12 17.4l-2.1-5.6L4 9.7l5.9-2.1z" />
            </svg>
            {t.heroPill}
          </a>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
          {subtitle ? (
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
          ) : null}
        </header>

        <ul className="mt-10 flex flex-wrap justify-center gap-2">
          {badges.map(b => (
            <li key={b.label} className={`rounded-full px-3 py-1 text-xs font-medium ${b.tone}`}>
              {b.label}
            </li>
          ))}
        </ul>

        <section className="mt-16 rounded-2xl border border-border p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight">{t.startTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.startIntro}</p>

          {/* Нумерованный список, а не набор карточек: шаги идут по порядку, и
              порядок здесь — часть содержания. */}
          <ol className="mt-6 flex flex-col gap-4">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium tabular-nums text-muted-foreground">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-foreground">
                  {s.text}
                  {s.href && s.link ? (
                    <>
                      {" "}
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-primary underline underline-offset-2"
                      >
                        {s.link}
                      </a>
                    </>
                  ) : null}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* 🔒 ВТОРАЯ СЕКЦИЯ = ОРАНЖЕВЫЕ ТРЕБОВАНИЯ ПАНЕЛИ (владелец 2026-08-13).
            Первая повторяет красные — то, без чего начинать нельзя. Эти два не
            блокируют ничего, и потому их откладывают; а откладывать дороже всего
            именно их: ключ открывает думающую половину продукта, домен меняет
            адрес КАЖДОЙ страницы, и после индексации это уже переезд, а не
            настройка. Разделение цветов взято из `admin-warnings.ts`, чтобы
            страница и панель говорили одно и то же. */}
        <section className="mt-8 rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight">{t.advisedTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.advisedIntro}</p>

          <div className="mt-6 flex flex-col gap-5">
            {[
              { title: t.advisedOpenaiTitle, body: t.advisedOpenai, link: t.advisedOpenaiLink, href: admin ? `${admin}/${lang}/openai` : undefined },
              { title: t.advisedDomainTitle, body: t.advisedDomain, link: t.advisedDomainLink, href: admin ? `${admin}/${lang}/domain` : undefined },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />
                <p className="text-sm leading-relaxed text-foreground">
                  <strong className="font-semibold">{item.title}</strong>{" "}
                  <span className="text-muted-foreground">{item.body}</span>
                  {item.href ? (
                    <>
                      {" "}
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-primary underline underline-offset-2"
                      >
                        {item.link}
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 🔒 QUIZ — ТРЕТЬИМ, И ПОРЯДОК ЗДЕСЬ СОДЕРЖАТЕЛЬНЫЙ (владелец 2026-08-13).
            Он не может стоять выше секции с ключом OpenAI: без ключа он просто не
            работает — вопросы задаёт модель. Поэтому сначала «поставьте ключ»,
            потом «вот что он открывает».

            ОФОРМЛЕНИЕ — ЕДИНСТВЕННОЕ ИСКЛЮЧЕНИЕ НА СТРАНИЦЕ, и оно намеренное.
            Весь сайт выдержан в спокойной рамке; выделять всё — значит не
            выделить ничего. Здесь свечение оправдано тем, что это единственная
            часть страницы, где работает модель, и оно решает главную проблему
            начала — «с чего начать».

            Свечение сделано ГРАДИЕНТАМИ И ТЕНЬЮ, без анимации и без единой
            строки скрипта: движущийся фон под текстом мешает читать, а на слабом
            телефоне ещё и стоит кадров. Цвета взяты из токенов темы (`primary`),
            поэтому в светлой и тёмной теме секция выглядит своей, а не
            наклеенной. */}
        <section className="relative mt-8 overflow-hidden rounded-2xl border border-primary/30 p-6 sm:p-8">
          {/* Три мягких пятна света под содержимым. `aria-hidden` — они
              декоративны, читалке о них знать нечего. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_15%_0%,var(--color-primary)_0%,transparent_60%),radial-gradient(50%_50%_at_100%_100%,var(--color-primary)_0%,transparent_55%)] opacity-[0.07]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-inset ring-primary/20"
          />

          <div className="relative">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{t.quizEyebrow}</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{t.quizTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.quizLead}</p>

            {/* Три шага — сеткой, а не списком: они равноправны и читаются
                параллельно, в отличие от нумерованных шагов «Как начать». */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { n: "01", title: t.quizStep1Title, body: t.quizStep1 },
                { n: "02", title: t.quizStep2Title, body: t.quizStep2 },
                { n: "03", title: t.quizStep3Title, body: t.quizStep3 },
              ].map(step => (
                <div key={step.n} className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4">
                  <p className="font-mono text-[11px] tabular-nums text-primary">{step.n}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>

            <p className="mt-5 border-l-2 border-primary/50 pl-4 text-sm leading-relaxed text-foreground">
              {t.quizGate}
            </p>

            {admin ? (
              <a
                href={`${admin}/${lang}/doc-use-cases`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {t.quizLink}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            ) : null}
          </div>
        </section>

        {/* Четвёртая секция — ответ на вопрос «что я вообще держу в руках».
            Технически, без обещаний: что за скелет, где пишется код и почему он
            не ломается на росте. */}
        <section className="mt-8 rounded-2xl border border-border p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight">{t.archTitle}</h2>
          <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
            <p>{t.archScale}</p>
            <p>{t.archLoop}</p>
            <p>{t.archSkeleton}</p>
          </div>
        </section>
      </div>
    </main>
  )
}
