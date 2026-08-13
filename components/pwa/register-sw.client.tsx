'use client'

// Регистрация сервис-воркера (шаг 504).
//
// Островок без единого слова — и это осознанно: у него нет интерфейса, поэтому
// он не нуждается в переводе и появляется в любом языке сразу. Всё видимое,
// что даёт установку, рисует сам браузер (значок в адресной строке, пункт меню).
//
// Регистрация идёт ПОСЛЕ загрузки страницы: воркер не должен соревноваться за
// сеть с содержимым, ради которого пользователь пришёл.
//
// Работает только в защищённом контексте (https или localhost) — по закону
// браузера. В режиме без домена сайт живёт по http, там воркера просто не будет,
// и это правильная деградация: приложение остаётся полностью рабочим.

import { useEffect } from 'react'

export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
    if (!window.isSecureContext) return

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Отказ регистрации не имеет права ничего ломать: сайт полноценно
        // работает и без воркера, он даёт только офлайн и быстрое повторное
        // открытие.
      })
    }

    if (document.readyState === 'complete') register()
    else {
      window.addEventListener('load', register)
      return () => window.removeEventListener('load', register)
    }
  }, [])

  return null
}
