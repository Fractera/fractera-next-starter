# (finance) — money

**Roles:** `finance` (plus `admin` / `architect`, who see everything).

**The test:** the page shows or moves money — payouts, invoices, refunds, revenue reports.

**Why money gets its own group instead of sitting in `(staff)`.** Not because the screens look
different, but because the blast radius does: a wrong role here is a financial incident, not an
inconvenience. A separate group makes "who may see money" a question with one visible answer, and makes
an accidental widening of access impossible to commit quietly.

**Built here:** `accounting/products` — the catalogue seen from the money side.

**The path mirrors `(staff)/manage/products` on purpose:** `<section>/<entity>`. The entity is the same
one; what differs is the role that works with it, and that has to be visible in the URL before anybody
opens a file — `/manage/products` is walked by a manager, `/accounting/products` by an accountant. Two
groups may not both claim `/manage/products`: route groups do not appear in the URL, so the section
folder is what keeps them apart. The same products the staff layer
manages, but the only editable field is the price, and that limit is enforced by the server
(`api/project/default/products/[id]`, `FIELDS_BY_GROUP`), not by hiding inputs. A page that merely
hides a field is not a restriction: the route is visible in any developer tab.

The list is read through the same endpoint the staff page uses — reading is shared, writing is not.
The table, toolbar, pager and skeleton come from `(protectedLayer)/_components/products/`; this group
owns only its own composition and its own words.
