// Посев картинок, КОГДА слой данных поднимется (аудит развёртывания 2026-08-13).
// Запускается сам при старте приложения (`prestart`), в фоне.
//
// 🔒 ЗАЧЕМ ОТДЕЛЬНЫЙ ЗАПУСК, ЕСЛИ ПОСЕВ УЖЕ ЕСТЬ В `prebuild`.
//
// На свежем сервере порядок установки такой: сначала СОБИРАЮТСЯ все приложения,
// и только потом ЗАПУСКАЮТСЯ службы (`lib/bootstrap.sh`: сборка на шаге
// `build_app`, запуск слоя данных — десятком строк ниже). Значит во время
// сборки хранилища ещё нет, и посев из `prebuild` честно ничего не делает.
//
// Итог без этого файла: первый развёрнутый сервер приезжает с пустым
// хранилищем — товары без картинок, статья с запасным файлом, — и всё
// становится на место только при СЛЕДУЮЩЕЙ сборке. То есть образец работы с
// изображениями не виден ровно тому, кто открывает продукт впервые.
//
// 🔒 ПОЧЕМУ В ФОНЕ И С ОТКРЕПЛЕНИЕМ. `prestart` стоит между pm2 и приложением:
// пока он не закончил, сайт не поднят. Ждать здесь слой данных синхронно значит
// держать сайт закрытым ради посевных картинок. Поэтому процесс открепляется и
// ждёт сам, а приложение стартует немедленно.
//
// ЖДЁМ РАЗУМНО, А НЕ ВЕЧНО: три минуты с шагом в пять секунд. Не поднялось —
// выходим молча. Картинки досеются следующей сборкой, и это гораздо лучше
// процесса, который висит на сервере до перезагрузки.

import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA_URL = process.env.REMOTE_DATA_URL ?? "http://localhost:3300";

function secret() {
  if (process.env.DATA_SECRET) return process.env.DATA_SECRET;
  try {
    const text = readFileSync(path.join(ROOT, ".env.local"), "utf8");
    const line = text.split("\n").find(l => l.trim().startsWith("DATA_SECRET="));
    return line ? line.slice(line.indexOf("=") + 1).trim() : "";
  } catch {
    return "";
  }
}

// Родитель НИЧЕГО не ждёт: он лишь порождает открепившегося потомка и выходит,
// чтобы `npm run start` пошёл дальше в ту же секунду.
if (!process.env.FRACTERA_SEED_CHILD) {
  const child = spawn(process.execPath, [new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")], {
    detached: true,
    stdio: "ignore",
    env: { ...process.env, FRACTERA_SEED_CHILD: "1" },
  });
  child.unref();
  process.exit(0);
}

// ── Дальше выполняется уже открепившийся потомок ─────────────────────────────

const DEADLINE = Date.now() + 3 * 60_000;
const KEY = secret();

async function dataLayerReady() {
  try {
    const res = await fetch(`${DATA_URL}/media`, {
      headers: KEY ? { "X-Data-Secret": KEY } : {},
      signal: AbortSignal.timeout(4000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

while (Date.now() < DEADLINE) {
  if (await dataLayerReady()) {
    // Тот же скрипт, что и в сборке: одна логика посева, а не вторая копия.
    const seed = spawn(process.execPath, [path.join(ROOT, "scripts", "seed-media.mjs")], {
      cwd: ROOT,
      stdio: "ignore",
      env: process.env,
    });
    seed.on("exit", () => process.exit(0));
    break;
  }
  await new Promise(r => setTimeout(r, 5000));
}
