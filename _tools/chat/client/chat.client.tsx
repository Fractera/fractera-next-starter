"use client";

import type { ChatStatus } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { ChatAttachments } from "./chat-attachments.client";
import type { ChatMessage, ChatSendPayload, ChatUi } from "../types/chat";

// ЧАТ — ЕДИНСТВЕННАЯ РЕАЛИЗАЦИЯ ПЕРЕПИСКИ В ПРОЕКТЕ (шаг 80-4).
//
// 🔒 ДВА СОСТОЯНИЯ — ЭТО СВОЙСТВО, А НЕ ВТОРОЙ КОМПОНЕНТ. Дан `onSend` — под
// лентой появляется поле ввода; не дан — остаётся одна лента, ровно то, что нужно
// «Логам». Два компонента разошлись бы молча: тот, которым пользуются реже,
// отстаёт и остаётся с прежним видом сообщения.
//
// 🔒 ЛЕНТА ПРОКРУЧИВАЕТСЯ САМА. `Conversation` держит низ и показывает кнопку
// возврата, когда человек ушёл вверх, — своей работы со скроллом здесь нет и не
// должно появиться (77-13 писал её руками, и это ровно та ошибка, ради которой
// заведён шаг 80).
//
// 🔒 ИНСТРУМЕНТ НЕ ХОДИТ В СЕТЬ. Он получает сообщения пропсом и отдаёт
// отправленное наружу; опрос склада, курсор и обновление — дело потребителя.
// Поэтому один и тот же островок годится и журналу службы, и будущему
// мессенджеру, и образцу в каталоге блоков.

export default function Chat({
  messages,
  ui,
  onSend,
  status,
  className,
}: {
  messages: ChatMessage[];
  ui: ChatUi;
  /** Дан — чат целиком; не дан — только лента. */
  onSend?: (payload: ChatSendPayload) => void | Promise<void>;
  /** Состояние отправки, когда потребитель его знает. */
  status?: ChatStatus;
  className?: string;
}) {
  const withComposer = typeof onSend === "function";

  return (
    <div
      className={["flex min-h-0 w-full flex-col gap-3", className].filter(Boolean).join(" ")}
      data-chat=""
      data-chat-composer={withComposer ? "on" : "off"}
      data-chat-rows={messages.length}
    >
      <Conversation className="min-h-0 flex-1">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              title={ui.emptyTitle}
              description={ui.emptyNote}
              data-chat-empty=""
            />
          ) : (
            messages.map(message => (
              <Message from={message.from} key={message.id} data-chat-row="">
                <MessageContent>
                  <ChatMeta message={message} ui={ui} />
                  {message.text ? (
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  ) : null}
                  {message.attachments?.length ? (
                    <ChatAttachments items={message.attachments} ui={ui} />
                  ) : null}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {withComposer ? <ChatComposer onSend={onSend} status={status} ui={ui} /> : null}
    </div>
  );
}

/** Кто, когда, откуда и не переслано ли — одной строкой над текстом. */
function ChatMeta({ message, ui }: { message: ChatMessage; ui: Pick<ChatUi, "forwarded"> }) {
  const parts: string[] = [];
  if (message.who) parts.push(message.who);
  if (message.at) parts.push(message.at);
  if (message.source) parts.push(message.source);
  if (message.forwardedFrom) parts.push(`${ui.forwarded} ${message.forwardedFrom}`);
  if (parts.length === 0) return null;

  return (
    <div className="text-muted-foreground text-xs" data-chat-meta="">
      {parts.join(" · ")}
    </div>
  );
}

/** Поле ввода — целиком из готовых частей библиотеки, включая прикрепление файла. */
function ChatComposer({
  onSend,
  status,
  ui,
}: {
  onSend: (payload: ChatSendPayload) => void | Promise<void>;
  status?: ChatStatus;
  ui: ChatUi;
}) {
  return (
    <PromptInput
      multiple
      data-chat-input=""
      onSubmit={message => {
        const text = message.text.trim();
        if (!text && message.files.length === 0) return;
        void onSend({
          text,
          files: message.files.map(file => ({
            url: file.url,
            mediaType: file.mediaType,
            filename: file.filename,
          })),
        });
      }}
    >
      <PromptInputBody>
        <PromptInputTextarea placeholder={ui.placeholder} />
      </PromptInputBody>
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments label={ui.attach} />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
        <PromptInputSubmit aria-label={ui.send} status={status} />
      </PromptInputFooter>
    </PromptInput>
  );
}
