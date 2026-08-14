import type { SectionRenderer } from '@/sections/contract'
import { inline } from '@/lib/content/blocks/inline'
import { StaticImage } from '@/components/media/static-image.server'
import { StoredImage } from '@/components/media/stored-image.server'
import { isMediaRef, mediaRefName } from '@/lib/media/by-name'

// Иллюстрация. Самый непростой рендерер набора: у него две развилки, и обе
// перенесены дословно вместе с объяснениями, потому что каждая оплачена
// дефектом.
export const figure: SectionRenderer<'figure'> = (b, { key: k }) => (
  <figure key={k} className="my-4 flex flex-col gap-3">
    {/* Иллюстрации внутри материала лежат ниже сгиба почти всегда: ленивая
        загрузка по умолчанию, размытая копия вместо пустого места. Размеры
        берутся из карты превью, поэтому текст под картинкой не подпрыгивает,
        когда она приходит. */}
    {/* 🔒 ССЫЛКА НЕ ОТМЕНЯЕТ РАЗБОР `media:` (найдено на живом сайте 2026-08-13).
        Сначала ветка со ссылкой стояла первой и рисовала картинку сама — а
        иллюстрация нашей же статьи как раз со ссылкой, и в HTML уехало
        `<img src="media:...">` дословно. Ветвление по НАЛИЧИЮ ССЫЛКИ не имеет
        права решать, ОТКУДА берётся картинка: это два разных вопроса, и
        смешение их даёт дефект, который виден только на том блоке, где сошлись
        оба условия. */}
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
)
