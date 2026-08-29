import Link from "next/link";
import { Boxes, SlidersHorizontal, Wrench } from "lucide-react";
import { findSocialIcon } from "@/components/icons/socials";
import { isUploadedIcon } from "@/lib/socials/catalogue";
import { getAppConfig } from "@/config/app-config";
import { resolveSocialLinks, socialHref } from "@/config/app-config.defaults";
import { getMenuGroups } from "@/lib/menu/group-menus";
import { navGroupsFromConfig, defaultFooterGroups } from "@/lib/menu/nav-config";
import { featureOn } from "@/config/platform-config";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/menu/shared/theme-toggle.client";
import { AppWidthToggle } from "@/components/menu/footer/app-width-toggle.client";
import { footerLabels, widthLabels, adminLinkLabels, architectLinkUi } from "@/components/menu/footer/footer-menu.i18n";
import { adminUrlFromSite } from "@/lib/site-urls";
import { FooterSocialDropdown, type SocialKey } from "@/components/menu/footer/footer-social-dropdown.client";
import { LanguageSwitcher } from "@/components/language-switcher.client";
import { CookieSettingsButton } from "@/components/menu/footer/cookie-settings-button.client";
import { cookieButtonUi } from "@/components/menu/footer/cookie-settings-button.i18n";
import { AccountButton } from "@/components/menu/account/account-button.client";
import { appShellAuthSide } from "@/components/menu/account/account-config";
import { accountLabels } from "@/components/menu/account/account-menu.i18n";
import { accountLinks } from "@/lib/menu/account-links";
import { cartUi } from "@/components/cart/cart.i18n";
import { appDialogUi } from "@/components/dialog/app-dialog.i18n"
import { architectureLinkUi } from "@/lib/i18n/architecture-link.i18n";

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
// 🔒 СПИСОК, А НЕ ЦЕПОЧКА УСЛОВИЙ (шаг 523). Здесь стояли четыре `if` с зашитыми
// правилами сборки адреса — по одному на сеть. Пятая сеть в такую форму не влезала
// вовсе, а правило её ссылки взять было неоткуда. Теперь правило хранится ВМЕСТЕ с
// записью (`urlTemplate`), и подвал только рисует то, что посчитал общий резолвер.
//
// Тип значка описан ПО ПОТРЕБЛЕНИЮ, а не «как у lucide»: рисуется он вызовом с одним
// `className`, и этого достаточно. Привязка к типу конкретной библиотеки запрещала бы
// иметь свой знак там, где в библиотеке его нет.
type FooterSocial = { href: string; label: string; Icon: (p: { className?: string }) => React.ReactNode; icon: SocialKey };

// Знаки для четырёх исторических сетей остаются встроенными: они уже нарисованы и
// не требуют похода в медиатеку. Новая запись приносит свой значок полем `icon`.
// 🔒 ЗНАЧОК БЕРЁТСЯ ИЗ ПОЛЯ `icon`, А НЕ ИЗ `id` (31-26, 2026-08-29). Здесь стояла
// таблица встроенных знаков, и ключом ей служил `link.id`. Работало это ровно для
// четырёх исторических записей, у которых `id` случайно совпадал с именем сети;
// `id` записи, заведённой владельцем, рождается как `s<время>` и не совпадёт
// НИКОГДА — то есть каждая новая соцсеть получала запасной кубик вместо своего
// знака. Дефект жил на публичной странице и выглядел как «иконки не работают».
//
// Теперь у поля `icon` две формы, и различает их первый знак: путь или адрес —
// загруженная картинка, всё остальное — ключ каталога (`lib/socials/catalogue.ts`).
//
// 🔒 `id` ПРОДОЛЖАЕТ ЧИТАТЬСЯ ЗАПАСНЫМ ПУТЁМ, и это не подстраховка «на всякий
// случай»: у развёрнутых сайтов в конфиге лежат старые записи `github`, `twitter`,
// `linkedin`, `facebook` БЕЗ поля `icon`. Перестань читать `id` — и у них значки
// исчезнут при первой же сборке.

