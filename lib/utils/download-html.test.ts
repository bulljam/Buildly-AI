import { describe, expect, it } from "vitest"

import {
  buildHtmlDownloadFilename,
  sanitizeProjectNameForFilename,
} from "@/lib/utils/download-html"

describe("download html helpers", () => {
  it("builds a clean html filename from the project name", () => {
    expect(buildHtmlDownloadFilename("Marketing Site")).toBe(
      "marketing-site.html"
    )
  })

  it("strips unsupported filename characters", () => {
    expect(sanitizeProjectNameForFilename("  Brand / Launch! Page  ")).toBe(
      "brand-launch-page"
    )
  })

  it("falls back to a safe default when the project name is blank", () => {
    expect(buildHtmlDownloadFilename("   ")).toBe("buildly-project.html")
  })
})
