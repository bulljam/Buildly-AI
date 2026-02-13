import { z } from "zod"

const nameSchema = z
  .string()
  .trim()
  .min(1, "Project name is required.")
  .max(80, "Project name must be 80 characters or less.")

export const createProjectSchema = z.object({
  name: nameSchema.optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export const updateProjectSchema = z.object({
  name: nameSchema,
})

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
