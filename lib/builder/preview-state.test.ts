import { describe, expect, it } from "vitest"

import { getNextPreviewMode, isPreviewMode } from "@/lib/builder/preview-state"

describe("preview state helpers", () => {
  it("recognizes preview as a valid mode", () => {
    expect(isPreviewMode("preview")).toBe(true)
  })

  it("recognizes code as a valid mode", () => {
    expect(isPreviewMode("code")).toBe(true)
  })

  it("rejects unsupported modes", () => {
    expect(isPreviewMode("split")).toBe(false)
  })

  it("switches from preview to code", () => {
    expect(getNextPreviewMode("preview")).toBe("code")
  })

  it("switches from code back to preview", () => {
    expect(getNextPreviewMode("code")).toBe("preview")
  })
})
