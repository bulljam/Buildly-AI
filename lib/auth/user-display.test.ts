import { describe, expect, it } from "vitest"

import { getUserInitials } from "@/lib/auth/user-display"

describe("getUserInitials", () => {
  it("uses the first letter of each trimmed word", () => {
    expect(getUserInitials("  Jane   Mary Doe ")).toBe("JMD")
  })

  it("returns a single initial for one-word names", () => {
    expect(getUserInitials("aymane")).toBe("A")
  })

  it("returns an empty string for blank names", () => {
    expect(getUserInitials("   ")).toBe("")
  })
})
