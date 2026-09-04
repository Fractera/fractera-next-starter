import { headers } from "next/headers"
import { Layers, Plug } from "lucide-react"
import { Small } from "@/components/ui/typography"
import { getAppConfig } from "@/config/app-config"
import { chatUrlFromSite } from "@/lib/site-urls"
import { SettingsCard } from "./settings-card"

// ЧТО ПОДКЛЮЧЕНО К АГЕНТУ — ВИТРИНА В РАЗДЕЛЕ СТРАТЕГИИ (113-4, 2026-09-04).
//
// 🔒 СПРАШИВАЕТСЯ ЧАТ, А НЕ ДИСК. Навыки и MCP читает SDK, а он живёт на `:3600`
// — значит правду о них знает чат. Прочитай мы те же папки отсюда, мы спросили бы
// ПОСРЕДНИКА вместо предмета и однажды показали бы папку, которой у чата нет
// (свой контейнер, свой путь, своё окружение). ✗ этот класс ошибки в проекте
// оплачен трижды за сутки — файлом конфига, `/proc/PID/environ` и разметкой
// страницы под замком.
//
// 🛑 ЧАТ МОЖЕТ НЕ ОТВЕТИТЬ, И ЭТО ЗАКОННОЕ СОСТОЯНИЕ, А НЕ ОШИБКА: на машине
// разработчика его нет вовсе. Тогда карточка говорит об этом словами и не
// притворяется, что у агента ноль навыков.

type Caps = {
  keyConfigured: boolean
  mcpRegistry: string
  mcpServers: { name: string }[]
  skills: { name: string; title: string | null }[]
  skillsDir: string
  workspace: string
}

/**
 * Адрес чата.
 *
 * ✗ ЗДЕСЬ СТОЯЛ ТОЛЬКО `chatUrlFromSite(getAppConfig().url)`, И ЖИВОЙ ЗАМЕР
 * 2026-09-04 ПОКАЗАЛ, ЧЕМ ЭТО ПЛОХО: на сервере адрес сайта не настроен
 * (`url: null`), функция вернула пустую строку — и витрина сказала «чат не
 * отвечает» ПРО ЖИВОЙ ЧАТ, который в ту же секунду отвечал `200`.
 * 🔒 ЛОЖНЫЙ ДИАГНОЗ ХУЖЕ ОТСУТСТВИЯ ДИАГНОЗА: человек пошёл бы чинить чат.
 * Поэтому адрес сперва выводится из хоста ЗАПРОСА — тем же правилом, которым
 * сам чат находит соседей, — и только потом из настройки.
 */
async function chatAddress(): Promise<string> {
  const h = await headers()
  const host = h.get("host") ?? ""
  const proto = h.get("x-forwarded-proto") ?? "http"
  // Режим по IP: `<адрес>:3000` → `<адрес>:3600`. Доменный: `chat.<домен>`.
  const byIp = host.match(/^(.+):3000$/)
  if (byIp) return `${proto}://${byIp[1]}:3600`
  if (host && !host.startsWith("chat.")) return `${proto}://chat.${host.replace(/^www\./, "")}`
  return chatUrlFromSite(getAppConfig().url)
}

async function readCaps(): Promise<Caps | null> {
  const url = await chatAddress()
  if (!url) return null
  try {
    // 🔒 КУКА ПЕРЕСЫЛАЕТСЯ: дверь чата под ролью архитектора, и спрашивать её
    // надо от имени того, кто сейчас смотрит на экран, а не от имени сервера.
    const cookie = (await headers()).get("cookie") ?? ""
    const r = await fetch(`${url}/api/fractera/agent-capabilities`, {
      cache: "no-store",
      headers: cookie ? { cookie } : undefined,
    })
    if (!r.ok) return null
    return (await r.json()) as Caps
  } catch {
    return null
  }
}

export async function AgentCapabilities() {
  const caps = await readCaps()

  return (
    <div className="flex flex-col gap-3" data-agent-capabilities={caps ? "ready" : "unreachable"}>
      <SettingsCard
        mark={{ "data-automation-group": "skills" }}
        icon={<Layers className="size-4 text-muted-foreground" />}
        title="Скилы"
        status={
          <Small className="text-muted-foreground" data-agent-skills-count>
            {caps ? `${caps.skills.length} шт.` : "чат не отвечает"}
          </Small>
        }
      >
        {caps ? (
          caps.skills.length ? (
            <ul className="flex flex-col gap-2">
              {caps.skills.map(s => (
                <li
                  className="rounded-md border border-border p-2.5"
                  data-agent-skill={s.name}
                  key={s.name}
                >
                  <span className="font-medium text-[length:var(--fs-small)] text-foreground">
                    {s.title ?? s.name}
                  </span>
                  <Small className="mt-1 block font-mono text-muted-foreground">{s.name}</Small>
                </li>
              ))}
            </ul>
          ) : (
            <Small className="leading-relaxed text-muted-foreground">
              Пока ни одного. Навык — это папка с файлом{" "}
              <span className="font-mono">SKILL.md</span> внутри{" "}
              <span className="font-mono">{caps.skillsDir}</span>. Адрес выбран не нами: SDK читает
              навыки только оттуда, и положенное в другое место он молча не увидит.
            </Small>
          )
        ) : (
          <Small className="leading-relaxed text-muted-foreground">
            Чат на этом сервере не отвечает, поэтому список навыков неизвестен. Это не то же самое,
            что «навыков нет».
          </Small>
        )}
      </SettingsCard>

      <SettingsCard
        mark={{ "data-automation-group": "mcp" }}
        icon={<Plug className="size-4 text-muted-foreground" />}
        title="MCP"
        status={
          <Small className="text-muted-foreground" data-agent-mcp-count>
            {caps ? `${caps.mcpServers.length} шт.` : "чат не отвечает"}
          </Small>
        }
      >
        {caps ? (
          caps.mcpServers.length ? (
            <ul className="flex flex-col gap-2">
              {caps.mcpServers.map(s => (
                <li
                  className="rounded-md border border-border p-2.5 font-mono text-[length:var(--fs-small)]"
                  data-agent-mcp={s.name}
                  key={s.name}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          ) : (
            <Small className="leading-relaxed text-muted-foreground">
              Пока ни одного. Серверы объявляются в файле{" "}
              <span className="font-mono">{caps.mcpRegistry}</span> — файлом, а не кодом, чтобы
              подключить новый источник данных можно было без пересборки чата.
              {/* 🛑 Здесь названо то, чего ещё нет, и названо честно: без этих
                  серверов агент не видит ни таблиц, ни графа знаний. */}{" "}
              Через них агент получит доступ к таблицам проекта, к слою данных и к графу знаний —
              этого пока не построено.
            </Small>
          )
        ) : (
          <Small className="leading-relaxed text-muted-foreground">
            Чат на этом сервере не отвечает, поэтому список MCP-серверов неизвестен.
          </Small>
        )}
      </SettingsCard>

      {caps && !caps.keyConfigured && (
        <Small
          className="rounded-md border border-amber-500/40 bg-amber-500/10 p-2.5 text-amber-800 dark:text-amber-200"
          data-agent-key="missing"
        >
          Ключ Anthropic не задан — в этом режиме агент ответит отказом. Карточка «Ключ Anthropic»
          на вкладке «Настройки».
        </Small>
      )}
    </div>
  )
}
