import { z } from "zod"

export const generateRequestSchema = z.object({
  projectId: z.string().trim().min(1, "Project ID is required."),
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required.")
    .max(5000, "Prompt must be 5000 characters or less."),
})

export type GenerateRequestInput = z.infer<typeof generateRequestSchema>
