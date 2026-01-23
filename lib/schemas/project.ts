import { z } from "zod"

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required.")
    .max(80, "Project name must be 80 characters or less.")
    .optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
