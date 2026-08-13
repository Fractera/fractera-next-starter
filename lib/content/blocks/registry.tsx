import type { ReactNode } from 'react'
import type { Block } from './types'
import type { PostBodyUi } from '@/lib/content/post-body-ui'
import { inline, headingId } from './inline'
import { author, authorSocialLinks } from '@/lib/author'
import { StaticImage } from '@/components/media/static-image.server'
import { StoredImage } from '@/components/media/stored-image.server'
import { isMediaRef, mediaRefName } from '@/lib/media/by-name'

// PORTED (2026-08-11). One block kind was dropped on the way in: `inquiry`,
// which rendered the platform's own "company brain" call to action. A starter
// has nothing to inquire about, and neither shipped post used it.

// ─────────────────────────────────────────────────────────────────────────────
// Block registry — the catalog renderer. One entry per block `kind`; PostBody is
// just a thin dispatcher over this map (see post-body.tsx). Renderers are lifted
// 1:1 from the former PostBody switch, so output is byte-identical for blog/news/
// documentation. Container blocks recurse through `ctx.renderBlocks`, so any block
// nests inside any layout. Add a section type = add a `kind` in ./types + one
// entry here.
// ─────────────────────────────────────────────────────────────────────────────

export type BlockRenderCtx = {
  lang: string
  ui: PostBodyUi
  /** React key for this block's root element (also used as the inline key-prefix). */
  key: string
  /** Recursively render child blocks (used by container blocks). */
  renderBlocks: (blocks: Block[], lang: string, ui: PostBodyUi, keyPrefix?: string) => ReactNode[]
}

type BlockOf<K extends Block['kind']> = Extract<Block, { kind: K }>
type BlockRenderers = {
  [K in Block['kind']]: (block: BlockOf<K>, ctx: BlockRenderCtx) => ReactNode
}

const COLS_CLASS: Record<2 | 3, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
}

