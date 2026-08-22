# (staff) — working on somebody else's data, on duty

**Roles:** `manager`, `senior_manager`, `support_manager`, `delivery_manager`, `content_editor`.

**The test:** the page shows data belonging to **other people**, and the visitor may act on it because
of their job — process an order, answer a ticket, plan a delivery, edit content.

That is the whole difference from `(account)`: same kind of screen, opposite subject. Mixing them is the
most expensive mistake in this layer, because a query written for "my rows" that lands on a staff page
quietly shows one operator's view of everyone, or one customer the operator's view of them.

**A separate "team" group would be this one under another name.** It was considered and folded in: two
doors into the same rooms drift apart, and the second one is always the one that forgets a check.

**Lives here today:** `products` — catalogue management: create products, list and delete them,
upload images.

**Why it is here and not in `(account)`.** The page was called `dashboard` and sat in the visitor's own
space. Both were wrong, and the code says why: `GET /api/project/default/products` returns EVERY row with
no owner filter, while `POST` stamps `created_by`. A page that shows everyone's rows is a duty station,
not a personal space. If the product decision changes to "each seller manages their own products", the
move back is real work, not a rename: the GET must filter by the session first.
