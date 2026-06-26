# HOW-USE-AUTH.md — wiring a page for public / private / guest access

This is the practical recipe an agent follows when creating or editing a page in `app/`. It answers one
question: **"who is allowed on this page, and what happens to an unauthenticated visitor?"**

There are exactly three access shapes. Pick one per route.

| Shape | Who gets in | What an unauthenticated visitor sees |
|---|---|---|
| **Public** | everyone, no session needed | the page (no gating) |
| **Private** | only listed roles | redirected to sign in |
| **Public + guest** | everyone, but anonymous visitors are upgraded to a **guest** | a real guest identity is created so their work persists |

> Platform boundary: the **auth service** (`services/auth`) provides the guest sign-in endpoint
> (`/api/auth/guest`) and the guest→full **promotion** (register updates the same row). Those are platform
> code outside `app/` — you do not edit them. Your job in `app/` is to **declare** the access shape and
> **trigger** the guest sign-in on the right pages, then write data against the session identity.

---

## 1. Declare the access shape in `_meta.ts`

Every route has a typed `_meta.ts` (`satisfies RouteMeta`). Use these fields:

```ts
// app/app/<route>/_meta.ts
export const meta = {
  // ...identity/seo/etc...

  // PUBLIC: leave roles empty / omit the gate.
  roles: [],                         // no role requirement

  // PRIVATE: list the roles allowed. Anyone else is redirected.
  // roles: ['user', 'architect'],
  // unauthorizedRedirect: '/register?requireRole=user',

  // PUBLIC + GUEST: the page is open to all, but an anonymous visitor
  // must be turned into a guest so their work (cart, chat…) is saved.
  requiresGuestRegistration: true,
} satisfies RouteMeta
```

- **Public** → `roles: []`, no `requiresGuestRegistration`.
- **Private** → `roles: ['<role>', …]` (+ optional `unauthorizedRedirect`). Roles come from the project
  role model (`guest | user | architect` plus the business roles) — the full vocabulary is `ALL_ROLES` in
  `lib/roles.ts`.
- **Public + guest** → `requiresGuestRegistration: true` (you may still leave `roles: []` — guests are
  allowed; the flag only forces "anonymous → guest").

---

## 2. Enforce it client-side (static-first — never `auth()` in a page)

Per the STATIC-FIRST canon (`CLAUDE.md §4` / `AGENTS.md §12a`), do **not** call
`auth()`/`cookies()`/`headers()` in a layout or page — it forces dynamic rendering and breaks static
generation. Instead read identity in a **client component** via **`/api/me`** and act on the route's meta.
The page stays SSG; the guard is a thin client overlay.

> There is **no `useRouteAccess` hook in this starter** — do not import one. Gate **inline** with `/api/me`,
> exactly the way the shipped pages already do.

> **Content groups composed by the Frozen Template Constructor** already ship this same `/api/me` pattern,
> wrapped in a reusable component: their `layout.tsx` gates with **`<RouteGuard …>`** (`@/lib/auth-guard/route-guard.client`).
> To change a composed group's access, **set the props** on that `RouteGuard` (the layout's own comments list
> the options) — do **not** hand-write an inline guard or add a `_meta.ts`; it is the inline pattern, already
> done. Props: `roles?: string[]` (literal match — `architect` is not auto-included in a `user` gate),
> `requireGuest?: boolean` (public+guest), `unauthorizedRedirect?: string` (fallback), `group?: string`
> (section name shown in the access-denied toast).

### Access-denied feedback (toast)

When a signed-in visitor lacks the required role, don't fail silently — show a localized toast that explains
why, then soft-redirect. `RouteGuard` does this automatically. To fire it from your own access logic:

```tsx
import { showAccessDenied } from '@/services/access-feedback/access-denied-toast.client'
showAccessDenied({ lang, group: 'News', role })   // role optional; defaults to "guest"
```

- **Translated by default — all 82 languages**, fallback to English. No setup at the call site.
- **Closes only by button** (the owner explicitly asked: no auto-dismiss). `<Toaster/>` is already mounted
  in the layouts.
- The guard pairs it with a **soft** `router.replace(unauthorizedRedirect)` so the toast survives the
  navigation (a hard `window.location` would wipe it).
- App-wide, ship-once utility: `services/access-feedback/access-denied-toast.client.tsx` (strings in the
  sibling `access-denied-strings.ts`). Lives next to the shared `services/upload` cropper.

