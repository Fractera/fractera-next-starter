"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVisibleGroups } from "@/components/menu/shared/use-visible-groups.client";
import type { MenuGroup } from "@/lib/menu/group-menus";

// Mobile collapse of the TOP nav (step 160), mirroring FES site-header: below 780px the
// desktop group buttons are hidden and this hamburger shows the same groups as a vertical
// list (dropdown groups flattened — group link + its child pages indented). UI standard:
// shadcn Button + lucide Menu/X icons (no inline SVG).
//
// 🔒 ПОД ОТКРЫТЫМ МЕНЮ ЭКРАН ГАСНЕТ (владелец, 2026-08-16). Панель была
// полупрозрачной (`bg-background/95`) и имела ТОЛЬКО верхнюю границу: снизу она
// ничем не заканчивалась, сквозь неё просвечивал текст страницы, и меню читалось
// не как меню, а как сломавшаяся вёрстка. Три правки, и каждая закрывает свою
// часть: подложка гасит страницу, непрозрачный фон убирает просвечивание, нижняя
// граница с тенью даёт панели край.
//
// Остальные выпадающие в шапке этим не болели: оба ящика и меню учётной записи
// собраны на shadcn `Sheet`, а он приносит подложку с собой. Здесь панель своя —
// значит и подложка своя.
//
// 🔒 ПОДЛОЖКА `absolute`, А НЕ `fixed`, И ЭТО НЕ ВКУСОВЩИНА. У шапки стоит
// `backdrop-blur-sm`, а `backdrop-filter` делает элемент КОНТЕЙНЕРОМ для
// потомков с `position: fixed` — такая подложка отсчитывалась бы не от окна, а
// от полосы шапки в 56px и превратилась бы в незаметную полоску. Проверить это
// в коде нельзя, видно только в браузере, поэтому написано здесь.
//
// 🔒 ПРОКРУТКА СТРАНИЦЫ НА ВРЕМЯ ЗАКРЫТА, и это не «заодно»: подложка ростом в
// экран удлинила бы прокручиваемую область, и под меню появилась бы пустая
// полоса. Запрет прокрутки убирает и её, и привычную неприятность, когда
// страница уезжает под открытым меню.
export function MobileMenu({ lang, groups, label }: { lang: string; groups: MenuGroup[]; label: string }) {
  const [open, setOpen] = useState(false);
  const visible = useVisibleGroups(groups);

  // Escape закрывает меню, страница под ним не прокручивается. Оба поведения
  // живут в одном эффекте: они включаются и выключаются вместе.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (visible.length === 0) return null;

  return (
    <div className="min-[780px]:hidden">
      <Button type="button" variant="ghost" size="icon" onClick={() => setOpen((v) => !v)} aria-label={label} aria-expanded={open}>
        {open ? <X /> : <Menu />}
      </Button>

      {open && (
        <>
          {/* Подложка начинается ПОД шапкой: сама полоса остаётся светлой, и
              крестик, которым меню закрывают, виден и нажимается. Цвет — тот же
              `bg-black/50`, что у `sheet` и `dialog` проекта: затемнение обязано
              быть тёмным в ОБЕИХ темах, поэтому здесь токен темы был бы ошибкой
              (в тёмной теме `foreground` — светлый, и «затемнение» осветлило бы
              экран). */}
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="absolute left-0 right-0 top-14 z-40 h-screen bg-black/50"
          />
          <nav className="absolute left-0 right-0 top-14 z-50 border-b border-border bg-background shadow-lg">
            <div className="flex flex-col px-6 py-2">
              {visible.map((g) => (
                <div key={g.slug} className="flex flex-col">
                  <Link
                    href={g.href ? `/${lang}${g.href}` : `/${lang}/${g.slug}`}
                    onClick={() => setOpen(false)}
                    className="py-2.5 text-sm font-semibold text-foreground hover:text-foreground transition-colors"
                  >
                    {g.label}
                  </Link>
                  {g.childrenAsDropdown && g.children.map((c) => (
                    <Link
                      key={c.slug}
                      href={c.href ? `/${lang}${c.href}` : `/${lang}/${g.slug}/${c.slug}`}
                      onClick={() => setOpen(false)}
                      // Полный текст, как и в выпадающем списке на десктопе: здесь
                      // ширина экрана и так узкая, поэтому название переносится по
                      // словам, а не обрывается многоточием.
                      className="py-2 pl-4 text-sm font-medium text-foreground hover:text-foreground transition-colors whitespace-normal break-words leading-snug"
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
