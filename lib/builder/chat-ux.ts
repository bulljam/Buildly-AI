import type { MessageRecord } from "@/lib/schemas/message"

export function shouldSubmitPromptOnKeyDown(input: {
  enterKey: boolean
  isComposing: boolean
  shiftKey: boolean
}) {
  return input.enterKey && !input.shiftKey && !input.isComposing
}

export function getMessageAlignment(role: MessageRecord["role"]) {
  return role === "user" ? "end" : "start"
}

export function formatMessageTimestamp(value: Date) {
  return value.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  })
}
