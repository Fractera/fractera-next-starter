import sharp from "sharp";
import { getAppConfig } from "@/config/app-config";
import { getDesignConfig } from "@/config/design-config";
import { getLogoPath } from "@/config/app-config.defaults";
import fs from "node:fs";
import path from "node:path";

// КАРТОЧКА ПРОЕКТА ДЛЯ ЧУЖОЙ ЛЕНТЫ — та картинка, которую видит человек, когда
// ему прислали ссылку на сайт (решение владельца 2026-08-21).
//
// 🔒 ПОЧЕМУ ЭТО МАРШРУТ, А НЕ ФАЙЛ В `public/`. Адрес `/og-default.png` уже
// стоял в пяти страницах подвала, а файла не существовало ни в репозитории, ни
// на сервере: `https://aifa.dev/og-default.png` отвечал 404, и карточка каждой
// из пяти страниц была пустой месяц. Маршрут оставляет адрес прежним — править
// пять `meta.ts` не нужно, — а содержимое делает правдой. Приём «папка с точкой
// в имени» в проекте уже применён: `llms.txt/`, `manifest.webmanifest/`,
// `index.md/`.
//
// 🔒 НИ ЗНАКА FRACTERA, НИ ЕДИНОЙ БУКВЫ — и то и другое намеренно.
//
// Знака нет потому, что это картинка для ЧУЖОЙ ленты: посторонний человек видит
// анонс сайта клиента, и наш знак в нём — не заглушка, а подпись не того автора.
// Ровно это записано в `config/app-config.defaults.ts` над пустым `ogImage`, и
// оно не противоречит иконкам, где знак Fractera разрешён: иконка живёт на
// устройстве самого владельца, карточка — у постороннего.
//
// Букв нет потому, что рисование текста требует ВСТРОЕННОГО шрифта: имя сайта
// бывает кириллическим, арабским, японским, а шрифтов сервера может не быть
// вовсе — и вместо имени выйдет ряд квадратов. Узор из фигур говорит то же
// самое («у проекта своё лицо») и не умеет сломаться на языке владельца.
//
// 🔒 ФИГУРЫ ВЫВЕДЕНЫ ИЗ ИМЕНИ, А НЕ СЛУЧАЙНЫ. Случайные давали бы новую
// картинку при каждой сборке на одном адресе: соцсети кэшируют превью, и анонс
// сайта менял бы вид сам собой. Зерно — имя проекта, поэтому картинка у каждого
// проекта своя и при этом постоянная.

// Сутки: имя и цвета владелец меняет в панели БЕЗ пересборки, и карточка
// обязана догонять его правку сама. Динамической страницу это не делает — это
// ISR, тот же механизм, что у карты сайта.
export const revalidate = 86_400;

const W = 1200;
const H = 630;

/** Устойчивое зерно из строки — один и тот же ответ на любой машине. */
function seedOf(text: string): number {
  let h = 2_166_136_261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16_777_619);
  }
  return h >>> 0;
}

/** Генератор чисел от зерна: последовательность повторяема. */
function rng(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100_000) / 100_000;
  };
}

/**
 * Палитра карточки. Цвет владельца, если он его задал; иначе выведенный из
 * зерна — но в тёмной части круга, чтобы светлые фигуры читались всегда.
 *
 * Копии темы здесь нет намеренно: `DESIGN-CONFIG` пуст ровно до тех пор, пока
 * владелец не высказался, и вторая палитра разошлась бы с темой молча.
 */
function palette(seed: number) {
  const design = getDesignConfig();
  const dark = design.colors?.dark ?? {};
  const hue = seed % 360;
  return {
    bg: dark.background ?? `hsl(${hue} 32% 8%)`,
    glow: dark.primary ?? `hsl(${(hue + 24) % 360} 72% 58%)`,
    ink: [
      dark.primary ?? `hsl(${(hue + 24) % 360} 72% 62%)`,
      dark.accent ?? `hsl(${(hue + 96) % 360} 68% 60%)`,
      dark.secondary ?? `hsl(${(hue + 210) % 360} 62% 58%)`,
    ],
  };
}

