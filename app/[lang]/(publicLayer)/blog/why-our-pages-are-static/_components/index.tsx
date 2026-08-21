import { createContentPost } from '@/lib/content/create-content-post'
import { blogPost } from '../../_lib/post'
import { getBlogUi } from '../../_data'
import { data } from '../_data'

// Вход записи (формат `blog`). Ни одной строки текста здесь нет намеренно:
// заголовки, крошки и подписи приходят из словаря вкладки (`getBlogUi`), а само
// содержимое — из языковых ячеек `_data`. Файл-вход у всех записей одинаков, и
// это и есть признак того, что запись — данные, а не свёрстанная страница.

const post = createContentPost({
  format: 'blog',
  subPath: `/blog/${data.meta.slug}`,
  resolve: lang => blogPost(data, lang),
  chrome: (lang, p) => {
    const ui = getBlogUi(lang)
    return {
      // Корень сайта в крошки не вписывается: его печатает сам компонент
      // (`components/nav/breadcrumbs.server.tsx`).
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
