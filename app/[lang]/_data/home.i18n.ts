// Слова главной страницы.
//
// 🔒 82 ЯЗЫКА. Главная — первое, что видит человек на СВЕЖЕМ сервере, до всякой
// настройки: она объясняет, что он получил и что делать дальше. Владелец включит
// в панели любой из 82 языков — и объяснение обязано заговорить на нём в ту же
// минуту, иначе первое впечатление о продукте будет на чужом языке.
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
  startTitle: string
  startIntro: string
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

const UI: Record<string, HomeUi> = {
  en: { untitled: "This is your application", untitledSub: "It runs on your own server and answers to nobody else. Give it a name in the control panel — this line will disappear.", badgeLanguages: "82 languages", badgeSeo: "SEO built in", badgeDatabase: "Own database", badgeVectors: "Vector search", badgeKnowledge: "Knowledge graph", badgeStorage: "Own file storage", badgeAuth: "Authorization", badgeRoles: "{roles} roles", badgeGithub: "GitHub", badgeArchitecture: "Fractera architecture", badgeMore: "100+ more", startTitle: "How to start", startIntro: "Six steps from a bare server to your own code in production. Everything below is already installed — you are switching it on, not building it.", step1: "Open the control panel — everything about this server is configured there.", step1Link: "Control panel", step2: "Pick the languages your application will ship in.", step2Link: "Languages", step3: "Use the settings to describe your project: name, description, logo, SEO.", step3Link: "App settings", step4: "Connect GitHub and push the server's code into your repository.", step4Link: "GitHub", step5: "Clone that repository onto your own machine, develop there, and push back.", step6: "Press Deploy in the panel — the server takes your commit and rebuilds itself.", step6Link: "Deployments" },
  ru: { untitled: "Это ваше приложение", untitledSub: "Оно работает на вашем сервере и не отчитывается ни перед кем. Дайте ему имя в панели управления — эта строка исчезнет.", badgeLanguages: "82 языка", badgeSeo: "SEO из коробки", badgeDatabase: "Своя база данных", badgeVectors: "Векторный поиск", badgeKnowledge: "Граф знаний", badgeStorage: "Своё хранилище файлов", badgeAuth: "Авторизация", badgeRoles: "Ролей: {roles}", badgeGithub: "GitHub", badgeArchitecture: "Архитектура Fractera", badgeMore: "100+ возможностей", startTitle: "Как начать", startIntro: "Шесть шагов от пустого сервера до вашего кода в работе. Всё перечисленное уже установлено — вы это включаете, а не строите.", step1: "Откройте панель управления — всё об этом сервере настраивается там.", step1Link: "Панель управления", step2: "Выберите языки, на которых будет работать ваше приложение.", step2Link: "Языки", step3: "Опишите проект в настройках: название, описание, логотип, SEO.", step3Link: "Настройки приложения", step4: "Подключите GitHub и отправьте код сервера в свой репозиторий.", step4Link: "GitHub", step5: "Клонируйте этот репозиторий на свою машину, разрабатывайте и отправляйте обратно.", step6: "Нажмите «Развернуть» в панели — сервер заберёт ваш коммит и пересоберётся.", step6Link: "Развёртывания" },
}

export function homeUi(lang: string): HomeUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}
