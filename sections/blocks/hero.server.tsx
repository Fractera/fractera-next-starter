import type { SectionRenderer } from '@/sections/contract'
import { getAppConfig } from '@/config/app-config'
import { getLogoPath } from '@/config/app-config.defaults'
import { StaticImage } from '@/components/media/static-image.server'

// Знак проекта и лейбл над заголовком.
//
// 🔒 ЗНАК БЕРЁТСЯ ИЗ НАСТРОЕК, А НЕ ИЗ ДАННЫХ. Логотип у каждого проекта свой и
// меняется в панели без пересборки; вписать его в материал значило бы раздать
// всем клиентам одну картинку. Не загрузили — знака нет, и это честно: чужой
// знак хуже отсутствующего.
//
// 🔒 ЗАГОЛОВКА ЗДЕСЬ НЕТ: его рисует фабрика страницы — одна на посты, правовые
// страницы и главную. Пока у главной был свой вход, заголовок жил здесь; с
// переходом на общую фабрику он стал бы вторым H1 на странице.
export const hero: SectionRenderer<'hero'> = (b, { key: k }) => {
  const logo = getLogoPath(getAppConfig())
  // Ни знака, ни лейбла — рисовать нечего, и пустой контейнер лучше не оставлять.
  if (!logo && !b.pill) return null
  return (
    <div key={k} className="flex flex-col items-center text-center">
      {logo && (
        <StaticImage src={logo} alt="" priority sizes="96px" className="mb-6 h-24 w-24 object-contain" />
      )}
      {b.pill && (
        /* Каёмка живёт в styles/globals.css (.pill-ai): один элемент, две темы. */
        <span className="pill-ai inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground">
          {b.pill}
        </span>
      )}
    </div>
  )
}
