import type { RouteMeta } from "@/lib/architecture/route-meta"

// STANDARD ROUTE DESCRIPTOR — do not delete any field. Public root page (no [lang]):
// the LICENSE text is one legal document. Static (file read at build).
const meta: RouteMeta = {
  kind: "page",
  path: "/license",
  filePath: "app/license/page.tsx",
  status: "live",
  todo: [],

  visibility: "public",
  roles: [],
  unauthorizedRedirect: undefined,
  enforcedBy: undefined,

  isDynamicRoute: false,
  segmentParams: [],
  pathParams: [],
  dynamicParams: undefined,
  prerenderedParams: undefined,
  routeGroup: undefined,
  parallelSlot: undefined,
  parentLayout: "app/layout.tsx",

  rendering: "static",
  revalidate: undefined,
  runtime: "nodejs",
  maxDuration: undefined,
  preferredRegion: undefined,
  cache: undefined,
  fetchCache: undefined,
  revalidateTags: [],

  seo: {
    supportsSeo: true,
    indexable: true,
    inSitemap: false,
    canonical: null,
    title: "License",
    metaDescription: undefined,
    openGraph: false,
    ogImage: null,
    jsonLd: [],
    robots: undefined,
  },

  i18n: { localized: false, locales: [], defaultLocale: undefined },

  queryParams: [],

  entryComponent: "_components/index.tsx",
  pageIsClient: false,
  entryIsClient: false,
  localComponents: [],
  sharedComponents: [],

  hasLoading: false,
  hasError: false,
  hasNotFound: false,
  hasLayout: false,

  methods: [],

  description: "Public license page — renders the project's root LICENSE file. Linked from the home footer.",
  dataDependencies: ["LICENSE (repo root, read at build)"],
  relatedRoutes: ["/[lang]"],
  notes: "Root path (no language prefix); registered in proxy.ts.",

  owner: undefined,
  createdBy: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}

export default meta
