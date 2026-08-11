# (account) — the visitor's own space

**Roles:** `user`, `buyer`, `vip_user`, `subscriber_lite`, `subscriber_standard`, `subscriber_max`.

**The test:** the page shows data that belongs to **the person looking at it**. Their orders, their
subscription, their uploads, their settings. Nobody else's row ever appears here.

This is the widest group and the one that scales without limit: a site with a million accounts has a
million versions of `/dashboard`. That is why routes here use a dynamic segment when they address one
item (`/[id]`), and never a folder per user — see `CONTENT-ENGINE.md` §2.

**Boundary case — the guest with an identity.** On a page that opts into guest registration, an
unregistered visitor is issued a permanent `user.id`: their work persists and attaches to the account
when they sign up. Such a page is user-scoped by shape and belongs here, but its gate is weaker —
let the subgroup's `layout.tsx` admit `guest` alongside `user`, and say so in the page's own comment. `guest` is not
"nobody": it is somebody without an account yet.

**Empty for now** — the catalogue lives in `(staff)`, because it is the business's data, not the
visitor's own. A page belongs here the day it shows a person THEIR rows: their orders, their
subscription, their uploads.
