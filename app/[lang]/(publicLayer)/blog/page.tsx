// Thin router page for /blog — renders the index entry from _components and
// nothing else. The post list is auto-discovered (see _components/index.tsx +
// parser-fs). Standard route shape: page.tsx thin + _components + the generated
// list (router canon — no _data folder).
import Index, { generateMetadata } from './_components'

export { generateMetadata }
export default Index
