---
name: place-page-in-menu
description: >
  Put a page into the TOP MENU or the FOOTER, and decide its order. Use whenever the owner says
  "add a subscriptions page to the top menu", "put the todo list in the footer", "this should be
  in the menu", "reorder the footer links", or names any page together with a place in the
  navigation. It answers the three questions that come before any code: does such a page already
  exist, is it allowed in a public menu at all, and WHICH of the two menu sources actually decides
  what the visitor sees. Getting the last one wrong is a silent no-op — the page ships, the menu
  never changes, and nothing reports an error.
---

# place-page-in-menu

Placing a page in a menu is three decisions, in this order. Skipping the first two is how a project
ends up with two subscription pages, or with a page nobody can reach.

## 1. FIND FIRST — never build first

The owner says "I want a subscriptions page in the top menu". He is describing an **outcome**, not
ordering a new file. A page that already serves that purpose is the common case in a project that
has been worked on.

```bash
# every real page of the site, one per line
find "app/[lang]" -name page.tsx | sed 's#/page.tsx##'
# by meaning, not only by name — titles live in the page's own data
grep -rn "title:" "app/[lang]" --include=*.ts | grep -i "subscri\|подписк"
```

Search by **meaning**, not by slug: `/pricing`, `/plans` and `/subscribe` are the same intent under
three names, and the owner will call all three "подписка".

- **Found one candidate** → name it back to the owner with its address, and place it after he
  confirms. Do not assume; two pages can both look right.
- **Found several** → show the list and ask which. This is the moment a duplicate is prevented.
- **Found none** → go to section 2. Do **not** start creating.

## 2. Nothing exists — ask TWO questions before writing a file

1. **Create it?** The owner may have meant a page that lives elsewhere, or may not want a new one.
2. **Who may open it — everyone, or a role?** This is not a detail to settle later: it decides
   *where the page can live*, and a page built in the wrong layer has to be moved, not configured.

Then build with `use-static-pages` (it owns the page shape and the three edits outside the folder).

🔒 **A PROTECTED PAGE CAN NEVER BE A MENU CANDIDATE.** The panel builds its list of candidates by
walking the route tree and **skipping every folder whose name contains `protected`**, and
`navGroupsFromConfig` marks everything it returns `roles: "public"`. So a page under
`app/[lang]/(protectedLayer)/…` will never appear in the top-menu picker, no matter what is written
in the config.

That is correct behaviour, not a gap: a public menu button leading to a page that answers 403 is a
promise the site does not keep. Pages behind roles reach their audience through the **account
drawer** (`lib/menu/account-links.ts`), which resolves by role group:

| Group | Folder | Roles that may enter |
|---|---|---|
| `account` | `(protectedLayer)/(account)/` | user, buyer, vip_user, subscriber_lite/standard/max, architect |
| `staff` | `(protectedLayer)/(staff)/` | manager, senior_manager, support_manager, delivery_manager, content_editor, architect |
| `finance` | `(protectedLayer)/(finance)/` | finance, architect |
| `admin` | `(protectedLayer)/(admin)/` | admin, architect |

Source of truth: `PROTECTED_GROUP_ROLES` in `lib/roles.ts`. Read it; do not retype it from here.

So "subscriptions in the top menu" usually splits in two: a **public** page that sells the plans
(top menu), and a **protected** page where the subscriber manages his own (account drawer). Say this
out loud to the owner — it is a product decision, not a technical one.

## 3. 🔒 The trap: TWO sources decide the menu, and only one of them wins

| Source | Where | Who writes it | When it is used |
|---|---|---|---|
| **The owner's list** | `nav.top` / `nav.footer` in `APP-CONFIG/app-config.json` **on the server** | only the control panel | **whenever the branch exists** — even empty |
| Repo default, footer | `lib/menu/nav-config.ts` → `DEFAULT_FOOTER` | this repository | only while `nav.footer` is absent |
| Repo default, top | group manifest `app/[lang]/<group>/_data/group.ts` → `menus.top.enabled` | this repository | only while `nav.top` is absent |

```ts
// lib/menu/nav-config.ts — the whole rule in one line
if (!nav || !Array.isArray(list)) return null;   // no branch → repo defaults answer
```

🔒 **A local agent cannot write the owner's list, and must not try.** `APP-CONFIG` lives on the
server, outside the repository; the panel owns that file. `git push` never carries it.

**Therefore the failure to avoid:** the owner has opened the menu section in the panel and pressed
Save even once → the branch now exists → editing `DEFAULT_FOOTER` or a group manifest changes
**nothing a visitor sees**. The page ships, the menu stays as it was, no error is raised anywhere.
This is the same family of silent failure as a config key missing from the schema.

**How to know which case you are in** — ask the owner, or read the live config if you have the
server: `nav.footer` present? Then the panel decides, full stop.

**What to do in each case:**

- **Branch absent** (fresh project, owner never touched the section): edit the repo default. Say in
  the report that this is the default for a project nobody has configured, and that the owner's
  first Save in the panel takes over from it.
- **Branch present** (the usual case on a live server): **do not edit the repo default** — it would
  be dead code pretending to be a change. Finish the page, and tell the owner in one sentence:
  "the page is ready at `/subscriptions`; drag it into the menu in the panel, section «Верхнее
  меню» / «Страницы подвала»." He drags it from the left column into the right one, and that is a
  five-second job for him and an impossible one for you.

## 4. Order, labels, nesting

- **Order** is the `order` number, ascending, ties broken by slug. The panel rewrites the whole
  column as `(index + 1) * 10` on every change, so the list order the owner sees IS the site order.
- **Label limit is 12 characters** (`lib/menu/nav-config.ts`). Longer labels are cut in the button —
  the page title stays full. "Accessibility" (13) ships as "Accessible" for exactly this reason.
- **Nesting is one level.** A group may hold children and becomes a dropdown; children have no
  children.
- Labels are translated through `i18n["nav.<slot>.<id>.label"]` — the same branch as the five
  per-language fields of the settings form. Do not invent a second store.

## 5. Before you call it done

1. Open the rendered page and **count `<a href>` in the footer / top bar** — not words. The word
   "privacy" also lives in structured data and in class names.
2. Check the state you did **not** change: if you edited a repo default, prove the branch was really
   absent; a passing check on the configured project says nothing about the unconfigured one.
3. If the placement is the owner's to do in the panel, say so plainly and name the section. A report
   that ends "added to the menu" when the menu did not change is the worst outcome available here.
