# CODING-STANDARDS.md — limits the code must respect

Not style advice. These are limits: when one is reached, you stop and restructure instead of continuing.

---

## 1. 250 lines, then decompose

**No component and no function may exceed 250 lines.** Data does not count — a translation table, a
catalogue of countries or a list of fields is data, and splitting it helps nobody.

On reaching the limit, **decomposition is mandatory, not optional**. Not "later", not "after this feature":
the file that crossed the line is split before the work continues.

**Why the limit is a hard one.** A component past that size stops fitting in one head and in one review.
Its state, its rendering and its side effects blur together, so every later change touches things it did
not mean to. Splitting after the fact costs several times what splitting at the line would have cost.

---

## 2. The public layer is static

**Pages a visitor sees are generated ahead of time** — static or server-rendered at build. Not dynamic
because dynamic was easier.

The app must work with JavaScript switched off. Next renders on the server, so a static page returns
complete HTML with no JS at all. Tools may degrade without JS — that is fine; everything that *can* work
without it must keep working.

**What actually breaks this:** a client component that owns the route, or a `dynamic = "force-dynamic"` on
a root layout — it makes the entire subtree dynamic. For content that changes, use revalidation
(`export const revalidate = N`), not full dynamics.

**The exception** is a page only the owner sees. Service and cockpit pages may be dynamic; the public
surface may not.

---

## 3. Text a user sees goes through translations

No user-visible string is written inline in a component, and no `lang === "ru" ? … : …` ternaries. A new
string is a new key; a new language is a new file.

**Why.** A hardcoded string cannot be translated without finding it first, and it will be found by the
person who least expects to. The exception is machine strings — identifiers, slugs, enum values, codes:
translating those breaks lookups.

---

## 4. Settings are read, never hardcoded

The app's name, description, branding, SEO and analytics live in the panel (`npm run read:app-config`).
Writing any of them into the code is wrong twice: the app does not read your version, and the file that it
does read will overwrite it.

---

## 5. Every API route carries a NAME of 6–12 words

First line of every `app/api/**/route.ts`:

```ts
// @api record every mood button press with its amount and second
```

English, verb first, 6–12 words. `npm run check:api` runs in `prebuild` and **fails the build** on a
route without a name or with a name outside those bounds.

**Why the name is not the URL.** The address is a public contract: it travels into browsers, logs,
bookmarks and other people's integrations, and renaming it breaks all of them silently — the 404 reaches
someone who did not do the renaming. A name in the header changes freely and costs nothing.

**Why a name at all.** A route called `tap`, `me` or `catalogue` is findable while there are fifteen of
them. At a hundred, the question is never "what is this folder called" but "which one writes the presses"
— and only the name answers it. Until 2026-08-17 this document said nothing about API names at all.

`npm run build:api-map` collects them into `development-docs/API-MAP.md` — one read instead of walking
twenty folders. That file is **generated**: anything typed into it by hand disappears on the next build.

---

*This list grows. When a limit is agreed with the owner, it belongs here — one section, with the reason,
so a later session can judge whether it still holds.*


## Статика — это архитектурное требование, а не настройка

Публичная страница остаётся предрендеренной (`●`). Три строки превращают её в динамику (`ƒ`) вместе
со всем поддеревом: `cookies()`, `headers()`, `export const dynamic = 'force-dynamic'`. Сессию
спрашивает островок после гидратации, право проверяет `/api/*`, стареющие данные обновляет
`revalidate`.

Отдельно про движение: библиотека анимации, поднятая на уровень страницы, отдаёт краулеру разметку с
`opacity: 0` — то есть пустую страницу. Движение допускается только внутри островка и только поверх
статического близнеца (см. `DESIGN.md` и навык `use-widgets`).

Проверяется это не рассуждением, а таблицей маршрутов после сборки: `●` — верно, `ƒ` — ищи одну из
трёх строк выше.
