"use client";

import Link from "next/link";
import { useState } from "react";
import { User, LogOut, Info } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import type { AuthShellSide } from "@/components/menu/account/account-config";
import type { AccountLabels } from "@/components/menu/account/account-menu.i18n";
import { PROTECTED_GROUP_ROLES, type ProtectedGroup } from "@/lib/roles";
import { FLOW_COLOR } from "@/lib/flows";

// Слой → ключ его заголовка в словаре. Отдельной таблицей, чтобы добавить пятый
// слой можно было в двух местах (роли и словарь), а не в трёх.
const GROUP_LABEL = {
  account: "groupAccount",
  staff: "groupStaff",
  finance: "groupFinance",
  admin: "groupAdmin",
} as const satisfies Record<ProtectedGroup, keyof AccountLabels>;

// Full-height account drawer (step 161). Opens from the side set by NEXT_PUBLIC_APP_SHELL_AUTH;
// taller than the left/right page drawers (which start below the header). Three zones:
//   (top) sticky title; (middle) scroll area — the person's work sections, grouped by
//   permission layer; (bottom) fixed: sign out, then the identity row (info icon → role
//   tooltip + the email).
// Owns its OWN open state — DrawerProvider is structurally two-sided (left/right) and must not
// carry a third drawer. UI standard: shadcn Sheet (Radix) + lucide; trigger = shadcn Button
// (Base UI, no asChild) driving controlled state.
//
// 🔒 РАЗБИТ ПО ЧЕТЫРЁМ СЛОЯМ ПРАВ, А НЕ ПЛОСКИМ СПИСКОМ. Сотрудник может быть
// одновременно менеджером и финансистом — и это не мелочь учёта, а разные роли
// в работе: правя цену, он действует как финансист, заводя товар — как
// менеджер. Плоский список этого не показывает, и человек не видит, в каком
// качестве он делает то, что делает. Порядок блоков ФИКСИРОВАН и совпадает с
// `PROTECTED_GROUP_ROLES`: своё → чужое по долгу службы → деньги → сам проект.
//
// 🔒 ПУНКТЫ ПРИХОДЯТ СПИСКОМ, А НЕ ЗАШИТЫ ЗДЕСЬ. Ящик — переиспользуемая часть
// продукта, живущая на всех 82 языках; страницы проекта у каждого клиента свои.
// Впиши сюда «Управление товарами» — и слово либо соврёт про 82 языка, либо
// потребует перевода на 82 ради страницы, которой в соседнем проекте нет.
// Поэтому ящик знает ФОРМУ пункта и названия слоёв (это его словарь), а чем
// наполнить слои — решает приложение, там же, где живут слова этих страниц.
export type DrawerLink = {
  href: string;
  label: string;
  /** Слой прав, к которому относится раздел. */
  group: ProtectedGroup;
};

// Порядок показа. Он же порядок в `PROTECTED_GROUP_ROLES` — списки, идущие в
// разном порядке, однажды разойдутся составом, и заметит это пользователь.
const GROUP_ORDER = ["account", "staff", "finance", "admin"] as const;

export function AccountDrawer({ lang, side, labels, email, roles, links }: {
  lang: string;
  side: AuthShellSide;
  labels: AccountLabels;
  email?: string;
  roles?: string[];
  /** Пункты рабочих разделов — их состав задаёт приложение. */
  links?: DrawerLink[];
}) {
  const [open, setOpen] = useState(false);
  const roleList = roles && roles.length ? roles : [];

  // Блок показывается, если человек ПРИНАДЛЕЖИТ слою, а не если в слое есть
  // страницы: слой без страниц — это «здесь пока ничего не построено», и сказать
  // это честнее, чем спрятать слой и оставить человека в уверенности, что прав у
  // него меньше, чем есть.
  const sections = GROUP_ORDER
    .filter((g) => PROTECTED_GROUP_ROLES[g].some((r) => roleList.includes(r)))
    .map((g) => ({
      group: g,
      title: labels[GROUP_LABEL[g]],
      links: (links ?? []).filter((l) => l.group === g),
    }));

  return (
    <>
      {/* Mobile: avatar only (no "My account" text) — the label stays for ≥ sm and
          as the accessible name at every width. */}
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} aria-label={labels.account} title={labels.account}>
        <User /><span className="hidden sm:inline">{labels.account}</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={side} className="w-80 sm:max-w-sm p-0 gap-0 flex flex-col">
          <SheetHeader className="border-b border-border">
            <SheetTitle>{labels.account}</SheetTitle>
          </SheetHeader>

          {/* Middle (step 500) — the Projects accordion is gone together with the
              projects layer. The drawer now says whose workspace this is: name and
              description straight from APP-CONFIG, the same pair the home renders. */}
          {/* Середина — рабочие разделы по слоям прав. Роль сверяется ЗДЕСЬ только
              ради того, чтобы не показывать заведомо закрытую дверь: настоящая
              проверка стоит на самой странице (layout подгруппы) и в маршрутах
              данных. Спрятанный пункт — вежливость, а не защита, и путать эти два
              не следует никогда. */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {sections.map((s) => (
              <section key={s.group} className="mb-5 last:mb-0">
                {/* Точка того же цвета, что и полоса потока на странице. Один
                    источник цвета на оба места (`lib/flows.ts`): человек,
                    увидевший зелёную ленту, обязан найти в ящике зелёную точку —
                    иначе оба знака перестают что-либо значить. */}
                <h3 className="flex items-center gap-2 px-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  <span aria-hidden className={`size-2 shrink-0 rounded-full ${FLOW_COLOR[s.group].dot}`} />
                  {s.title}
                </h3>
                {s.links.length > 0 ? (
                  <nav className="mt-1.5 flex flex-col gap-0.5">
                    {s.links.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-start")}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </nav>
                ) : (
                  <p className="mt-1.5 px-2 text-xs text-muted-foreground">{labels.groupEmpty}</p>
                )}
              </section>
            ))}
          </div>

          {/* Bottom — fixed: identity row on top, sign out below; both left-aligned. */}
          <div className="mt-auto border-t border-border p-3 flex flex-col gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                    <Info className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {roleList.length ? (
                      <ul className="flex flex-col gap-0.5">
                        {roleList.map((r) => <li key={r}>{r}</li>)}
                      </ul>
                    ) : "—"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm text-foreground truncate">{email}</span>
            </div>
            <Separator />
            {/* Sign out mirrors sign-in (step 169): a RELATIVE /logout link that proxy.ts
                (AUTH_FORM_PATHS) redirects to the auth service with an absolute redirectUrl
                back to this site. Never a bare /api/auth/* path — this app has none (404). */}
            {/* 🔒 prefetch={false} — ОБЯЗАТЕЛЕН НА ВСЕХ АДРЕСАХ АВТОРИЗАЦИИ (владелец нашёл
                в консоли 2026-08-13, тот же класс, что у /login часом раньше).
                Next заранее тянет страницы по видимым ссылкам, а /logout уводит
                переадресацией на ДРУГОЙ домен — слой авторизации. Браузер видит
                запрос через границу источника, не находит разрешающего заголовка
                и пишет ошибку CORS. Ошибок было девять на страницу, и все они —
                предзагрузка, которой никто не просил: выйти можно только нажав.
                Список таких адресов уже есть — AUTH_FORM_PATHS в proxy.ts. */}
            <Link href={`/logout?lang=${lang}`} prefetch={false} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full justify-start")}>
              <LogOut />{labels.signOut}
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
