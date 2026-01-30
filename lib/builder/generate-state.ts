import type { MessageRecord } from "@/lib/schemas/message"

export function normalizePrompt(value: string) {
  return value.trim()
}

export function canSubmitPrompt(value: string, isLoading: boolean) {
  return !isLoading && normalizePrompt(value).length > 0
}

export function createOptimisticUserMessage(input: {
  id: string
  projectId: string
  prompt: string
  createdAt?: Date
}): MessageRecord {
  return {
    id: input.id,
    projectId: input.projectId,
    role: "user",
    content: normalizePrompt(input.prompt),
    createdAt: input.createdAt ?? new Date(),
  }
}

export function appendAssistantMessage(
  messages: MessageRecord[],
  assistantMessage: MessageRecord
) {
  return [...messages, assistantMessage]
}