Copy this real pattern (it mirrors `app/(service)/dashboard/_components/dashboard-app.client.tsx`):

```tsx
'use client'
import { useEffect, useState } from 'react'
import { registerRedirectUrl } from '@/lib/runtime-urls'
import { meta } from '../_meta'

export function GuardedView() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    fetch('/api/me')
      .then(async res => {
        // No session. Public+guest → upgrade anon to a guest; otherwise → register form.
        if (!res.ok) {
          if (meta.requiresGuestRegistration) {
            window.location.href = `/api/auth/guest?redirectUrl=${encodeURIComponent(location.href)}`
          } else {
            window.location.href = registerRedirectUrl(location.href, 'user')
          }
          return
        }
        // Signed in. Private → check the required roles against the session.
        const session = (await res.json()) as { roles?: string[] }
        const need = meta.roles ?? []
        if (need.length && !need.some(r => session.roles?.includes(r))) {
          window.location.href = meta.unauthorizedRedirect ?? '/'   // ← fallback target
          return
        }
        setReady(true)
      })
      .catch(() => { window.location.href = '/' })
  }, [])
  if (!ready) return null
  return /* …page content… */
}
```

**Where the real building blocks live (look here, not for a hook):**
- **`app/api/me/route.ts`** — client identity read (returns the session JSON or `401`).
- **`lib/auth/get-session.ts`** — server identity read (honors `X-Agent-Identity`; dev / IP mode bypass → `architect`).
- **`lib/runtime-urls.ts`** — `registerRedirectUrl(callbackUrl, 'user' | 'architect')` + mode-aware service bases.
- **`lib/roles.ts`** — `ALL_ROLES` (the full role vocabulary) + `ACCESS_TIERS`.
- **Reference client guard:** `app/(service)/dashboard/_components/dashboard-app.client.tsx` (the pattern above).

`/api/auth/guest` is a **hard navigation** (not `fetch`) — it sets the session cookie and redirects back to
`redirectUrl`. After it returns, the visitor has a real `guest` session.

**Server-side guard — the sanctioned exception.** For pages that must hide content outright (the
architect-only service cockpit), use the shipped **`requireAdmin()`** (`lib/auth/require-admin.ts`) in the
**server** component. It reads `cookies()/headers()` and therefore **forces dynamic rendering**, so it is
allowed ONLY for architect-only pages — never for public content, which stays static via the client guard above.

> Enforcement is live only in **Secure mode** (custom domain). In IP / dev mode `getSession` bypasses to
> `architect`, so `/api/me` always returns a session and gating is effectively open — by design (onboarding).

---

## 3. Write the visitor's data against their identity

Once a guest (or any user) has a session, store their cart / messages / drafts against **their
identity**, never in localStorage-only. Use the project's data layer with the agent-identity header so
rows carry the owning user:

```ts
await fetch('/api/project/default/<resource>', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ /* …the cart line / message… */ }),
})
// The server stamps the row with the current session's user.id (the data-scoping the app already uses).
```

Because the guest's `user.id` is **permanent**, every row stays addressable by that id.

---

## 4. Promotion to a full account (platform-provided — know how it behaves)

When the guest later signs up, the platform's `register()` **updates the same `users` row** (adds
`email` + `password`, switches `roles` to `['user']`), keeping `user.id`. So **all the data the guest
produced stays attached** — no migration, nothing to re-link. You do not implement this in `app/`; just
rely on it: the visitor's cart and messages are still theirs after they register.

---

## 5. Decision checklist (use this when adding any page)

1. **Is this page public or private?**
2. If **private** → which **roles** may see it? → set `roles: [...]` in `_meta.ts`.
3. If **public**, does it let a visitor produce data worth keeping (cart, chat, draft)?
   - **No** → plain public (`roles: []`).
   - **Yes** → set `requiresGuestRegistration: true` and mount the inline `/api/me` client guard from §2
     so an anonymous visitor becomes a guest and their work persists.

Where the pieces live: role vocabulary → `lib/roles.ts` (`ALL_ROLES`); identity reads → `lib/auth/get-session.ts`
(server) + `app/api/me/route.ts` (client); redirects → `lib/runtime-urls.ts`; server-only guard →
`lib/auth/require-admin.ts`.
