import { createContentPage } from '@/lib/content/create-content-page'
import { brand } from '@/lib/brand'
import { footerPage } from '@/lib/pages/footer-page'
import { data } from '../_data'

// Точка входа страницы «Архитектура». Форма — ровно та же, что у соседних
// страниц подвала: тонкий `page.tsx`, фабрика `createContentPage`, языковые
// ячейки в `_data/`.
//
// 🔒 ВРЕЗКИ «ТЕКСТ РАЗМЕЩАЕТСЯ В ПАНЕЛИ» ЗДЕСЬ НЕТ, И ЭТО ЕДИНСТВЕННОЕ ОТЛИЧИЕ
// ОТ СОСЕДЕЙ. У правовых страниц тело — заглушка: такой документ пишет владелец,
// и врезка ведёт его туда, где это делается. Здесь тело написано и верно с
// первой минуты: описывается архитектура продукта, одинаковая у всех, кто на нём
// стоит. Врезка «замените этот текст» на готовой странице сказала бы неправду и
// отправила владельца править то, что править не нужно.

const page = createContentPage({
  meta: { subPath: `/${data.meta.slug}`, ogImage: data.meta.ogImage },
  resolve: lang => footerPage(data, lang),
  chrome: (lang, content) => ({
    // Корень сайта в путь НЕ вписывается: его печатает сам компонент крошек
    // (`components/nav/breadcrumbs.server.tsx`). Пока он стоял здесь, страница
    // показывала «Fractera / Fractera / Заголовок» и объявляла в разметке
    // `BreadcrumbList` два одинаковых первых пункта.
    breadcrumbs: [{ label: content.title }],
    backHref: `/${lang}`,
    backLabel: brand().name,
  }),
})

export const generateMetadata = page.generateMetadata
export default page.Page
