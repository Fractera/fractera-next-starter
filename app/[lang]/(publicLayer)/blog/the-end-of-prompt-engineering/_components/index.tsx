import { createContentPost } from '@/lib/content/create-content-post'
import { blogPost } from '../../_lib/post'
import { getBlogUi } from '../../_data'
import { data } from '../_data'

// Entry for this blog post (format: 'blog'). The post is multilingual: `resolve`
// merges the base `en` cell with the cell of the requested language per key
// (lib/content/resolve.ts), so a language that translated only some fields still
// gets those. The chrome (breadcrumb/back/title/min-read) comes from getBlogUi —
// no hardcoded text anywhere in this file.

const post = createContentPost({
  format: 'blog',
  subPath: `/blog/${data.meta.slug}`,
  resolve: lang => blogPost(data, lang),
  chrome: (lang, p) => {
    const ui = getBlogUi(lang)
    return {
      // Корень сайта в путь НЕ вписывается: его печатает сам компонент крошек
      // (`components/nav/breadcrumbs.server.tsx`). Пока он стоял здесь, каждая
      // страница показывала «Fractera / Fractera / Блог / …» и объявляла в
      // разметке `BreadcrumbList` два одинаковых первых пункта.
      breadcrumbs: [
        { label: ui.breadcrumbBlog, href: `/${lang}/blog` },
        { label: p.title },
      ],
      backHref: `/${lang}/blog`,
      backLabel: ui.backToBlog,
    }
  },
  titleSuffix: lang => getBlogUi(lang).titleSuffix,
  minLabel: lang => getBlogUi(lang).minRead,
})

export const generateMetadata = post.generateMetadata
export default post.Page
