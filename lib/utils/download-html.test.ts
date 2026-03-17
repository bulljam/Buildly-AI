import { describe, expect, it, vi } from "vitest"

import {
  buildHtmlDownloadFilename,
  downloadProjectHtml,
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

  it("triggers a download with the project filename", () => {
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:preview")
    const revokeObjectURL = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {})
    const click = vi.fn()
    const createElement = vi.fn().mockReturnValue({
      click,
      download: "",
      href: "",
    } as unknown as HTMLAnchorElement)

    vi.stubGlobal("document", {
      createElement,
    })

    downloadProjectHtml("Marketing Site", "<html></html>")

    const anchor = createElement.mock.results[0]?.value as HTMLAnchorElement

    expect(anchor.download).toBe("marketing-site.html")
    expect(anchor.href).toBe("blob:preview")
    expect(click).toHaveBeenCalled()
    expect(createObjectURL).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:preview")

    vi.unstubAllGlobals()
  })
})
