import { z } from "zod"

export const authCredentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be 72 characters or less."),
})

export type AuthCredentialsInput = z.infer<typeof authCredentialsSchema>
