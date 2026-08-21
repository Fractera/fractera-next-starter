import type { AboutCell } from '../_lib/types'

// Английская основа страницы «О нас».
//
// 🔒 ЭТО ЗАГЛУШКА ПО СОДЕРЖАНИЮ И ОБРАЗЕЦ ПО УСТРОЙСТВУ. История студии и пять
// сотрудников ВЫМЫШЛЕНЫ — они показывают, из чего собирается такая страница
// (рассказ, ряд людей, числа, цитата), и владелец заменяет их своими. Ни одно
// имя, число и год здесь не относится к реальному человеку или компании.
//
// 🔒 ИМЯ САЙТА НЕ НАБИРАЕТСЯ РУКАМИ. Компания называет себя «мы»: имя приходит
// из настроек, а вписанное в текст оно уехало бы в каждый проект, собранный из
// этого шаблона. Единственная законная форма ссылки на себя — `[%SITE%](/en)`,
// её подставляет рендерер.
//
// 🔒 ВИД РАЗДЕЛА НЕ ПОВТОРЯЕТСЯ. `flow` рассказывает историю (порядок —
// содержание), `cards` показывает людей (порядка нет), `metrics` — числа,
// `quote` — голос основателя, `statement` — вывод. Второй раздел того же вида
// читался бы как повтор ещё до того, как прочитаны слова.

export const en: AboutCell = {
  title: 'About us',
  eyebrow: 'About us',
  description:
    'Who we are: how a two-person studio started in a rented back room in 2019, what it learned the expensive way, and the five people who run it today.',
  keywords: 'about us, our team, company history, who we are, meet the team',
  blocks: [
    {
      kind: 'p',
      text: 'We are a small team that builds and runs software for other small teams. This page is the short version: how the studio started, what it cost us to learn what we know, and the five people you actually reach when you write to us. Back to [%SITE%](/en).',
    },
    {
      kind: 'flow',
      badge: 'Our story',
      title: 'How a rented back room became a studio',
      note: 'Four moments that decided what this company is — and what it refuses to be.',
      steps: [
        {
          title: '2019 — Two people and one radiator',
          text: 'We started in a room behind a bakery, with one window and a radiator that only worked in summer. The first job was a booking form for the bakery downstairs, and for two months it paid in bread. We still think that was a fair rate.',
        },
        {
          title: '2021 — The rewrite that taught us to say no',
          text: 'A customer asked for everything at once and we agreed to all of it. Nine months later we threw the result away and rebuilt it in six weeks with a third of the features. Every proposal we send now opens with the list of things we are not going to build.',
        },
        {
          title: '2023 — From projects to a product',
          text: 'Four customers in a row asked for the same thing in four different vocabularies. We stopped billing by the hour, turned that thing into a product, and moved the whole team onto it.',
        },
        {
          title: '2026 — Five people, five cities',
          text: 'We are still five. We ship on Tuesdays and Thursdays, we answer support ourselves, and there is nobody to hand the difficult letter to. That is the point.',
        },
      ],
    },
    {
      kind: 'cards',
      badge: 'The team',
      title: 'The five people behind it',
      note: 'Everyone here builds, and everyone here answers the mail.',
      cols: 2,
      children: [
        {
          kind: 'card',
          tone: 'data',
          children: [
            { kind: 'h3', text: 'Mara Ellison — founder' },
            {
              kind: 'p',
              text: 'Wrote the bakery booking form in 2019 and has written the release notes ever since. Mara reads every support letter before anyone answers it, which is why our roadmap is shorter than most and finishes more often.',
            },
          ],
        },
        {
          kind: 'card',
          tone: 'code',
          children: [
            { kind: 'h3', text: 'Tomas Reiner — engineering' },
            {
              kind: 'p',
              text: 'Joined after the 2021 rewrite and quietly deleted a third of the code in his first month. Tomas keeps a list called "things that broke at 3 a.m."; nothing ships until the new thing cannot join it.',
            },
          ],
        },
        {
          kind: 'card',
          tone: 'reach',
          children: [
            { kind: 'h3', text: 'Aiko Nakamura — design' },
            {
              kind: 'p',
              text: 'Came from print, and it shows: she measures a screen the way a typesetter measures a page. Aiko is the reason every button here says what happens next instead of saying "Submit".',
            },
          ],
        },
        {
          kind: 'card',
          tone: 'access',
          children: [
            { kind: 'h3', text: 'Daniel Okoye — customer support' },
            {
              kind: 'p',
              text: 'Was our second customer, complained precisely enough that we hired him, and now replies faster than any of us. Daniel turns confused letters into one-line bug reports, which is a rarer skill than it sounds.',
            },
          ],
        },
        {
          kind: 'card',
          tone: 'muted',
          children: [
            { kind: 'h3', text: 'Sofia Marchetti — operations' },
            {
              kind: 'p',
              text: 'Runs contracts, invoices and the calendar, and is the only person allowed to say "no, that week is full". Sofia joined in 2023 and the studio has not missed a delivery date since — the two facts are not a coincidence.',
            },
          ],
        },
      ],
    },
    {
      kind: 'metrics',
      items: [
        { value: '2019', label: 'The year we started' },
        { value: '5', label: 'People on the team' },
        { value: '11', label: 'Countries our customers work in' },
        { value: '24 h', label: 'How long a first reply takes' },
      ],
    },
    {
      kind: 'quote',
      lead: 'We never set out to build a product.',
      text: 'We set out to stop rebuilding the same thing for the fourth customer. The product is what was left when we finally admitted that.',
      cite: 'Mara Ellison, founder',
    },
    {
      kind: 'statement',
      text: 'Small on purpose: the people who build this are the people who answer the mail about it.',
    },
  ],
}
