import { CONTENT_DOCS, LEGAL_LANGS, type BannerConfig, type ContentDoc, type LegalConfig } from "./types";

// SHIPPED DEFAULTS (step 305). We author the localized page NAMES + one-line descriptions for all ten
// languages (safe, generic chrome — not legal advice), and an ENGLISH body that is a self-documenting markup
// example. Other languages ship with an empty body → the page shows a "content pending" notice until the
// architect fills the config. Titles/descriptions are also part of the config so the architect can refine
// them; these are just the seed.

const TITLES: Record<ContentDoc, Record<string, string>> = {
  privacy: {
    en: "Privacy Policy", es: "Política de privacidad", fr: "Politique de confidentialité", it: "Informativa sulla privacy",
    ru: "Политика конфиденциальности", de: "Datenschutzerklärung", pt: "Política de Privacidade", pl: "Polityka prywatności",
    tr: "Gizlilik Politikası", nl: "Privacybeleid",
  },
  cookies: {
    en: "Cookie Policy", es: "Política de cookies", fr: "Politique relative aux cookies", it: "Informativa sui cookie",
    ru: "Политика использования файлов cookie", de: "Cookie-Richtlinie", pt: "Política de Cookies", pl: "Polityka plików cookie",
    tr: "Çerez Politikası", nl: "Cookiebeleid",
  },
  terms: {
    en: "Terms of Service", es: "Términos del servicio", fr: "Conditions d'utilisation", it: "Termini di servizio",
    ru: "Условия использования", de: "Nutzungsbedingungen", pt: "Termos de Serviço", pl: "Warunki korzystania z usługi",
    tr: "Hizmet Şartları", nl: "Servicevoorwaarden",
  },
  imprint: {
    en: "Legal Notice", es: "Aviso legal", fr: "Mentions légales", it: "Note legali",
    ru: "Правовая информация", de: "Impressum", pt: "Aviso Legal", pl: "Nota prawna",
    tr: "Yasal Bildirim", nl: "Juridische kennisgeving",
  },
  accessibility: {
    en: "Accessibility Statement", es: "Declaración de accesibilidad", fr: "Déclaration d'accessibilité", it: "Dichiarazione di accessibilità",
    ru: "Заявление о доступности", de: "Barrierefreiheitserklärung", pt: "Declaração de Acessibilidade", pl: "Deklaracja dostępności",
    tr: "Erişilebilirlik Beyanı", nl: "Toegankelijkheidsverklaring",
  },
};

