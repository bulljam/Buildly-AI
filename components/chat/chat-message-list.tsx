import type { MessageRecord } from "@/lib/schemas/message"

import { ChatMessageItem } from "@/components/chat/chat-message-item"

type ChatMessageListProps = {
  messages: Array<Pick<MessageRecord, "id" | "content" | "createdAt" | "role">>
}

export function ChatMessageList({ messages }: ChatMessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} />
      ))}
    </div>
  )
}
