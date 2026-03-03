import { describe, expect, it } from "vitest"

import { hashPassword, verifyPassword } from "@/lib/auth/password"

describe("password helpers", () => {
  it("hashes and verifies the original password", async () => {
    const passwordHash = await hashPassword("super-secret-password")

    await expect(
      verifyPassword("super-secret-password", passwordHash)
    ).resolves.toBe(true)
  })

  it("rejects an invalid password", async () => {
    const passwordHash = await hashPassword("super-secret-password")

    await expect(verifyPassword("wrong-password", passwordHash)).resolves.toBe(
      false
    )
  })

  it("rejects malformed stored hashes", async () => {
    await expect(verifyPassword("super-secret-password", "invalid")).resolves.toBe(
      false
    )
  })
})
