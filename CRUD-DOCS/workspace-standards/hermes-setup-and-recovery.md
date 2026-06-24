# Hermes — установка, состав и восстановление (страховка непрерывности)

> **Зачем этот документ.** Hermes — «мозг» (Brain) воркспейса. Его можно случайно снести (или захотеть
> поставить заново на чистый сервер), и тогда всё знание о том, **из чего он состоит, как ставится и где
> подводные камни**, должно быть под рукой — не в чьей-то памяти. Этот документ + его загрузка в
> Company Memory (LightRAG) и есть та страховка. Небольшой намеренно — только то, без чего Hermes не
> оживёт. Опирается на [`authoring-skills-instructions-mcp.md`](./authoring-skills-instructions-mcp.md)
> (форма навыков/MCP) и реальные шаги `lib/bootstrap.sh` (easy-starter).

---

## §1. Кто такой Hermes и его поверхности

Hermes — **оркестратор** воркспейса: раздаёт задачи пяти кодерам (claude-code/codex/gemini-cli/
qwen-code/kimi-code), управляет средой (настройки, деплой, память), **сам код приложения не пишет**.

| Поверхность | Порт | PM2-процесс | Роль |
|---|---|---|---|
| Hermes Agent (дашборд) | `:9119` | `fractera-hermes` | агент + панель (config/ключи/сессии) |
| Chat Web UI | `:9120` | `fractera-hermes-webui` | дружелюбный встроенный чат к тому же агенту |
| Messaging gateway | — | `fractera-hermes-gateway` | Telegram/мессенджеры + cron |

Бинарь: `/usr/local/lib/hermes-agent/venv/bin/hermes` (venv Python).
Дом: `/root/.hermes/` (HERMES_HOME).

---

## §2. Из чего состоит установка (компоненты в `/root/.hermes/`)

| Компонент | Путь на сервере | Источник (субстрат, едет с ai-workspace) |
|---|---|---|
| **Личность** | `/root/.hermes/SOUL.md` | `services/hermes-soul/SOUL.md` |
| **Навыки** | `/root/.hermes/skills/<name>/SKILL.md` | `services/hermes-skills/<name>/SKILL.md` |
| **Плагины** | `/root/.hermes/plugins/` | `services/hermes-plugins/` (fractera-access-control, fractera-platforms, lightrag-memory) |
| **Тема дашборда** | `/root/.hermes/dashboard-themes/` | `services/hermes-dashboard-themes/` |
| **Конфиг** | `/root/.hermes/config.yaml` | генерится/правится (mcp_servers, model) |
| **Web UI** | отдельный процесс :9120 | `services/hermes-webui-installer/` |

**MCP-мосты в `config.yaml → mcp_servers`** (Hermes вызывает их как инструменты): claude/codex/gemini/
qwen/kimi-bridge `:3210–3214`, deployments `:3215`, readiness `:3216`, app-settings `:3218`, ai-draft
`:3221`, arch `:3222` (+ Bearer-секреты). Каждый мост обязан отвечать на JSON-RPC `initialize`+`tools/list`.

---

## §3. Как ставится (шаги `lib/bootstrap.sh`, гейт `brain`)

Порядок (имена под-шагов — для атрибуции и идемпотентности):
1. `install_hermes_plugins` — `cp -r services/hermes-plugins/* /root/.hermes/plugins/`.
2. `install_hermes_skills` — **`cp -r`** services/hermes-skills/* → `/root/.hermes/skills/` (директории!).
3. `install_hermes_soul` — `cp services/hermes-soul/SOUL.md /root/.hermes/SOUL.md`.
4. `install_hermes_theme` — тема дашборда.
5. `hermes_docs_dir` — защищённые доки `/opt/fractera/app/docs/hermes/`.
6. `start_hermes` — `pm2 start … -- dashboard --host 127.0.0.1 --port 9119 --no-open` + poll :9119 до ~180с.
7. `start_hermes_gateway` — `pm2 start … -- gateway`.
8. `install_hermes_webui` — `bash services/hermes-webui-installer/install.sh` (:9120).
Затем `pm2 save` (переживает reboot).

---

## §4. 🔴 Критические подводные камни (без них Hermes не оживёт)

1. **Бинд только `127.0.0.1`, НЕ `0.0.0.0`.** Hardening июня-2026: Hermes ОТКАЗЫВАЕТСЯ биндить
   non-loopback без dashboard-auth; флаг `--insecure` — мёртвый no-op. `0.0.0.0` → краш-цикл → :9119
   не слушает → nginx 502. → `reports/errors/hermes-refuses-0.0.0.0-bind-and-host-check` (шаг 136).
2. **nginx шлёт Hermes `Host: 127.0.0.1:9119`, не `$host`.** Тот же hardening валидирует Host-заголовок
   против bound-host: при `Host: hermes.<домен>` → 400 «Invalid Host header». Правит генератор nginx
   (`bridges/app/.../config/domain/route.ts`, только для `prefix===hermes`).
3. **Навыки — только `<name>/SKILL.md` + YAML-frontmatter.** Плоский `<name>.md` Hermes НЕ открывает
   (выберет чужой). Bootstrap копирует `cp -r`. → `authoring-skills-instructions-mcp.md`, шаг 137.
4. **Ключ Brain → пул `hermes auth add`, модель в `config.yaml` И `model.model`, И `model.default`**
   (webui читает `default`). Рестартить ОБА процесса при смене ключа/модели. → шаг 89.
5. **MCP-мост без `initialize`/`tools/list`** → Hermes регистрирует 0 инструментов. → шаг 92.

---

## §5. Восстановление / переустановка Hermes

**Полная (чистый сервер):** развернуть заново — bootstrap пройдёт §3 из коробки (всё в субстрате
ai-workspace + bootstrap; источники §2). Это делает архитектор (правило 18).

**Частичная (Hermes снесли, сервер жив):** на сервере прогнать аналог §3 вручную из субстрата:
`cp -r /opt/fractera/services/hermes-skills/* /root/.hermes/skills/` · `cp …/hermes-soul/SOUL.md` ·
`cp -r …/hermes-plugins/*` · восстановить `config.yaml` (mcp_servers §2) · `pm2 start` агента (`--host
127.0.0.1`), gateway, webui · `pm2 save`. Проверка: `hermes skills list` (наши навыки `enabled`),
`curl localhost:9119/`=200, `pm2 list` (0 рестартов).

**Диагностика «502 на вкладке Hermes»:** `pm2 list` (рестарты `fractera-hermes`?), `curl localhost:9119`
(000=мёртв), `tail /root/.pm2/logs/fractera-hermes-error.log` («Refusing to bind 0.0.0.0» → §4.1;
«Invalid Host» → §4.2). Чат :9120 жив ≠ агент :9119 жив — это РАЗНЫЕ процессы.

---

## §6. Связи
- `authoring-skills-instructions-mcp.md` — канон формы навыков/инструкций/MCP (как создавать/хранить).
- `reports/errors/hermes-refuses-0.0.0.0-bind-and-host-check.md` — корневой антипаттерн §4.1–4.2.
- Шаги 136 (502-фикс), 137 (навыки), 140 (SOUL.md/личность), 113 (самоосознание Hermes).

---

> **Roma Armstrong, основатель Fractera:**
> «Быстро исправляйте допущенные ошибки. Если вы постоянно экспериментируете, то таких ошибок будет
> много. Если вы их вовремя исправляете, то катастрофы не произойдёт.»
