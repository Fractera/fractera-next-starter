import sharp from 'sharp'
import fs from 'node:fs'
const src = fs.readFileSync('app/og-default.png/route.ts','utf8')
// вырезаем чистые функции из маршрута и исполняем их как есть — проверяем РИСОВАНИЕ,
// а не переписанную копию
const body = src
  .replace(/^import[\s\S]*?\n\n/, '')
  .split('export async function GET')[0]
  .replace(/export const revalidate[^\n]*\n/, '')
  .replace(/getDesignConfig\(\)/g, '({colors:{dark:{}}})')
const mod = await import('data:text/javascript,' + encodeURIComponent(body + '\nexport {seedOf, rng, palette, shapes, W, H}'))
const seed = mod.seedOf('https://aifa.dev')
const { bg, glow, ink } = mod.palette(seed)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><radialGradient id="g" cx="50%" cy="115%" r="75%"><stop offset="0%" stop-color="${glow}" stop-opacity="0.35"/><stop offset="100%" stop-color="${glow}" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="630" fill="${bg}"/>
  <g stroke="#ffffff" stroke-opacity="0.04">${Array.from({length:13},(_,i)=>`<line x1="${i*100}" y1="0" x2="${i*100}" y2="630"/>`).join('')}${Array.from({length:8},(_,i)=>`<line x1="0" y1="${i*100}" x2="1200" y2="${i*100}"/>`).join('')}</g>
  ${mod.shapes(seed, ink)}
  <rect width="1200" height="630" fill="url(#g)"/></svg>`
const out = process.argv[2]
await sharp(Buffer.from(svg)).png().toFile(out)
const m = await sharp(out).metadata()
console.log('OK', out, m.width + 'x' + m.height, 'seed=' + seed)
