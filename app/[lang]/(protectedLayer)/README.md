# (protectedLayer) — pages you must be signed in to open

**Declared node.** This folder is a route group: the parentheses mean it groups files without appearing
in any URL. `app/[lang]/(protectedLayer)/(account)/dashboard` is served at `/{lang}/dashboard`.

## What makes a page belong here

Two conditions, both required — either one alone is not enough:

1. **The visitor is signed in.**
2. **The visitor holds the role the page names.**

If either fails, the page is not rendered with an apology inside it: the visitor is redirected to the
sign-in form with the address to come back to, and an interactive toast says which roles the page needs.

Everything else — a page anyone may open, with or without an account — belongs to the **public layer**
(`app/[lang]/<page>`), is prerendered and indexed, and follows `CONTENT-ENGINE.md`.

## The shape of a protected page — static shell, dynamic centre

A protected page is **not** a dynamic page. It is a static page with dynamic holes.

**Static, prerendered, part of the build:** the heading, the description, section titles, explanatory
prose, empty states, the frame at every nesting depth. These arrive as HTML with no query behind them,
so the page is addressable instantly and stays readable when the data service is slow or down.

**Dynamic, fetched at request time:** the rows — the actual substance. They live inside a container that
renders a **skeleton** until the data arrives, and the data comes from an authenticated `/api/*` route,
never baked into the page.

The two consequences worth stating out loud:

- **A static page never calls authorization inside itself.** A public page that asks the auth service on
  render dies when that service dies, and pays a round trip on every visit for a question it does not
  need answered.
- **A dynamic route does not license a dynamic page.** `/[id]` resolves per request; the shell around it
  is still built ahead of time.

## Why route groups and not folders in the URL

The group name is architecture, not navigation. `(account)`, `(staff)`, `(finance)`, `(admin)` say who a
page is for — a fact the code needs and the visitor does not. Putting it in the URL would leak the
project's internal role model to the outside and freeze it: renaming a group would break every link.

Each subgroup carries its own `README.md` naming the roles it serves. Read it before adding a page
there; if no group fits, say so instead of stretching one — a wrong group is a wrong door.
