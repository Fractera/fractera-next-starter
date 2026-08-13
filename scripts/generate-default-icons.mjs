// Стартовые иконки приложения (шаг 504, заказ владельца 2026-08-13).
// Запуск: npm run icons:default
//
// ЗАЧЕМ. Манифест без иконок означает одно: приложение НЕЛЬЗЯ УСТАНОВИТЬ. Свежий
// проект приезжал именно таким — вся работа по PWA была сделана, а телефон
// предложить установку не мог, потому что владелец ещё не загрузил логотип.
// Замер на живом сайте: `иконок=0`.
//
// 🔒 ЭТО ЗАГЛУШКА, А НЕ ЧУЖОЙ ЛОГОТИП. Рисунок намеренно нейтральный —
// геометрический знак в фирменных цветах темы, без букв, названий и намёка на
// чей-либо бренд. Поставить проекту чужой логотип было бы хуже пустоты: пустоту
// человек замечает и исправляет, подделку — нет.
//
// Как только владелец загрузит своё изображение, панель нарежет из него полный
// набор и `iconSet` перекроет эти файлы — они нужны ровно до этого момента.
//
// MASKABLE — ОТДЕЛЬНЫЙ ФАЙЛ, А НЕ ТОТ ЖЕ САМЫЙ. Android обрезает значок под форму
// своей оболочки (круг, скруглённый квадрат, каплю), и по спецификации рисунок
// обязан умещаться в безопасную зону — центральные 80% полотна. Обычная иконка,
// объявленная maskable, теряет края.

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const OUT = path.join(ROOT, 'public', 'icons')

// Цвета берутся из умолчаний конфига, чтобы заглушка не спорила с темой проекта.
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
  await sharp(markSvg(t.size, t.inset, t.rounded)).png({ compressionLevel: 9 }).toFile(out)
  made.push(`${t.file} (${fs.statSync(out).size} байт)`)
}

console.log(`стартовые иконки записаны в public/icons:\n  ${made.join('\n  ')}`)
console.log('\n===ICONS_OK===')
