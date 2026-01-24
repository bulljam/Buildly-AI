import { describe, expect, it } from "vitest"

import { createProjectSchema } from "@/lib/schemas/project"

describe("createProjectSchema", () => {
  it("accepts a valid project name and trims it", () => {
    const result = createProjectSchema.parse({
      name: "  Marketing Site  ",
    })

    expect(result).toEqual({
      name: "Marketing Site",
    })
  })

  it("allows an empty payload so the default project name can be used", () => {
    const result = createProjectSchema.parse({})

    expect(result).toEqual({})
  })

  it("rejects a blank project name", () => {
    const result = createProjectSchema.safeParse({
      name: "   ",
    })

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Project name is required.")
    }
  })

  it("rejects project names longer than 80 characters", () => {
    const result = createProjectSchema.safeParse({
      name: "a".repeat(81),
    })

    expect(result.success).toBe(false)

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Project name must be 80 characters or less.",
      )
    }
  })
})
