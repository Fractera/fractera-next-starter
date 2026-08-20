import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

// 🔒 ФЛАГ РЕЖИМА ЧИТАЕТСЯ ИЗ ФАЙЛА, А НЕ ИЗ ПАМЯТИ ПРОЦЕССА (шаг 520, 2026-08-20).
//
// ЧТО БЫЛО НЕ ТАК. Правило стояло на `process.env.FRACTERA_IP_NODOMAIN_MODE`, а
// значение в памяти процесса умеет расходиться с файлом на диске: панель
// перезапускает соседние службы с `--update-env`, дочерний процесс наследует её
// окружение, и однажды записанное `true` переживает переключение в защищённый режим.
// `dotenv`/Next при этом не переписывают переменную, которая уже есть в `process.env`,
// поэтому правильное `false` из файла не применялось никогда.
//
// Чем это кончилось на живом сервере: `getSession()` отдавал `demo@local` с ролью
// `architect`, и любой запрос с ЛЮБОЙ выдуманной кукой `authjs.session-token`
// оказывался запросом архитектора. Прокси проверяет только НАЛИЧИЕ такой куки —
// её содержимое обязан проверить слой авторизации, а он был обойдён.
//
// Правду о режиме знает ФАЙЛ. Окружение осталось запасным путём на случай, когда
// ключа в файле нет вовсе (локальный запуск, свежая машина).
//
// 🔗 Близнецы живут в репозитории платформы (`ai-workspace`): `services/auth/lib/auth-bypass.ts`,
// `services/data/auth-bypass.js`, `bridges/app/lib/auth-bypass.ts`. Правило продублировано
// намеренно — платформа для слота чужой репозиторий, — поэтому правка нужна во всех четырёх.

const ENV_FILE = process.env.FRACTERA_ENV_FILE ?? join(process.cwd(), ".env.local");

// Значение живёт до пяти секунд и обновляется по времени правки файла: переключение
// режима вступает в силу само, без перезапуска приложения.
const TTL_MS = 5_000;
let cachedValue: string | null = null;
let cachedMtime = -1;
let cachedAt = 0;

function flagFromFile(): string | null {
  const now = Date.now();
  if (now - cachedAt < TTL_MS) return cachedValue;
  cachedAt = now;
  try {
    const mtime = statSync(ENV_FILE).mtimeMs;
    if (mtime === cachedMtime) return cachedValue;
    cachedMtime = mtime;
    const match = readFileSync(ENV_FILE, "utf8").match(/^FRACTERA_IP_NODOMAIN_MODE=(.*)$/m);
    cachedValue = match ? match[1].trim().replace(/^["']|["']$/g, "") : null;
  } catch {
    cachedMtime = -1;
    cachedValue = null;
  }
  return cachedValue;
}

export function shouldBypassAuth(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const fromFile = flagFromFile();
  if (fromFile !== null) return fromFile === "true";
  return process.env.FRACTERA_IP_NODOMAIN_MODE === "true";
}
