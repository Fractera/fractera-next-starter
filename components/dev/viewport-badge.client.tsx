"use client";

import { useEffect, useState } from "react";

// Индикатор ширины экрана — только в режиме разработки.
//
// ЗАЧЕМ. Раскладка в проекте держится на брейкпоинтах и на общем пределе
// (`--app-w`, `--hero-w`), а глазами ширину не измерить: «кажется, около
// тысячи» — не тот ответ, по которому чинят вёрстку. Кружок называет и число, и
// текущую ступень, поэтому разговор о дизайне идёт числами, а не ощущениями.
//
// 🔒 ЕГО НЕТ В БОЕВОЙ СБОРКЕ, И ЭТО НЕ «СПРЯТАН», А ВЫРЕЗАН. Проверка
// `process.env.NODE_ENV` вычисляется на сборке: в продакшне тело функции
// становится `return null`, и вся разметка выпадает при минификации. Прятать
// такой значок классом было бы хуже вдвойне — он уехал бы к клиенту и однажды
// проявился на живом сайте.
//
// 🔒 `pointer-events-none` ОБЯЗАТЕЛЕН. Значок висит поверх угла страницы, где у
// сайтов обычно живут плавающие кнопки. Без этого он молча перехватывал бы клики
// по ним, и причину искали бы в самих кнопках.
//
// Угол ЛЕВЫЙ нижний (заказ владельца 2026-08-15): правый занят — там кнопки
// чата и «наверх», и значок закрывал бы именно их.

// 🔴 ВРЕМЕННО: ЗНАЧОК ПОКАЗЫВАЕТСЯ ВЕЗДЕ, ВКЛЮЧАЯ БОЕВУЮ СБОРКУ.
//
// Заказ владельца 2026-08-15: он смотрит сайт на реальном сервере, где сборка
// боевая, и проверки режима значок бы не пережил — то есть увидеть его было бы
// нельзя. Действует ДО ОТДЕЛЬНОГО СЛОВА «скрыть».
//
// 🔒 ВЕРНУТЬ ОДНИМ ЗНАЧЕНИЕМ: поставить `false` — и восстановится правило
// «только в разработке», ради которого файл и написан. Флаг стоит здесь, а не
// растворён в условии, ровно затем, чтобы его нашли: временное, спрятанное в
// логике, перестаёт быть временным.
const ALWAYS_VISIBLE = true;

/** Ступени Tailwind — те же значения, что у утилит `sm:`, `md:`, … */
const STEPS: [number, string][] = [
  [1536, "2xl"],
  [1280, "xl"],
  [1024, "lg"],
  [768, "md"],
  [640, "sm"],
];

function stepName(width: number): string {
  for (const [min, name] of STEPS) if (width >= min) return name;
  return "xs";
}

export function ViewportBadge() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const read = () => setWidth(window.innerWidth);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  if (!ALWAYS_VISIBLE && process.env.NODE_ENV === "production") return null;
  // До первого замера ничего не рисуем: подставить сюда серверное число нельзя —
  // на сервере ширины экрана не существует, и любое значение было бы выдумкой,
  // которая мигнёт при гидратации.
  if (width === null) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-4 left-4 z-50 flex size-20 select-none flex-col items-center justify-center rounded-full border border-white/30 bg-white/30 text-black shadow-lg backdrop-blur-sm"
    >
      <span className="font-mono text-sm font-bold leading-none tabular-nums">{width}</span>
      <span className="mt-1 font-mono text-[10px] uppercase leading-none tracking-widest opacity-70">
        {stepName(width)}
      </span>
    </div>
  );
}
