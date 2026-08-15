"use client";

import { useEffect, useState } from "react";
import { UnfoldHorizontal, FoldHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

// Переключатель ширины СРЕДИННОЙ ЧАСТИ страницы (в подвале).
//
// 🔒 НАЖАТИЕ СУЖАЕТ, А НЕ РАСШИРЯЕТ (ТЗ владельца, уточнено 2026-08-15).
// Раньше было наоборот: обычное состояние 1280px, нажатие растягивало ленту почти
// на всю ширину экрана. По заданию лента живёт широкой (80rem = 1280px) и
// СУЖАЕТСЯ до 64rem = 1024px, когда человек просит колонку поуже для чтения.
// Полная ширина экрана из механизма убрана вовсе: строка в 2500 пикселей
// нечитаема, и предлагать её кнопкой незачем.
//
// 🔒 ЧТО КНОПКА ДВИГАЕТ. Только контейнер с меткой `[data-app-column]` — это
// `<article>` страницы. Шапка, первый экран, завершающая секция и подвал имеют
// полную ширину всегда. Когда-то метку носил ТОЛЬКО подвал, и кнопка двигала
// единственно его, из-за чего выглядела сломанной.
//
// 🔒 ЗНАЧОК НАЗЫВАЕТ ДЕЙСТВИЕ, А НЕ СОСТОЯНИЕ. Стрелки внутрь (`FoldHorizontal`)
// — «сузить», наружу (`UnfoldHorizontal`) — «расширить». Показывается тот, что
// произойдёт по нажатию: кнопка обещает результат, а не описывает текущее
// положение дел, — иначе человек читает её ровно наоборот.
//
// Спрятан на телефоне (`hidden md:inline-flex`): там раскладка одноколоночная во
// всю ширину, двигать нечего. Состояние помнится (localStorage) и поднимается до
// первой отрисовки (`app-width-init.tsx`), поэтому лента не прыгает при загрузке.
const STORAGE_KEY = "fractera-app-width";

export function AppWidthToggle({ labels }: { labels: { wide: string; normal: string } }) {
  const [narrow, setNarrow] = useState(false);

  // Читаем состояние, которое поставил встроенный скрипт, — один источник истины.
  useEffect(() => {
    setNarrow(document.documentElement.getAttribute("data-app-width") === "narrow");
  }, []);

  function toggle() {
    const next = !narrow;
    const el = document.documentElement;
    if (next) el.setAttribute("data-app-width", "narrow");
    else el.removeAttribute("data-app-width");
    try {
      localStorage.setItem(STORAGE_KEY, next ? "narrow" : "normal");
    } catch {
      /* приватный просмотр — переключение работает, просто не запомнится */
    }
    setNarrow(next);
  }

  // Подпись и значок описывают ДЕЙСТВИЕ: сужено — предложим расширить, и наоборот.
  const label = narrow ? labels.wide : labels.normal;
  const Icon = narrow ? UnfoldHorizontal : FoldHorizontal;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={narrow}
      className="hidden md:inline-flex"
    >
      <Icon />
    </Button>
  );
}
