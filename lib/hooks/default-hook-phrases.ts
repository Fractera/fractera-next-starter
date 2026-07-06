// Default hook phrases for the personal-automation starter (step 187.6). Three ready
// trigger phrases per language — save / remind / recall — idiomatic and memorable, each
// carrying "Fractera". Seeded into a composed project's _data/hooks.ts (via the composer
// --hook-phrases arg) for the slot's language; the user can add/remove/reword afterwards.
//
// remind and recall are worded DISTINCTLY on purpose: the hooks registry enforces GLOBAL
// phrase uniqueness (lib/hooks/normalize.ts), so "remind me" and "what did I save about…"
// must not collapse into one phrase.
//
// Coverage: a broad core of languages with idiomatic phrasing; unlisted languages fall
// back to English (defaultHookPhrases(lang) ?? en) — never a fabricated translation
// (avoids mojibake, rule 4б). The Russian seed is the owner's exact wording.

export type HookAction = "save" | "remind" | "recall";

export type DefaultHookPhrase = {
  action: HookAction;
  phrase: string;
  description: string;
};

const EN: DefaultHookPhrase[] = [
  { action: "save", phrase: "by the way, Fractera, remember this:", description: "Save the text that follows into memory." },
  { action: "remind", phrase: "by the way, Fractera, remind me to", description: "Create a reminder; if no date/time is given, the agent asks when." },
  { action: "recall", phrase: "by the way, Fractera, what did I save about", description: "Search memory and answer in the chat." },
];

