import type { BlogMeta } from '../../_lib/types'

// Непереводимые поля. Автора здесь нет намеренно: подпись берётся из настроек
// проекта, иначе блог каждого клиента подписывался бы чужим именем.
//
// Видео-обложки у этого поста нет — `hero` тогда не рисуется вовсе, и это
// законный вид поста. `heroPoster` остаётся: карточка в списке блога рисует
// именно его (свой файл из `public/`, к которому посчитана размытая подложка),
// а `ogImage` тот же кадр достраивает до абсолютного адреса для соцсетей.
export const meta: BlogMeta = {
  slug: 'a-page-is-a-list-of-blocks',
  date: '2026-08-19',
  readingMinutes: 7,
  tags: ['Sections', 'Content engine', 'Page models', 'Architecture'],
  heroPoster: '/blog-media/development-loop-2026.jpg',
  ogImage: '/blog-media/development-loop-2026.jpg',
}
