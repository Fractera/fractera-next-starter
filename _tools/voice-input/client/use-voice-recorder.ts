"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { voiceStrings, type VoiceStrings } from "./voice-input-i18n";

// МЕХАНИКА ГОЛОСОВОГО ВВОДА — ОДНА НА ВСЕ ИНТЕРФЕЙСЫ (шаг 32-2, 2026-08-28).
//
// 🔒 ЗАЧЕМ ХУК, ЕСЛИ ВСЁ УЖЕ РАБОТАЛО. Владелец заказал второй облик того же
// умения: маленькая кнопка рядом с полем остаётся, а рядом появляется контейнер,
// где микрофон встроен в поле, полоса стоит под ним и сменяется расшифровкой.
// Скопировать сюда полтораста строк работы с `AudioContext` значило бы завести
// ДВЕ реализации одного, и разошлись бы они молча — обе продолжали бы работать,
// но по-разному слышать тишину, по-разному считать время и по-разному объяснять
// отказ. Поэтому механика вынута целиком, а облик остался у компонентов.
//
// 🔒 ПЕРЕНЕСЕНО ДОСЛОВНО. Ни одно число, ни одно условие и ни одна строка отказа
// в этом подшаге не менялись: подшаг обязан быть невидим снаружи. Всё, что
// меняется для человека, меняется в 32-3.
//
// 🔒 КУРСОР ТОЖЕ ЗДЕСЬ, И ЭТО НЕ ЛИШНЕЕ. Оба интерфейса вставляют расшифровку в
// поле, и оба обязаны попасть туда, где стоял курсор В МОМЕНТ НАЧАЛА РЕЧИ, а не в
// конец. Оставь эту логику снаружи — и второй интерфейс напишет её заново, чуть
// иначе, и разница всплывёт на первом же тексте, надиктованном в середину абзаца.
//
// СРЕДА: `getUserMedia` требует защищённого контекста (HTTPS или localhost). В
// IP-режиме браузер откажет, поэтому неподдержку выясняем ЗАРАНЕЕ, а не по клику.

const BAR_WIDTH = 2; // px — спецификация владельца
const BAR_GAP = 1; // px
const BAR_MAX = 32; // px
const BAR_MIN = 2; // px — тишина рисует точку, полоса видимо жива
const BAR_TICK_MS = 100; // новый столбик десять раз в секунду — читается как живой звук

export const VOICE_BAR = { width: BAR_WIDTH, gap: BAR_GAP, max: BAR_MAX } as const;

export type VoiceTargetRef =
  | React.RefObject<HTMLTextAreaElement | null>
  | React.RefObject<HTMLInputElement | null>;

