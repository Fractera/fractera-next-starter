import { NextRequest } from "next/server"
import { shouldBypassAuth } from "@/lib/auth/auth-bypass"

export type AppSession = {
  userId: string
  email: string
  roles: string[]
}

export async function getSession(req?: NextRequest): Promise<AppSession | null> {
  const agentId = req?.headers.get('x-agent-identity')
  if (agentId) {
    return { userId: `${agentId}@agent`, email: `${agentId}@agent`, roles: ['agent'] }
  }

  if (shouldBypassAuth()) {
    return { userId: 'demo@local', email: 'demo@local', roles: ['architect'] }
  }

  // 🔒 `||`, А НЕ `??`, И ЭТО НЕ ВКУСОВЩИНА — ОПЛАЧЕНО ПОТЕРЕЙ ВХОДА НА ЖИВОМ
  // САЙТЕ (2026-09-01).
  //
  // `??` заменяет только `null` и `undefined`. `NEXT_PUBLIC_AUTH_URL` в слоте —
  // ПУСТАЯ СТРОКА, и она запекается в бандл при сборке: выражение возвращало
  // `""`, дальше шёл `fetch("/api/session")` — относительный адрес, который на
  // сервере падает молча в `catch`. Наружу это выглядело как честный `401`:
  // человек вошёл, служба сессию признавала, а сайт показывал кнопку «войти».
  //
  // 🛑 ДЕФЕКТ БЫЛ НЕВИДИМ, ПОКА СЕРВЕР РАБОТАЛ ПО IP: там `shouldBypassAuth()`
  // отвечал раньше, и до этой строки дело не доходило. Перевод на домен включил
  // настоящий путь — и сломанным он был всё это время.
  const authUrl =
    process.env.AUTH_SERVICE_URL || process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3001'
  const cookie = req?.headers.get('cookie') ?? ''
  try {
    const res = await fetch(`${authUrl}/api/session`, { headers: { cookie } })
    if (!res.ok) return null
    return res.json() as Promise<AppSession>
  } catch {
    return null
  }
}
