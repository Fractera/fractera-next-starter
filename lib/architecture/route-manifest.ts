import type { RouteMeta } from "./route-meta"
import { GENERATED_ROUTE_META } from "./routes.generated"

// Route descriptors (`_meta.ts`) keyed by path — DERIVED from the real
// app/**/_meta.ts on disk by lib/architecture/parser-routes.mjs (gen:routes,
// regenerated on predev/prebuild). The /architecture detail panel renders the real
// RouteMeta from here. No hand edits: a newly created route's _meta.ts appears
// automatically, so the manifest never drifts from the code (it replaces the old
// hand-maintained import list — exactly the "later codegen can glob these" plan).
export const ROUTE_MANIFEST: Record<string, RouteMeta> = GENERATED_ROUTE_META

export function routeMetaFor(key: string | undefined | null): RouteMeta | null {
  if (!key) return null
  return ROUTE_MANIFEST[key] ?? null
}
