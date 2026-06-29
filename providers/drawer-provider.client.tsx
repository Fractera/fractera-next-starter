"use client";

import { createContext, useContext, useState, useCallback } from "react";

// Shared open/close state for the left & right drawer menus (step 160). The header
// toggle icons set it now; the drawer panels (sub-step 3) read the same state, so one
// source of truth drives both. JS-only by nature (a drawer needs JS) — without JS the
// toggle simply does nothing and the group pages stay reachable via their links.
type Side = "left" | "right";
type DrawerCtx = {
  leftOpen: boolean;
  rightOpen: boolean;
  toggle: (side: Side) => void;
  close: (side: Side) => void;
};

const Ctx = createContext<DrawerCtx | null>(null);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const toggle = useCallback((side: Side) => {
    if (side === "left") setLeftOpen((v) => !v);
    else setRightOpen((v) => !v);
  }, []);
  const close = useCallback((side: Side) => {
    if (side === "left") setLeftOpen(false);
    else setRightOpen(false);
  }, []);
  return <Ctx.Provider value={{ leftOpen, rightOpen, toggle, close }}>{children}</Ctx.Provider>;
}

export function useDrawer(): DrawerCtx {
  const c = useContext(Ctx);
  // Safe fallback so a toggle rendered outside the provider never throws (e.g. SSR edge).
  return c ?? { leftOpen: false, rightOpen: false, toggle: () => {}, close: () => {} };
}
