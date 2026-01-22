import { z } from "zod"

export const messageRoleSchema = z.enum(["user", "assistant", "system"])

export const messageSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  role: messageRoleSchema,
  content: z.string(),
  createdAt: z.date(),
})

export type MessageRole = z.infer<typeof messageRoleSchema>
export type MessageRecord = z.infer<typeof messageSchema>
