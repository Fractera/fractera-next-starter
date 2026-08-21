// Слова виджета «безопасность» — СВОИ (шаг 521, вторая разновидность).
//
// 🔒 ДЕСЯТЬ ЯЗЫКОВ, страничный набор (правило 4д): виджет принадлежит ОДНОМУ
// маршруту и не переиспользуется. Восемьдесят два несут переиспользуемые части
// продукта — ящик аккаунта, корзину, окна: они являются в любом включённом языке
// сами, а виджет так не появляется. Включат язык сверх десяти — виджет ответит
// по-английски (откат в функции внизу), и это осознанный размен.
//
// 🔒 ЧЕТЫРЕ ПУНКТА — СЛОВА ВЛАДЕЛЬЦА, а не мой пересказ, И ПОРЯДОК ЕГО ЖЕ
// (уточнён 2026-08-22): 01 соответствие регуляторам · 02 сохранность данных ·
// 03 финансы без сюрпризов · 04 своя авторизация. Номер карточки — это её место
// в массиве, поэтому порядок здесь и есть нумерация на экране. Раскладка донора
// не менялась: на широком экране 01 сверху слева, 03 сверху справа, 02 снизу
// слева, 04 снизу справа — диагональное чтение; на узком карточки идут подряд.

export type SecurityCard = {
  title: string
  text: string
  /** Короткий ярлычок под текстом и на плавающей метке орбиты. */
  chip: string
}

export type SecurityOrbitUi = {
  /** Ярлык раздела — то же слово, что у соседних секций страницы. */
  badge: string
  /** Заголовок разорван надвое: вторая половина — акцентом. */
  headingLead: string
  headingAccent: string
  subheading: string
  cards: [SecurityCard, SecurityCard, SecurityCard, SecurityCard]
}

