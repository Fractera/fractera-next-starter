import type { SectionRenderer } from '@/sections/contract'
import { getAppConfig } from '@/config/app-config'
import { getLogoPath } from '@/config/app-config.defaults'
import { StaticImage } from '@/components/media/static-image.server'

// Первый экран: знак проекта, заголовок, подпись.
//
// 🔒 ЗНАК БЕРЁТСЯ ИЗ НАСТРОЕК, А НЕ ИЗ ДАННЫХ. Логотип у каждого проекта свой и
// меняется в панели без пересборки; вписать его в материал значило бы раздать
// всем клиентам одну картинку. Не загрузили — знака нет, и это честно: чужой
// знак хуже отсутствующего.
export const hero: SectionRenderer<'hero'> = (b, { key: k }) => {
  const logo = getLogoPath(getAppConfig())
  return (
    <header key={k} className="flex flex-col items-center text-center">
      {logo && (
        <StaticImage src={logo} alt="" priority sizes="96px" className="mb-6 h-24 w-24 object-contain" />
      )}
      {b.pill && (
        /* Каёмка живёт в styles/globals.css (.pill-ai): один элемент, две темы. */
        <span className="pill-ai mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground">
          {b.pill}
        </span>
      )}
      <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">{b.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{b.subtitle}</p>
    </header>
  )
}
