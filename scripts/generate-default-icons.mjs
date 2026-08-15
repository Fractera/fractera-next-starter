// Стартовые иконки приложения (шаг 504, заказ владельца 2026-08-13).
// Запуск: npm run icons:default
//
// ЗАЧЕМ. Манифест без иконок означает одно: приложение НЕЛЬЗЯ УСТАНОВИТЬ. Свежий
// проект приезжал именно таким — вся работа по PWA была сделана, а телефон
// предложить установку не мог, потому что владелец ещё не загрузил логотип.
// Замер на живом сайте: `иконок=0`.
//
// 🔒 ЗНАК FRACTERA, А НЕ НЕЙТРАЛЬНАЯ ФИГУРА (владелец 2026-08-15; прежнее
// правило «заглушка, а не логотип» ОТМЕНЕНО — не воскрешать).
//
// Здесь рисовался абстрактный геометрический значок в фиолетовом и бирюзовом.
// Довод был: «поставить проекту чужой логотип хуже пустоты». Для чужого логотипа
// он верен и остаётся в силе — но знак Fractera не чужой ни нам, ни владельцу
// шаблона. Абстрактная фигура во вкладке браузера не принадлежала никому, и
// владелец справедливо назвал её чужеродной.
//
// Загрузил владелец своё изображение — панель нарежет из него полный набор, и
// `iconSet` перекроет эти файлы: они нужны ровно до этого момента.
//
// Как только владелец загрузит своё изображение, панель нарежет из него полный
// набор и `iconSet` перекроет эти файлы — они нужны ровно до этого момента.
//
// MASKABLE — ОТДЕЛЬНЫЙ ФАЙЛ, А НЕ ТОТ ЖЕ САМЫЙ. Android обрезает значок под форму
// своей оболочки (круг, скруглённый квадрат, каплю), и по спецификации рисунок
// обязан умещаться в безопасную зону — центральные 80% полотна. Обычная иконка,
// объявленная maskable, теряет края.

import fs from 'node:fs'
import fs2 from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'public', 'icons')

// Цвета заставок iOS: поле, на котором показывается знак при запуске приложения.
const BG = '#0b0f19'
const FG = '#7c6cf0'
const FG2 = '#22d3ee'

/**
 * Знак: три сходящихся штриха — «слои, собранные в одно». Ни букв, ни слов:
 * иконка обязана оставаться нейтральной на любом языке.
 *
 * @param size    сторона полотна
 * @param inset   доля поля вокруг рисунка (для maskable — безопасная зона)
 * @param rounded скруглять ли подложку (для обычной иконки да, для maskable нет:
 *                форму задаёт система, и своя рамка была бы обрезана дважды)
 */
// 🔒 ИСТОЧНИК ИКОНОК — НАСТОЯЩИЙ ЗНАК FRACTERA (решение владельца 2026-08-15).
//
// Здесь рисовался НЕЙТРАЛЬНЫЙ геометрический знак — три штриха в фиолетовом и
// бирюзовом. Довод был такой: «поставить проекту чужой логотип хуже пустоты».
// Довод неверен для НАШЕГО шаблона: продукт называется Fractera, знак у него
// есть, и до первой настройки владельцем стоять должен именно он. Владелец
// увидел абстрактный значок во вкладке браузера и справедливо назвал его
// чужеродным — он не принадлежал ни ему, ни нам.
//
// Знак лежит в `assets/brand/fractera-mark.png` — вне `public/`, потому что это
// материал для сборки, а не файл для раздачи.
const BRAND_MARK = path.join(ROOT, 'assets', 'brand', 'fractera-mark.png')

/**
 * Иконка из знака проекта.
 *
 * 🔒 MASKABLE ПОЛУЧАЕТ ПОЛЕ, А ОБЫЧНАЯ — НЕТ. Android обрезает значок под форму
 * своей оболочки, и по спецификации рисунок обязан умещаться в безопасную зону —
 * центральные 80% полотна. Одна и та же картинка в обеих ролях теряет края там и
 * выглядит мелкой здесь.
 *
 * Подложка берётся из самого знака: он нарисован белым по непрозрачному чёрному,
 * поэтому поле вокруг заливается тем же чёрным — иначе на светлой теме браузера
 * вокруг значка появилась бы белая рамка неизвестного происхождения.
 */
