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

const UI: Record<string, HomeUi> = {
  en: { untitled: "This is your application", untitledSub: "It runs on your own server and answers to nobody else. Give it a name in the control panel — this line will disappear.", badgeLanguages: "82 languages", badgeSeo: "SEO built in", badgeDatabase: "Own database", badgeVectors: "Vector search", badgeKnowledge: "Knowledge graph", badgeStorage: "Own file storage", badgeAuth: "Authorization", badgeRoles: "{roles} roles", badgeGithub: "GitHub", badgeArchitecture: "Fractera architecture", badgeMore: "100+ more", startTitle: "How to start", startIntro: "Six steps from a bare server to your own code in production. Everything below is already installed — you are switching it on, not building it.", step1: "Open the control panel — everything about this server is configured there.", step1Link: "Control panel", step2: "Pick the languages your application will ship in.", step2Link: "Languages", step3: "Use the settings to describe your project: name, description, logo, SEO.", step3Link: "App settings", step4: "Connect GitHub and push the server's code into your repository.", step4Link: "GitHub", step5: "Clone that repository onto your own machine, develop there, and push back.", step6: "Press Deploy in the panel — the server takes your commit and rebuilds itself.", step6Link: "Deployments", advisedTitle: "Recommended before you start", advisedIntro: "Neither blocks anything. Both save rework: the first switches on the thinking half of the product, the second changes the address of every page.", advisedOpenaiTitle: "An OpenAI key.", advisedOpenai: "Without it the site works in full, but vector search and the knowledge graph stay empty: embeddings and text analysis are done by a model. The key is entered once and the cost goes straight to your model provider.", advisedOpenaiLink: "OpenAI key", advisedDomainTitle: "Your own domain.", advisedDomain: "While the site lives at a numeric address it has no certificate and no installable app — a browser grants those only over a secure connection. Moving to a domain changes every page address, so it is cheaper to do before they are indexed.", advisedDomainLink: "Domain", archTitle: "What this project is, technically", archScale: "This is not a finished site but the Fractera architecture: one skeleton carries a landing page, a large SaaS and multi-level automation alike. Growth needs no rewrite — the data, authorization and panel layers are already separate, and each is built for load you do not have yet.", archLoop: "Code is not written here. A developer clones the repository to their own machine and works with Claude Code, which reads the instructions and skills that live inside the project: they state the rules, and machine checks refuse to let them be broken. The server only receives the result and rebuilds.", archSkeleton: "The skeleton is built for a project that will outgrow a million lines: every entity owns its folder, the shared layer does not grow with their number, and routes and permissions are declared where they are enforced. Stability here is not a promise but a consequence — a new page adds nothing to a central spine.", quizEyebrow: "Before any code", quizTitle: "Quiz — seven questions instead of a blank page", quizLead: "A project's most expensive mistake is made before the first line of code: the wrong thing gets built. Not through poor building, but because «where do I start» is hard to answer alone. Quiz turns it into a conversation: you answer, the model asks further, and out of it grows the list of scenarios the project is then built from.", quizStep1Title: "The seed", quizStep1: "Seven short questions: what the product is, who it is for, what a person should walk away with. Answer in your own words — dictation works. Everything after this grows from here, so a couple of sentences yields a markedly better result than a couple of words.", quizStep2Title: "The conversation", quizStep2: "Then one question at a time, in your language. There is an auto-quiz: the model asks five new questions and answers them itself, deepening the description — but anything it invented on your behalf is marked «Assumption», and you correct it. A guess passed off as fact would surface later, inside the finished scenarios.", quizStep3Title: "The scenarios", quizStep3: "The conversation is synthesised into numbered cases: who arrives, what they do, what must be true at the end. You read and confirm each one separately. An unread case is still the model's guess.", quizGate: "And this is a product rule, not advice: while a single case is unconfirmed the panel keeps its alarm lit and the coding agent refuses to build. Building on an unread guess costs more than not building at all.", quizLink: "Open Quiz", heroPill: "Agentic engineering infrastructure" },
  ru: { untitled: "Это ваше приложение", untitledSub: "Оно работает на вашем сервере и не отчитывается ни перед кем. Дайте ему имя в панели управления — эта строка исчезнет.", badgeLanguages: "82 языка", badgeSeo: "SEO из коробки", badgeDatabase: "Своя база данных", badgeVectors: "Векторный поиск", badgeKnowledge: "Граф знаний", badgeStorage: "Своё хранилище файлов", badgeAuth: "Авторизация", badgeRoles: "Ролей: {roles}", badgeGithub: "GitHub", badgeArchitecture: "Архитектура Fractera", badgeMore: "100+ возможностей", startTitle: "Как начать", startIntro: "Шесть шагов от пустого сервера до вашего кода в работе. Всё перечисленное уже установлено — вы это включаете, а не строите.", step1: "Откройте панель управления — всё об этом сервере настраивается там.", step1Link: "Панель управления", step2: "Выберите языки, на которых будет работать ваше приложение.", step2Link: "Языки", step3: "Опишите проект в настройках: название, описание, логотип, SEO.", step3Link: "Настройки приложения", step4: "Подключите GitHub и отправьте код сервера в свой репозиторий.", step4Link: "GitHub", step5: "Клонируйте этот репозиторий на свою машину, разрабатывайте и отправляйте обратно.", step6: "Нажмите «Развернуть» в панели — сервер заберёт ваш коммит и пересоберётся.", step6Link: "Развёртывания", advisedTitle: "Рекомендуется до старта", advisedIntro: "Ни то, ни другое не мешает работать. Но сделанное заранее избавляет от переделки: первое открывает думающую половину продукта, второе меняет адреса всех страниц.", advisedOpenaiTitle: "Ключ OpenAI.", advisedOpenai: "Без него сайт работает полностью, но векторный поиск и граф знаний не наполняются: представления и разбор текста считает модель. Ключ вводится один раз, расход идёт напрямую вашему поставщику модели.", advisedOpenaiLink: "Ключ OpenAI", advisedDomainTitle: "Собственный домен.", advisedDomain: "Пока сайт живёт по адресу-числу, у него нет ни сертификата, ни устанавливаемого приложения — браузер даёт это только защищённому соединению. Переезд на домен меняет адрес каждой страницы, поэтому дешевле сделать его до того, как их проиндексировали.", advisedDomainLink: "Домен", archTitle: "Что это за проект технически", archScale: "Перед вами не готовый сайт, а архитектура Fractera: один и тот же скелет держит и посадочную страницу, и крупный SaaS, и многоуровневую автоматизацию. Расти можно без переписывания — слои данных, авторизации и панели уже разделены, и каждый из них рассчитан на нагрузку, которой у вас пока нет.", archLoop: "Код пишется не здесь. Разработчик клонирует репозиторий на свою машину и работает с Claude Code, который читает инструкции и навыки, лежащие в самом проекте: они описывают принятые правила, а машинные проверки не дают их нарушить. Сервер только принимает результат и пересобирается.", archSkeleton: "Скелет рассчитан на проект, который перерастёт миллион строк: у каждой сущности своя папка, общий слой не растёт от их числа, а маршруты и права объявляются там, где применяются. Устойчивость здесь — не обещание, а следствие того, что новая страница ничего не добавляет в общий центр.", quizEyebrow: "Прежде чем писать код", quizTitle: "Quiz — семь вопросов вместо чистого листа", quizLead: "Самая дорогая ошибка проекта совершается до первой строки кода: строят не то. Не потому что плохо строят, а потому что «с чего начать» — вопрос, на который трудно ответить в одиночку. Quiz превращает его в разговор: вы отвечаете, модель спрашивает дальше, и из этого вырастает список сценариев, по которым проект и будет собран.", quizStep1Title: "Затравка", quizStep1: "Семь коротких вопросов: что за продукт, для кого, что человек должен получить. Отвечать своими словами — можно голосом. Всё дальнейшее вырастает отсюда, поэтому пара фраз даёт заметно лучший результат, чем пара слов.", quizStep2Title: "Разговор", quizStep2: "Дальше по одному вопросу за раз, на вашем языке. Есть автоквиз: модель задаёт пять новых вопросов и сама на них отвечает, углубляя описание, — но всё, что она домыслила за вас, помечено словом «Предположение», и вы это правите. Догадка, выданная за факт, всплыла бы уже в готовых сценариях.", quizStep3Title: "Сценарии", quizStep3: "Разговор синтезируется в пронумерованные кейсы: кто приходит, что делает, что должно быть правдой в конце. Каждый вы читаете и подтверждаете — по одному. Непрочитанный кейс остаётся догадкой модели.", quizGate: "И это не совет, а правило продукта: пока хоть один кейс не подтверждён, панель держит тревогу, а агент-программист отказывается строить. Строить по непрочитанной догадке дороже, чем не строить вовсе.", quizLink: "Открыть Quiz", heroPill: "Инфраструктура агентной инженерии" },
}

export function homeUi(lang: string): HomeUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}
