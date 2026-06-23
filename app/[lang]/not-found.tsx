import { NotFoundContent } from "@/components/not-found-content";

// 404 for the localized surface (step 131). proxy.ts rewrites every unmatched path
// under /<lang>/, so this is where real 404 traffic lands — it renders inside the
// [lang] layout (which owns <html lang>). Restores a branded 404 after the root
// layout was made bare.
export default function LangNotFound() {
  return <NotFoundContent />;
}
