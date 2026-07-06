# 20 — Ответить пользователю в Telegram

> Project sub-step · node `reply-in-telegram` · kind: action · importance: mandatory · order sheet `os-244071e59531649b` (9/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; implement ONLY the body of this node's step (under the `// node:reply-in-telegram` marker in the workflow); a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Реализовать ответ. Собрать исходы: (1) save → «Запомнил: <summary>» при ingestOk, «Не смог сохранить: <error>» при сбое. (2) remind с датой → «Напомню <дата>: <summary>». (3) remind needs_when=true → «Когда напомнить? Ответьте датой/временем» (следующее сообщение пользователя обработается как дата — упрощённо в MVP: пользователь повторит с датой). (4) recall → answer из search-memory-recall. (5) POST sendMessage, parse_mode не задавать (plain text — свободная форма не должна ломаться на Markdown-спецсимволах); текст >4096 резать по границе абзаца. (6) Итог прогона {processed, saved, reminded, answered, errors[]} — это результат для dashboard и таблицы результатов (Layer C).

## Tools
- Telegram Bot API sendMessage
- fetch

## Environment keys
- `TELEGRAM_BOT_TOKEN`
_Materialize each via the `persist-env-var-with-rebuild` skill — never hardcode a secret._

## Inputs / outputs
- **In:** "результаты ingest {dbId,chatId,ingestOk,summary}, needs_when, recall {chatId,answer}"
- **Out:** "итог прогона {processed, saved, reminded, answered, errors[]} для dashboard/таблицы"

## Depends on
- `ingest-note-to-memory` (must be completed first)
- `search-memory-recall` (must be completed first)

## To-do / acceptance criteria
- [ ] save→подтверждение, remind→«напомню»/«когда?», recall→answer
- [ ] plain text без parse_mode, резка >4096
- [ ] итог прогона {processed,saved,reminded,answered,errors[]}

<!-- fractera:step
{"number":20,"name":"Ответить пользователю в Telegram","importance":"mandatory","status":"new","completedAt":null,"description":"Финальный узел: подтверждение сохранения («Запомнил»), вопрос «когда?» для remind без даты, или найденный ответ recall — обратно в тот же чат методом sendMessage.","tasks":[{"body":"save→подтверждение, remind→«напомню»/«когда?», recall→answer"},{"body":"plain text без parse_mode, резка >4096"},{"body":"итог прогона {processed,saved,reminded,answered,errors[]}"}],"plan":{"sheet":"os-244071e59531649b","seq":9,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"reply-in-telegram","title":"Ответить пользователю в Telegram","kind":"action","task":"Реализовать ответ. Собрать исходы: (1) save → «Запомнил: <summary>» при ingestOk, «Не смог сохранить: <error>» при сбое. (2) remind с датой → «Напомню <дата>: <summary>». (3) remind needs_when=true → «Когда напомнить? Ответьте датой/временем» (следующее сообщение пользователя обработается как дата — упрощённо в MVP: пользователь повторит с датой). (4) recall → answer из search-memory-recall. (5) POST sendMessage, parse_mode не задавать (plain text — свободная форма не должна ломаться на Markdown-спецсимволах); текст >4096 резать по границе абзаца. (6) Итог прогона {processed, saved, reminded, answered, errors[]} — это результат для dashboard и таблицы результатов (Layer C).","description":"Финальный узел: подтверждение сохранения («Запомнил»), вопрос «когда?» для remind без даты, или найденный ответ recall — обратно в тот же чат методом sendMessage.","tools":["Telegram Bot API sendMessage","fetch"],"envKeys":["TELEGRAM_BOT_TOKEN"],"io":{"in":"результаты ingest {dbId,chatId,ingestOk,summary}, needs_when, recall {chatId,answer}","out":"итог прогона {processed, saved, reminded, answered, errors[]} для dashboard/таблицы"},"dependsOn":["ingest-note-to-memory","search-memory-recall"],"todo":["save→подтверждение, remind→«напомню»/«когда?», recall→answer","plain text без parse_mode, резка >4096","итог прогона {processed,saved,reminded,answered,errors[]}"]}}}
-->
