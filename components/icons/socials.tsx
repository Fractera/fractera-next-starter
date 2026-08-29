import { Boxes, Facebook, Github, Instagram, Linkedin, Youtube } from "lucide-react"
import { BrandX } from "./brand-x"

// ЗНАЧКИ ДЕСЯТИ СЕТЕЙ КАТАЛОГА (31-26, 2026-08-29).
//
// 🔒 БЕРЁМ ИЗ `lucide-react` ВСЁ, ЧТО ТАМ ЕСТЬ, И РИСУЕМ ТОЛЬКО НЕДОСТАЮЩЕЕ. Правило
// «значки только из lucide» уже имело ровно одно исключение — знак X (его в наборе
// нет, а старая птица показывает бренд, которого не существует). Здесь исключений
// становится четыре, и все по той же причине: Telegram, WhatsApp, TikTok и Discord
// в наборе отсутствуют. Нарисовать их — меньшее зло, чем поставить в ряд соцсетей
// «конверт», «телефон» и «музыкальную ноту»: человек читает такой ряд как ошибку.
//
// 🔒 ФОРМА ОДНА НА ВСЕХ: `viewBox="0 0 24 24"`, `fill="currentColor"`, размер и класс
// приходят СНАРУЖИ. Так свой значок живёт по законам темы наравне с lucide и не
// выпадает из ряда ни размером, ни цветом.
//
// 🔒 ЗАПАСНОЙ ЗНАЧОК — `Boxes`, и он означает «сеть без знака», а не поломку.
// Записи вне каталога — законное состояние: у владельца может быть сеть, которой в
// десятке нет.

type IconProps = { className?: string }

function Telegram({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M21.9 4.3 18.8 19c-.2 1-.9 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.7-7.9c.4-.3-.1-.5-.6-.2L6.7 12.9l-4.6-1.4c-1-.3-1-1 .2-1.5l18-6.9c.8-.3 1.5.2 1.2 1.2Z" />
    </svg>
  )
}

function WhatsApp({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.1-1.4A9.9 9.9 0 1 0 12 2Zm0 1.8a8.1 8.1 0 1 1-4.1 15.1l-.3-.2-3 .8.8-2.9-.2-.3A8.1 8.1 0 0 1 12 3.8Zm-3.7 4c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.7 4.2 3.7 2.1.8 2.5.7 3 .6.5-.1 1.5-.6 1.7-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3l-1.8-.9c-.3-.1-.5-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.1-.3 0-.4.1-.6l.5-.5c.1-.2.2-.3.3-.5v-.5l-.8-1.9c-.2-.5-.4-.4-.6-.5h-.4Z" />
    </svg>
  )
}

function TikTok({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M16.3 2h-3v13.4a2.4 2.4 0 1 1-2-2.4V9.9a5.5 5.5 0 1 0 5 5.5V8.7a6.8 6.8 0 0 0 4 1.3V7a4 4 0 0 1-4-4Z" />
    </svg>
  )
}

function Discord({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M19.3 5.4A16.5 16.5 0 0 0 15.2 4l-.3.6c1.4.3 2.5.8 3.6 1.5a13.5 13.5 0 0 0-11-.4l.4-.2c.4-.3.9-.5 1.4-.7L9.1 4c-1.5.3-2.9.7-4.2 1.4C2.3 9.4 1.6 13.3 2 17.1A16.6 16.6 0 0 0 7 19.6l1-1.7c-.8-.3-1.5-.7-2.1-1.2l.5-.4a11.8 11.8 0 0 0 11.4 0l.5.4c-.7.5-1.4.9-2.2 1.2l1 1.7c1.8-.5 3.5-1.4 5-2.5.5-4.4-.7-8.3-2.8-11.7ZM8.9 14.8c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.2 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
    </svg>
  )
}

/**
 * Ключ каталога → значок.
 *
 * 🔒 КЛЮЧИ ПОВТОРЯЮТ `SOCIAL_BRANDS` ОДИН В ОДИН. Разойтись им нельзя: сеть, у
 * которой есть строка в каталоге и нет значка здесь, получит запасной кубик и будет
 * выглядеть как сбой, а не как выбор.
 */
export const SOCIAL_ICONS = {
  github: Github,
  x: BrandX,
  telegram: Telegram,
  whatsapp: WhatsApp,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: TikTok,
  discord: Discord,
} as const

export type SocialIconKey = keyof typeof SOCIAL_ICONS

export const FallbackSocialIcon = Boxes

/** Значок по ключу; неизвестный ключ и пустое значение дают запасной. */
export function socialIcon(key: string | undefined): (p: IconProps) => React.ReactNode {
  const Found = key ? SOCIAL_ICONS[key as SocialIconKey] : undefined
  return Found ?? FallbackSocialIcon
}
