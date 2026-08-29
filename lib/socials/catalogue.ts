// КАТАЛОГ СОЦСЕТЕЙ — ЧИСТЫЕ ДАННЫЕ, БЕЗ ЕДИНОЙ ЗАВИСИМОСТИ (31-26, 2026-08-29).
//
// 🔒 ФАЙЛ БЕЗ ИМПОРТОВ, И ЭТО МЕХАНИЧЕСКОЕ ТРЕБОВАНИЕ. Каталог читают И серверный
// подвал сайта, И островок настроек. Положи его рядом с чем-нибудь, что трогает
// диск или React, — и один из двух потребителей перестанет собираться.
//
// 🔒 ДЕСЯТЬ, И ЭТО РЕШЕНИЕ ВЛАДЕЛЬЦА, А НЕ ПРЕДЕЛ КОНСТРУКЦИИ («Подготовь 10 самых
// популярных социальных сетей включая GitHub… Это будет достаточно», 2026-08-29).
// Одиннадцатая добавляется одной строкой здесь и одним значком в
// `components/icons/socials.tsx`. Сеть вне каталога тоже законна: у записи остаётся
// свободное имя и свой шаблон адреса, значка у неё просто нет.

export type SocialBrand = {
  /**
   * Вечный ключ значка. 🔒 ХРАНИТСЯ В `SocialLink.icon`, и это ВТОРАЯ его форма:
   * значение, начинающееся с `/` или `http`, — загруженная картинка, всё остальное
   * — ключ отсюда. Различение по первому знаку, а не по отдельному полю: одно поле
   * с двумя формами не рассыпается при копировании конфига, два поля — рассыпаются.
   */
  key: string
  /** Каноническое имя сети — то, что человек ждёт увидеть. */
  name: string
  /**
   * Правило сборки адреса. Без `{value}` шаблон считается полным адресом —
   * свойство записи, а не особый случай в коде (`socialHref`).
   */
  urlTemplate: string
}

export const SOCIAL_BRANDS: readonly SocialBrand[] = [
  { key: "github", name: "GitHub", urlTemplate: "https://github.com/{value}" },
  { key: "x", name: "X", urlTemplate: "https://x.com/{value}" },
  { key: "telegram", name: "Telegram", urlTemplate: "https://t.me/{value}" },
  { key: "whatsapp", name: "WhatsApp", urlTemplate: "https://wa.me/{value}" },
  { key: "instagram", name: "Instagram", urlTemplate: "https://instagram.com/{value}" },
  { key: "facebook", name: "Facebook", urlTemplate: "https://facebook.com/{value}" },
  { key: "youtube", name: "YouTube", urlTemplate: "https://youtube.com/@{value}" },
  { key: "linkedin", name: "LinkedIn", urlTemplate: "https://linkedin.com/in/{value}" },
  { key: "tiktok", name: "TikTok", urlTemplate: "https://tiktok.com/@{value}" },
  { key: "discord", name: "Discord", urlTemplate: "https://discord.gg/{value}" },
]

/** Загруженная картинка, а не ключ каталога. */
export function isUploadedIcon(icon: string | undefined): boolean {
  return Boolean(icon && (icon.startsWith("/") || icon.startsWith("http")))
}

export function brandOf(key: string | undefined): SocialBrand | undefined {
  if (!key || isUploadedIcon(key)) return undefined
  return SOCIAL_BRANDS.find(b => b.key === key)
}