function shapes(seed: number, ink: string[]): string {
  const rand = rng(seed);
  const out: string[] = [];
  // 🔒 ФИГУРЫ СТАВЯТСЯ ПО СЕТКЕ С ДРОЖАНИЕМ, А НЕ В ЧИСТО СЛУЧАЙНЫЕ ТОЧКИ.
  // Свободный разброс на первом же зерне собрал все фигуры в левой половине и
  // оставил правую пустой: у равномерного распределения нет обязанности выглядеть
  // равномерно на двенадцати точках. Клетка задаёт покрытие, дрожание внутри
  // клетки — непохожесть, и обе задачи решены разом.
  const COLS = 4;
  const ROWS = 3;
  for (let i = 0; i < COLS * ROWS; i++) {
    const cell = { w: W / COLS, h: H / ROWS };
    const cx = (i % COLS) * cell.w + cell.w / 2;
    const cy = Math.floor(i / COLS) * cell.h + cell.h / 2;
    const x = Math.round(cx + (rand() - 0.5) * cell.w * 0.7);
    const y = Math.round(cy + (rand() - 0.5) * cell.h * 0.7);
    const size = Math.round(70 + rand() * 150);
    const color = ink[Math.floor(rand() * ink.length)] ?? ink[0];
    const fill = (0.08 + rand() * 0.16).toFixed(2);
    const stroke = (0.25 + rand() * 0.45).toFixed(2);
    const kind = Math.floor(rand() * 3);
    const common = `fill="${color}" fill-opacity="${fill}" stroke="${color}" stroke-opacity="${stroke}" stroke-width="2"`;
    if (kind === 0) {
      out.push(`<circle cx="${x}" cy="${y}" r="${Math.round(size / 2)}" ${common}/>`);
    } else if (kind === 1) {
      const angle = Math.round(rand() * 90);
      out.push(
        `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" rx="${Math.round(size / 8)}" transform="rotate(${angle} ${x} ${y})" ${common}/>`,
      );
    } else {
      const h = Math.round(size * 0.87);
      out.push(
        `<polygon points="${x},${y - h / 2} ${x + size / 2},${y + h / 2} ${x - size / 2},${y + h / 2}" ${common}/>`,
      );
    }
  }
  return out.join("");
}

export async function GET(): Promise<Response> {
  const cfg = getAppConfig();
  const seed = seedOf(cfg.url || cfg.name || "fractera-project");
  const { bg, glow, ink } = palette(seed);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="glow" cx="50%" cy="115%" r="75%">
        <stop offset="0%" stop-color="${glow}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="${glow}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="${bg}"/>
    <g stroke="#ffffff" stroke-opacity="0.04">
      ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${H}"/>`).join("")}
      ${Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 100}" x2="${W}" y2="${i * 100}"/>`).join("")}
    </g>
    ${shapes(seed, ink)}
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
  </svg>`;

  let image = sharp(Buffer.from(svg)).png();

  // Логотип ВЛАДЕЛЬЦА поверх узора — только его собственный. Умолчание `logo`
  // равно `null`, а заглушки в `public/placeholders/` несут знак Fractera,
  // поэтому берём файл лишь тогда, когда владелец его действительно загрузил и
  // файл лежит локально. Не загрузил — остаётся чистый узор.
  const logo = getLogoPath(cfg);
  if (logo && logo.startsWith("/") && !logo.startsWith("/placeholders/")) {
    const file = path.join(process.cwd(), "public", logo.replace(/^\//, ""));
    if (fs.existsSync(file)) {
      try {
        const mark = await sharp(file).resize({ width: 320, height: 320, fit: "inside" }).png().toBuffer();
        image = sharp(await image.toBuffer()).composite([{ input: mark, gravity: "center" }]).png();
      } catch {
        // Логотип нечитаем — карточка выходит без него. Отказ здесь роняет
        // картинку целиком, а узор сам по себе — законный ответ.
      }
    }
  }

  const png = await image.toBuffer();
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
