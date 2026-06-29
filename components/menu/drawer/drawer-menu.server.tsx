import { getMenuGroups } from "@/lib/menu/group-menus";
import { DrawerPanel } from "@/components/menu/drawer/drawer-panel.client";

// Always-present LEFT/RIGHT drawer menu (step 160, sub-step 3). Like the other menus it
// renders NOTHING until a group enables this side's slot. Server component: scans the
// manifests at build (SSG-safe) and hands the resolved groups to the client Sheet panel.
const TITLE: Record<string, string> = { en: "Menu", es: "Menú", ru: "Меню" };

export function DrawerMenu({ side, lang }: { side: "left" | "right"; lang: string }) {
  const groups = getMenuGroups(side, lang);
  if (groups.length === 0) return null;
  return <DrawerPanel side={side} lang={lang} groups={groups} title={TITLE[lang] ?? TITLE.en} />;
}
