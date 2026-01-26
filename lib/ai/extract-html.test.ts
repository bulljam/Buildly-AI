import { describe, expect, it } from "vitest"

import { extractHtmlDocument } from "@/lib/ai/extract-html"

describe("extractHtmlDocument", () => {
  it("returns a full html document unchanged", () => {
    const html = "<!DOCTYPE html><html><body><h1>Hello</h1></body></html>"

    expect(extractHtmlDocument(html)).toBe(html)
  })

  it("extracts html from a fenced code block", () => {
    const response = [
      "```html",
      "<!DOCTYPE html><html><body><h1>Hello</h1></body></html>",
      "```",
    ].join("\n")

    expect(extractHtmlDocument(response)).toBe(
      "<!DOCTYPE html><html><body><h1>Hello</h1></body></html>",
    )
  })

  it("extracts the html document when commentary surrounds it", () => {
    const response = [
      "Here is your page:",
      "<!DOCTYPE html><html><body><h1>Hello</h1></body></html>",
      "Thanks!",
    ].join("\n")

    expect(extractHtmlDocument(response)).toBe(
      "<!DOCTYPE html><html><body><h1>Hello</h1></body></html>",
    )
  })

  it("throws when the response is not a complete html document", () => {
    expect(() => extractHtmlDocument("<div>Only a fragment</div>")).toThrow(
      "AI returned malformed HTML.",
    )
  })
})
