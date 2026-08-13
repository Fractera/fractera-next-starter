import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook } from "lucide-react";
import { getAppConfig } from "@/config/app-config";
import { getMenuGroups } from "@/lib/menu/group-menus";
import { navGroupsFromConfig, defaultFooterGroups } from "@/lib/menu/nav-config";
import { featureOn } from "@/config/platform-config";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/menu/shared/theme-toggle.client";
import { AppWidthToggle } from "@/components/menu/footer/app-width-toggle.client";
import { footerLabels, widthLabels } from "@/components/menu/footer/footer-menu.i18n";
import { FooterSocialDropdown, type SocialKey } from "@/components/menu/footer/footer-social-dropdown.client";
import { LanguageSwitcher } from "@/components/language-switcher.client";
import { CookieSettingsButton } from "@/components/menu/footer/cookie-settings-button.client";
import { cookieButtonUi } from "@/components/menu/footer/cookie-settings-button.i18n";
import { AccountButton } from "@/components/menu/account/account-button.client";
import { appShellAuthSide } from "@/components/menu/account/account-config";
import { accountLabels } from "@/components/menu/account/account-menu.i18n";
import { accountLinks } from "@/lib/menu/account-links";
import { cartUi } from "@/components/cart/cart.i18n";

// Always-present FOOTER menu (step 160), mirroring FES site-footer in look & behaviour
// (re-programmed, not copied). Three sections:
//   1. footer-page navigation — links to every group that enabled the `footer` slot;
//   2. home-section navigation — scroll links, HOME PAGE ONLY (client island);
//   3. company — brand + copyright + social icons + theme toggle + language switcher.
// The footer is always rendered (site furniture + the always-useful theme/language).
// UI standard: lucide icons, shadcn controls, theme tokens (light + dark).
// Footer-owned strings live co-located in ./footer-menu.i18n (delete the folder, they go
// with it); the two headings are translated across the full 82-language catalogue.

// Each link carries BOTH the icon component (for the desktop inline render, done
// here on the server) and a serializable string `icon` key (for the mobile
// FooterSocialDropdown client component — a function/component cannot cross the
// server→client boundary as a prop).
function socialLinks(social: { twitter?: string; github?: string; linkedin?: string; facebook?: string } | undefined) {
  type SocialLink = { href: string; label: string; Icon: typeof Github; icon: SocialKey };
  if (!social) return [] as SocialLink[];
  const out: SocialLink[] = [];
  if (social.github) out.push({ href: social.github, label: "GitHub", Icon: Github, icon: "github" });
  if (social.twitter) out.push({ href: social.twitter.startsWith("http") ? social.twitter : `https://twitter.com/${social.twitter.replace("@", "")}`, label: "X (Twitter)", Icon: Twitter, icon: "twitter" });
  if (social.linkedin) out.push({ href: social.linkedin.startsWith("http") ? social.linkedin : `https://linkedin.com/company/${social.linkedin}`, label: "LinkedIn", Icon: Linkedin, icon: "linkedin" });
  if (social.facebook) out.push({ href: social.facebook.startsWith("http") ? social.facebook : `https://facebook.com/${social.facebook}`, label: "Facebook", Icon: Facebook, icon: "facebook" });
  return out;
}

