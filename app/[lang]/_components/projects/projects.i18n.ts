// TEN-LANGUAGE strings for the public Projects surface (step 304) — co-located dictionary, same pattern as
// components/menu/footer/footer-menu.i18n.ts. Category title/description come already-localized from the 3003
// catalog (titleI18n/descriptionI18n) and are NOT re-translated here; this covers only the fixed chrome:
// the home title/subtitle, the breadcrumb root, the empty-category state, and the body access-error message.
// Languages: the ten admin-layer languages (en, es, fr, it, ru, de, pt, pl, tr, nl). Add a language = add a key.

export type ProjectsStrings = {
  homeTitle: string;
  homeSubtitle: string;
  breadcrumbRoot: string;
  emptyCategory: string;
  bodyNoAccessTitle: string;
  bodyNoAccessText: string;
};

const STRINGS: Record<string, ProjectsStrings> = {
  en: {
    homeTitle: "Projects",
    homeSubtitle: "Explore the automations available in this workspace.",
    breadcrumbRoot: "Projects",
    emptyCategory: "No automations here yet.",
    bodyNoAccessTitle: "Access restricted",
    bodyNoAccessText:
      "You don't have permission to view this automation's content. Sign in or request access.",
  },
  ru: {
    homeTitle: "Проекты",
    homeSubtitle: "Автоматизации, доступные в этом рабочем пространстве.",
    breadcrumbRoot: "Проекты",
    emptyCategory: "Здесь пока нет автоматизаций.",
    bodyNoAccessTitle: "Доступ ограничен",
    bodyNoAccessText:
      "У вас нет прав на просмотр содержимого этой автоматизации. Войдите или запросите доступ.",
  },
  es: {
    homeTitle: "Proyectos",
    homeSubtitle: "Explora las automatizaciones disponibles en este espacio de trabajo.",
    breadcrumbRoot: "Proyectos",
    emptyCategory: "Aún no hay automatizaciones aquí.",
    bodyNoAccessTitle: "Acceso restringido",
    bodyNoAccessText:
      "No tienes permiso para ver el contenido de esta automatización. Inicia sesión o solicita acceso.",
  },
  fr: {
    homeTitle: "Projets",
    homeSubtitle: "Découvrez les automatisations disponibles dans cet espace de travail.",
    breadcrumbRoot: "Projets",
    emptyCategory: "Aucune automatisation ici pour le moment.",
    bodyNoAccessTitle: "Accès restreint",
    bodyNoAccessText:
      "Vous n'avez pas l'autorisation de voir le contenu de cette automatisation. Connectez-vous ou demandez l'accès.",
  },
  it: {
    homeTitle: "Progetti",
    homeSubtitle: "Esplora le automazioni disponibili in questo spazio di lavoro.",
    breadcrumbRoot: "Progetti",
    emptyCategory: "Ancora nessuna automazione qui.",
    bodyNoAccessTitle: "Accesso limitato",
    bodyNoAccessText:
      "Non hai il permesso di vedere il contenuto di questa automazione. Accedi o richiedi l'accesso.",
  },
  de: {
    homeTitle: "Projekte",
    homeSubtitle: "Entdecke die Automatisierungen in diesem Arbeitsbereich.",
    breadcrumbRoot: "Projekte",
    emptyCategory: "Hier gibt es noch keine Automatisierungen.",
    bodyNoAccessTitle: "Zugriff eingeschränkt",
    bodyNoAccessText:
      "Du hast keine Berechtigung, den Inhalt dieser Automatisierung zu sehen. Melde dich an oder fordere Zugriff an.",
  },
  pt: {
    homeTitle: "Projetos",
    homeSubtitle: "Explore as automações disponíveis neste espaço de trabalho.",
    breadcrumbRoot: "Projetos",
    emptyCategory: "Ainda não há automações aqui.",
    bodyNoAccessTitle: "Acesso restrito",
    bodyNoAccessText:
      "Você não tem permissão para ver o conteúdo desta automação. Faça login ou solicite acesso.",
  },
  pl: {
    homeTitle: "Projekty",
    homeSubtitle: "Poznaj automatyzacje dostępne w tym obszarze roboczym.",
    breadcrumbRoot: "Projekty",
    emptyCategory: "Nie ma tu jeszcze żadnych automatyzacji.",
    bodyNoAccessTitle: "Dostęp ograniczony",
    bodyNoAccessText:
      "Nie masz uprawnień do wyświetlenia treści tej automatyzacji. Zaloguj się lub poproś o dostęp.",
  },
  tr: {
    homeTitle: "Projeler",
    homeSubtitle: "Bu çalışma alanındaki otomasyonları keşfedin.",
    breadcrumbRoot: "Projeler",
    emptyCategory: "Burada henüz otomasyon yok.",
    bodyNoAccessTitle: "Erişim kısıtlı",
    bodyNoAccessText:
      "Bu otomasyonun içeriğini görüntüleme izniniz yok. Giriş yapın veya erişim isteyin.",
  },
  nl: {
    homeTitle: "Projecten",
    homeSubtitle: "Ontdek de automatiseringen in deze werkruimte.",
    breadcrumbRoot: "Projecten",
    emptyCategory: "Hier zijn nog geen automatiseringen.",
    bodyNoAccessTitle: "Toegang beperkt",
    bodyNoAccessText:
      "Je hebt geen toestemming om de inhoud van deze automatisering te bekijken. Log in of vraag toegang aan.",
  },
};

export function projectsStrings(lang: string): ProjectsStrings {
  return STRINGS[lang] ?? STRINGS[lang.slice(0, 2)] ?? STRINGS.en;
}