/** Внутри ли мы фрейма (окно предпросмотра панели) — там браузер микрофон не даёт. */
function inFrame(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export type VoiceRecorder = {
  /** Слова на языке страницы — резолвятся один раз здесь, чтобы оба облика брали одни. */
  strings: VoiceStrings;
  /** Микрофон в принципе доступен в этой среде. */
  supported: boolean;
  recording: boolean;
  /** Идёт расшифровка: запись кончилась, ответ ещё не пришёл. */
  busy: boolean;
  /** Столбики уровня звука, слева направо. */
  bars: number[];
  /** Прошедшее время записи, уже в виде `мм:сс`. */
  elapsed: string;
  /** Причина отказа словами; пусто — отказа нет. */
  note: string;
  /** Расшифровка, ждущая решения человека; `null` — ждать нечего. */
  draft: string | null;
  setDraft: (text: string | null) => void;
  /** Сколько столбиков поместилось: облик меряет свою полосу и говорит сюда. */
  setBarCapacity: (n: number) => void;
  start: () => void;
  stop: () => void;
  /** Вставить расшифровку туда, где стоял курсор, и закрыть черновик. */
  accept: () => void;
  discard: () => void;
};

export function useVoiceRecorder({
  targetRef,
  value,
  onChange,
  lang,
  disabled,
  apiUrl,
}: {
  targetRef: VoiceTargetRef;
  value: string;
  onChange: (next: string) => void;
  lang: string;
  disabled?: boolean;
  /**
   * Адрес двери расшифровки. Не задан — берётся соседняя `api/transcribe`
   * относительно текущего пути.
   *
   * 🔒 Пропс появился, когда инструмент понадобился в панели: там страница живёт
   * по адресу вида `/ru/doc-instruction`, и относительный путь дал бы
   * `/ru/doc-instruction/api/transcribe` — двери, которой нет.
   */
  apiUrl?: string;
}): VoiceRecorder {
  const L = voiceStrings(lang);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bars, setBars] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [supported, setSupported] = useState(true);
  const [note, setNote] = useState("");
  // 🔒 РАСШИФРОВКА НЕ ВСТАВЛЯЕТСЯ САМА: она ждёт решения человека. Причина в цене
  // ошибки — распознавание иногда слышит не то, а текст встаёт в СЕРЕДИНУ
  // документа, и вылавливать чужую фразу дороже, чем один раз её прочитать.
  const [draft, setDraft] = useState<string | null>(null);

  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);
  const stream = useRef<MediaStream | null>(null);
  const audioCtx = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const ticker = useRef<ReturnType<typeof setInterval> | null>(null);
  const clock = useRef<ReturnType<typeof setInterval> | null>(null);
  const caret = useRef<{ start: number; end: number } | null>(null);
  const maxBars = useRef(64);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
        window.isSecureContext &&
        Boolean(navigator.mediaDevices?.getUserMedia) &&
        typeof MediaRecorder !== "undefined",
    );
  }, []);

  const cleanup = useCallback(() => {
    if (ticker.current) { clearInterval(ticker.current); ticker.current = null; }
    if (clock.current) { clearInterval(clock.current); clock.current = null; }
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    void audioCtx.current?.close().catch(() => {});
    audioCtx.current = null;
    analyser.current = null;
    recorder.current = null;
  }, []);

  useEffect(() => cleanup, [cleanup]);

  /** Расшифровка встаёт туда, где стоял курсор в момент начала речи. */
  const insert = useCallback(
    (text: string) => {
      if (!text) return;
      const el = targetRef.current;
      const pos = caret.current ?? { start: value.length, end: value.length };
      const before = value.slice(0, pos.start);
      const after = value.slice(pos.end);
      const glue = before && !/\s$/.test(before) ? " " : "";
      const tail = after && !/^\s/.test(after) ? " " : "";
      onChange(`${before}${glue}${text}${tail}${after}`);
      const caretAt = (before + glue + text).length;
      requestAnimationFrame(() => {
        if (!el) return;
        el.focus();
        el.setSelectionRange(caretAt, caretAt);
      });
    },
    [targetRef, value, onChange],
  );

  const transcribe = useCallback(
    async (blob: Blob) => {
      if (blob.size < 1200) return; // касание, а не речь
      setBusy(true);
      try {
        const fd = new FormData();
        fd.append("audio", new File([blob], "speech.webm", { type: blob.type || "audio/webm" }));
        const url = apiUrl ?? `${location.pathname.replace(/\/+$/, "")}/api/transcribe`;
        const r = await fetch(url, { method: "POST", body: fd, credentials: "include" });
        const d = (await r.json()) as { text?: string; reason?: string };
        if (!r.ok) { setNote(d.reason === "no-key" ? L.noKey : L.failed); return; }
        if (!d.text) { setNote(L.nothing); return; }
        setNote("");
        setDraft(d.text);
      } catch {
        setNote(L.failed);
      } finally {
        setBusy(false);
      }
    },
    [L, apiUrl],
  );

  const start = useCallback(async () => {
    if (recording || busy || disabled || !supported) return;
    const el = targetRef.current;
    caret.current = el
      ? { start: el.selectionStart ?? value.length, end: el.selectionEnd ?? value.length }
      : { start: value.length, end: value.length };

    let media: MediaStream;
    try {
      media = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      const name = (e as { name?: string })?.name ?? "";
      setNote(
        name === "NotFoundError" || name === "DevicesNotFoundError"
          ? L.micNoDevice
          : inFrame()
            ? L.frame
            : L.micDenied,
      );
      return;
    }
    setNote("");
    stream.current = media;
    chunks.current = [];

    const rec = new MediaRecorder(media);
    rec.ondataavailable = (e) => { if (e.data.size) chunks.current.push(e.data); };
    rec.onstop = () => { void transcribe(new Blob(chunks.current, { type: rec.mimeType || "audio/webm" })); };
    rec.start();
    recorder.current = rec;

    // Столбики И ЕСТЬ звук: по замеру громкости на тик, дописываются справа.
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(media);
    const an = ctx.createAnalyser();
    an.fftSize = 512;
    src.connect(an);
    audioCtx.current = ctx;
    analyser.current = an;
    const buf = new Uint8Array(an.frequencyBinCount);

    setBars([]);
    setSeconds(0);
    setRecording(true);

    ticker.current = setInterval(() => {
      const a = analyser.current;
      if (!a) return;
      a.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / buf.length); // 0…1
      const h = Math.min(BAR_MAX, Math.max(BAR_MIN, Math.round(rms * 3 * BAR_MAX)));
      setBars((b) => [...b, h].slice(-maxBars.current));
    }, BAR_TICK_MS);

    clock.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }, [recording, busy, disabled, supported, targetRef, value, transcribe, L]);

  const stop = useCallback(() => {
    if (!recording) return;
    setRecording(false);
    try { recorder.current?.stop(); } catch { /* уже остановлен */ }
    if (ticker.current) { clearInterval(ticker.current); ticker.current = null; }
    if (clock.current) { clearInterval(clock.current); clock.current = null; }
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    void audioCtx.current?.close().catch(() => {});
    audioCtx.current = null;
    analyser.current = null;
  }, [recording]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return {
    strings: L,
    supported,
    recording,
    busy,
    bars,
    elapsed: `${mm}:${ss}`,
    note,
    draft,
    setDraft,
    setBarCapacity: (n: number) => { maxBars.current = Math.max(16, n); },
    // `start` асинхронна внутри, но снаружи это простое «нажали» — обёртка
    // избавляет оба облика от плавающего промиса в обработчике события.
    start: () => { void start(); },
    stop,
    accept: () => { if (draft) insert(draft); setDraft(null); },
    discard: () => setDraft(null),
  };
}