export function FooterMenu({ lang }: { lang: string }) {
  const cfg = getAppConfig();
  // 🔒 ТОТ ЖЕ МЕХАНИЗМ, ЧТО У ВЕРХНЕГО МЕНЮ (2026-08-12). Ссылки подвала —
  // настройка владельца в панели, а не манифесты на диске. Различие «ветки нет»
  // и «ветка пуста» сохранено: пусто — владелец убрал все ссылки, нет ветки —
  // он раздел не открывал, и работает прежний источник. Иначе каждый
  // существующий проект потерял бы ссылки подвала молча.
  const pagesOn = featureOn("footerPages");
  const fromConfig = pagesOn ? navGroupsFromConfig("footer", lang) : null;
  // Владелец раздел не открывал — показываем три страницы, которые в проекте
  // уже есть. Плюс группы с диска, если разработчик их объявил.
  const groups = pagesOn
    ? (fromConfig ?? [...defaultFooterGroups(lang), ...getMenuGroups("footer", lang)])
    : [];
  const ui = footerLabels(lang);
  const socials = socialLinks(cfg.seo?.social);
  const address = cfg.geo?.address;

  // Кнопка настроек cookie появляется РОВНО тогда, когда есть сам баннер: она
  // его и открывает. Баннер выключен — кнопка вела бы в никуда.
  const bannerOn = featureOn("cookieBanner");
  // Вход/аккаунт в подвале — та же кнопка, что и в шапке, и тот же ящик:
  // человек, докрутивший до низа страницы, не должен возвращаться наверх.
  const authSide = appShellAuthSide();

  return (
    <footer className="border-t border-border bg-background text-foreground mt-auto">
      {/* data-app-column: the footer content follows the same width as the page content;
          the footer width toggle (below) widens BOTH at once via --app-w (globals.css). */}
      <div data-app-column className="px-6 py-10 flex flex-col gap-6">
        {/* Section 1 — footer-page navigation (groups that enabled the footer slot),
            under a "Footer pages" heading. */}
        {groups.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest">{ui.footerPages}</p>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground font-medium">
              {groups.map((g) => (
                <Link key={g.slug} href={g.href ? `/${lang}${g.href}` : `/${lang}/${g.slug}`} className="hover:text-primary transition-colors">
                  {g.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* 🪦 Навигатор «слоёв» удалён 2026-08-12 по слову владельца. Он вёл на
            Admin :3002, Design :3004 и слой проектов :3003 — два последних снесены
            шагом 500. Ссылка в никуда на каждой странице сайта хуже отсутствующей:
            посетитель считает её поломкой сайта, а не следом старой архитектуры. */}

        {/* Отдельной «правовой» полосы здесь больше нет (2026-08-12). Страницы
            подвала — обычные страницы сайта, и живут они в секции 1 выше, где их
            собирает владелец. Второй список ссылок делил подвал по признаку,
            которого в настройках не существует. */}

        {/* Полоса действий: вход и настройки cookie. Обе появляются только когда
            включены соответствующие возможности, поэтому у проекта без них
            подвал выглядит ровно как раньше — пустой полосы не остаётся. */}
        {(authSide || bannerOn) && (
          <div className="flex flex-wrap items-center gap-2">
            {authSide && (
              <AccountButton
                lang={lang}
                side={authSide}
                labels={accountLabels(lang)}
                links={accountLinks(lang)}
                cart={cartUi(lang)}
                currency={cfg.commerce.currency}
              />
            )}
            {bannerOn && <CookieSettingsButton label={cookieButtonUi(lang).settings} />}
          </div>
        )}

        {/* Section 3 — company: copyright + address, social, theme toggle, language.
            One row on every width (© + name on the left, controls on the right).
            MOBILE (< sm): no "rights" text; controls order = theme · language ·
            social-hamburger (rightmost, opens upward). DESKTOP (≥ sm): the classic
            inline socials + theme + language, with the "rights" line intact. */}
        <div className="flex flex-row items-center justify-between gap-3 text-sm border-t border-border pt-6">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="truncate">
              © {new Date().getFullYear()} {cfg.short_name}.<span className="hidden sm:inline"> {ui.rights}</span>
            </span>
            {address && <span className="text-xs text-muted-foreground truncate">{address}</span>}
          </div>

          {/* Desktop cluster — inline socials + theme + language */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="w-8 h-8 inline-flex items-center justify-center rounded-md border border-border text-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Icon className="size-4" />
              </a>
            ))}
            {/* Content-width toggle (wide ↔ normal) — ported from the Projects zone footer;
                governs the [data-app-column] width. Hidden on mobile (own full-width mode). */}
            <AppWidthToggle labels={widthLabels(lang)} />
            <ThemeToggle labels={{ system: ui.system, light: ui.light, dark: ui.dark }} />
            <LanguageSwitcher />
          </div>

          {/* Mobile cluster — theme · language · social-hamburger (rightmost) */}
          <div className="flex sm:hidden items-center gap-2 shrink-0">
            <ThemeToggle labels={{ system: ui.system, light: ui.light, dark: ui.dark }} />
            <LanguageSwitcher />
            <FooterSocialDropdown
              socials={socials.map(({ href, label, icon }) => ({ href, label, icon }))}
              label={ui.social}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
