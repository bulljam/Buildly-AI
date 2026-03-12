import { describe, expect, it } from "vitest"

import { profileUpdateSchema } from "@/lib/schemas/profile"

describe("profileUpdateSchema", () => {
  it("accepts basic profile updates", () => {
    const result = profileUpdateSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      avatarDataUrl: "data:image/png;base64,abc123",
    })

    expect(result.success).toBe(true)
  })

  it("accepts avatar-only updates when password fields are blank", () => {
    const result = profileUpdateSchema.safeParse({
      avatarDataUrl: "data:image/png;base64,abc123",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    expect(result.success).toBe(true)
  })

  it("requires password confirmation to match", () => {
    const result = profileUpdateSchema.safeParse({
      currentPassword: "old-password",
      newPassword: "new-password",
      confirmPassword: "different-password",
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe("Passwords do not match.")
  })

  it("rejects non-image avatar values", () => {
    const result = profileUpdateSchema.safeParse({
      avatarDataUrl: "data:text/plain;base64,abc123",
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      "Profile picture must be an image."
    )
  })
})
