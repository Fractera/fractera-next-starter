import { createContentPage } from '@/lib/content/create-content-page'
import { brand } from '@/lib/brand'
import { footerPage } from '@/lib/pages/footer-page'
import { data } from '../_data'
import { PageTextRequest } from '@/components/request/page-text-request.server'

// Точка входа страницы «Доступность». Форма — ровно та же, что у соседних
// страниц подвала: тонкий `page.tsx`, фабрика `createContentPage`, языковые
// ячейки в `_data/`. Всё, что делает статику и разметку для машин — предрендер
// по языкам, hreflang, OpenGraph, JSON-LD, хлебные крошки, — приходит из
// `createContentPage`; руками здесь не пишется ничего из этого.
//
// 🔒 НИКАКОГО `force-dynamic`. Ровно этим были неверны прежние страницы legal:
// тело грузилось из рантайм-конфига на каждый запрос, и для поиска страница
// почти не существовала.
//
// 🔒 ВРЕЗКИ «ТЕКСТ РАЗМЕЩАЕТСЯ В ПАНЕЛИ» ЗДЕСЬ НЕТ — как и у «Архитектуры», и по
// той же причине. Врезка ведёт владельца туда, где он пишет СВОЙ документ:
// приватность и условия без него неправдивы. Заявление о доступности верно с
// первой минуты и говорит о том, как построен сам сайт. Врезка «замените этот
// текст» отправила бы владельца править то, что править не нужно.

const page = createContentPage({
  meta: { subPath: `/${data.meta.slug}`, ogImage: data.meta.ogImage },
  resolve: lang => footerPage(data, lang),
  // 🔒 КНОПКА ЗАЯВКИ СТОИТ ПОСЛЕ ТЕКСТА ЗАГЛУШКИ (69, слово владельца: «вместо
  // текста „что здесь должно быть“, а лучше ПОСЛЕ этого текста»). Слот `afterBody`
  // заведён ради неё и рисует ровно между телом и завершающей секцией.
  //
  // 🔒 СТАТИКА НЕ ТЕРЯЕТСЯ: сервер сессию не спрашивает, HTML одинаков для всех, а
  // видимость решает островок после гидратации. Посетитель не видит ничего.
  afterBody: lang => <PageTextRequest lang={lang} slug={data.meta.slug} title={footerPage(data, lang).title} />,
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
