import { describe, expect, it } from "vitest"

import { preparePreviewHtml } from "@/lib/preview/prepare-preview-html"

describe("preparePreviewHtml", () => {
  it("injects an about:srcdoc base tag into the head", () => {
    const result = preparePreviewHtml(
      "<!DOCTYPE html><html><head><title>Demo</title></head><body><a href=\"#about\">About</a></body></html>"
    )

    expect(result).toContain('<base href="about:srcdoc">')
    expect(result).toContain("<head><base href=\"about:srcdoc\"><title>Demo</title></head>")
  })

  it("does not duplicate the base tag when it already exists", () => {
    const result = preparePreviewHtml(
      '<html><head><base href="about:srcdoc"></head><body>Hello</body></html>'
    )

    expect(result.match(/<base href="about:srcdoc">/g)).toHaveLength(1)
  })
})
