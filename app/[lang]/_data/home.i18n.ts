// Слова главной страницы.
//
// 🔒 ЭТО СЛОВАРЬ ОДНОЙ СТРАНИЦЫ — он идёт по ВКЛЮЧЁННОМУ набору языков
// (`NEXT_PUBLIC_SUPPORTED_LANGUAGES`), а не по всем 82. Сегодня включено `en,ru`
// — значит здесь два языка, и это ПОЛНОЕ решение, а не долг. Все 82 обязаны
// нести только переиспользуемые части продукта (`components/`, тосты, отказы
// платформы): их я не создаю заново, поэтому они должны заговорить в любом
// языке, который владелец включит, в ту же минуту. Решение владельца
// 2026-08-12: языки главной больше не дописывать.
//
// 🔒 ЗАГОЛОВОК ГЕРОЯ — ДВА СОСТОЯНИЯ, И ЭТО СМЫСЛОВАЯ РАЗНИЦА. Пока имя в
// настройках не менялось, сервер показывает не «Fractera», а «Это ваше
// приложение»: имя шаблона на чужом сайте — реклама платформы за счёт клиента.
// Как только владелец сохранил своё имя, оно и стоит в заголовке, а этот текст
// исчезает навсегда.
//
// Значение `{roles}` подставляется из `ALL_ROLES.length` — число ролей меняется
// вместе с кодом, и цифра, набранная здесь руками, устарела бы первой.

export type HomeUi = {
  /** Заголовок, пока имя проекта не задано в настройках. */
  untitled: string
  /** Подпись под ним — тоже до настройки. */
  untitledSub: string

  // ── Бейджи возможностей ───────────────────────────────────────────────────
  badgeLanguages: string
  badgeSeo: string
  badgeDatabase: string
  badgeVectors: string
  badgeKnowledge: string
  badgeStorage: string
  badgeAuth: string
  /** `{roles}` — число ролей. */
  badgeRoles: string
  badgeGithub: string
  badgeArchitecture: string
  badgeMore: string

  // ── Как начать ────────────────────────────────────────────────────────────
  /** Лейбл над заголовком: чем является проект, со ссылкой на платформу. */
  heroPill: string
  startTitle: string
  startIntro: string
  // Вторая секция — то, что панель отмечает оранжевым: начинать можно, но лучше не.
  advisedTitle: string
  advisedIntro: string
  advisedOpenaiTitle: string
  advisedOpenai: string
  advisedOpenaiLink: string
  advisedDomainTitle: string
  advisedDomain: string
  advisedDomainLink: string
  // Третья секция — Quiz. Стоит ПОСЛЕ ключа не случайно: без ключа он не работает.
  quizEyebrow: string
  quizTitle: string
  quizLead: string
  quizStep1Title: string
  quizStep1: string
  quizStep2Title: string
  quizStep2: string
  quizStep3Title: string
  quizStep3: string
  quizGate: string
  quizLink: string
  // Четвёртая секция — чем этот проект является технически.
  archTitle: string
  archScale: string
  archLoop: string
  archSkeleton: string
  step1: string
  step1Link: string
  step2: string
  step2Link: string
  step3: string
  step3Link: string
  step4: string
  step4Link: string
  step5: string
  step6: string
  step6Link: string
}

// 🔒 СЛОВА ЖИВУТ В JSON РЯДОМ, А НЕ ЗДЕСЬ (владелец 2026-08-14).
//
// Тип остаётся в TypeScript и продолжает решать всё: страница без ключа не
// собирается. А сами строки лежат в `home.i18n.json`, потому что переводы делает
// ВНЕШНЯЯ модель и возвращает их файлом. Пока словарь был кодом, каждый новый
// язык означал правку исходника руками — на десяти языках это работа, на
// которой молча теряются кавычки и плейсхолдеры.
//
// Тот же приём, что в панели управления (`admin-translations.json`), и по той же
// причине: корпус приезжает одним файлом, а не вписывается в исходник.
//
// Обмен с внешней моделью — два шага:
//   npm run i18n:export home            → готовый запрос для модели
//   npm run i18n:import home <файл.json> → вложить перевод обратно
// Импорт проверяет полноту ключей и сохранность плейсхолдеров вида {roles}:
// потерянный плейсхолдер в редком языке иначе увидит только клиент.
import UI_JSON from './home.i18n.json'

const UI = UI_JSON as unknown as Record<string, HomeUi>

export function homeUi(lang: string): HomeUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}
