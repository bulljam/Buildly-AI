import { z } from "zod"

const emailSchema = z.string().trim().email("Enter a valid email address.")
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password must be 72 characters or less.")
const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters.")
  .max(80, "Full name must be 80 characters or less.")

export const authCredentialsSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const signupCredentialsSchema = z
  .object({
    email: emailSchema,
    fullName: fullNameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export type AuthCredentialsInput = z.infer<typeof authCredentialsSchema>
export type SignupCredentialsInput = z.infer<typeof signupCredentialsSchema>
