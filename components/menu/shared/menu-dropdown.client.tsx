"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// One group button in a menu (step 160). UI standard: shadcn DropdownMenu + Button +
// lucide icons (no inline SVG, no hand-rolled dropdown). When the group asked for
// childrenAsDropdown it opens a dropdown of its child pages; otherwise it is a plain
// link (Button asChild) to the group index. no-JS degradation (sub-step 4) layers on
// later — the static HTML already carries the group-root link for the non-dropdown case.
export type MenuChildLink = { slug: string; title: string; href?: string };

export function MenuDropdown({
  lang, slug, label, items, asDropdown, href,
}: {
  lang: string;
  slug: string;
  label: string;
  items: MenuChildLink[];
  asDropdown: boolean;
  /** Адрес из настроек панели. Нет — значит пункт с диска, `/<язык>/<slug>`. */
  href?: string;
}) {
  const groupHref = href ? `/${lang}${href}` : `/${lang}/${slug}`;
  const childHref = (c: MenuChildLink) => (c.href ? `/${lang}${c.href}` : `${groupHref}/${c.slug}`);

  if (!asDropdown || items.length === 0) {
    // Button is Base UI (no asChild); a link styled as a button uses buttonVariants().
    return (
      <Link href={groupHref} className={buttonVariants({ variant: "ghost", size: "sm" })}>
        {label}
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          {label}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      {/* 🔒 ПОЛНЫЙ ТЕКСТ ССЫЛКИ, БЕЗ ОБРЕЗКИ (владелец, 2026-08-12). Здесь стояли
          фиксированная ширина `w-64` и `truncate`: длинное название обрывалось
          многоточием — а человек открыл список именно затем, чтобы его ПРОЧИТАТЬ.
          Обрезка уместна у кнопки в горизонтальной полосе, где места нет; в
          вертикальном списке места по высоте сколько угодно.
          Ширина ограничена экраном (`calc(100vw-2rem)`), а название переносится
          по словам — поэтому на телефоне список не вылезает за край и не рвёт
          вёрстку, каким бы длинным ни было название. */}
      <DropdownMenuContent
        align="start"
        className="w-[min(22rem,calc(100vw-2rem))] max-h-[600px] overflow-y-auto"
      >
        <DropdownMenuItem asChild>
          <Link href={groupHref} className="font-semibold whitespace-normal break-words leading-snug">
            {label}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {items.map((c) => (
          <DropdownMenuItem key={c.slug} asChild>
            <Link href={childHref(c)} className="whitespace-normal break-words leading-snug py-1.5">
              {c.title}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
