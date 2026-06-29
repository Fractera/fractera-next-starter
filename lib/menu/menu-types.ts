// The four menu types, named explicitly in ONE place (step 160). Every menu component,
// the scanner, and the manifest share these identifiers and display names — so each of
// the four menus has a clear, single declared identity instead of scattered string
// literals. Neutral module (no server-only): usable from client and server alike.

export type MenuSlot = "top" | "footer" | "left" | "right";

export const MENU_TYPES: Record<MenuSlot, { slot: MenuSlot; name: string }> = {
  top: { slot: "top", name: "Top menu" },
  footer: { slot: "footer", name: "Footer menu" },
  left: { slot: "left", name: "Left drawer menu" },
  right: { slot: "right", name: "Right drawer menu" },
};

export const MENU_SLOTS = Object.keys(MENU_TYPES) as MenuSlot[];
