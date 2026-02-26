import { cn } from "@/lib/utils"
import { getMessageAlignment } from "@/lib/builder/chat-ux"
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
          "max-w-xl rounded-[1.35rem] border px-3.5 py-2.5 text-[13px] leading-5 shadow-xs",
          isUser
            ? "border-[#1D4ED8]/15 bg-[#2563EB] text-white"
            : "border-[#D7E3F4] bg-white text-[#0F172A]"
        )}
      >
        <p className="break-words whitespace-pre-wrap">{message.content}</p>
      </div>
    </article>
  )
}
