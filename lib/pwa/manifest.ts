import type { MetadataRoute } from 'next'
import { getAppConfig, metaForLang } from '@/config/app-config'
import { iconUrl } from '@/config/app-config.defaults'
import { urlFor } from '@/lib/seo/alternates'
import { getBlogUi } from '@/app/[lang]/blog/_data'
import { catalogueUi } from '@/app/[lang]/products/_data/ui.i18n'

// Манифест устанавливаемого приложения — НА ЯЗЫК (шаг 504).
//
// ЗАЧЕМ ПО ЯЗЫКАМ. Установленное приложение подписано на домашнем экране именем
// из манифеста и открывается с адреса `start_url`. Один манифест на весь сайт
// означал, что испаноязычный посетитель ставит себе приложение с английским
// именем, которое открывается на английской главной, — то же самое, что один
// `<html lang>` на все языки, только на телефоне и навсегда: имя на экране он
// потом не переименует.
//
// Иконки — общие: они не текст. Нарезает их панель из одного изображения
// владельца, включая `maskable` (систему интересует форма, а не картинка).

export function buildManifest(lang: string): MetadataRoute.Manifest {
  const cfg = getAppConfig()
  const meta = metaForLang(lang)
  const blog = getBlogUi(lang)
  const cat = catalogueUi(lang)

  const icons: NonNullable<MetadataRoute.Manifest['icons']> = []
  if (cfg.iconSet) {
    const i192 = iconUrl(cfg, 'icon_192')
    const i512 = iconUrl(cfg, 'icon_512')
    if (i192) icons.push({ src: i192, sizes: '192x192', type: 'image/png', purpose: 'any' })
    if (i512) {
      icons.push({ src: i512, sizes: '512x512', type: 'image/png', purpose: 'any' })
      icons.push({ src: i512, sizes: '512x512', type: 'image/png', purpose: 'maskable' })
    }
  } else {
    if (cfg.icons.icon192) icons.push({ src: cfg.icons.icon192, sizes: '192x192', type: 'image/png', purpose: 'any' })
    if (cfg.icons.icon512) icons.push({ src: cfg.icons.icon512, sizes: '512x512', type: 'image/png', purpose: 'any' })
    if (cfg.icons.icon512Maskable)
      icons.push({ src: cfg.icons.icon512Maskable, sizes: '512x512', type: 'image/png', purpose: 'maskable' })
  }

  const start = urlFor(lang, '')

  return {
    // `id` фиксирует ТОЖДЕСТВО приложения. Без него система опознаёт установку по
    // `start_url`, и смена стартового адреса превращается в ВТОРОЕ приложение
    // рядом с первым вместо обновления существующего.
    id: start,
    // 🔒 ИМЯ — БЕЗ ШАБЛОНА ЗАГОЛОВКА. `metaForLang().title` возвращает название,
    // пропущенное через шаблон страницы (`%s | Сайт`), и на домашнем экране это
    // выглядело как «Proof Site | Fractera» — заголовок вкладки вместо имени
    // приложения. Найдено живой проверкой манифеста. Для значка нужно имя сайта.
    name: meta.siteName,
    short_name: cfg.short_name || meta.siteName,
    description: meta.description,
    lang,
    dir: 'auto',
    start_url: start,
    scope: cfg.pwa.scope ?? '/',
    display: cfg.pwa.display,
    orientation: cfg.pwa.orientation,
    theme_color: cfg.pwa.themeColor,
    background_color: cfg.pwa.backgroundColor,
    icons,
    categories: ['productivity', 'utilities'],
    // Быстрые действия при долгом нажатии на значок. Слова берутся из УЖЕ
    // переведённых разделов — своих строк ярлыки не заводят, поэтому они
    // появляются на новом языке вместе с ним и не ждут партии перевода.
    shortcuts: [
      { name: blog.metaTitle, url: urlFor(lang, '/blog') },
      { name: cat.metaTitle, url: urlFor(lang, '/products') },
    ],
  }
}
