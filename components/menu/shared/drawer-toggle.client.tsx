"use client";

import { PanelLeftOpen, PanelLeftClose, PanelRightOpen, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDrawer } from "@/providers/drawer-provider.client";

// Header icon that opens/closes a side drawer (step 160). Rendered ONLY when that side's
// menu has a group. UI standard: shadcn Button + lucide icons (no inline SVG). Four
// distinct lucide icons name the four states: PanelLeftOpen/Close, PanelRightOpen/Close.
export function DrawerToggle({ side, labels }: { side: "left" | "right"; labels: { open: string; close: string } }) {
  const { leftOpen, rightOpen, toggle } = useDrawer();
  const open = side === "left" ? leftOpen : rightOpen;
  const Icon = side === "left" ? (open ? PanelLeftClose : PanelLeftOpen) : open ? PanelRightClose : PanelRightOpen;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => toggle(side)}
      aria-label={open ? labels.close : labels.open}
      aria-expanded={open}
    >
      <Icon />
    </Button>
  );
}
