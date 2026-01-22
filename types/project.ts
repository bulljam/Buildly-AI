import type { MessageRecord } from "@/lib/schemas/message"

export type ProjectRecord = {
  id: string
  name: string
  currentHtml: string
  createdAt: Date
  updatedAt: Date
}

export type ProjectWithMessages = ProjectRecord & {
  messages: MessageRecord[]
}
