import { cn } from "@/lib/utils"
import {
  formatMessageTimestamp,
  getMessageAlignment,
} from "@/lib/builder/chat-ux"
import type { MessageRecord } from "@/lib/schemas/message"

type ChatMessageItemProps = {
  message: Pick<MessageRecord, "content" | "createdAt" | "role">
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const alignment = getMessageAlignment(message.role)
  const isUser = message.role === "user"

  return (
    <article
      className={cn(
        "flex w-full",
        alignment === "end" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-xl rounded-3xl border px-4 py-3 text-sm leading-6 shadow-xs",
          isUser
            ? "border-[#1D4ED8]/15 bg-[#2563EB] text-white"
            : "border-[#D7E3F4] bg-white text-[#0F172A]"
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          <p
            className={cn(
              "text-[11px] font-medium tracking-[0.18em] uppercase",
              isUser ? "text-white/78" : "text-[#64748B]"
            )}
          >
            {message.role}
          </p>
          <span
            className={cn(
              "text-[11px]",
              isUser ? "text-white/68" : "text-[#94A3B8]"
            )}
          >
            {formatMessageTimestamp(message.createdAt)}
          </span>
        </div>
        <p className="break-words whitespace-pre-wrap">{message.content}</p>
      </div>
    </article>
  )
}
