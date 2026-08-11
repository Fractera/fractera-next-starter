// Слова диалога переводов. Ко-локированы рядом с ним: это строки интерфейса,
// то есть данные, известные на сборке (GLOSSARY.md, «три вида переводов»).
//
// Сообщений об ОТКАЗАХ здесь нет: они общие для голосового ввода, перевода и
// любой будущей думающей части, живут один раз в `lib/i18n/platform-errors.ts`
// на 82 языках и приходят в диалог пропсом.
//
// 🕳 ДОЛГ, НАЗВАННЫЙ ВСЛУХ: сам этот словарь пока на десяти языках, а правило
// `/code/CLAUDE.md` §4д требует 82. Язык вне десятки честно падает на
// английский; довести до 82 — отдельной работой.

export type TranslationsUi = {
  title: string
  intro: string
  translateTab: string
  translateAllTabs: string
  translating: string
  saveOne: string
  saving: string
  savedMark: string
  skip: string
  close: string
  /** Текст у вопросика — почему пропуск это нормально. */
  hint: string
  saved: string
}

const UI: Record<string, TranslationsUi> = {
  en: { title: 'Add translations', intro: 'Fill the languages your app ships in. Nothing is translated until you ask.', translateTab: 'Translate this tab', translateAllTabs: 'Translate all tabs', translating: 'Translating…', saveOne: 'Save this translation', saving: 'Saving…', savedMark: 'saved', skip: 'Skip for now', close: 'Close', hint: 'Designing a page and not sure it is final? Skip the translations. The record lives in the language you are working in, and you add the rest when the wording settles — translating a draft spends time and tokens on text you are about to rewrite.', saved: 'Translation saved' },
  ru: { title: 'Добавление переводов', intro: 'Заполните языки, на которых работает приложение. Ничего не переводится, пока вы не попросите.', translateTab: 'Перевести эту вкладку', translateAllTabs: 'Перевести все вкладки', translating: 'Перевожу…', saveOne: 'Сохранить перевод', saving: 'Сохраняю…', savedMark: 'сохранено', skip: 'Пропустить', close: 'Закрыть', hint: 'Проектируете страницу и не уверены, что это финальная редакция? Пропустите переводы. Запись останется на языке, на котором вы работаете, а остальные добавите, когда формулировки устоятся, — перевод черновика тратит время и токены на текст, который вы вот-вот перепишете.', saved: 'Перевод сохранён' },
  es: { title: 'Añadir traducciones', intro: 'Rellena los idiomas de tu aplicación. Nada se traduce hasta que lo pidas.', translateTab: 'Traducir esta pestaña', translateAllTabs: 'Traducir todas las pestañas', translating: 'Traduciendo…', saveOne: 'Guardar traducción', saving: 'Guardando…', savedMark: 'guardado', skip: 'Omitir por ahora', close: 'Cerrar', hint: '¿Estás diseñando y no sabes si es la versión final? Omite las traducciones. El registro vive en el idioma en el que trabajas y añades el resto cuando el texto se asiente: traducir un borrador gasta tiempo y tokens en algo que vas a reescribir.', saved: 'Traducción guardada' },
  fr: { title: 'Ajouter des traductions', intro: 'Remplissez les langues de votre application. Rien n’est traduit tant que vous ne le demandez pas.', translateTab: 'Traduire cet onglet', translateAllTabs: 'Traduire tous les onglets', translating: 'Traduction…', saveOne: 'Enregistrer la traduction', saving: 'Enregistrement…', savedMark: 'enregistré', skip: 'Passer pour l’instant', close: 'Fermer', hint: 'Vous concevez une page sans savoir si elle est finale ? Passez les traductions. L’enregistrement reste dans votre langue de travail, et vous ajouterez le reste une fois le texte stabilisé — traduire un brouillon dépense du temps et des tokens pour du texte que vous allez réécrire.', saved: 'Traduction enregistrée' },
  it: { title: 'Aggiungi traduzioni', intro: 'Compila le lingue della tua applicazione. Nulla viene tradotto finché non lo chiedi.', translateTab: 'Traduci questa scheda', translateAllTabs: 'Traduci tutte le schede', translating: 'Traduzione…', saveOne: 'Salva traduzione', saving: 'Salvataggio…', savedMark: 'salvato', skip: 'Salta per ora', close: 'Chiudi', hint: 'Stai progettando e non sai se è la versione finale? Salta le traduzioni. Il record resta nella lingua in cui lavori e aggiungi il resto quando il testo si assesta: tradurre una bozza spende tempo e token su testo che riscriverai.', saved: 'Traduzione salvata' },
  de: { title: 'Übersetzungen hinzufügen', intro: 'Füllen Sie die Sprachen Ihrer Anwendung. Es wird nichts übersetzt, bevor Sie darum bitten.', translateTab: 'Diesen Tab übersetzen', translateAllTabs: 'Alle Tabs übersetzen', translating: 'Übersetze…', saveOne: 'Übersetzung speichern', saving: 'Speichere…', savedMark: 'gespeichert', skip: 'Vorerst überspringen', close: 'Schließen', hint: 'Entwerfen Sie noch und wissen nicht, ob es die finale Fassung ist? Überspringen Sie die Übersetzungen. Der Eintrag bleibt in Ihrer Arbeitssprache; den Rest fügen Sie hinzu, wenn der Text steht — einen Entwurf zu übersetzen kostet Zeit und Tokens für Text, den Sie ohnehin neu schreiben.', saved: 'Übersetzung gespeichert' },
  pt: { title: 'Adicionar traduções', intro: 'Preencha os idiomas do seu aplicativo. Nada é traduzido até você pedir.', translateTab: 'Traduzir esta aba', translateAllTabs: 'Traduzir todas as abas', translating: 'Traduzindo…', saveOne: 'Salvar tradução', saving: 'Salvando…', savedMark: 'salvo', skip: 'Pular por agora', close: 'Fechar', hint: 'Está desenhando e não sabe se é a versão final? Pule as traduções. O registro fica no idioma em que você trabalha e o resto vem quando o texto assentar — traduzir rascunho gasta tempo e tokens com texto que você vai reescrever.', saved: 'Tradução salva' },
  pl: { title: 'Dodaj tłumaczenia', intro: 'Wypełnij języki swojej aplikacji. Nic nie jest tłumaczone, dopóki nie poprosisz.', translateTab: 'Przetłumacz tę zakładkę', translateAllTabs: 'Przetłumacz wszystkie zakładki', translating: 'Tłumaczę…', saveOne: 'Zapisz tłumaczenie', saving: 'Zapisuję…', savedMark: 'zapisano', skip: 'Pomiń na razie', close: 'Zamknij', hint: 'Projektujesz i nie wiesz, czy to wersja finalna? Pomiń tłumaczenia. Wpis zostaje w języku, w którym pracujesz, a resztę dodasz, gdy tekst się ustali — tłumaczenie szkicu to czas i tokeny wydane na tekst, który i tak przepiszesz.', saved: 'Tłumaczenie zapisane' },
  tr: { title: 'Çeviri ekle', intro: 'Uygulamanızın dillerini doldurun. Siz istemeden hiçbir şey çevrilmez.', translateTab: 'Bu sekmeyi çevir', translateAllTabs: 'Tüm sekmeleri çevir', translating: 'Çevriliyor…', saveOne: 'Çeviriyi kaydet', saving: 'Kaydediliyor…', savedMark: 'kaydedildi', skip: 'Şimdilik atla', close: 'Kapat', hint: 'Sayfayı tasarlıyorsunuz ve son hâli mi bilmiyor musunuz? Çevirileri atlayın. Kayıt çalıştığınız dilde kalır, metin oturunca gerisini eklersiniz — taslağı çevirmek, birazdan yeniden yazacağınız metne zaman ve token harcamaktır.', saved: 'Çeviri kaydedildi' },
  nl: { title: 'Vertalingen toevoegen', intro: 'Vul de talen van uw applicatie in. Er wordt niets vertaald tot u erom vraagt.', translateTab: 'Dit tabblad vertalen', translateAllTabs: 'Alle tabbladen vertalen', translating: 'Bezig met vertalen…', saveOne: 'Vertaling opslaan', saving: 'Opslaan…', savedMark: 'opgeslagen', skip: 'Nu overslaan', close: 'Sluiten', hint: 'Ontwerpt u nog en weet u niet of dit de definitieve versie is? Sla de vertalingen over. De record blijft in uw werktaal en de rest voegt u toe zodra de tekst vastligt — een concept vertalen kost tijd en tokens voor tekst die u toch herschrijft.', saved: 'Vertaling opgeslagen' },
}

export function translationsUi(lang: string): TranslationsUi {
  return UI[lang] ?? UI[lang.slice(0, 2)] ?? UI.en
}
