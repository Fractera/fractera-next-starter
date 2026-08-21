import { createContentPage } from '@/lib/content/create-content-page'
import { brand } from '@/lib/brand'
import { footerPage } from '@/lib/pages/footer-page'
import { data } from '../_data'

// Точка входа страницы «О нас». Модель первая из трёх: публичная, авторская,
// конечная — папка на запись, предрендер, индексируется. Форма ровно та же, что
// у страниц подвала: тонкий `page.tsx`, фабрика `createContentPage`, языковые
// ячейки в `_data/`.
//
// Всё, что делает статику и разметку для машин, приходит из фабрики и руками
// здесь не пишется: предрендер по языкам, канонический адрес и `hreflang`,
// OpenGraph с картинкой, карточка Twitter, `Article` с автором-`Person` и
// издателем-`Organization`. Хлебные крошки печатает компонент крошек, он же
// объявляет `BreadcrumbList` — второй такой разметки на странице быть не должно.
//
// 🔒 НИ ОДНОЙ ИЗ ТРЁХ СТРОК, УБИВАЮЩИХ СТАТИКУ: `force-dynamic`, `cookies()`,
// `headers()`. Любая из них делает динамическим всё поддерево, и страница
// перестаёт стоять в списке сборки с `●`.
//
// 🔒 КАРТИНКА ПРИХОДИТ ИЗ `meta`, А НЕ ИЗ ЯЗЫКОВОЙ ЯЧЕЙКИ. Файл один и тот же в
// обеих ролях — герой под заголовком и `og:image`, — поэтому и живёт в одном
// непереводимом месте: два адреса разошлись бы, и снаружи это видно только в
// чужом мессенджере.
const page = createContentPage({
  meta: { subPath: `/${data.meta.slug}`, ogImage: data.meta.ogImage, heroImage: data.meta.heroImage },
  resolve: lang => footerPage(data, lang),
  chrome: (lang, content) => ({
    // Корень сайта в путь НЕ вписывается: его печатает сам компонент крошек
    // (`components/nav/breadcrumbs.server.tsx`).
    breadcrumbs: [{ label: content.title }],
    backHref: `/${lang}`,
    backLabel: brand().name,
  }),
})

export const generateMetadata = page.generateMetadata
export default page.Page
