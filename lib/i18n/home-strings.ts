import { DEFAULT_LANGUAGE } from "@/config/translations/translations.config";

// Minimal per-language strings for the starter's home page. This is a SMALL
// local strings map, not the full per-document content resolver (that folder-per-
// document + deep-merge infrastructure — which the create-multilingual-content-
// entry skill writes into — is a separate follow-up step). It exists so the
// shipped bilingual starter (en + es by default) actually shows translated copy,
// demonstrating the multilingual routing end to end. Add a language = add a key.
export type HomeStrings = {
  badge: string;
  liveLead: string; // "Your app is already live in production"
  atWord: string; // "at"
  replaceDomain: string; // "— a domain you can replace with your own at any time."
  openAdminPre: string; // "Open the"
  adminPanel: string; // "Admin Panel"
  openAdminPost: string; // "to customize this page and turn it into your own product."
  startCoding: string;
  dashboard: string;
  footer: string; // "Your code · Your server · Your AI"
};

const STRINGS: Record<string, HomeStrings> = {
  en: {
    badge: "Fractera-next-starter",
    liveLead: "Your app is already live in production",
    atWord: "at",
    replaceDomain: "— a domain you can replace with your own at any time.",
    openAdminPre: "Open the",
    adminPanel: "Admin Panel",
    openAdminPost: "to customize this page and turn it into your own product.",
    startCoding: "Start Coding",
    dashboard: "Dashboard",
    footer: "Your code · Your server · Your AI",
  },
  es: {
    badge: "Fractera-next-starter",
    liveLead: "Tu aplicación ya está en producción",
    atWord: "en",
    replaceDomain: "— un dominio que puedes reemplazar por el tuyo en cualquier momento.",
    openAdminPre: "Abre el",
    adminPanel: "Panel de administración",
    openAdminPost: "para personalizar esta página y convertirla en tu propio producto.",
    startCoding: "Empezar a programar",
    dashboard: "Panel",
    footer: "Tu código · Tu servidor · Tu IA",
  },
};

export function getHomeStrings(lang: string): HomeStrings {
  return STRINGS[lang] ?? STRINGS[DEFAULT_LANGUAGE] ?? STRINGS.en;
}
