"use client";

import { useVoiceRecorder, VOICE_BAR, type VoiceTargetRef } from "./use-voice-recorder";

// ГОЛОСОВОЙ ВВОД — маленькая кнопка рядом с полем (перенос v1, шаг 232).
//
// 🔒 С ШАГА 32-2 ЗДЕСЬ ТОЛЬКО ОБЛИК. Механика — разрешение микрофона, запись,
// столбики уровня, таймер, расшифровка, память курсора — живёт в
// `use-voice-recorder.ts`, одна на все интерфейсы. Владелец заказал второй облик
// того же умения (контейнер, где микрофон встроен в поле), и две копии работы с
// `AudioContext` разошлись бы молча: обе продолжали бы работать, но по-разному
// слышать тишину и по-разному объяснять отказ.
//
// 🔒 ПОВЕДЕНИЕ ЭТОЙ КНОПКИ НЕ ИЗМЕНИЛОСЬ НИ НА ШАГ. Она стоит в форме настроек
// слоя архитектора и в карточке товара; 32-2 — перекладка внутренностей, а не
// правка интерфейса. Всё, что меняется для человека, меняется в 32-3.
//
// Почему здесь нет ни shadcn, ни lucide, ни sonner: инструмент обязан оставаться
// архивом — распаковал папку в другом месте, и всё работает. Своя кнопка, свои
// значки, отказ показывается СТРОКОЙ ПОД КНОПКОЙ, а не тостом платформы.
//
// КАК СЕБЯ ВЕДЁТ (дизайн владельца, как в v1):
//   • УДЕРЖИВАЕШЬ кнопку — идёт запись; отпустил — уходит на расшифровку.
//   • Во время записи полоса 40px показывает приходящий звук; в центре — время.
//   • ПОМНИТ КУРСОР: расшифровка встаёт туда, где он стоял, а не в конец поля.

function MicIcon({ off }: { off?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-3.5">
      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" />
      {off ? <path d="M3 3l18 18" /> : null}
    </svg>
  );
}

export default function VoiceInput({
  targetRef,
  value,
  onChange,
  lang,
  disabled,
  apiUrl,
}: {
  /** Поле, которое принимает речь (его курсор решает КУДА). */
  targetRef: VoiceTargetRef;
  value: string;
  /** Зовётся с полным новым текстом; курсор остаётся сразу после вставленных слов. */
  onChange: (next: string) => void;
  lang: string;
  disabled?: boolean;
  /** Адрес двери расшифровки; не задан — соседняя `api/transcribe`. */
  apiUrl?: string;
}) {
  const v = useVoiceRecorder({ targetRef, value, onChange, lang, disabled, apiUrl });
  const L = v.strings;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          disabled={disabled || v.busy || !v.supported}
          title={v.supported ? L.tipOk : L.tipInsecure}
          onPointerDown={(e) => { e.preventDefault(); v.start(); }}
          onPointerUp={v.stop}
          onPointerLeave={v.stop}
          onPointerCancel={v.stop}
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
            v.recording ? "border-rose-500/50 text-rose-700 dark:text-rose-400" : "hover:bg-accent"
          }`}
        >
          <MicIcon off={!v.supported} />
          {v.busy ? L.transcribing : v.recording ? L.recording : L.hold}
        </button>

        {/* ПОЛОСА ЗВУКА — 40px; столбики 2px через 1px, до 32px, дописываются слева
            направо; в центре плашка с прошедшим временем. */}
        {v.recording ? (
          <div
            ref={(el) => {
              if (el) v.setBarCapacity(Math.floor(el.clientWidth / (VOICE_BAR.width + VOICE_BAR.gap)));
            }}
            className="relative h-10 min-w-[120px] flex-1 overflow-hidden rounded-md border border-border bg-muted/40"
          >
            <div className="absolute inset-0 flex items-center" style={{ gap: `${VOICE_BAR.gap}px`, paddingInline: 2 }}>
              {v.bars.map((h, i) => (
                <span key={i} className="shrink-0 rounded-sm bg-primary/70" style={{ width: `${VOICE_BAR.width}px`, height: `${h}px` }} />
              ))}
            </div>
            <span className="absolute left-1/2 top-1/2 flex h-5 -translate-x-1/2 -translate-y-1/2 items-center rounded bg-background px-2 text-[11px] font-medium tabular-nums text-foreground shadow-sm">
              {v.elapsed}
            </span>
          </div>
        ) : null}
      </div>

      {/* РАСШИФРОВКА ЖДЁТ РЕШЕНИЯ — под кнопкой, до вставки. Показать сказанное и
          спросить дороже на одно нажатие, но дешевле любой ошибки распознавания:
          текст встаёт в СЕРЕДИНУ документа, и выловить там чужую фразу тяжелее,
          чем один раз её прочитать. */}
      {v.draft !== null ? (
        <div className="w-full rounded-md border border-border bg-muted/30 p-2">
          <p className="mb-1 text-[10px] font-medium text-muted-foreground">{L.draftTitle}</p>
          {/* Текст ПРАВИТСЯ прямо здесь: одно неверно услышанное слово не должно
              стоить повторной диктовки всего абзаца. */}
          <textarea
            value={v.draft}
            onChange={(e) => v.setDraft(e.target.value)}
            rows={Math.min(8, Math.max(2, v.draft.split("\n").length + 1))}
            className="w-full resize-y rounded border border-border bg-background p-2 text-xs leading-relaxed text-foreground outline-none"
          />
          <div className="mt-1.5 flex items-center gap-2">
            <button
              type="button"
              onClick={v.accept}
              disabled={!v.draft.trim()}
              className="rounded-md border border-primary bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground transition-colors disabled:opacity-50"
            >
              {L.accept}
            </button>
            <button
              type="button"
              onClick={v.discard}
              className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              {L.discard}
            </button>
          </div>
        </div>
      ) : null}

      {/* Причина отказа — строкой рядом с кнопкой: тостов у инструмента нет, а
          тупика быть не должно. */}
      {!v.supported ? <p className="text-xs text-muted-foreground">{L.tipInsecure}</p> : null}
      {v.note ? <p className="text-xs text-amber-700 dark:text-amber-400">{v.note}</p> : null}
    </div>
  );
}
