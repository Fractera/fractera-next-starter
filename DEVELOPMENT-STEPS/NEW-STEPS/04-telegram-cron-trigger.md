# 04 — Cron-триггер: запуск конвейера раз в минуту

> Project sub-step · node `telegram-cron-trigger` · kind: trigger · importance: mandatory · order sheet `os-244071e59531649b` (1/9)

**Before anything else, read `app/(projects)/projects/personal/telegram-notes/README.md`** — the project overview (why / how it works / efficiency / reuse / result). Then read this whole spec before writing any code.

**Execution schema (contract R6):** the process diagram (`app/(projects)/projects/personal/telegram-notes/_data/flow.ts`) and the durable workflow (`app/api/projects/personal/telegram-notes/_workflow/definition.ts`) are GENERATED from the decomposition graph and are the project's ONLY execution schema — what is not on the diagram does not exist in the project; this node is a TRIGGER — it IS the run route / cron queue that fires the workflow, it has no workflow step; a new action = extend the GRAPH and re-run the engine, never a shadow step outside the schema.

## Task
Настроить триггер конвейера. (1) Создать co-located cron.json в app/(projects)/projects/personal/telegram-notes/ с расписанием «* * * * *» (каждую минуту), целью POST /api/projects/personal/telegram-notes/run, пустым телом — fractera-cron подхватывает co-located cron.json автоматически. (2) Run-роут (route.ts рядом с _workflow/definition.ts) принимает пустое тело от cron и опциональный ручной input из run-панели ({ simulateMessage?: string } — для теста без Telegram: строка обрабатывается как будто пришла из чата). (3) Роут стартует durable-прогон runProject (WDK, world-local, шаг 183) и возвращает runId; никакой бизнес-логики в роуте.

## Tools
- fractera-cron (co-located cron.json)
- run route POST /api/projects/personal/telegram-notes/run
- Workflow DevKit (world-local)

## Environment keys
_No environment keys._

## Inputs / outputs
- **In:** "cron-тик раз в минуту ИЛИ ручной запуск из run-панели (опц. simulateMessage)"
- **Out:** "запущенный durable-прогон runProject (runId)"

## Depends on
_No dependencies (root node)._

## To-do / acceptance criteria
- [ ] cron.json с расписанием * * * * * рядом со страницей проекта
- [ ] run-роут: пустое тело от cron и {simulateMessage?} от run-панели
- [ ] роут возвращает runId, вся логика — в workflow-шагах

<!-- fractera:step
{"number":4,"name":"Cron-триггер: запуск конвейера раз в минуту","importance":"mandatory","status":"new","completedAt":null,"description":"Точка входа. Вместо Telegram-webhook (требует HTTPS, недоступен в IP-режиме и привязал бы к нативному шлюзу Hermes) используется поллинг: co-located cron.json планирует запуск run-роута каждую минуту через fractera-cron (субстрат-планировщик шага 179); тот же роут доступен вручную из run-панели страницы проекта.","tasks":[{"body":"cron.json с расписанием * * * * * рядом со страницей проекта"},{"body":"run-роут: пустое тело от cron и {simulateMessage?} от run-панели"},{"body":"роут возвращает runId, вся логика — в workflow-шагах"}],"plan":{"sheet":"os-244071e59531649b","seq":1,"total":9,"kind":"project-node","category":"personal","slug":"telegram-notes","readmeRel":"app/(projects)/projects/personal/telegram-notes/README.md","node":{"id":"telegram-cron-trigger","title":"Cron-триггер: запуск конвейера раз в минуту","kind":"trigger","task":"Настроить триггер конвейера. (1) Создать co-located cron.json в app/(projects)/projects/personal/telegram-notes/ с расписанием «* * * * *» (каждую минуту), целью POST /api/projects/personal/telegram-notes/run, пустым телом — fractera-cron подхватывает co-located cron.json автоматически. (2) Run-роут (route.ts рядом с _workflow/definition.ts) принимает пустое тело от cron и опциональный ручной input из run-панели ({ simulateMessage?: string } — для теста без Telegram: строка обрабатывается как будто пришла из чата). (3) Роут стартует durable-прогон runProject (WDK, world-local, шаг 183) и возвращает runId; никакой бизнес-логики в роуте.","description":"Точка входа. Вместо Telegram-webhook (требует HTTPS, недоступен в IP-режиме и привязал бы к нативному шлюзу Hermes) используется поллинг: co-located cron.json планирует запуск run-роута каждую минуту через fractera-cron (субстрат-планировщик шага 179); тот же роут доступен вручную из run-панели страницы проекта.","tools":["fractera-cron (co-located cron.json)","run route POST /api/projects/personal/telegram-notes/run","Workflow DevKit (world-local)"],"envKeys":[],"io":{"in":"cron-тик раз в минуту ИЛИ ручной запуск из run-панели (опц. simulateMessage)","out":"запущенный durable-прогон runProject (runId)"},"dependsOn":[],"todo":["cron.json с расписанием * * * * * рядом со страницей проекта","run-роут: пустое тело от cron и {simulateMessage?} от run-панели","роут возвращает runId, вся логика — в workflow-шагах"]}}}
-->
