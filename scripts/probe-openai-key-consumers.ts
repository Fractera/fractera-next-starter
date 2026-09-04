// Прибор 107: проверяет ОБЕ стороны одной ошибки — писателя и читателя.
// Пути окружения переопределяются, как и задумано в самом модуле:
// «Пути — параметром окружения, чтобы работа проверялась на временной папке».
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

const dir = mkdtempSync(join(tmpdir(), "key107-"))
const slot = join(dir, "slot.env")
const data = join(dir, "data.env")
const rag = join(dir, "rag.env")

// Файл графа рождается таким, каким его создаёт развёртывание: имена есть, значения пусты.
writeFileSync(rag, "LLM_BINDING=openai\nLLM_BINDING_API_KEY=\nEMBEDDING_BINDING_API_KEY=\nEMBEDDING_MODEL=text-embedding-3-small\n")
writeFileSync(slot, "OPENAI_API_KEY=\n")
writeFileSync(data, "OPENAI_API_KEY=\n")

process.env.SLOT_ENV_PATH = slot
process.env.DATA_ENV_PATH = data
process.env.RAG_ENV_PATH = rag

const { writeOpenAiKey, readOpenAiKeyState } = await import("@/lib/architect/openai-key")

let bad = 0
const ok = (name: string, cond: boolean, detail = "") => {
  console.log(`  ${cond ? "✓" : "✗"} ${name}${detail ? " — " + detail : ""}`)
  if (!cond) bad++
}

console.log("=== ПЛОСКОСТЬ 1: ПИСАТЕЛЬ ===")
console.log("до записи:", JSON.stringify(readOpenAiKeyState().graph))
const res = writeOpenAiKey("sk-test-107-abcdefghijklmnop")
console.log("writeOpenAiKey →", JSON.stringify(res))

const ragText = readFileSync(rag, "utf8")
ok("LLM_BINDING_API_KEY заполнена", /^LLM_BINDING_API_KEY=sk-test-107/m.test(ragText))
ok("EMBEDDING_BINDING_API_KEY заполнена", /^EMBEDDING_BINDING_API_KEY=sk-test-107/m.test(ragText))
ok("НЕГАТИВНЫЙ КОНТРОЛЬ: OPENAI_API_KEY в файл графа НЕ добавлена",
   !/^OPENAI_API_KEY=/m.test(ragText),
   "переменная, которой служба не читает, не заводится")
ok("граф числится среди записанных", res.written.includes("graph"))
ok("соседи не сломаны", /^OPENAI_API_KEY=sk-test-107/m.test(readFileSync(slot, "utf8")) && /^OPENAI_API_KEY=sk-test-107/m.test(readFileSync(data, "utf8")))

console.log("=== ПЛОСКОСТЬ 2: ЧИТАТЕЛЬ (плашка) ===")
ok("после записи граф = задан", readOpenAiKeyState().graph.configured === true)

// Негативный контроль читателя №1: половина ключа — это НЕ «задан».
// Заполненная генерация при слепом встраивании — ровно тот молчаливый отказ.
writeFileSync(rag, ragText.replace(/^EMBEDDING_BINDING_API_KEY=.*$/m, "EMBEDDING_BINDING_API_KEY="))
ok("НЕГАТИВНЫЙ КОНТРОЛЬ: половина переменных → НЕ задан",
   readOpenAiKeyState().graph.configured === false,
   "одна из двух не считается за «задан»")

// Негативный контроль читателя №2: старое имя больше не обманывает плашку.
writeFileSync(rag, "LLM_BINDING_API_KEY=\nEMBEDDING_BINDING_API_KEY=\nOPENAI_API_KEY=sk-test-107-abcdefghijklmnop\n")
ok("НЕГАТИВНЫЙ КОНТРОЛЬ: один OPENAI_API_KEY → НЕ задан",
   readOpenAiKeyState().graph.configured === false,
   "прежде это давало зелёный цвет при слепом графе")

console.log(bad === 0 ? "===PROBE107_OK===" : `===PROBE107_FAILED=== провалов: ${bad}`)
process.exit(bad === 0 ? 0 : 1)
