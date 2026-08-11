# (admin) — the project itself

**Roles:** `admin`, `architect`.

**The test:** the page administers the PROJECT rather than serving its business — accounts and their
roles, configuration, deployment history, diagnostics.

**Where the boundary with the control panel runs.** Anything that belongs to the platform — settings
storage, the data layer, authorization, deployment — lives in the control panel on `:3002`, outside this
repository and outside the customer's git. What belongs here is administration of THIS application:
screens whose data is the project's own. When a request sounds like "add a setting to the panel", say
which layer it belongs to instead of building a second panel here.

**Built here:** `administration/products` — the catalogue with exactly one action available: delete.

**Why deletion lives here and nowhere else** (owner's decision, 2026-08-11). Editing has an undo;
deletion does not. Splitting the two across roles means an irreversible action needs a second person,
not a second click. So the staff layer lost its delete icon and this layer gained it — and this layer
can edit nothing at all: `FIELDS_BY_GROUP` in `api/project/default/products/[id]` gives `admin` an
empty field set, so a PATCH from here is refused whatever it carries.

**The `admin` role was removed from the other groups' role lists** to make that true. While it sat in
`staff` and `finance`, an administrator inherited their capabilities by union and could edit everything;
the "restriction" would have existed only in the fact that nobody drew the button. `architect` still
belongs to every group — the owner of a deployment is never locked out of their own application.

The rows here are deliberately **not links**: the product card belongs to the staff layer, and a link
into a refusal is a promise the interface cannot keep.

**Still planned:** the project-users page.