const UI: Record<string, SecurityOrbitUi> = {
  en: {
    badge: "Why it matters",
    headingLead: "Security is built into the",
    headingAccent: "foundation",
    subheading: "Four layers of protection — each one works on its own.",
    cards: [
      { title: "Made to fit the regulator", text: "Personal data stays where the law of your country requires it to stay — on your own server, under your own jurisdiction.", chip: "your country's law" },
      { title: "Your data survives you", text: "Backups, moving to another server, export and import — the project is yours to carry away whole.", chip: "backups and moving" },
      { title: "Money with no surprises", text: "Cloud AI costs and everything else stay on the server you own. Nothing bills you from somewhere else.", chip: "no surprises" },
      { title: "Your own authorization", text: "The whole project is closed by authorization that belongs to you. Security is entirely in your hands.", chip: "your authorization" },
    ],
  },
  ru: {
    badge: "Почему это важно",
    headingLead: "Безопасность встроена в",
    headingAccent: "основу",
    subheading: "Четыре слоя защиты — каждый работает независимо.",
    cards: [
      { title: "Соответствие регуляторам", text: "Персональные данные остаются там, где требует закон вашей страны, — на вашем собственном сервере и в вашей юрисдикции.", chip: "по закону страны" },
      { title: "Сохранность данных", text: "Резервные копии, перенос на другой сервер, выгрузка и загрузка — проект вы вправе унести целиком.", chip: "копии и перенос" },
      { title: "Финансы без сюрпризов", text: "Расходы на облачный искусственный интеллект и всё остальное остаются на вашем сервере. Никто не выставит счёт со стороны.", chip: "без сюрпризов" },
      { title: "Своя авторизация", text: "Весь проект закрыт авторизацией, которая принадлежит вам. Безопасность целиком в ваших руках.", chip: "ваша авторизация" },
    ],
  },
  es: {
    badge: "Por qué importa",
    headingLead: "La seguridad está en la",
    headingAccent: "base",
    subheading: "Cuatro capas de protección: cada una funciona por su cuenta.",
    cards: [
      { title: "A la medida del regulador", text: "Los datos personales se quedan donde exige la ley de su país: en su propio servidor y bajo su jurisdicción.", chip: "ley de su país" },
      { title: "Sus datos le sobreviven", text: "Copias de seguridad, traslado a otro servidor, exportación e importación: el proyecto puede llevárselo entero.", chip: "copias y traslado" },
      { title: "Dinero sin sorpresas", text: "El gasto en IA en la nube y todo lo demás se queda en el servidor que usted posee. Nadie le factura desde fuera.", chip: "sin sorpresas" },
      { title: "Su propia autorización", text: "Todo el proyecto está cerrado con una autorización que le pertenece. La seguridad está por completo en sus manos.", chip: "su autorización" },
    ],
  },
  fr: {
    badge: "Pourquoi c’est important",
    headingLead: "La sécurité est dans les",
    headingAccent: "fondations",
    subheading: "Quatre couches de protection — chacune fonctionne seule.",
    cards: [
      { title: "À la mesure du régulateur", text: "Les données personnelles restent là où la loi de votre pays l'exige : sur votre propre serveur, sous votre juridiction.", chip: "loi de votre pays" },
      { title: "Vos données vous survivent", text: "Sauvegardes, déplacement vers un autre serveur, export et import — le projet, vous pouvez l'emporter entier.", chip: "sauvegardes et transfert" },
      { title: "De l'argent sans surprise", text: "Le coût de l'IA en nuage et tout le reste restent sur le serveur qui vous appartient. Personne ne vous facture d'ailleurs.", chip: "sans surprise" },
      { title: "Votre propre autorisation", text: "Tout le projet est fermé par une autorisation qui vous appartient. La sécurité est entièrement entre vos mains.", chip: "votre autorisation" },
    ],
  },
  it: {
    badge: "Perché conta",
    headingLead: "La sicurezza è nelle",
    headingAccent: "fondamenta",
    subheading: "Quattro livelli di protezione: ciascuno funziona da solo.",
    cards: [
      { title: "Su misura del regolatore", text: "I dati personali restano dove lo impone la legge del suo Paese: sul suo server, nella sua giurisdizione.", chip: "legge del Paese" },
      { title: "I dati le sopravvivono", text: "Copie di sicurezza, trasferimento su un altro server, esportazione e importazione: il progetto può portarselo via intero.", chip: "copie e trasferimento" },
      { title: "Soldi senza sorprese", text: "La spesa per l'IA in cloud e tutto il resto restano sul server che possiede lei. Nessuno le manda un conto da fuori.", chip: "senza sorprese" },
      { title: "La sua autorizzazione", text: "L'intero progetto è chiuso da un'autorizzazione che appartiene a lei. La sicurezza è tutta nelle sue mani.", chip: "la sua autorizzazione" },
    ],
  },
  de: {
    badge: "Warum das zählt",
    headingLead: "Sicherheit steckt im",
    headingAccent: "Fundament",
    subheading: "Vier Schutzschichten — jede arbeitet für sich.",
    cards: [
      { title: "Passend zur Aufsicht", text: "Personenbezogene Daten bleiben dort, wo es das Gesetz Ihres Landes verlangt: auf Ihrem eigenen Server, in Ihrer Rechtsordnung.", chip: "Recht Ihres Landes" },
      { title: "Ihre Daten überdauern", text: "Sicherungskopien, Umzug auf einen anderen Server, Export und Import — das Projekt dürfen Sie ganz mitnehmen.", chip: "Kopien und Umzug" },
      { title: "Geld ohne Überraschungen", text: "Kosten für Cloud-KI und alles andere bleiben auf dem Server, der Ihnen gehört. Niemand stellt Ihnen von außen eine Rechnung.", chip: "ohne Überraschungen" },
      { title: "Ihre eigene Anmeldung", text: "Das ganze Projekt ist durch eine Anmeldung geschlossen, die Ihnen gehört. Die Sicherheit liegt vollständig bei Ihnen.", chip: "Ihre Anmeldung" },
    ],
  },
  pt: {
    badge: "Por que importa",
    headingLead: "A segurança está na",
    headingAccent: "base",
    subheading: "Quatro camadas de proteção — cada uma funciona sozinha.",
    cards: [
      { title: "Na medida do regulador", text: "Os dados pessoais ficam onde a lei do seu país exige: no seu próprio servidor, sob a sua jurisdição.", chip: "lei do seu país" },
      { title: "Seus dados sobrevivem", text: "Cópias de segurança, mudança para outro servidor, exportação e importação — o projeto você pode levar inteiro.", chip: "cópias e mudança" },
      { title: "Dinheiro sem surpresas", text: "O custo da IA na nuvem e todo o resto ficam no servidor que é seu. Ninguém cobra de fora.", chip: "sem surpresas" },
      { title: "Sua própria autorização", text: "Todo o projeto é fechado por uma autorização que pertence a você. A segurança está inteiramente nas suas mãos.", chip: "sua autorização" },
    ],
  },
  pl: {
    badge: "Dlaczego to ważne",
    headingLead: "Bezpieczeństwo tkwi w",
    headingAccent: "fundamencie",
    subheading: "Cztery warstwy ochrony — każda działa osobno.",
    cards: [
      { title: "Zgodnie z regulatorem", text: "Dane osobowe zostają tam, gdzie wymaga tego prawo Twojego kraju — na Twoim własnym serwerze i w Twojej jurysdykcji.", chip: "prawo Twojego kraju" },
      { title: "Dane Cię przeżyją", text: "Kopie zapasowe, przeniesienie na inny serwer, eksport i import — projekt możesz zabrać w całości.", chip: "kopie i przenosiny" },
      { title: "Pieniądze bez niespodzianek", text: "Koszt chmurowej sztucznej inteligencji i cała reszta zostają na serwerze, który należy do Ciebie. Nikt nie wystawi rachunku z zewnątrz.", chip: "bez niespodzianek" },
      { title: "Własna autoryzacja", text: "Cały projekt zamyka autoryzacja, która należy do Ciebie. Bezpieczeństwo jest w całości w Twoich rękach.", chip: "Twoja autoryzacja" },
    ],
  },
  tr: {
    badge: "Neden önemli",
    headingLead: "Güvenlik en",
    headingAccent: "temelde",
    subheading: "Dört koruma katmanı — her biri kendi başına çalışır.",
    cards: [
      { title: "Düzenleyiciye uygun", text: "Kişisel veriler ülkenizin yasasının gerektirdiği yerde kalır: kendi sunucunuzda, kendi yargı alanınızda.", chip: "ülkenizin yasası" },
      { title: "Veriniz sizinle kalır", text: "Yedekler, başka sunucuya taşıma, dışa ve içe aktarma — projeyi bütünüyle götürebilirsiniz.", chip: "yedek ve taşıma" },
      { title: "Sürprizsiz bütçe", text: "Bulut yapay zekâ gideri ve geri kalan her şey size ait sunucuda kalır. Kimse dışarıdan fatura kesmez.", chip: "sürpriz yok" },
      { title: "Kendi yetkilendirmeniz", text: "Tüm proje size ait bir yetkilendirmeyle kapalıdır. Güvenlik tümüyle sizin elinizde.", chip: "sizin yetkilendirmeniz" },
    ],
  },
  nl: {
    badge: "Waarom dit telt",
    headingLead: "Veiligheid zit in het",
    headingAccent: "fundament",
    subheading: "Vier beschermingslagen — elk werkt op zichzelf.",
    cards: [
      { title: "Op maat van de toezichthouder", text: "Persoonsgegevens blijven waar de wet van uw land dat eist: op uw eigen server, binnen uw rechtsgebied.", chip: "wet van uw land" },
      { title: "Uw gegevens blijven van u", text: "Reservekopieën, verhuizen naar een andere server, export en import — het project mag u in zijn geheel meenemen.", chip: "kopieën en verhuizing" },
      { title: "Geld zonder verrassingen", text: "Kosten voor AI in de cloud en al het andere blijven op de server die van u is. Niemand stuurt u van buitenaf een rekening.", chip: "geen verrassingen" },
      { title: "Uw eigen autorisatie", text: "Het hele project is gesloten met een autorisatie die van u is. De veiligheid ligt volledig in uw handen.", chip: "uw autorisatie" },
    ],
  },
}

export function securityOrbitUi(lang: string): SecurityOrbitUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}
