import { meta } from './meta'
import { en } from './en'
import { ru } from './ru'
import type { BlogData } from '../../_lib/post'

// Ячейки заведены по ВКЛЮЧЁННОМУ набору языков проекта
// (`NEXT_PUBLIC_SUPPORTED_LANGUAGES` = en,ru), а не по числу файлов у соседних
// постов: те приехали со стартером на десяти языках, и это их история, а не
// требование к новому материалу. Включит владелец язык — ячейка добавляется
// сюда, до тех пор `resolve.ts` отдаёт английский ключ за ключом.
export const data: BlogData = { meta, en, overrides: { ru } }