// Idiomatic phrase sets. Keyed by language code (config/translations/language-metadata.ts).
export const HOOK_PHRASES: Record<string, DefaultHookPhrase[]> = {
  en: EN,
  ru: [
    { action: "save", phrase: "кстати говоря, Фрактера, запомни это:", description: "Сохранить следующий текст в память." },
    { action: "remind", phrase: "кстати говоря, Фрактера, напомни мне", description: "Создать напоминание; если дата не названа, агент спросит «когда?»." },
    { action: "recall", phrase: "кстати, Фрактера, что я сохранял про", description: "Найти в памяти и ответить в чат." },
  ],
  es: [
    { action: "save", phrase: "por cierto, Fractera, recuerda esto:", description: "Guardar en memoria el texto que sigue." },
    { action: "remind", phrase: "por cierto, Fractera, recuérdame que", description: "Crear un recordatorio; si no hay fecha, el agente pregunta cuándo." },
    { action: "recall", phrase: "oye, Fractera, qué guardé sobre", description: "Buscar en la memoria y responder en el chat." },
  ],
  fr: [
    { action: "save", phrase: "au fait, Fractera, retiens ceci :", description: "Enregistrer en mémoire le texte qui suit." },
    { action: "remind", phrase: "au fait, Fractera, rappelle-moi de", description: "Créer un rappel ; sans date, l'agent demande quand." },
    { action: "recall", phrase: "dis, Fractera, qu'ai-je enregistré à propos de", description: "Chercher en mémoire et répondre dans le chat." },
  ],
  de: [
    { action: "save", phrase: "übrigens, Fractera, merk dir das:", description: "Den folgenden Text im Gedächtnis speichern." },
    { action: "remind", phrase: "übrigens, Fractera, erinnere mich daran,", description: "Eine Erinnerung erstellen; ohne Datum fragt der Agent wann." },
    { action: "recall", phrase: "sag mal, Fractera, was habe ich gespeichert über", description: "Im Gedächtnis suchen und im Chat antworten." },
  ],
  pt: [
    { action: "save", phrase: "a propósito, Fractera, guarde isto:", description: "Salvar na memória o texto a seguir." },
    { action: "remind", phrase: "a propósito, Fractera, me lembre de", description: "Criar um lembrete; sem data, o agente pergunta quando." },
    { action: "recall", phrase: "ei, Fractera, o que eu salvei sobre", description: "Buscar na memória e responder no chat." },
  ],
  it: [
    { action: "save", phrase: "a proposito, Fractera, ricorda questo:", description: "Salvare in memoria il testo che segue." },
    { action: "remind", phrase: "a proposito, Fractera, ricordami di", description: "Creare un promemoria; senza data l'agente chiede quando." },
    { action: "recall", phrase: "senti, Fractera, cosa ho salvato su", description: "Cercare in memoria e rispondere in chat." },
  ],
  uk: [
    { action: "save", phrase: "до речі, Фрактеро, запам'ятай це:", description: "Зберегти наступний текст у пам'ять." },
    { action: "remind", phrase: "до речі, Фрактеро, нагадай мені", description: "Створити нагадування; якщо дати немає, агент запитає «коли?»." },
    { action: "recall", phrase: "слухай, Фрактеро, що я зберігав про", description: "Знайти в пам'яті та відповісти в чат." },
  ],
  pl: [
    { action: "save", phrase: "przy okazji, Fractera, zapamiętaj to:", description: "Zapisz następujący tekst w pamięci." },
    { action: "remind", phrase: "przy okazji, Fractera, przypomnij mi, żeby", description: "Utwórz przypomnienie; bez daty agent pyta kiedy." },
    { action: "recall", phrase: "słuchaj, Fractera, co zapisałem o", description: "Wyszukaj w pamięci i odpowiedz na czacie." },
  ],
  tr: [
    { action: "save", phrase: "bu arada, Fractera, şunu hatırla:", description: "Aşağıdaki metni belleğe kaydet." },
    { action: "remind", phrase: "bu arada, Fractera, bana hatırlat:", description: "Bir hatırlatma oluştur; tarih yoksa aracı ne zaman diye sorar." },
    { action: "recall", phrase: "baksana Fractera, ne kaydetmiştim şu konuda:", description: "Bellekte ara ve sohbette yanıtla." },
  ],
  ar: [
    { action: "save", phrase: "بالمناسبة يا فراكتيرا، احفظ هذا:", description: "حفظ النص التالي في الذاكرة." },
    { action: "remind", phrase: "بالمناسبة يا فراكتيرا، ذكّرني بأن", description: "إنشاء تذكير؛ إذا لم يُذكر تاريخ يسأل الوكيل متى." },
    { action: "recall", phrase: "على فكرة يا فراكتيرا، ماذا حفظت عن", description: "البحث في الذاكرة والرد في المحادثة." },
  ],
  zh: [
    { action: "save", phrase: "顺便说一下，Fractera，记住这个：", description: "将后面的文本保存到记忆中。" },
    { action: "remind", phrase: "顺便说一下，Fractera，提醒我", description: "创建提醒；若未给出日期，代理会询问时间。" },
    { action: "recall", phrase: "对了，Fractera，我保存过关于什么的内容", description: "在记忆中搜索并在聊天中回答。" },
  ],
  ja: [
    { action: "save", phrase: "ところで、Fractera、これを覚えておいて：", description: "続くテキストを記憶に保存します。" },
    { action: "remind", phrase: "ところで、Fractera、これをリマインドして", description: "リマインダーを作成。日時がなければエージェントが尋ねます。" },
    { action: "recall", phrase: "そういえば、Fractera、何を保存したっけ、", description: "記憶を検索してチャットで回答します。" },
  ],
  ko: [
    { action: "save", phrase: "그런데, Fractera, 이거 기억해 둬:", description: "이어지는 텍스트를 메모리에 저장합니다." },
    { action: "remind", phrase: "그런데, Fractera, 나에게 알림 줘", description: "알림 생성; 날짜가 없으면 에이전트가 언제인지 묻습니다." },
    { action: "recall", phrase: "참, Fractera, 내가 뭘 저장했더라", description: "메모리를 검색해 채팅으로 답합니다." },
  ],
  hi: [
    { action: "save", phrase: "वैसे, Fractera, यह याद रखना:", description: "आगे का पाठ स्मृति में सहेजें।" },
    { action: "remind", phrase: "वैसे, Fractera, मुझे याद दिलाना", description: "अनुस्मारक बनाएँ; तारीख न हो तो एजेंट पूछता है कब।" },
    { action: "recall", phrase: "सुनो, Fractera, मैंने किस बारे में सहेजा था", description: "स्मृति में खोजें और चैट में उत्तर दें।" },
  ],
  id: [
    { action: "save", phrase: "ngomong-ngomong, Fractera, ingat ini:", description: "Simpan teks berikut ke memori." },
    { action: "remind", phrase: "ngomong-ngomong, Fractera, ingatkan aku untuk", description: "Buat pengingat; tanpa tanggal, agen bertanya kapan." },
    { action: "recall", phrase: "eh Fractera, apa yang kusimpan tentang", description: "Cari di memori dan jawab di obrolan." },
  ],
  vi: [
    { action: "save", phrase: "nhân tiện, Fractera, nhớ cái này nhé:", description: "Lưu đoạn văn bản tiếp theo vào bộ nhớ." },
    { action: "remind", phrase: "nhân tiện, Fractera, nhắc tôi", description: "Tạo lời nhắc; nếu chưa có ngày, trợ lý sẽ hỏi khi nào." },
    { action: "recall", phrase: "này Fractera, tôi đã lưu gì về", description: "Tìm trong bộ nhớ và trả lời trong cuộc trò chuyện." },
  ],
  nl: [
    { action: "save", phrase: "trouwens, Fractera, onthoud dit:", description: "Sla de volgende tekst op in het geheugen." },
    { action: "remind", phrase: "trouwens, Fractera, herinner me eraan om", description: "Maak een herinnering; zonder datum vraagt de agent wanneer." },
    { action: "recall", phrase: "zeg Fractera, wat heb ik opgeslagen over", description: "Zoek in het geheugen en antwoord in de chat." },
  ],
};

// Resolve the default hook phrases for a language, English fallback for unlisted.
export function defaultHookPhrases(lang: string): DefaultHookPhrase[] {
  return HOOK_PHRASES[lang] ?? EN;
}
