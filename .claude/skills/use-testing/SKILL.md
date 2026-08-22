---
name: use-testing
description: >
  How work is PROVEN here — before you say "done", "it works", "ready to check". Load it when you are
  about to report a result, when a gate goes green and you feel finished, and when something must be
  verified on the deployment. The rule that changes behaviour: two proofs from DIFFERENT planes, and
  a build log is never one of them — it reads identically whether the feature works or not. Also the
  four proofs that lied here today, and the class of defect no gate can ever catch.
---

# use-testing

> Informational, not binding. **Know a better way for the case in front of you — do it your way and
> say so.** You are trusted with the creative work on this project.

## 1. Two proofs, from different planes

A step or a substep closes on **two** proofs, and they must come from different planes — otherwise
you have measured the same thing twice.

| Plane | Answers |
|---|---|
| the tree | is the code well-formed — gates, types, structure |
| the build | did it compile and what shape did the route take (`●` / `ƒ`) |
| the wire | what does the server actually answer — status, headers, body |
| the eye | what does a person see — in a browser, in both themes, on a narrow screen |
| the story | is this the thing that was ASKED for |

A proof has four fields: **what was run**, **the verbatim output**, **what it proves**, and **how it
would look if the change had NOT been made**. The last field is what separates a proof from a ritual.

🔒 **A build log is never one of the two.** It reads the same when the feature works and when it does
not. "It compiles", "200 OK", "the hash is in the footer" — all true, none of them says the thing
works.

## 2. 🔒 Green was green BEFORE your change

Every gate passed before you touched anything. Green therefore proves the tree is still well-formed —
it never proves your work is right, and it cannot prove the work was the right work.

**So one of the two proofs carries a negative control:** make the thing fail on purpose, see it fail,
put it back. Today that caught two defects in gates written the same hour — one refused a page that
existed, the other passed a violation it was written to catch. Neither would have been found by
running them on a clean tree.

## 3. 🔒 The class of defect no gate will ever catch

Markup can be formally correct and still wrong: a page that reads as a different site, blocks that do
not add up to a story, a section repeated in another guise. Gates see structure and contrast, not
whether something is good.

For that class the proof is comparison, and it costs seconds: **open your page and its neighbour side
by side in two tabs.** Two pages of this project shipped past every gate this way — one a clone of
the home page, one in a foreign rhythm — and both were found by the owner, which is the expensive way
to find them.

## 4. The four proofs that lied here

Each of these looked like success:

- **the service worker serves the previous build.** You measure yesterday's page in today's browser.
  Unregister it AND clear `caches` — caches outlive `unregister`, so doing one proves nothing.
- **`npm run build | tail` prints the exit code of `tail`**, which is always 0. Write the log to a
  file, read `$?` straight after `npm`, and require a marker in the output.
- **`pm2 list` says `online` for a process in an endless restart loop.** Look at the restart count
  and at uptime GROWING between two samples; then confirm the port is held by a descendant of the pm2
  pid, at any depth.
- **a hidden browser tab reports width 0**, so every "is it narrow" check answers yes. Check
  `document.visibilityState` before believing a measurement taken through automation.

## 5. What cannot be proven — say it, do not substitute

When a proof is out of reach — no key, the owner's session is needed, a phone is needed — **name it
in the report** and do not replace it with something easy to obtain. "Built and served" is honest;
"PWA works" needs a phone. A screen tested only under the dev bypass or on a bare IP is tested for
the case that never fails: say which mode you were in.

Never simulate what the owner can do in five seconds — voice input, a login, a purchase. The
simulation checks a different path and takes longer.

## 6. Before you say "done"

1. Name the two planes you used and paste the verbatim output of each.
2. Say what would have looked different without your change.
3. Say what remains unproven — plainly, in the same message, not in a later one.

If you cannot fill point 1, the work is not finished; it is unmeasured.

## 7. Форма блока доказательств — и команда владельца

Пустое поле видно, проза его прячет. Поэтому доказательства подаются формой, а не рассказом:

```
ПРУФ 1 — плоскость <какая>
  запустил:      <команда / запрос / действие>
  вывод:         <дословно>
  доказывает:    <какая строка вывода означает, что работает>
  без правки:    <как этот же вывод выглядел бы БЕЗ изменения>

ПРУФ 2 — плоскость <другая>
  …

НЕГАТИВНЫЙ КОНТРОЛЬ
  случай:        <вход, ответ на который обязан отличаться>
  ответ:         <и он отличался — вот так>

ДОСТАВКА (не пруф)
  сборка / деплой / reload: <коды выхода, хэши>

Я НЕ ПРОВЕРИЛ
  <что требует владельца или архитектора и почему я не достал>
```

🔒 **Владелец вправе потребовать доказательства в любую минуту** — «покажи доказательства», «докажи»,
«show me the proof». Это одна и та же просьба: она произносится голосом, и отказ из-за переставленных
слов — дефект. Отвечаешь формой выше по тому, что сделано на эту минуту, не дожидаясь конца шага. Одна
из плоскостей недостижима — говоришь какая и почему; эта фраза часть ответа, а не повод выдать один
пруф за два.
