'use client'

// Предложение установить приложение (шаг 504).
//
// ЗАЧЕМ ОНО НУЖНО. Браузер умеет предлагать установку сам, но прячет это в меню
// и в значке адресной строки — то есть находит его тот, кто и так знал, что
// искать. Посетитель, которому приложение было бы полезно, о такой возможности
// не узнаёт никогда.
//
// 🔒 МЫ НЕ ПОКАЗЫВАЕМ НИЧЕГО, ПОКА БРАУЗЕР НЕ РАЗРЕШИЛ. Кнопка появляется только
// после события `beforeinstallprompt`: браузер присылает его, лишь когда сайт
// действительно устанавливаем (манифест с иконками, https, воркер) и посетитель
// уже проявил интерес. Своё «поставьте наше приложение», нарисованное без этого
// события, оказывается либо неработающим (ставить нечем — окно вызывается только
// из этого события), либо назойливым.
//
// 🔒 ОТКАЗ ПОМНИТСЯ. Нажал «Не сейчас» — предложение не возвращается тридцать
// дней. Баннер, который приходит на каждой странице, — причина, по которой люди
// перестают читать вообще все баннеры сайта, включая согласие на cookie.
//
// Слова приезжают ПРОПСОМ с сервера: 82 языка живут в
// `install-prompt.i18n.ts`, и островок их не импортирует — иначе весь словарь
// уехал бы в браузер на каждой странице.

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import type { InstallStrings } from './install-prompt.i18n'

// Событие нестандартное: в типах TypeScript его нет, потому что в спецификации
// оно не описано — это дополнение поставщиков браузеров. Объявляем ровно то, чем
// пользуемся.
type InstallEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const SNOOZE_KEY = 'fractera-install-dismissed'
const SNOOZE_DAYS = 30

function snoozed(): boolean {
  try {
    const raw = localStorage.getItem(SNOOZE_KEY)
    if (!raw) return false
    return Date.now() - Number(raw) < SNOOZE_DAYS * 24 * 60 * 60 * 1000
  } catch {
    // Приватный режим запрещает хранилище — тогда просто не помним отказ.
    return false
  }
}

export function InstallPrompt({ strings }: { strings: InstallStrings }) {
  const [event, setEvent] = useState<InstallEvent | null>(null)

  useEffect(() => {
    if (snoozed()) return

    const onPrompt = (e: Event) => {
      // Отменяем показ СВОЕЙ полосы браузера, чтобы предложение было одно, а не
      // два разных в одном окне.
      e.preventDefault()
      setEvent(e as InstallEvent)
    }
    // Приложение уже установили из браузера — предлагать нечего.
    const onInstalled = () => setEvent(null)

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!event) return null

  const dismiss = () => {
    try {
      localStorage.setItem(SNOOZE_KEY, String(Date.now()))
    } catch {
      /* без хранилища отказ живёт до перезагрузки — это лучше, чем ничего */
    }
    setEvent(null)
  }

  const install = async () => {
    // Окно установки открывает БРАУЗЕР, и только по этому событию. Второй раз то
    // же событие использовать нельзя, поэтому кнопка исчезает сразу.
    setEvent(null)
    try {
      await event.prompt()
      const choice = await event.userChoice
      // Отказался в окне браузера — считаем это отказом и не спрашиваем месяц.
      if (choice.outcome === 'dismissed') {
        try {
          localStorage.setItem(SNOOZE_KEY, String(Date.now()))
        } catch {}
      }
    } catch {
      /* окно не открылось — молча, это не поломка сайта */
    }
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Download size={14} className="shrink-0" />
        {strings.install}
      </button>
      <button
        type="button"
        onClick={dismiss}
        title={strings.dismiss}
        aria-label={strings.dismiss}
        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <X size={14} />
      </button>
    </div>
  )
}
