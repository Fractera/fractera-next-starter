import { blocksToMarkdown, faqToMarkdown } from './blocks-to-markdown'
import { urlFor, mdUrlFor } from '@/lib/seo/alternates'
import { getAppConfig, metaForLang } from '@/config/app-config'
import { blogPost } from '@/app/[lang]/blog/_lib/post'
import { POSTS } from '@/app/[lang]/blog/_list.generated'
import { getBlogUi } from '@/app/[lang]/blog/_data'
import { catalogueUi } from '@/app/[lang]/products/_data/ui.i18n'
import { footerPage } from '@/lib/pages/footer-page'
import { data as privacyData } from '@/app/[lang]/(footerPages)/privacy/_data'
import { data as termsData } from '@/app/[lang]/(footerPages)/terms/_data'
import { data as cookiesData } from '@/app/[lang]/(cookie)/cookies/_data'

// ПЕРЕЧЕНЬ ПУБЛИЧНЫХ ПОВЕРХНОСТЕЙ — ОДИН НА ВЕСЬ AIO (шаг 505).
//
// Отсюда берут содержимое три вещи: `llms.txt` (карта), `llms-full.txt` (полные
// тексты) и markdown-версия каждой страницы. Один перечень означает, что новая
// страница появляется во всех трёх сразу либо не появляется нигде — расхождение
// между картой и сайтом физически невозможно.
//
// 🔒 ЗДЕСЬ ТОЛЬКО ПУБЛИЧНОЕ. Страницы за ролью (`(protectedLayer)`) в перечень не
// входят и входить не могут: карта для ИИ — это приглашение прочитать, а
// закрытые адреса приглашать нельзя. Проверка `check:aio` следит за этим.
//
// Товары в перечне отсутствуют НАМЕРЕННО: их множество растёт в рантайме и
// умножается на языки. Карта называет каталог; сами карточки индексируются
// картой сайта и имеют собственные markdown-версии по своему адресу. Тот же урок,
// что с `sitemap.xml`: файл, выросший до предела, перестаёт работать целиком.

export type Surface = {
  /** Путь без языка: '' — главная, '/blog' — раздел. */
  subPath: string
  title: string
  description: string
  /** Раздел карты, в который попадает ссылка. */
  section: 'main' | 'articles' | 'legal'
  /** Полный текст в markdown — считается лениво, он нужен не всем читателям. */
  body: () => string
}

// Адрес markdown-версии живёт рядом с построением остальных адресов
// (`lib/seo/alternates.ts`) — там же, где `urlFor`, чтобы одноязычный режим
// учитывался ровно один раз. Здесь он только переэкспортируется для читателей
// этого модуля.
export { mdUrlFor }

export function publicSurfaces(lang: string): Surface[] {
  const cfg = getAppConfig()
  const home = metaForLang(lang)
  const blog = getBlogUi(lang)
  const cat = catalogueUi(lang)

  const surfaces: Surface[] = [
    {
      subPath: '',
      // Имя сайта, а не заголовок страницы: последний пропущен через шаблон
      // (`%s | Сайт`) и в карте читался бы как имя, повторённое дважды.
      title: home.siteName,
      description: home.description,
      section: 'main',
      // У главной нет собственного текста в блоках: её содержимое — это
      // идентичность проекта из настроек. Честнее отдать её как описание с
      // перечнем разделов, чем выдумать текст, которого на странице нет.
      body: () =>
        [
          `# ${home.siteName}`,
          '',
          `> ${home.description}`,
          '',
          `- ${cfg.url ? `Сайт: ${cfg.url}` : 'Адрес сайта не задан'}`,
        ].join('\n'),
    },
    {
      subPath: '/blog',
      title: blog.metaTitle,
      description: blog.metaDescription,
      section: 'articles',
      body: () =>
        [
          `# ${blog.indexTitle}`,
          '',
          `> ${blog.metaDescription}`,
          '',
          ...POSTS.map(p => {
            const post = blogPost(p, lang)
            return `- [${post.title}](${urlFor(lang, `/blog/${p.meta.slug}`)}): ${post.description}`
          }),
        ].join('\n'),
    },
    {
      subPath: '/products',
      title: cat.metaTitle,
      description: cat.metaDescription,
      section: 'main',
      body: () =>
        [`# ${cat.title}`, '', `> ${cat.metaDescription}`, '', cat.subtitle].join('\n'),
    },
  ]

  for (const p of POSTS) {
    surfaces.push({
      subPath: `/blog/${p.meta.slug}`,
      title: blogPost(p, lang).title,
      description: blogPost(p, lang).description,
      section: 'articles',
      body: () => {
        const post = blogPost(p, lang)
        return [
          `# ${post.title}`,
          '',
          post.subtitle ? `*${post.subtitle}*` : '',
          '',
          `> ${post.description}`,
          '',
          `— ${post.authorName}, ${post.date}`,
          '',
          blocksToMarkdown(post.blocks),
          '',
          faqToMarkdown(post.faq),
        ]
          .join('\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim()
      },
    })
  }

  for (const [data, sub] of [
    [privacyData, '/privacy'],
    [termsData, '/terms'],
    [cookiesData, '/cookies'],
  ] as const) {
    const page = footerPage(data as never, lang)
    surfaces.push({
      subPath: sub,
      title: page.title,
      description: page.description,
      section: 'legal',
      body: () =>
        [`# ${page.title}`, '', `> ${page.description}`, '', blocksToMarkdown(page.blocks)].join('\n').trim(),
    })
  }

  return surfaces
}

export function surfaceFor(lang: string, subPath: string): Surface | undefined {
  return publicSurfaces(lang).find(s => s.subPath === subPath)
}
