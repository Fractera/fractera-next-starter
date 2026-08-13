import { publicSurfaces, mdUrlFor, type Surface } from './surfaces'
import { urlFor } from '@/lib/seo/alternates'
import { getAppConfig, metaForLang } from '@/config/app-config'
import { SUPPORTED_LANGUAGES, SINGLE_LANG_MODE } from '@/config/translations/translations.config'

// `llms.txt` и `llms-full.txt` — что именно мы публикуем и по какой форме (шаг 505).
//
// 🔒 ФОРМА ВЗЯТА ИЗ ПЕРВОИСТОЧНИКА — https://llmstxt.org (правило «факт о чужом
// продукте только из первоисточника»). Спецификация требует ровно такой порядок:
//   1. H1 — ЕДИНСТВЕННЫЙ обязательный элемент;
//   2. цитата (`>`) с кратким описанием, несущим всё нужное для понимания
//      остального;
//   3. необязательные абзацы БЕЗ заголовков;
//   4. необязательные разделы H2 со списками ссылок вида `[имя](адрес)` и
//      необязательным `: пояснением` после них.
// Раздел `Optional` — по соглашению спецификации: ссылки, которые агент вправе
// пропустить, когда контекст надо сократить. Туда уходит правовой блок.
//
// 🔒 `llms-full.txt` В СПЕЦИФИКАЦИИ ОТСУТСТВУЕТ. Это сложившаяся практика
// сообщества, а не часть предложения, и называть его стандартом нельзя. Мы его
// отдаём, потому что он полезен, и говорим о нём именно так.
//
// Назначение формата по спецификации — ВЫВОД модели (inference), а не обучение.

const SECTION_TITLES: Record<Surface['section'], { en: string; ru: string }> = {
  main: { en: 'Pages', ru: 'Страницы' },
  articles: { en: 'Articles', ru: 'Статьи' },
  legal: { en: 'Optional', ru: 'Optional' },
}

function sectionTitle(section: Surface['section'], lang: string): string {
  const t = SECTION_TITLES[section]
  // `Optional` — служебное имя раздела из спецификации, оно не переводится:
  // по нему агент узнаёт, что эти ссылки можно пропустить.
  if (section === 'legal') return t.en
  return lang === 'ru' ? t.ru : t.en
}

/** Карта сайта для модели: H1, цитата, разделы со ссылками. */
export function buildLlmsTxt(lang: string): string {
  const cfg = getAppConfig()
  const meta = metaForLang(lang)
  const surfaces = publicSurfaces(lang)
  // 🔒 ЗАГОЛОВОК КАРТЫ — ИМЯ САЙТА, А НЕ ЗАГОЛОВОК СТРАНИЦЫ. `metaForLang().title`
  // пропущен через шаблон (`%s | Сайт`), и на живом сайте H1 карты вышел как
  // «Fractera — … | Fractera»: имя дважды. Тот же класс ошибки уже был в манифесте.
  const out: string[] = [`# ${meta.siteName}`, '', `> ${meta.description}`, '']

  // Абзацы без заголовков — по спецификации здесь можно дать ориентиры, которые
  // не являются ссылками. Даём ровно два факта, которые агенту нужны раньше
  // остального: где полная версия и на каких языках существует сайт.
  const full = `${urlFor(lang, '').replace(/\/$/, '')}/llms-full.txt`
  out.push(`Full text of every page listed below: ${full}`, '')
  if (!SINGLE_LANG_MODE) {
    const others = SUPPORTED_LANGUAGES.filter(l => l !== lang)
      .map(l => `${urlFor(l, '').replace(/\/$/, '')}/llms.txt`)
      .join(', ')
    if (others) out.push(`This site also exists in other languages: ${others}`, '')
  }

  for (const section of ['main', 'articles', 'legal'] as const) {
    const rows = surfaces.filter(s => s.section === section)
    if (!rows.length) continue
    out.push(`## ${sectionTitle(section, lang)}`, '')
    for (const s of rows) {
      // Ссылка ведёт на markdown-версию: спецификация просит давать машине
      // разметку, а не HTML со всей обвязкой сайта.
      out.push(`- [${s.title}](${mdUrlFor(lang, s.subPath)}): ${s.description}`)
    }
    out.push('')
  }

  if (cfg.mailSupport) out.push(`## Contact`, '', `- ${cfg.mailSupport}`, '')
  return out.join('\n').replace(/\n{3,}/g, '\n\n')
}

/** Полные тексты тех же страниц, одним документом. */
export function buildLlmsFullTxt(lang: string): string {
  const meta = metaForLang(lang)
  const surfaces = publicSurfaces(lang)
  const out: string[] = [
    `# ${meta.siteName}`,
    '',
    `> ${meta.description}`,
    '',
    // Происхождение формата названо прямо: `llms-full.txt` — практика, а не
    // спецификация. Мы не имеем права выдавать одно за другое даже умолчанием.
    'This file is the community `llms-full.txt` convention: the full text of every page listed in /llms.txt.',
    '',
  ]
  for (const s of surfaces) {
    out.push('---', '', `<!-- ${urlFor(lang, s.subPath)} -->`, '', s.body(), '')
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n')
}
