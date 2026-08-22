import type { FooterPageCell } from '@/lib/pages/footer-page'

// Английская основа страницы «Доступность».
//
// 🔒 ЭТО НЕ ЗАГЛУШКА, В ОТЛИЧИЕ ОТ ПРАВОВЫХ СОСЕДЕЙ. Приватность и условия пишет
// владелец — до него их текст обязан быть заглушкой. Заявление о доступности
// говорит о том, КАК ПОСТРОЕН сайт, а построен он одинаково у всех: публичные
// страницы статические и читаются с выключенным JavaScript. Поэтому текст верен
// с первой минуты, и владелец лишь уточняет его, а не пишет с нуля.
//
// 🔒 НИ ОДНОГО ОБЕЩАНИЯ, КОТОРОЕ НЕЛЬЗЯ ПРОВЕРИТЬ. Соответствие WCAG здесь не
// объявляется: аудита не было, а заявление о доступности — юридически значимый
// текст в ЕС и США. Обещание уровня «AA», выданное шаблоном, стало бы ложью в
// каждом проекте разом.
//
// 🔒 АДРЕС ДЛЯ ПИСЬМА НЕ ВПИСАН СТРОКОЙ. Почта проекта — настройка
// (`APP-CONFIG` → Author → email), у каждого владельца своя; вписанная сюда, она
// уехала бы во все проекты вместе с шаблоном. Текст отправляет читателя к
// контактам сайта, а не к чужому ящику.

export const en: FooterPageCell = {
  title: 'Accessibility',
  description:
    'How this site tries to stay usable for everyone, and where to write if something here gets in your way.',
  keywords: 'accessibility, screen reader, keyboard navigation, contrast',
  blocks: [
    {
      kind: 'p',
      text: 'We want this site to be usable by everyone — including people who read it with a screen reader, move through it with a keyboard alone, or enlarge the text. Its public pages are ordinary server-rendered HTML and keep working with JavaScript switched off. Back to [%SITE%](/en).',
    },
    {
      kind: 'p',
      text: 'Accessibility is never finished, and parts of this site have not been reviewed yet, so we do not claim a conformance level we have not measured.',
    },
    {
      kind: 'p',
      text: 'If something here gets in your way, please tell us through the contact details published on this site: name the page and describe what happened. We answer and fix what we can.',
    },
  ],
}