const DESCRIPTIONS: Record<ContentDoc, Record<string, string>> = {
  privacy: {
    en: "How we collect, use, and protect your personal data.",
    es: "Cómo recopilamos, usamos y protegemos tus datos personales.",
    fr: "Comment nous collectons, utilisons et protégeons vos données personnelles.",
    it: "Come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali.",
    ru: "Как мы собираем, используем и защищаем ваши персональные данные.",
    de: "Wie wir Ihre personenbezogenen Daten erheben, verwenden und schützen.",
    pt: "Como coletamos, usamos e protegemos os seus dados pessoais.",
    pl: "Jak zbieramy, wykorzystujemy i chronimy Twoje dane osobowe.",
    tr: "Kişisel verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz.",
    nl: "Hoe wij uw persoonsgegevens verzamelen, gebruiken en beschermen.",
  },
  cookies: {
    en: "What cookies we use and how you can control them.",
    es: "Qué cookies usamos y cómo puedes controlarlas.",
    fr: "Quels cookies nous utilisons et comment les contrôler.",
    it: "Quali cookie utilizziamo e come puoi controllarli.",
    ru: "Какие файлы cookie мы используем и как вы можете ими управлять.",
    de: "Welche Cookies wir verwenden und wie Sie sie steuern können.",
    pt: "Que cookies utilizamos e como pode controlá-los.",
    pl: "Jakich plików cookie używamy i jak możesz nimi zarządzać.",
    tr: "Hangi çerezleri kullandığımız ve bunları nasıl kontrol edebileceğiniz.",
    nl: "Welke cookies wij gebruiken en hoe u ze kunt beheren.",
  },
  terms: {
    en: "The rules and conditions for using this service.",
    es: "Las reglas y condiciones para usar este servicio.",
    fr: "Les règles et conditions d'utilisation de ce service.",
    it: "Le regole e le condizioni per l'utilizzo di questo servizio.",
    ru: "Правила и условия использования этого сервиса.",
    de: "Die Regeln und Bedingungen für die Nutzung dieses Dienstes.",
    pt: "As regras e condições para utilizar este serviço.",
    pl: "Zasady i warunki korzystania z tej usługi.",
    tr: "Bu hizmeti kullanmaya ilişkin kurallar ve koşullar.",
    nl: "De regels en voorwaarden voor het gebruik van deze dienst.",
  },
  imprint: {
    en: "Legally required provider identification and contact details.",
    es: "Identificación del proveedor y datos de contacto exigidos por ley.",
    fr: "Identification du fournisseur et coordonnées requises par la loi.",
    it: "Identificazione del fornitore e recapiti richiesti dalla legge.",
    ru: "Требуемые законом сведения о поставщике и контактные данные.",
    de: "Gesetzlich vorgeschriebene Anbieterkennzeichnung und Kontaktdaten.",
    pt: "Identificação do fornecedor e contactos exigidos por lei.",
    pl: "Wymagane prawem dane identyfikacyjne dostawcy i kontaktowe.",
    tr: "Yasal olarak zorunlu sağlayıcı kimliği ve iletişim bilgileri.",
    nl: "Wettelijk verplichte aanbiederidentificatie en contactgegevens.",
  },
  accessibility: {
    en: "Our commitment to making this service accessible to everyone.",
    es: "Nuestro compromiso de hacer este servicio accesible para todos.",
    fr: "Notre engagement à rendre ce service accessible à tous.",
    it: "Il nostro impegno a rendere questo servizio accessibile a tutti.",
    ru: "Наше обязательство сделать этот сервис доступным для всех.",
    de: "Unser Engagement, diesen Dienst für alle zugänglich zu machen.",
    pt: "O nosso compromisso de tornar este serviço acessível a todos.",
    pl: "Nasze zobowiązanie do udostępnienia tej usługi wszystkim.",
    tr: "Bu hizmeti herkes için erişilebilir kılma taahhüdümüz.",
    nl: "Onze toewijding om deze dienst voor iedereen toegankelijk te maken.",
  },
};

// The English body = a self-documenting markup example. It demonstrates every supported mark and tells the
// architect exactly how to translate the whole document. This SAME text is what an English visitor sees
// until the customer replaces it (owner's requirement, step 305).
function exampleBody(title: string): string[] {
  return [
    `This is placeholder content for the **${title}** page. Replace it with your own legally reviewed text before going live.`,
    "The body supports simple inline formatting so your document stays readable: **bold** for emphasis, *italic* for terms, _underline_ for key phrases, and [links](https://example.com) to related pages. Each item in the list is one paragraph.",
    "To publish this page in every supported language, an architect downloads this document's config, pastes it into an AI model (for example Gemini) with the instruction \"fill the title, description and body for every language, keeping the markup exactly\", and uploads the completed file back.",
  ];
}

const HELP =
  "Fill `title`, `description` and `body` for EVERY language key. `body` is an array of paragraphs; " +
  "keep the inline markup exactly: **bold**, *italic*, _underline_, [text](https://url). Do not rename or " +
  "remove any language key. Then upload this file back on the page in architect mode.";

