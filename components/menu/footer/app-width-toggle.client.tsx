"use client";

import { useEffect, useState } from "react";
import { UnfoldHorizontal, FoldHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

// Content-width toggle for the public showcase (footer), ported from the Projects zone
// (:3003). Sets html[data-app-width="wide"]; the single CSS var --app-w (globals.css)
// then widens every [data-app-column] container — the page content AND the footer — at
// once. Normal = centered 64rem; wide = full screen width (32px bridge each side). The
// choice is persisted (localStorage) and raised before paint (app-width-init.tsx).
// Hidden on mobile (hidden md:inline-flex): there the layout is single-column full-width,
// nothing to toggle. UI standard: shadcn Button + lucide.
const STORAGE_KEY = "fractera-app-width";

export function AppWidthToggle({ labels }: { labels: { wide: string; normal: string } }) {
  const [wide, setWide] = useState(false);

  // Read the actual state the inline script set on <html> — one source of truth.
  useEffect(() => {
    setWide(document.documentElement.getAttribute("data-app-width") === "wide");
  }, []);

  function toggle() {
    const next = !wide;
    const el = document.documentElement;
    if (next) el.setAttribute("data-app-width", "wide");
    else el.removeAttribute("data-app-width");
    try {
      localStorage.setItem(STORAGE_KEY, next ? "wide" : "normal");
    } catch {
      /* private browsing — toggling still works, it just won't be remembered */
    }
    setWide(next);
  }

  const label = wide ? labels.normal : labels.wide;
  const Icon = wide ? FoldHorizontal : UnfoldHorizontal;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={wide}
      className="hidden md:inline-flex"
    >
      <Icon />
    </Button>
  );
}
