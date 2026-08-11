# (staff) — working on somebody else's data, on duty

**Roles:** `manager`, `senior_manager`, `support_manager`, `delivery_manager`, `content_editor`.

**The test:** the page shows data belonging to **other people**, and the visitor may act on it because
of their job — process an order, answer a ticket, plan a delivery, edit content.

That is the whole difference from `(account)`: same kind of screen, opposite subject. Mixing them is the
most expensive mistake in this layer, because a query written for "my rows" that lands on a staff page
quietly shows one operator's view of everyone, or one customer the operator's view of them.

**A separate "team" group would be this one under another name.** It was considered and folded in: two
doors into the same rooms drift apart, and the second one is always the one that forgets a check.

**Empty for now** — no page has been built here yet.
