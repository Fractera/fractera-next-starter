"use client";

import { useDrawer } from "@/providers/drawer-provider.client";

// Header icon that opens/closes a side drawer (step 160). Rendered ONLY when that side's
// menu has at least one group. The icon flips to its opposite when the drawer is open —
// four distinct states: open-left / close-left / open-right / close-right.
function Icon({ side, open }: { side: "left" | "right"; open: boolean }) {
  // Panel rect + the section bar on this side + a chevron pointing in the action's direction.
  const bar = side === "left" ? <line x1="9" y1="4" x2="9" y2="20" /> : <line x1="15" y1="4" x2="15" y2="20" />;
  // left-closed → open to the right (→); left-open → close to the left (←); right mirrors.
  const pointsRight = side === "left" ? !open : open;
  const chevron = pointsRight ? <path d="M12.5 9.5l2.5 2.5-2.5 2.5" /> : <path d="M11.5 9.5l-2.5 2.5 2.5 2.5" />;
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      {bar}
      {chevron}
    </svg>
  );
}

export function DrawerToggle({ side, labels }: { side: "left" | "right"; labels: { open: string; close: string } }) {
  const { leftOpen, rightOpen, toggle } = useDrawer();
  const open = side === "left" ? leftOpen : rightOpen;
  return (
    <button
      type="button"
      onClick={() => toggle(side)}
      aria-label={open ? labels.close : labels.open}
      aria-expanded={open}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent transition-colors shrink-0"
    >
      <Icon side={side} open={open} />
    </button>
  );
}