function footerSocials(seo: Parameters<typeof resolveSocialLinks>[0]): FooterSocial[] {
  return resolveSocialLinks(seo).map((link) => {
    const uploaded = isUploadedIcon(link.icon);
    // Ключ значка: явно выбранный → историческое имя из `id` → ничего.
    const key = uploaded ? undefined : (link.icon || link.id);
    const Chosen = findSocialIcon(key);
    const Icon = Chosen ?? ((p: { className?: string }) =>
      uploaded
        ? // eslint-disable-next-line @next/next/no-img-element
          <img src={link.icon} alt="" aria-hidden className={p.className} />
        : <Boxes className={p.className} />);
    return { href: socialHref(link), label: link.name, Icon, icon: (key as SocialKey) };
  });
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
  // 🔒 ВИДИМОСТЬ — ВОПРОС PLATFORM-CONFIG, СОДЕРЖАНИЕ — APP-CONFIG (шаг 523,
  // разделение владельца). Прежде ряд значков появлялся просто оттого, что в
  // APP-CONFIG есть записи: «не хочу видеть соцсети» было невыполнимо иначе как
  // удалением данных. Теперь это выключатель, а записи остаются на месте.
  const socials = featureOn("socials") ? footerSocials(cfg.seo) : [];
  const address = cfg.geo?.address;

  // Кнопка настроек cookie появляется РОВНО тогда, когда есть сам баннер: она
  // его и открывает. Баннер выключен — кнопка вела бы в никуда.
  const bannerOn = featureOn("cookieBanner");

  // 🔒 ТРИ ВЫКЛЮЧАТЕЛЯ ПОДВАЛА БЫЛИ МЁРТВЫМИ (шаг 522, 2026-08-20). Панель их
  // предлагала, конфиг их хранил, а подвал рисовал кнопки безусловно: проверка
  // браузером показала «Theme: dark» и «Narrow the screen» на странице во ВСЕХ
  // трёх положениях конфига. Выключатель, который ничего не выключает, хуже
  // отсутствующего — человек считает задачу решённой.
  //
  // Гейт стоит ЗДЕСЬ, в серверном компоненте, а не внутри островков: `featureOn`
  // читает диск и помечен `server-only`, островку его не отдать.
  //
  // 🔒 КЛАСТЕРА ДВА — настольный и мобильный, и кнопки в них ПОВТОРЯЮТСЯ. Гейт
  // обязан стоять в обоих: закрыть один — значит выключить кнопку на половине
  // устройств и получить отчёт «у меня не работает», который не воспроизводится.
  const themeOn = featureOn("themeToggle");
  const widthOn = featureOn("widthToggle");
  const langSwitchOn = featureOn("languageSwitcher");
  // Вход/аккаунт в подвале — та же кнопка, что и в шапке, и тот же ящик:
  // человек, докрутивший до низа страницы, не должен возвращаться наверх.
  const authSide = appShellAuthSide();
  // Адрес панели выводится из адреса сайта, а не из окна браузера: подвал —
  // серверная разметка, и ссылка обязана быть в статическом HTML.
  const adminUrl = adminUrlFromSite(cfg.url);

  return (
    <footer className="border-t border-border bg-background text-foreground mt-auto">
      {/* 🔒 ПОДВАЛ ПЕРЕКЛЮЧАТЕЛЮ ШИРИНЫ НЕ ПОДЧИНЯЕТСЯ (2026-08-15).
          Здесь стояло `data-app-column`, и получалось наоборот: подвал был
          ЕДИНСТВЕННЫМ, чем кнопка управляла, — лента страницы сидела в жёстком
          `max-w-5xl` и не двигалась вовсе. Человек нажимал «шире», видел, как
          разъезжается один подвал, и справедливо считал кнопку сломанной.
          Подвал — мебель сайта: он занимает всю ширину всегда, как и шапка. */}
      <div className="px-6 py-10 flex flex-col gap-6">
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
        {(authSide || bannerOn || adminUrl) && (
          <div className="flex flex-wrap items-center gap-2">
            {authSide && (
              <AccountButton
                lang={lang}
                side={authSide}
                labels={accountLabels(lang)}
                links={accountLinks(lang)}
                cart={cartUi(lang)}
                dialogUi={appDialogUi(lang)}
                currency={cfg.commerce.currency}
              />
            )}
            {bannerOn && <CookieSettingsButton label={cookieButtonUi(lang).settings} />}

            {/* 🔒 АРХИТЕКТУРА — ОБЫЧНАЯ СТРАНИЦА САЙТА, И ССЫЛКА НА НЕЁ ОБЫЧНАЯ
                (заказ владельца 2026-08-17). Она живёт там же, где privacy,
                terms и cookies, и по тем же законам: статическая, индексируемая,
                со своей markdown-версией. Поэтому `Link`, а не `<a>` с
                `nofollow`: в отличие от панели, эту страницу поисковику показать
                как раз нужно — она объясняет продукт тому, кто выбирает.
                Стоит она в полосе ДЕЙСТВИЙ, а не в списке страниц подвала
                выше: тот список владелец собирает сам в настройках, и чужая
                строка в нём выглядела бы как его собственная забытая настройка. */}
            <Link
              href={`/${lang}/architecture`}
              className={buttonVariants({ variant: "ghost", size: "sm" }) + " gap-1.5 text-muted-foreground hover:text-foreground"}
            >
              {/* 🔒 НА ТЕЛЕФОНЕ ОСТАЁТСЯ ТОЛЬКО СЛОВО (владелец 2026-08-19).
                  Значок и надпись рядом съедают ширину узкой полосы, и две
                  кнопки переносятся в две строки. Слово несёт смысл, значок —
                  украшение; на узком экране режется украшение. */}
              <Boxes className="hidden size-3.5 sm:inline-block" />
              {architectureLinkUi(lang).footer}
            </Link>

            {/* 🔒 ВХОД В СЛОЙ АРХИТЕКТОРА (шаг 31-1, решение владельца 2026-08-28:
                «я хочу в подвал сайта по 3000 перенести вкладку для работа с App
                CONFIG»). Настройки проекта переезжают из панели внутрь самого
                проекта, и вход к ним — здесь, рядом со входом в панель.

                🔒 ССЫЛКА ВИДНА ВСЕМ, И ЭТО НЕ ДЫРА В ДОСТУПЕ. Подвал НЕ читает
                сессию намеренно: одна строка с `cookies()` сделала бы динамическим
                ВЕСЬ публичный слой и убила бы поиск. Закрывает не видимость
                ссылки, а замок страницы (`(architectLayer)/layout.tsx`) и двери
                `/api/*`: посторонний, нажав, получает отказ, а не настройки.
                Ровно так же здесь живёт соседняя ссылка на панель.

                `rel="nofollow"` и `Link`: страница служебная и поисковику не
                нужна, но она СВОЯ — в отличие от панели, которая живёт на чужом
                поддомене и потому берёт `<a>`. */}
            <Link
              href={`/${lang}/architect/app-config`}
              rel="nofollow"
              className={buttonVariants({ variant: "ghost", size: "sm" }) + " gap-1.5 text-muted-foreground hover:text-foreground"}
            >
              {/* Значок прячется на телефоне — то же правило, что у соседей:
                  на узкой полосе режется украшение, а не слово. */}
              <Wrench className="hidden size-3.5 sm:inline-block" />
              {architectLinkUi(lang).footer}
            </Link>

            {/* 🔒 ВХОД В ПАНЕЛЬ УПРАВЛЕНИЯ (владелец 2026-08-14).
                Панель закрыта авторизацией: без входа она уводит на страницу
                регистрации, поэтому видимая ссылка ничего не открывает
                постороннему — она лишь избавляет ВЛАДЕЛЬЦА от необходимости
                помнить адрес поддомена.
                Адрес выводится из адреса сайта (`adminUrlFromSite`), а не
                зашит: на домене это admin.<домен>, на голом IP — <ip>:3002.
                Настроек ещё нет — адрес пуст, и ссылки просто не будет:
                выдуманный адрес панели хуже отсутствующего.
                `rel="nofollow"` — служебная страница не должна утаскивать вес
                сайта на поддомен, который поисковику всё равно закрыт. */}
            {adminUrl && (
              <a
                href={adminUrl}
                rel="nofollow"
                // 🔒 ЗНАЧОК СЛЕВА (заказ владельца 2026-08-17). Кнопка стояла в
                // полосе последней и единственной без значка: соседи — вход,
                // настройки cookie и архитектура — его несут. Ряд, где часть
                // кнопок помечена, а часть нет, читается как недоделанный, а не
                // как лаконичный. `gap-1.5` и размер значка — те же, что у
                // соседей, иначе «единый ряд» держался бы на глазок.
                className={buttonVariants({ variant: "outline", size: "sm" }) + " gap-1.5"}
              >
                <SlidersHorizontal className="hidden size-3.5 sm:inline-block" />
                {adminLinkLabels(lang).admin}
              </a>
            )}
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
            {widthOn && <AppWidthToggle labels={widthLabels(lang)} />}
            {themeOn && <ThemeToggle labels={{ system: ui.system, light: ui.light, dark: ui.dark }} />}
            {langSwitchOn && <LanguageSwitcher />}
          </div>

          {/* Mobile cluster — theme · language · social-hamburger (rightmost) */}
          <div className="flex sm:hidden items-center gap-2 shrink-0">
            {themeOn && <ThemeToggle labels={{ system: ui.system, light: ui.light, dark: ui.dark }} />}
            {langSwitchOn && <LanguageSwitcher />}
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
