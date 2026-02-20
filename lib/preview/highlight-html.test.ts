import { describe, expect, it } from "vitest"

import { highlightHtml } from "@/lib/preview/highlight-html"

describe("highlightHtml", () => {
  it("wraps tags and attributes with syntax highlight spans", () => {
    const result = highlightHtml(
      '<div class="hero" data-mode="preview">Hello</div>'
    )

    expect(result).toContain('class="text-[#EEEEEE]">div</span>')
    expect(result).toContain('class="text-[#A64D79]">class</span>')
    expect(result).toContain('class="text-[#EEEEEE]">&quot;hero&quot;</span>')
    expect(result).toContain("Hello")
  })

  it("escapes raw html before applying highlighting", () => {
    const result = highlightHtml("<script>alert('x')</script>")

    expect(result).toContain("&lt;")
    expect(result).not.toContain("<script>")
  })
})
