import { meta } from './meta'
import { en } from './en'
import { ru } from './ru'
import type { FooterPageData } from '../../_lib/page'

export const data: FooterPageData = { meta, en, overrides: { ru } }
