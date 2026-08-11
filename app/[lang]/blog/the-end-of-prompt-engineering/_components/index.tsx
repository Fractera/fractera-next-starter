import { createContentPost } from '@/lib/content/create-content-post'
import { blogPost } from '../../_lib/post'
import { getBlogUi } from '../../_data'
import { brand } from '@/lib/brand'
import { data } from '../_data'

// Entry for this blog post (format: 'blog'). Blog content is EN-only, so resolve
// ignores lang; the URL still carries the lang segment for routing and the chrome
// (breadcrumb/back/title/min-read) is localized via getBlogUi — no hardcoded text.

const post = createContentPost({
  format: 'blog',
  subPath: `/blog/${data.meta.slug}`,
  resolve: lang => blogPost(data, lang),
  chrome: (lang, p) => {
    const ui = getBlogUi(lang)
    return {
      breadcrumbs: [
        { label: brand().name, href: `/${lang}` },
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
