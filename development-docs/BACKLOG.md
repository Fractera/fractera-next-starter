# BACKLOG — what is built but unexplained, half-built, or owed

**This is not instruction.** `CLAUDE.md` holds the laws and is read at the start of every session;
this file is the list of our own unfinished work and is read when the area it names comes up. It left
the instruction on 2026-08-23 for exactly that reason: a backlog loaded into every session is paid for
by every session, including the ones it has nothing to do with.

**How an entry leaves:** the work is done and the law moves into `CLAUDE.md` or a skill, and the line
is deleted here. An empty file means nothing is owed.

---

## 🔶 Mode `migration` is half built

Step 533, closed 2026-08-22 → `development-steps/completed-steps/533-main.md`.

**Works:** the `migration` value in the `PLATFORM-CONFIG` schema and type; the mode card in the panel
with a door to its tab; the "Move to Fractera" tab writing the source into `PLATFORM-CONFIG.migration`.
Verified live on a foreign project: reading → tree → cases → queue.

**Missing:** the skeleton as the first slice (533-4), the skill `use-migration` (533-5), data transfer
(533-6). **And above all, the building has never been tried:** nobody executed the generated steps, so
the price of a move is unknown. Before promising dates — walk the first two steps of a queue and
measure them.

🔒 **Not a word about this in public texts** — no "soon", "in development", "not yet available" on site
pages. The same law stands in `CLAUDE.md`; it is repeated here because this is where the temptation is.

## 🚧 Guest access is neither described nor verified

The auth service has a door `/api/auth/guest` and a path `/guest-login` in `AUTH_FORM_PATHS`
(`proxy.ts`) — the mechanism exists. What does not exist: a **description** (what a guest is in this
product, how it differs from an anonymous visitor, which roles it gets, how long its session lives,
what it sees and what it loses on a normal sign-in) and a **verification** — guest sign-in has never
been walked live.

While that holds, "guest access works" may not be written. `use-auth` names `guest` among the
`ACCESS_TIERS` without describing its behaviour: a debt, not a gap in the telling.

## 🚧 What authentication does out of the box is not written down

A deployed project already carries database-backed auth: registration and sign-in by password, roles,
a session. What it does NOT have is **password recovery** — someone who forgets it today cannot get in
without the owner. The panel adds, in simplified form, **Google** and email via **Resend**: everything
on the `3001` side is prepared and the owner only fills in keys — no code is touched. Underneath is
NextAuth with some eighty other providers; wanting one of them is a request to the developers, not
work for the agent in the slot.

Destination when written: the `3001` section and the skills `use-auth` / `use-auth-providers`.

## 🚧 Sections: the layer is still growing

The page frame and list cards have not become sections yet. When they do, the section of `CLAUDE.md`
is rewritten, not appended to.

## 🚧 Widgets and the design boundary — half written

The full discussion is kept in the development repository
(`next-step/521-widgets-and-design-boundary.next-step.md`). Written and built on 2026-08-21: the widget
folder shape, the boundary rule, the ban on a shared fragment library, the ten-language dictionary.
Still unwritten, and both belong in `use-widgets` / `use-design` rather than in the instruction:

**"Three ways to build a page."** A static route — content as blocks. A dynamic route — data from the
database, protected areas. **A widget** — custom logic, up to a whole page. The third is what makes a
one-off calculator cheap; today such a thing still costs edits in shared files, and that is the hole.

**Four design rings and the write boundary:** tokens (`DESIGN-CONFIG` → CSS variables, written by the
owner through the panel) · primitives (`components/ui/*`, platform) · sections (closed catalogue,
platform) · **widgets — the one ring where an external design skill and the library it brings may
write**. The library stays inside the design system on one condition: it feeds on the same CSS
variables `lib/design-css.ts` produces. Then a foreign chart or UI kit is repainted by the owner's
palette on its own, even when the widget takes the whole page. The boundary is checked by an import
gate, not by an honest word.

**Moved out 2026-08-23:** the law "a full-screen widget inherits a page's duties" now lives in
`use-widgets`, where it is read at the moment it applies.

## 🚧 Search, machine readers and the installable app — mechanisms exist, the explanation does not

Built by steps 503–505 and guarded by `check:seo`, `check:aio`, `check:pwa`. The instruction does not
say how they work or what an agent must do when adding a new surface — so every new page risks falling
out of all three at once, exactly as on 2026-08-19 when no footer page reached the sitemap with a green
gate. Most of this now lives in `use-seo`, `use-aio`, `use-pwa`; what remains unwritten is the
narrative that ties the three together for someone adding a surface for the first time.

**What `use-pwa` does NOT prove, and claiming otherwise is forbidden:** installation on a phone and
launching from the home screen; the iOS splash screen seen by eye; behaviour with the network REALLY
off (the cache branch logic was verified, not the disconnection); the appearance of the install button
— the browser sends it as `beforeinstallprompt` and it cannot be summoned. That half is closed only by
a phone.

## 🚧 `use-code-shape` has never been exercised by building

The skill was checked claim by claim against the gates on 2026-08-22, and four discrepancies were
fixed. But nobody has built an `app/api/**/route.ts` door and a `SCHEMA` table by it. Fact-checking and
an agent run are different proofs, and the second one does not exist.

## 🚧 A feature report is owed for the data-layer group (544–546)

The group closed on 2026-08-23 and its steps are in `completed-steps/`, but the report that describes
the feature AS A WHOLE is not written. Reason it is deferred rather than forgotten: the exam of the
instruction corpus runs first by the owner's decision, and the same session cannot both take a
measurement and rewrite what is being measured.

## 🚧 Telegram: the bridge does not exist (verified 2026-08-23)

The channel service answers questions from the knowledge base by itself. Your application has **no**
outbound route, **no** inbound door, and voice notes are dropped silently — the loop keeps `msg.text`
only. One chat, the owner's. The five limits are listed in `use-channels` §3.

**What closing it takes** (platform work, in `services/channels`): accept `voice` updates → fetch the
file from Telegram → transcribe (the slot already has `app/api/transcribe`) → treat as text; plus two
doors for the application — send, and receive with the sender's chat id.

**What is already proven and should be reused rather than reinvented:** the deleted projects layer
pushed each update into a door of the application together with `telegramChatId`, and delivered to a
personal chat linked natively (step 296, verified end to end). Take the shape, not the files — that
generation was per-automation, and the channel today is one service per server.
