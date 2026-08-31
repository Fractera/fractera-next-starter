import { createContentPage } from '@/lib/content/create-content-page'
import { brand } from '@/lib/brand'
import { footerPage, panelNotice } from '@/lib/pages/footer-page'
import { noticeUi } from '@/lib/pages/notice.i18n'
import { data } from '../_data'
import { PageTextRequest } from '@/components/request/page-text-request.server'

// Точка входа страницы подвала. Всё, что делает статику и SEO — предрендер по
// языкам, hreflang, OpenGraph, JSON-LD, хлебные крошки, — приходит из
// `createContentPage`; здесь остаются только данные этой страницы.
//
// 🔒 НИКАКОГО `force-dynamic`. Ровно этим были неверны прежние страницы legal:
// тело грузилось из рантайм-конфига на каждый запрос, и для поиска страница
// почти не существовала. Текст владельца приезжает переводом языковой ячейки,
// а не динамикой.

const page = createContentPage({
  meta: { subPath: `/${data.meta.slug}`, ogImage: data.meta.ogImage },
  resolve: lang => {
    const ui = noticeUi(lang)
    const content = footerPage(data, lang)
    return {
      ...content,
      // Врезка «текст размещается в панели» стоит ПЕРВОЙ и собирается здесь:
      // её адрес выводится из настроек на сервере, а в языковой ячейке лежит
      // только текст. Ячейку владелец заменит своим документом — врезка уйдёт
      // вместе с этим кодом, а не останется висеть посреди готовой страницы.
      blocks: [panelNotice(lang, ui), ...content.blocks],
    }
  },
  // 🔒 КНОПКА ЗАЯВКИ СТОИТ ПОСЛЕ ТЕКСТА ЗАГЛУШКИ (69, слово владельца: «вместо
  // текста „что здесь должно быть“, а лучше ПОСЛЕ этого текста»). Слот `afterBody`
  // заведён ради неё и рисует ровно между телом и завершающей секцией.
  //
  // 🔒 СТАТИКА НЕ ТЕРЯЕТСЯ: сервер сессию не спрашивает, HTML одинаков для всех, а
  // видимость решает островок после гидратации. Посетитель не видит ничего.
  afterBody: lang => <PageTextRequest lang={lang} slug={data.meta.slug} title={footerPage(data, lang).title} />,
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
