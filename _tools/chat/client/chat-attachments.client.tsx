"use client";

import { CalendarClock, FileText, Image as ImageIcon, MapPin, Music2, Video } from "lucide-react";
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  Attachments,
  type AttachmentData,
} from "@/components/ai-elements/attachments";
import type { ChatAttachment, ChatUi } from "../types/chat";

// ВЛОЖЕНИЯ СООБЩЕНИЯ — шесть родов в одном ряду (шаг 80-4; число исправлено 80-5).
//
// 🔒 ЧИСЛО ПРАВИТСЯ ВМЕСТЕ С ПЕРЕЧИСЛЕНИЕМ (закон 76-6). Здесь стояло «пять» при
// шести перечисленных ниже родах: четыре нативных плюс место и событие.
//
// 🔒 ЧЕТЫРЕ РОДА РИСУЕТ БИБЛИОТЕКА, ДВА — МЫ, И ГРАНИЦА ПРОХОДИТ ИМЕННО ЗДЕСЬ.
// `Attachments` сам определяет вид файла по типу содержимого (разведка 80-1),
// поэтому аудио, изображение, видео и документ уходят ему как есть. Места и
// календарного события в библиотеке нет — их рисуем строкой того же вида, чтобы
// человек видел один ряд вложений, а не два разных списка под сообщением.
//
// 🔒 ФОРМА СТРОКИ СПИСАНА С `variant="list"` БИБЛИОТЕКИ НАМЕРЕННО. Свой узор для
// двух родов из шести сделал бы наши вложения похожими на чужой элемент.

const ROW =
  "flex w-full items-center gap-3 rounded-lg border p-3 text-sm hover:bg-accent/50";

/** Значок для вложения, у которого есть род, но нет адреса. */
const FILE_ICON = { audio: Music2, image: ImageIcon, video: Video, document: FileText } as const;

/** Наш род вложения превращается в то, что понимает библиотека. */
function toAttachmentData(item: ChatAttachment, index: number): AttachmentData | null {
  if (item.kind === "place" || item.kind === "event") return null;
  if (!item.url) return null;
  return {
    type: "file",
    id: `${index}`,
    url: item.url,
    mediaType: item.mediaType ?? defaultMediaType(item.kind),
    filename: item.name,
  };
}

/** Тип содержимого, когда его не прислали: род вложения уже известен. */
function defaultMediaType(kind: "audio" | "image" | "video" | "document"): string {
  if (kind === "audio") return "audio/mpeg";
  if (kind === "image") return "image/jpeg";
  if (kind === "video") return "video/mp4";
  return "application/pdf";
}

export function ChatAttachments({
  items,
  ui,
}: {
  items: ChatAttachment[];
  ui: Pick<ChatUi, "place" | "event">;
}) {
  if (items.length === 0) return null;

  return (
    <Attachments variant="list" className="w-full" data-chat-attachments={items.length}>
      {items.map((item, index) => {
        if (item.kind === "place") {
          return (
            <div className={ROW} key={`place-${index}`} data-chat-attachment="place">
              <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0">
                <div className="truncate font-medium">{item.label || ui.place}</div>
                <div className="text-muted-foreground text-xs">
                  {item.lat.toFixed(5)}, {item.lon.toFixed(5)}
                </div>
              </div>
            </div>
          );
        }

        if (item.kind === "event") {
          return (
            <div className={ROW} key={`event-${index}`} data-chat-attachment="event">
              <CalendarClock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0">
                <div className="truncate font-medium">{item.title}</div>
                <div className="text-muted-foreground text-xs">
                  {item.at}
                  {item.note ? ` · ${item.note}` : ""}
                </div>
              </div>
            </div>
          );
        }

        // 🔒 ВЛОЖЕНИЕ БЕЗ АДРЕСА — СТРОКА-ПОДПИСЬ, А НЕ ПРОПУЩЕННОЕ ВЛОЖЕНИЕ
        // (80-6). У журнала службы есть идентификатор файла и нет ссылки; молча
        // не нарисовать его значило бы соврать, что сообщение пришло пустым.
        const data = toAttachmentData(item, index);
        if (!data) {
          const Icon = FILE_ICON[item.kind];
          return (
            <div className={ROW} key={`bare-${index}`} data-chat-attachment={item.kind}>
              <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 truncate font-medium">{item.name ?? item.kind}</div>
            </div>
          );
        }

        return (
          <Attachment data={data} key={`file-${index}`} data-chat-attachment={item.kind}>
            <AttachmentPreview />
            <AttachmentInfo />
          </Attachment>
        );
      })}
    </Attachments>
  );
}
