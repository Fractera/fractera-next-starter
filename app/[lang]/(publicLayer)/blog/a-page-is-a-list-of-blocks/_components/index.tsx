import { createContentPost } from '@/lib/content/create-content-post'
import { blogPost } from '../../_lib/post'
import { getBlogUi } from '../../_data'
import { data } from '../_data'

// Вход этого поста (формат 'blog'). Файл повторяет соседний пост дословно и
// намеренно: оболочка поста — не место для авторского решения. Всё, что
// отличает материал, лежит в `_data`; крошки, кнопка возврата и подпись
// «N мин» приходят из `getBlogUi`, поэтому здесь нет ни одной строки текста.

const post = createContentPost({
  format: 'blog',
  subPath: `/blog/${data.meta.slug}`,
  resolve: lang => blogPost(data, lang),
  chrome: (lang, p) => {
    const ui = getBlogUi(lang)
    return {
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
