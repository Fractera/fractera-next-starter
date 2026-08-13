"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AccountDrawer, type DrawerLink } from "@/components/menu/account/account-drawer.client";
import { CartButton } from "@/components/cart/cart-button.client";
import type { CartUi } from "@/components/cart/cart.i18n";
import type { AuthShellSide } from "@/components/menu/account/account-config";
import type { AccountLabels } from "@/components/menu/account/account-menu.i18n";

// Public app-shell account control (step 161). Rendered ONLY when public auth is enabled
// (NEXT_PUBLIC_APP_SHELL_AUTH = left|right). Client island: reads identity from /api/me (the
// slot convention — never auth() in a page). Guest → a Sign-in link into the auth flow;
// signed-in → the account drawer. Pre-hydration shows the Sign-in link so no-JS visitors get
// the entry point too. UI standard: shadcn Button/buttonVariants + lucide icons.
type Me = { userId?: string; email?: string; roles?: string[] } | null;

export function AccountButton({ lang, side, labels, links, cart, currency }: {
  lang: string;
  side: AuthShellSide;
  labels: AccountLabels;
  /** Рабочие разделы ящика: состав приходит с сервера, где известны страницы проекта. */
  links?: DrawerLink[];
  /** Слова корзины и валюта витрины — для значка заказа слева от кнопки аккаунта. */
  cart?: CartUi;
  currency?: string;
}) {
  const [me, setMe] = useState<Me>(undefined as unknown as Me);

  useEffect(() => {
    let alive = true;
    fetch("/api/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (alive) setMe(d?.userId ? d : null); })
      .catch(() => { if (alive) setMe(null); });
    return () => { alive = false; };
  }, []);

  if (me && me.userId) {
    // Корзина — СЛЕВА от кнопки аккаунта и только у вошедшего. Тот же запрос
    // `/api/me`, что и у ящика: два островка спрашивали бы одно и то же дважды.
    return (
      <>
        {cart && currency && <CartButton lang={lang} currency={currency} labels={cart} />}
        <AccountDrawer lang={lang} side={side} labels={labels} email={me.email} roles={me.roles} links={links} />
      </>
    );
  }

  return (
    /* 🔒 `prefetch={false}` ОБЯЗАТЕЛЕН (найдено владельцем в консоли 2026-08-13).
       Next заранее подтягивает страницы по видимым ссылкам, а `/login` уводит
       переадресацией на ДРУГОЙ домен — слой авторизации. Браузер видит запрос
       через границу источника, не находит разрешающего заголовка и пишет в
       консоль ошибку CORS на КАЖДОЙ странице сайта. Ни один посетитель при этом
       не страдает — вход работает по нажатию, — но в отчёте Lighthouse это
       «ошибки в консоли», и первое, что видит покупатель, открыв свой сайт
       инструментом проверки, — красная строка.
       Заранее тянуть чужой домен незачем и по существу: страница входа живёт не
       у нас, и её содержимое нам не принадлежит. */
    <Link href={`/login?lang=${lang}`} prefetch={false} className={buttonVariants({ variant: "ghost", size: "sm" })}>
      <LogIn />{labels.signIn}
    </Link>
  );
}
