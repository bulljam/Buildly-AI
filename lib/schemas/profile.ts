import { z } from "zod"

const emailSchema = z.string().trim().email("Enter a valid email address.")
const nameSchema = z
  .string()
  .trim()
  .min(2, "Full name must be at least 2 characters.")
  .max(80, "Full name must be 80 characters or less.")
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password must be 72 characters or less.")
const optionalStringField = z.string().optional().transform((value) => {
  const trimmedValue = value?.trim()

  return trimmedValue ? trimmedValue : undefined
})

export const profileUpdateSchema = z
  .object({
    avatarDataUrl: z
      .union([
        z
          .string()
          .trim()
          .refine(
            (value) => value.startsWith("data:image/"),
            "Profile picture must be an image."
          ),
        z.literal(""),
        z.null(),
      ])
      .optional()
      .transform((value) => (value === "" ? null : value)),
    confirmPassword: optionalStringField,
    currentPassword: optionalStringField,
    email: emailSchema.optional(),
    name: nameSchema.optional(),
    newPassword: optionalStringField.pipe(passwordSchema.optional()),
  })
  .superRefine((value, context) => {
    const hasProfileFields =
      value.name !== undefined ||
      value.email !== undefined ||
      value.avatarDataUrl !== undefined
    const hasPasswordFields =
      value.currentPassword !== undefined ||
      value.newPassword !== undefined ||
      value.confirmPassword !== undefined

    if (!hasProfileFields && !hasPasswordFields) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Update at least one profile field.",
        path: ["name"],
      })
    }

    if (hasPasswordFields) {
      if (!value.currentPassword) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Current password is required to change your password.",
          path: ["currentPassword"],
        })
      }

      if (!value.newPassword) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "New password is required.",
          path: ["newPassword"],
        })
      }

      if (value.newPassword !== value.confirmPassword) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match.",
          path: ["confirmPassword"],
        })
      }
    }
  })

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