// Build the shipped default config for one content document: English fully populated (title + description +
// example body), the other nine languages seeded with the localized title/description and an EMPTY body.
export function buildDefaultConfig(doc: ContentDoc): LegalConfig {
  const languages: LegalConfig["languages"] = {};
  for (const lang of LEGAL_LANGS) {
    languages[lang] = {
      title: TITLES[doc][lang] ?? TITLES[doc].en,
      description: DESCRIPTIONS[doc][lang] ?? DESCRIPTIONS[doc].en,
      body: lang === "en" ? exampleBody(TITLES[doc].en) : [],
    };
  }
  return { document: doc, help: HELP, languages };
}

// ── Cookie-consent banner strings (all ten languages; user-facing, so shipped fully populated) ──
const BANNER: Record<string, { message: string; policyLinkLabel: string; accept: string; reject: string }> = {
  en: { message: "We use cookies to run this site and, with your consent, to measure traffic. See our {policy}.", policyLinkLabel: "Cookie Policy", accept: "Accept", reject: "Reject" },
  es: { message: "Usamos cookies para gestionar este sitio y, con tu consentimiento, medir el tráfico. Consulta nuestra {policy}.", policyLinkLabel: "Política de cookies", accept: "Aceptar", reject: "Rechazar" },
  fr: { message: "Nous utilisons des cookies pour faire fonctionner ce site et, avec votre consentement, mesurer l'audience. Consultez notre {policy}.", policyLinkLabel: "Politique relative aux cookies", accept: "Accepter", reject: "Refuser" },
  it: { message: "Usiamo i cookie per far funzionare questo sito e, con il tuo consenso, misurare il traffico. Consulta la nostra {policy}.", policyLinkLabel: "Informativa sui cookie", accept: "Accetta", reject: "Rifiuta" },
  ru: { message: "Мы используем файлы cookie для работы сайта и, с вашего согласия, для оценки трафика. См. нашу {policy}.", policyLinkLabel: "Политику использования файлов cookie", accept: "Принять", reject: "Отклонить" },
  de: { message: "Wir verwenden Cookies für den Betrieb dieser Website und, mit Ihrer Einwilligung, zur Reichweitenmessung. Siehe unsere {policy}.", policyLinkLabel: "Cookie-Richtlinie", accept: "Akzeptieren", reject: "Ablehnen" },
  pt: { message: "Usamos cookies para operar este site e, com o seu consentimento, medir o tráfego. Consulte a nossa {policy}.", policyLinkLabel: "Política de Cookies", accept: "Aceitar", reject: "Rejeitar" },
  pl: { message: "Używamy plików cookie do obsługi tej witryny i, za Twoją zgodą, do pomiaru ruchu. Zobacz naszą {policy}.", policyLinkLabel: "Politykę plików cookie", accept: "Akceptuj", reject: "Odrzuć" },
  tr: { message: "Bu siteyi çalıştırmak ve izniniz ile trafiği ölçmek için çerezleri kullanıyoruz. {policy} bakın.", policyLinkLabel: "Çerez Politikamıza", accept: "Kabul et", reject: "Reddet" },
  nl: { message: "Wij gebruiken cookies om deze site te laten werken en, met uw toestemming, om het verkeer te meten. Zie ons {policy}.", policyLinkLabel: "Cookiebeleid", accept: "Accepteren", reject: "Weigeren" },
};

const BANNER_HELP =
  "Translate `message`, `policyLinkLabel`, `accept` and `reject` for EVERY language. Keep the `{policy}` " +
  "placeholder in `message` exactly where the link to the Cookie Policy should appear.";

export function buildDefaultBannerConfig(): BannerConfig {
  const languages: BannerConfig["languages"] = {};
  for (const lang of LEGAL_LANGS) languages[lang] = BANNER[lang] ?? BANNER.en;
  return { document: "cookie-banner", help: BANNER_HELP, languages };
}

// Localized page name for the footer nav (stable standard name — the footer keeps the standard label even
// if the architect renames the page's own H1 in the config).
export function legalDocTitle(doc: ContentDoc, lang: string): string {
  return TITLES[doc][lang] ?? TITLES[doc].en;
}
