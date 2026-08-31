import { StaticImage } from "@/components/media/static-image.server"
import { H2, H3, P, Small } from "@/components/ui/typography"
import type { getBlogUi } from "../../../_data"

// ВИДЖЕТ «список записей» — облик индекса блога, принадлежащий одному маршруту
// (шаг 64).
//
// 🔒 ПОЧЕМУ ВИДЖЕТ, А НЕ ВИД КАТАЛОГА. Список записей знает про обложку, время
// чтения, метки и главную карточку на первом экране — всё это свойства ОДНОЙ
// страницы. Вид каталога обязан подходить любой странице проекта; этот не
// подошёл бы ни одной другой.
//
// 🔒 ДАТА ФОРМАТИРУЕТСЯ ЗДЕСЬ, А НЕ ПРИХОДИТ СТРОКОЙ. Формат зависит от языка
// страницы, и он часть облика — как и всё остальное в этом файле.
function formatDate(iso: string, lang: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

type Ui = ReturnType<typeof getBlogUi>
type Post = { slug: string; title: string; excerpt: string; image: string; date: string; readingMinutes: number; tags: string[] }

export function PostList({ lang, ui, posts }: { lang: string; ui: Ui; posts: Post[] }) {
  const [featured, ...rest] = posts

  return (
    <>
    {featured && (
      <a
        href={`/${lang}/blog/${featured.slug}`}
        className="group grid grid-cols-1 overflow-hidden rounded-3xl border border-border transition-colors hover:border-foreground/30 md:grid-cols-2"
      >
        <div className="relative aspect-video overflow-hidden bg-muted md:aspect-auto">
          {/* Главная карточка стоит на первом экране, поэтому `priority`:
              ленивая загрузка здесь отложила бы ровно то, ради чего человек
              пришёл. Ширина в вёрстке — половина полосы на широком экране. */}
          <StaticImage
            src={featured.image}
            alt={featured.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
            {ui.featured}
          </span>
        </div>
        <div className="flex flex-col gap-4 p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            {featured.tags.slice(0, 2).map(t => (
              <span key={t} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
          <H2>
            {featured.title}
          </H2>
          {/* Текст карточки — примитив шкалы, а не свои классы: `text-base`
              не двигается вместе с множителем `--type-scale` из панели. */}
          <P>{featured.excerpt}</P>
          <div className="mt-auto flex items-center gap-3 pt-2 text-sm text-muted-foreground">
            <time dateTime={featured.date}>{formatDate(featured.date, lang)}</time>
            <span aria-hidden>·</span>
            <span>{featured.readingMinutes} {ui.minRead}</span>
            <span className="ml-auto inline-flex items-center gap-1.5 font-medium text-primary group-hover:text-primary">
              {ui.read}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </span>
          </div>
        </div>
      </a>
    )}

    {rest.length > 0 && (
      <div className="flex flex-col gap-5">
        {rest.map(post => (
          <a
            key={post.slug}
            href={`/${lang}/blog/${post.slug}`}
            className="group grid grid-cols-[8rem_1fr] items-stretch gap-4 overflow-hidden rounded-2xl border border-border transition-colors hover:border-foreground/30 sm:grid-cols-[12rem_1fr] sm:gap-6"
          >
            {/* Fixed 4:3 illustration container on the left. Its fixed width
                makes the 4:3 height — and thus the whole card's height —
                constant at any screen width (8rem→6rem tall, sm 12rem→9rem). */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              {/* Карточки списка лежат ниже сгиба — грузятся лениво (по
                  умолчанию у `next/image`), и до загрузки на их месте стоит
                  размытая копия, а не пустой прямоугольник. Ширина в вёрстке
                  фиксирована контейнером, отсюда точные `sizes`. */}
              <StaticImage
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 6rem, 12rem"
                className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
              />
            </div>
            {/* Content clamped so it always fits the fixed card height: title
                max 1 line, excerpt max 2 lines, meta pinned to the bottom. */}
            <div className="flex min-w-0 flex-col gap-1.5 py-3 pr-5 sm:gap-2 sm:py-4 sm:pr-6">
              <H3 variant="ui" className="line-clamp-1">
                {post.title}
              </H3>
              <Small className="line-clamp-2">{post.excerpt}</Small>
              <div className="mt-auto flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
                <span aria-hidden>·</span>
                <span>{post.readingMinutes} {ui.minRead}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    )}
    </>
)
}
