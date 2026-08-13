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

        {/* Третья секция — ответ на вопрос «что я вообще держу в руках».
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
