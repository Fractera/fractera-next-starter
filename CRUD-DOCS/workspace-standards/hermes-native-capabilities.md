# Нативные способности Hermes — что НЕ надо строить с нуля

> **Это «окно кодера в Hermes».** Прежде чем строить любой инструмент/мост/навык под способность,
> сверься с этим каталогом: **Hermes (оркестратор) уже несёт ~70 нативных инструментов** + **Nous Tool
> Gateway** (одна подписка на web/browser/image/TTS). Кодинг-агент часто НЕ знает арсенал Hermes и
> переизобретает то, что уже есть. Если способность совпадает с нативной — **НЕ строй с нуля**: включи
> нативное в конфиге ИЛИ верни задачу Hermes через appeal-шаг (см. `<law id="prefer-hermes-native">` в
> корневой инструкции). Живёт в `CRUD-DOCS/workspace-standards/`, едет к клиенту с клоном.

> **Полные официальные доки Hermes лежат в репозитории разработки** —
> `ai-workspace/docs/HERMES/hermes-agent-main/website/docs/`: `reference/tools-reference.md` (полный список
> инструментов по тулсетам), `user-guide/features/{web-search,browser,tool-gateway,tools,mcp}.md`. Этот
> каталог — краткая карта; за деталями и точным конфигом иди туда.

---

## Nous Tool Gateway — одна подписка = web + browser + image + TTS

Самый «в характере Fractera» путь (философия «только подписка, не россыпь API-ключей»). Платная фича
подписки Nous Portal: маршрутизирует вызовы инструментов Hermes через инфраструктуру Nous — не нужно
регистрироваться у Firecrawl/FAL/OpenAI/Browser Use по отдельности. Включает 🔍 web search & extract ·
🎨 image generation (9 моделей) · 🔊 TTS · 🌐 cloud browser automation. Per-tool флаг `use_gateway: true`
в `~/.hermes/config.yaml`; включается `hermes setup --portal` / `hermes model` / `hermes tools`. Bring-your-own-keys
в любой момент, per-tool. → `features/tool-gateway.md`.

---

## Нативные инструменты по областям (не строить своё под эти)

| Область | Нативные инструменты Hermes | Как включить |
|---|---|---|
| **Веб-поиск / извлечение** | `web_search`, `web_extract` (сам суммаризует длинные страницы дешёвой aux-моделью) | `web.backend` ∈ firecrawl/searxng/tavily/**exa**/parallel, или `use_gateway:true`. `searxng` = free self-hosted без ключа. → `features/web-search.md` |
| **Браузер** | `browser_navigate/click/type/snapshot/vision/scroll/press/back/console/get_images` (+CDP: `browser_cdp/dialog`) — стелс, CAPTCHA, изоляция сессий, vision | Tool Gateway (Browser Use) или свой CDP/Browserbase. → `features/browser.md` |
| **Изображения** | `image_generate` (9 моделей: FLUX 2, GPT Image, Ideogram, Qwen…) | `image_gen.use_gateway:true` |
| **Голос (TTS)** | `text_to_speech` (голоса OpenAI) | `tts.use_gateway:true` или свой ключ |
| **Память** | `memory`, `session_search` (поиск по прошлым сессиям) | нативно |
| **Расписание** | `cronjob` (create/list/update/pause/resume/run/remove; skill-backed jobs) | нативно |
| **Делегирование** | `delegate_task` (суб-агенты в изолированных контекстах) | нативно |
| **Код / вычисления** | `execute_code` (Python, вызывает инструменты Hermes программно), `computer_use` | нативно |
| **Навыки** | `skills_list`, `skill_view`, `skill_manage` (процедурная память, самосоздаётся) | нативно |
| **Анализ** | `vision_analyze`, `video_analyze`, `mixture_of_agents` | нативно |
| **Прочее** | `clarify`, `todo`, `send_message`, `process` | нативно |

Плюс инструменты MCP-серверов (префикс `mcp_<server>_`) — Hermes грузит их динамически (`features/mcp.md`).

---

## Правило применения (коротко)

1. Собираешься строить способность → найди её область выше.
2. **Совпало с нативной** → НЕ строй с нуля. Либо включи нативное (конфиг Hermes), либо материализуй
   appeal-шаг оркестратору (`plan.kind="native-capability-appeal"`) — «у Hermes это ЕСТЬ, переформулируй ТЗ
   через нативное». Механика — `<law id="prefer-hermes-native">` в корневой инструкции.
3. **Не совпало** (реально новая способность, специфичная слоту) → строй по обычному регламенту
   ([`authoring-skills-instructions-mcp.md`](./authoring-skills-instructions-mcp.md)), самодостаточно ×6.
4. **Проект без Hermes** (напр. только Codex): нативного арсенала Hermes нет — используй собственные
   инструменты агента; каталог всё равно уберегает от лишнего изобретения там, где у самого агента уже есть.
