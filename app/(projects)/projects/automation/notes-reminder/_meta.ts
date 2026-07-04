import type { RouteMeta } from "@/lib/architecture/route-meta"

const meta: RouteMeta = {
  kind: "page",
  path: "/projects/automation/notes-reminder",
  filePath: "app/app/(projects)/projects/automation/notes-reminder/page.tsx",
  status: "live",
  todo: [],

  visibility: "private",
  roles: ["architect", "manager"],
  unauthorizedRedirect: "auth-service /register?requireRole=architect",
  enforcedBy: "component",

  isDynamicRoute: false,
  segmentParams: [],
  pathParams: [],
  dynamicParams: undefined,
  prerenderedParams: undefined,
  routeGroup: "(projects)",
  parallelSlot: undefined,
  parentLayout: "app/app/(projects)/layout.tsx",

  rendering: "dynamic",
  revalidate: undefined,
  runtime: "nodejs",
  maxDuration: undefined,
  preferredRegion: undefined,
  cache: undefined,
  fetchCache: undefined,
  revalidateTags: [],

  seo: {
    supportsSeo: false, indexable: false, inSitemap: false, canonical: null,
    title: undefined, metaDescription: undefined, openGraph: false, ogImage: null,
    jsonLd: [], robots: "noindex, nofollow",
  },

  i18n: { localized: false, locales: [], defaultLocale: undefined },

  queryParams: [],

  entryComponent: "_components/index.tsx",
  pageIsClient: false,
  entryIsClient: false,
  localComponents: [
    "index",
    "process-flow.client",
    "process-queue-table.server",
    "results-table.server",
  ],
  sharedComponents: [],

  hasLoading: false,
  hasError: false,
  hasNotFound: false,
  hasLayout: false,

  methods: [],

  description: "Automatic daily collection of pending notes from the notes table.",
  dataDependencies: [
    "_data/description.ts + _data/flow.ts (declarative page data)",
    "_lib/project-data.ts (cron queue + results — substrate tables)",
  ],
  relatedRoutes: ["/projects/automation"],
  notes:
    "Projects-layer route: monolingual (site default language, outside [lang]); " +
    "access architect+manager inherited from the zone layout. Runs daily at 09:00 UTC.",

  owner: undefined,
  createdBy: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}

export default meta