export const BLOCK_RENDERERS: BlockRenderers = {
  h2: (b, { key: k }) => (
    <h2 key={k} id={headingId(b.text)} className="mt-6 scroll-mt-24 text-2xl font-bold tracking-tight text-foreground md:text-xl">
      {inline(b.text, k)}
    </h2>
  ),
  h3: (b, { key: k }) => (
    <h3 key={k} id={headingId(b.text)} className="mt-4 scroll-mt-24 text-lg font-semibold text-foreground">
      {inline(b.text, k)}
    </h3>
  ),
  p: (b, { key: k }) => (
    <p key={k} className="text-[17px] leading-8 text-muted-foreground md:text-base">
      {inline(b.text, k)}
    </p>
  ),
  quote: (b, { key: k }) => (
    <figure key={k} className="my-2 border-l-2 border-primary/60 bg-primary/[0.05] py-4 pl-6 pr-4">
      <blockquote className="text-xl font-medium leading-relaxed text-foreground md:text-lg">
        “{inline(b.text, k)}”
      </blockquote>
      {b.cite && (
        <figcaption className="mt-3 text-sm font-medium text-primary">{b.cite}</figcaption>
      )}
    </figure>
  ),
  list: (b, { key: k }) => (
    <ul key={k} className="flex list-disc flex-col gap-3 pl-6 text-[17px] leading-8 text-muted-foreground marker:text-primary md:text-base">
      {b.items.map((it, j) => <li key={`${k}-${j}`}>{inline(it, `${k}-${j}`)}</li>)}
    </ul>
  ),
  olist: (b, { key: k }) => (
    <ol key={k} className="flex list-decimal flex-col gap-3 pl-6 text-[17px] leading-8 text-muted-foreground marker:font-semibold marker:text-primary md:text-base">
      {b.items.map((it, j) => <li key={`${k}-${j}`} className="pl-1">{inline(it, `${k}-${j}`)}</li>)}
    </ol>
  ),
  figure: (b, { key: k }) => (
    <figure key={k} className="my-4 flex flex-col gap-3">
      {/* Иллюстрации внутри материала лежат ниже сгиба почти всегда: ленивая
          загрузка по умолчанию, размытая копия вместо пустого места. Размеры
          берутся из карты превью, поэтому текст под картинкой не подпрыгивает,
          когда она приходит. */}
      {/* 🔒 ССЫЛКА НЕ ОТМЕНЯЕТ РАЗБОР `media:` (найдено на живом сайте 2026-08-13).
          Сначала ветка со ссылкой стояла первой и рисовала картинку сама — а
          иллюстрация нашей же статьи как раз со ссылкой, и в HTML уехало
          `<img src="media:development-loop.jpg">` дословно. Ветвление по НАЛИЧИЮ
          ССЫЛКИ не имеет права решать, ОТКУДА берётся картинка: это два разных
          вопроса, и смешение их даёт дефект, который виден только на том блоке,
          где сошлись оба условия. */}
      {b.href ? (
        <a href={b.href} className="block overflow-hidden rounded-2xl border border-border">
          {isMediaRef(b.src) ? (
            <StoredImage name={mediaRefName(b.src)} alt={b.alt} sizes="(max-width: 768px) 100vw, 48rem" className="w-full h-auto" />
          ) : (
            <StaticImage src={b.src} alt={b.alt} sizes="(max-width: 768px) 100vw, 48rem" className="w-full h-auto" />
          )}
        </a>
      ) : isMediaRef(b.src) ? (
        /* 🔒 ДВА ПУТИ, И ОБА ЗДЕСЬ НАМЕРЕННО (владелец 2026-08-13).
           `media:<файл>` — картинка из ХРАНИЛИЩА: её меняет владелец в панели, и
           материал при этом не трогают вовсе. Обычный путь — файл проекта, он
           правится вместе с текстом. Материал выбирает вид ссылки, а не способ
           показа: на экране оба дают одно и то же — размеры, подложку,
           оптимизацию. Именно эту развилку и обязан повторить агент, читающий
           наш пример. */
        <StoredImage
          name={mediaRefName(b.src)}
          alt={b.alt}
          sizes="(max-width: 768px) 100vw, 48rem"
          className="w-full h-auto rounded-2xl border border-border"
        />
      ) : (
        <StaticImage
          src={b.src}
          alt={b.alt}
          sizes="(max-width: 768px) 100vw, 48rem"
          className="w-full h-auto rounded-2xl border border-border"
        />
      )}
      {b.caption && (
        <figcaption className="text-center text-sm text-muted-foreground">{inline(b.caption, `${k}-cap`)}</figcaption>
      )}
    </figure>
  ),
  cta: (b, { key: k }) => (
    <div key={k} className="my-4 flex flex-col gap-4 rounded-2xl border border-primary/30 bg-primary/[0.06] p-6">
      <p className="text-base font-medium text-foreground">{inline(b.text, k)}</p>
      <a
        href={b.href}
        // 🔒 ТЕКСТ НА ЗАЛИВКЕ — `text-primary-foreground`, А НЕ `text-foreground`
        // (2026-08-12). Здесь стояло `text-foreground`: цвет обычного текста
        // СТРАНИЦЫ, то есть тёмный на светлой теме. На тёмной заливке кнопки он
        // сливался с ней. Переменные ходят парой — фон `primary` и текст на нём
        // `primary-foreground`, — и это единственный способ остаться читаемым в
        // обеих темах. Значок наследует цвет текста (`currentColor`), поэтому
        // чинится вместе с надписью.
        className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
      >
        {b.label}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </a>
    </div>
  ),
  code: (b, { key: k }) => (
    <pre
      key={k}
      className="overflow-x-auto rounded-2xl border border-border bg-muted/40 p-5 text-[12.5px] leading-snug text-foreground"
    >
      <code className="whitespace-pre font-mono">{b.text}</code>
    </pre>
  ),
  note: (b, { key: k }) => (
    // Было `text-foreground/35` — примечание почти сливалось с фоном и не
    // проходило порог контраста (проверка доступности 2026-08-13). Примечание не
    // обязано кричать, но обязано читаться: `muted-foreground` для того и есть.
    <p key={k} className="mt-2 border-t border-border pt-6 text-sm italic leading-relaxed text-muted-foreground">
      {inline(b.text, k)}
    </p>
  ),
  founder: (b, { key: k }) => (
    <figure key={k} className="my-6 flex flex-col items-center rounded-2xl border border-border bg-muted/40 px-6 py-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/blockquote-violet.svg" alt="" aria-hidden width={56} height={56} className="mb-6 h-14 w-14" />
      <blockquote className="max-w-[640px] text-center">
        <p
          className="bg-clip-text text-center text-[22px] font-medium leading-snug tracking-tight text-transparent md:text-xl"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(167,139,250,0.35) 0%, rgba(167,139,250,0.95) 25%, #a78bfa 50%, rgba(167,139,250,0.95) 75%, rgba(167,139,250,0.35) 100%)',
          }}
        >
          {inline(b.text, k)}
        </p>
      </blockquote>
      {/* Byline — name, photo and job title all come from the control panel
          (App settings → Author). A project whose owner has not filled that in
          shows the quote WITHOUT attribution: no name is honest, a borrowed one
          is not. Each part degrades on its own — no photo still gives a name. */}
      <figcaption className="mt-7 flex flex-col items-center gap-4">
        {author().name && (
          <div className="flex items-center">
            {author().photo && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={author().photo!} alt={`${author().name} photo`} width={32} height={32} className="mr-2.5 rounded-full" />
            )}
            <span className="text-base font-light tracking-tight text-gray-400">
              <a href={author().url} rel="author me" className="hover:text-foreground">{author().name}</a>
              {author().role && (
                <cite className="ml-1.5 not-italic text-gray-500 before:mr-1.5 before:inline-flex before:h-px before:w-4 before:bg-gray-500 before:align-middle">
                  {author().role}
                </cite>
              )}
            </span>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          {authorSocialLinks().map(s => (
            <a key={s.href} href={s.href} target="_blank" rel="me author noopener noreferrer" className="hover:text-primary">
              {s.label}
            </a>
          ))}
        </div>
      </figcaption>
    </figure>
  ),
  callout: (b, { key: k }) => (
    <aside key={k} className="my-6 flex gap-4 rounded-2xl border border-sky-400/30 bg-sky-400/[0.06] p-5">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-sky-300" aria-hidden>
        <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
      </svg>
      <p className="text-[15px] leading-relaxed text-muted-foreground">
        <span className="font-semibold text-sky-200">{b.title} </span>
        {inline(b.text, k)}
      </p>
    </aside>
  ),
  table: (b, { key: k }) => {
    const lastCol = b.headers.length - 1
    return (
      <figure key={k} className="my-6 overflow-x-auto rounded-2xl border border-border">
        {b.caption && (
          <figcaption className="border-b border-border bg-muted/40 px-5 py-3 text-sm font-semibold text-muted-foreground">
            {inline(b.caption, `${k}-cap`)}
          </figcaption>
        )}
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {b.headers.map((h, ci) => (
                <th
                  key={ci}
                  scope="col"
                  className={`px-4 py-3 align-bottom font-semibold ${ci === lastCol ? 'bg-primary/10 text-foreground' : 'text-foreground'}`}
                >
                  {inline(h, `${k}-h${ci}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {b.rows.map((row, ri) => (
              <tr key={ri} className="border-b border-border last:border-0">
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`px-4 py-3 align-top leading-relaxed ${
                      ci === 0
                        ? 'font-medium text-foreground'
                        : ci === lastCol
                          ? 'bg-primary/5 text-foreground'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {inline(cell, `${k}-r${ri}c${ci}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    )
  },
  docref: (b, { key: k, ui }) => (
    <aside key={k} className="my-6 flex flex-col gap-4 rounded-2xl border border-primary/30 bg-primary/[0.05] p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          {b.kicker ?? ui.fullDocumentation}
        </p>
        <p className="text-base font-semibold text-foreground">{b.title}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{inline(b.summary, k)}</p>
      </div>
      <a
        href={b.href}
        download
        className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-foreground hover:bg-primary"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" /></svg>
        {b.label ?? ui.downloadMd}
      </a>
    </aside>
  ),

  // ── Container blocks (recursive) ───────────────────────────────────────────
  columns: (b, ctx) => (
    <div key={ctx.key} className={`my-4 grid gap-6 ${COLS_CLASS[b.cols ?? 2]}`}>
      {ctx.renderBlocks(b.children, ctx.lang, ctx.ui, ctx.key)}
    </div>
  ),
  group: (b, ctx) => (
    <div key={ctx.key} className="flex flex-col gap-6">
      {ctx.renderBlocks(b.children, ctx.lang, ctx.ui, ctx.key)}
    </div>
  ),
}

// Dispatch a single block to its registered renderer.
export function renderBlock(block: Block, ctx: BlockRenderCtx): ReactNode {
  const render = BLOCK_RENDERERS[block.kind] as (b: Block, c: BlockRenderCtx) => ReactNode
  return render(block, ctx)
}

// Render an ordered list of blocks. `keyPrefix` keeps keys unique across nesting
// levels (top level uses `blk`, matching the previous PostBody key scheme).
export function renderBlocks(
  blocks: Block[],
  lang: string,
  ui: PostBodyUi,
  keyPrefix = 'blk',
): ReactNode[] {
  return blocks.map((b, i) =>
    renderBlock(b, { lang, ui, key: `${keyPrefix}-${i}`, renderBlocks }),
  )
}
