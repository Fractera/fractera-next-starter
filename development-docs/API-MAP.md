# API map

> **Собирается командой `npm run build:api-map` — не правьте руками.** Имена живут в самих маршрутах
> первой строкой (`// @api …`), потому что рядом с кодом они не расходятся с ним. Написанное здесь
> вручную исчезнет при следующей сборке.

Имя маршрута — то, чем его находят: 6–12 слов, глагол первым. Правило проверяется `npm run check:api`,
который стоит в `prebuild` — маршрут без имени роняет сборку.

Всего маршрутов: **15**

| Адрес | Методы | Что делает | Продукт |
|---|---|---|---|
| `/api/catalogue` | GET | load more public catalogue rows for the storefront page | — |
| `/api/config-image/[slot]` | GET | serve a settings image slot at one stable address | — |
| `/api/health` | GET | answer whether this application process is alive right now | — |
| `/api/i18n/translate` | POST | translate one record's fields without exposing the model key | — |
| `/api/me` | GET | tell the browser who is signed in and with which roles | — |
| `/api/media-proxy/[...path]` | GET | proxy media files the browser cannot reach directly | — |
| `/api/media/[id]/file` | GET | stream one stored media file to the visitor | — |
| `/api/media/icons/[setId]/file/[name]` | GET | stream one generated application icon from its set | — |
| `/api/media/upload` | POST | upload a file into the platform media store | — |
| `/api/openai-models` | GET | list the live model names this key can actually use | — |
| `/api/project-types/[lang]/[id]` | GET | describe one project direction for the home page window | — |
| `/api/project/default/products` | GET, POST | list and create catalogue products behind a role check | — |
| `/api/project/default/products/[id]` | GET, PATCH, DELETE | read update or delete one catalogue product by id | — |
| `/api/revalidate` | POST | rebuild public pages after the owner changes app settings | — |
| `/api/transcribe` | POST | turn a recorded voice fragment into written text | — |

## Как этим пользоваться

- **Ищете, куда писать данные?** Читайте столбец «что делает», а не имена папок: адрес говорит, где
  маршрут лежит, имя — что он делает, и это разные вопросы.
- **Заводите свой маршрут?** Первой строкой файла — `// @api <6–12 слов>`, затем `npm run build:api-map`.
- **Адрес не переименовывают ради красоты.** URL — публичный контракт: он в браузере, в журналах и в
  чужих интеграциях. Меняется имя в заголовке, оно ничего не ломает.
