// Canonical content-block catalog — the single source of truth for every block
// kind a content page (news, blog, documentation, StandardContentPage) can use.
// Authoring a page = writing data with these blocks; rendering = the registry in
// ./registry.tsx maps each `kind` to a renderer. Adding a new section type to the
// catalog = add a member here + a renderer in the registry, nothing else.
//
// Inline markup inside text fields supports **bold** and [label](url) (see
// ./inline.tsx). This file intentionally has NO imports so the catalog stays a
// leaf of the import graph: lib/blog/types.ts re-exports `Block` as `BlogBlock`,
// keeping every existing import path working unchanged.

// ── Leaf blocks (15) ─────────────────────────────────────────────────────────
export type LeafBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'quote'; text: string; cite?: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'olist'; items: string[] }
  | { kind: 'figure'; media: 'image' | 'video'; src: string; alt: string; caption?: string; href?: string }
  | { kind: 'code'; text: string }
  | { kind: 'cta'; text: string; href: string; label: string }
  | { kind: 'note'; text: string }
  // Founder pull-quote in the homepage testimonial design (gradient-violet text +
  // author photo/name/role + social links). Author defaults to the site founder.
  | { kind: 'founder'; text: string }
  // Reference card to a full raw document with a download button (e.g. a living
  // pipeline standard shipped under /public/docs). title + one-line summary + file.
  // Optional `label` overrides the default download-button text (e.g. "Download PDF"
  // for a .pdf instead of the default "Download .md"); optional `kicker` overrides
  // the eyebrow above the title (default "Full documentation").
  | { kind: 'docref'; title: string; summary: string; href: string; label?: string; kicker?: string }
  // "Did you know" callout — icon + tinted panel for an aside fact (e.g. the page
  // auto-updates in real time as an AI agent edits it). title is the lead-in.
  | { kind: 'callout'; title: string; text: string }
  // Comparison table — static, no-JS. `headers` is the column row (first column is
  // the row label); `rows` are the body rows (each a cell array matching headers).
  // The LAST column is visually emphasized as the "ours/highlight" column. Cells
  // support inline markup (**bold** + links). Optional `caption` above the table.
  | { kind: 'table'; headers: string[]; rows: string[][]; caption?: string }
  // 🪦 REMOVED ON THE WAY IN (2026-08-11): block kind `inquiry`. It rendered the
  // platform's own consultation CTA — a client button that opened an inquiry
  // drawer and posted to an endpoint that exists only on the marketing site. A
  // starter has nothing to inquire about, and neither shipped post used it.
  // Need a call to action? `cta` is the plain, portable one.

// ── Container blocks (composite layouts) ─────────────────────────────────────
// Containers hold `children: Block[]` and are rendered recursively through the
// same registry, so ANY block (including another container) can be nested inside
// ANY layout. This is the extensibility headroom: a two-column section is just a
// `columns` container; future layouts (grid, callout-with-figure, …) are new
// container kinds — no change to existing blocks or pages.
export type ContainerBlock =
  // Responsive multi-column layout: stacks on mobile, `cols` columns from md up.
  | { kind: 'columns'; children: Block[]; cols?: 2 | 3 }
  // Plain vertical grouping (semantic wrapper / a single column's contents).
  | { kind: 'group'; children: Block[] }

export type Block = LeafBlock | ContainerBlock

export type FaqPair = { q: string; a: string }
