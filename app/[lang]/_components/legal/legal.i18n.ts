// TEN-LANGUAGE UI chrome for the legal layer (step 305) — footer section heading, the "not published yet"
// notice, the architect Download/Upload button labels + toasts, the breadcrumb, and the markup hint. Page
// title/description/body come from the per-document config, NOT from here.

export type LegalUi = {
  heading: string; // footer section heading
  pending: string; // shown instead of the body when the customer hasn't provided it
  download: string;
  upload: string;
  uploaded: string;
  uploadFailed: string;
  home: string;
  markupHelp: string;
};

const UI: Record<string, LegalUi> = {
  en: { heading: "Legal", pending: "This content has not been published yet.", download: "Download config", upload: "Upload config", uploaded: "Configuration uploaded.", uploadFailed: "Upload failed.", home: "Home", markupHelp: "Supports **bold**, *italic*, _underline_ and [links](url)." },
  ru: { heading: "Правовое", pending: "Этот контент ещё не опубликован.", download: "Скачать конфиг", upload: "Загрузить конфиг", uploaded: "Конфигурация загружена.", uploadFailed: "Не удалось загрузить.", home: "Главная", markupHelp: "Поддерживает **жирный**, *курсив*, _подчёркнутый_ и [ссылки](url)." },
  es: { heading: "Legal", pending: "Este contenido aún no se ha publicado.", download: "Descargar configuración", upload: "Subir configuración", uploaded: "Configuración subida.", uploadFailed: "Error al subir.", home: "Inicio", markupHelp: "Admite **negrita**, *cursiva*, _subrayado_ y [enlaces](url)." },
  fr: { heading: "Mentions légales", pending: "Ce contenu n'a pas encore été publié.", download: "Télécharger la config", upload: "Importer la config", uploaded: "Configuration importée.", uploadFailed: "Échec de l'import.", home: "Accueil", markupHelp: "Prend en charge **gras**, *italique*, _souligné_ et [liens](url)." },
  it: { heading: "Note legali", pending: "Questo contenuto non è ancora stato pubblicato.", download: "Scarica configurazione", upload: "Carica configurazione", uploaded: "Configurazione caricata.", uploadFailed: "Caricamento non riuscito.", home: "Home", markupHelp: "Supporta **grassetto**, *corsivo*, _sottolineato_ e [link](url)." },
  de: { heading: "Rechtliches", pending: "Dieser Inhalt wurde noch nicht veröffentlicht.", download: "Konfig herunterladen", upload: "Konfig hochladen", uploaded: "Konfiguration hochgeladen.", uploadFailed: "Upload fehlgeschlagen.", home: "Startseite", markupHelp: "Unterstützt **fett**, *kursiv*, _unterstrichen_ und [Links](url)." },
  pt: { heading: "Legal", pending: "Este conteúdo ainda não foi publicado.", download: "Baixar configuração", upload: "Enviar configuração", uploaded: "Configuração enviada.", uploadFailed: "Falha no envio.", home: "Início", markupHelp: "Suporta **negrito**, *itálico*, _sublinhado_ e [links](url)." },
  pl: { heading: "Informacje prawne", pending: "Ta treść nie została jeszcze opublikowana.", download: "Pobierz konfigurację", upload: "Prześlij konfigurację", uploaded: "Konfiguracja przesłana.", uploadFailed: "Przesyłanie nie powiodło się.", home: "Strona główna", markupHelp: "Obsługuje **pogrubienie**, *kursywę*, _podkreślenie_ i [linki](url)." },
  tr: { heading: "Yasal", pending: "Bu içerik henüz yayımlanmadı.", download: "Yapılandırmayı indir", upload: "Yapılandırmayı yükle", uploaded: "Yapılandırma yüklendi.", uploadFailed: "Yükleme başarısız.", home: "Ana sayfa", markupHelp: "**Kalın**, *italik*, _altı çizili_ ve [bağlantılar](url) desteklenir." },
  nl: { heading: "Juridisch", pending: "Deze inhoud is nog niet gepubliceerd.", download: "Config downloaden", upload: "Config uploaden", uploaded: "Configuratie geüpload.", uploadFailed: "Uploaden mislukt.", home: "Home", markupHelp: "Ondersteunt **vet**, *cursief*, _onderstreept_ en [links](url)." },
};

export function legalUi(lang: string): LegalUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en;
}