async function markFromBrand(size, inset, rounded) {
  const pad = Math.round(size * inset)
  const inner = size - pad * 2
  const r = rounded ? Math.round(size * 0.22) : 0

  const art = await sharp(BRAND_MARK).resize(inner, inner, { fit: 'cover' }).png().toBuffer()

  const canvas = sharp({
    create: { width: size, height: size, channels: 4, background: '#000000' },
  })
    .composite([{ input: art, top: pad, left: pad }])
    .png({ compressionLevel: 9 })

  if (!rounded) return canvas.toBuffer()

  // Скругление — маской: прямоугольник со скруглёнными углами поверх готового
  // полотна. Рисовать его в исходном SVG нельзя, знак уже растровый.
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="#fff"/></svg>`,
  )
  return sharp(await canvas.toBuffer())
    .composite([{ input: mask, blend: 'dest-in' }])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

// 🪦 Прежний рисованный знак оставлен ниже для заставок iOS: там нужна крупная
// картинка на однотонном поле, и знак проекта в этой роли не пробовался.
function markSvg(size, inset, rounded) {
  const pad = Math.round(size * inset)
  const inner = size - pad * 2
  const r = rounded ? Math.round(size * 0.22) : 0
  const stroke = Math.max(2, Math.round(inner * 0.11))
  const x = pad
  const y = pad
  const w = inner
  const h = inner

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${BG}"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="${stroke}">
    <path d="M ${x + w * 0.2} ${y + h * 0.72} L ${x + w * 0.5} ${y + h * 0.2} L ${x + w * 0.8} ${y + h * 0.72}" stroke="${FG}"/>
    <path d="M ${x + w * 0.34} ${y + h * 0.8} L ${x + w * 0.66} ${y + h * 0.8}" stroke="${FG2}"/>
  </g>
</svg>`)
}

const TARGETS = [
  { file: 'icon-192.png', size: 192, inset: 0.06, rounded: true },
  { file: 'icon-512.png', size: 512, inset: 0.06, rounded: true },
  // Безопасная зона: рисунок внутри центральных 80%, подложка на всё полотно.
  { file: 'icon-512-maskable.png', size: 512, inset: 0.14, rounded: false },
  { file: 'apple-touch-icon.png', size: 180, inset: 0.06, rounded: true },
  { file: 'favicon-32.png', size: 32, inset: 0.04, rounded: true },
  { file: 'favicon-48.png', size: 48, inset: 0.04, rounded: true },
]

fs.mkdirSync(OUT, { recursive: true })

const made = []
for (const t of TARGETS) {
  const out = path.join(OUT, t.file)
  await fs2.writeFile(out, await markFromBrand(t.size, t.inset, t.rounded))
  made.push(`${t.file} (${fs.statSync(out).size} байт)`)
}

// ── Заставки iOS ────────────────────────────────────────────────────────────
//
// ЗАЧЕМ. Приложение, установленное на iPhone, показывает при запуске картинку
// `apple-touch-startup-image`. Её нет — Safari рисует БЕЛЫЙ ЭКРАН, и на тёмной
// теме запуск выглядит как вспышка и поломка. Android берёт цвет фона из
// манифеста и в картинке не нуждается; iOS требует растр под КАЖДОЕ разрешение —
// именно поэтому этот пункт обычно и не делают.
//
// Размеры — устройства, а не абстрактные числа: те, что реально в руках у людей.
// Для каждого нужны портрет и альбом, поэтому файлов вдвое больше строк.
const SPLASH = [
  { w: 1290, h: 2796, name: 'iphone-15-pro-max' },
  { w: 1179, h: 2556, name: 'iphone-15' },
  { w: 1170, h: 2532, name: 'iphone-13' },
  { w: 1125, h: 2436, name: 'iphone-x' },
  { w: 828, h: 1792, name: 'iphone-xr' },
  { w: 750, h: 1334, name: 'iphone-8' },
  { w: 1536, h: 2048, name: 'ipad' },
  { w: 1668, h: 2388, name: 'ipad-pro-11' },
  { w: 2048, h: 2732, name: 'ipad-pro-12' },
]

const SPLASH_OUT = path.join(ROOT, 'public', 'splash')
fs.mkdirSync(SPLASH_OUT, { recursive: true })

/** Знак по центру полотна устройства: доля от МЕНЬШЕЙ стороны, иначе на альбомной ориентации он растянется. */
async function splash(w, h, file) {
  const mark = Math.round(Math.min(w, h) * 0.28)
  await sharp({ create: { width: w, height: h, channels: 4, background: BG } })
    .composite([
      {
        input: await sharp(markSvg(mark, 0.08, false)).png().toBuffer(),
        top: Math.round((h - mark) / 2),
        left: Math.round((w - mark) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(SPLASH_OUT, file))
}

const splashes = []
for (const s of SPLASH) {
  await splash(s.w, s.h, `${s.name}-portrait.png`)
  await splash(s.h, s.w, `${s.name}-landscape.png`)
  splashes.push(`${s.name} (${s.w}×${s.h} и наоборот)`)
}

console.log(`стартовые иконки записаны в public/icons:\n  ${made.join('\n  ')}`)
console.log(`\nзаставки iOS записаны в public/splash (${splashes.length * 2} файла):\n  ${splashes.join('\n  ')}`)
console.log('\n===ICONS_OK===')
