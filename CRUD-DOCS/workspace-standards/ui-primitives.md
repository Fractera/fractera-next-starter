# UI primitives — one interface, one style

> The product is assembled from a **single fixed primitive set**. This is what keeps the whole app — every
> menu, drawer, modal, dropdown, button and icon — visually and behaviourally consistent, and what lets any
> agent build UI that matches without re-deciding. Concise rule lives in `CLAUDE.md §4`; this is the mapping.

## The three pillars (non-negotiable)

| Concern | Use ONLY | Never |
|---|---|---|
| **Icons** | `lucide-react` | inline `<svg>`, emoji-as-icon, another icon pack |
| **Interactive UI** | shadcn/ui in `components/ui/*` | a raw `<button>`, a hand-built dropdown/modal/drawer |
| **Toasts / notifications** | **Sonner** — `toast()` from `sonner`, the `<Toaster/>` mounted in the root layout | `alert()`, a custom toast |

## shadcn component map (reach for these by name)

- Button → `Button` (`variant`: default/secondary/outline/ghost/destructive/link; `size`: default/sm/xs/icon).
  A link that looks like a button → `<Button asChild><Link …/></Button>`.
- Dropdown menu → `DropdownMenu` + `DropdownMenuTrigger`/`Content`/`Item`/`Separator`/`Label`/`Sub*`.
- Modal / dialog → `Dialog` (+ `DialogTrigger`/`Content`/`Header`/`Title`).
- Side drawer (left/right slide-in) → `Sheet` (+ `SheetTrigger`/`Content`/`Header`/`Title`).
- Also available: `Popover`, `Tooltip`, `Select`, `Checkbox`, `Collapsible`, `Command`, `Input`, `Textarea`,
  `Label`, `Card`, `Badge`, `Avatar`(if added), `ScrollArea`, `Separator`, `Skeleton`, `Spinner`, `HoverCard`.

If a needed primitive is missing from `components/ui/`, add it via the shadcn CLI / its canonical source —
do not hand-roll a one-off.

## Rules

1. **Icons are lucide components**, sized by the parent (shadcn Button auto-sizes `[&_svg]`). Pick the icon
   that *names the state* (e.g. `PanelLeftOpen`/`PanelLeftClose`, `Menu`/`X`, `ChevronDown`, `LogIn`/`LogOut`).
2. **Every clickable control is a shadcn `Button`** (or a shadcn trigger), not a styled `<div>`/`<button>`.
3. **Dropdowns/modals/drawers are the shadcn component**, not a `useState` + absolute `<div>` you wrote.
4. **Toasts go through Sonner.** One `<Toaster/>` is already mounted; just call `toast(...)`.
5. **Theme tokens, not hardcoded colors** — `text-foreground`, `bg-background`, `bg-popover`, `border-border`,
   `hover:bg-accent` (so light/dark both work). Never bake `text-white`/`bg-black` into a reusable component.
6. **Bring non-conforming code to this standard whenever you touch it** (boy-scout rule). New code conforms
   from the start.

## Already conforming (reference)

The menu shell (`components/menu/**`, step 160) is built to this standard: `DrawerToggle` and the mobile
hamburger use `Button` + lucide; group buttons use `Button` + `DropdownMenu` + `ChevronDown`; the auth control
uses `Button` + `LogIn`/`LogOut`; toasts are Sonner via the root `<Toaster/>`. Drawer panels (left/right) use
shadcn `Sheet`.
