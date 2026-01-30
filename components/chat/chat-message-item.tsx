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
            ? "border-foreground/10 bg-foreground text-background"
            : "border-border/60 bg-background"
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          <p
            className={cn(
              "text-[11px] font-medium tracking-[0.18em] uppercase",
              isUser ? "text-background/70" : "text-muted-foreground"
            )}
          >
            {message.role}
          </p>
          <span
            className={cn(
              "text-[11px]",
              isUser ? "text-background/60" : "text-muted-foreground"
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
