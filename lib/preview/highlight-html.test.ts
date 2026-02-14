import { describe, expect, it } from "vitest"

import { highlightHtml } from "@/lib/preview/highlight-html"

describe("highlightHtml", () => {
  it("wraps tags and attributes with syntax highlight spans", () => {
    const result = highlightHtml(
      '<div class="hero" data-mode="preview">Hello</div>'
    )

    expect(result).toContain('class="text-cyan-300">div</span>')
    expect(result).toContain('class="text-sky-300">class</span>')
    expect(result).toContain('class="text-amber-300">&quot;hero&quot;</span>')
    expect(result).toContain("Hello")
  })

  it("escapes raw html before applying highlighting", () => {
    const result = highlightHtml("<script>alert('x')</script>")

    expect(result).toContain("&lt;")
    expect(result).not.toContain("<script>")
  })
})
