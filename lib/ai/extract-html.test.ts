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
      "<!DOCTYPE html><html><body><h1>Hello</h1></body></html>"
    )
  })

  it("extracts the html document when commentary surrounds it", () => {
    const response = [
      "Here is your page:",
      "<!DOCTYPE html><html><body><h1>Hello</h1></body></html>",
      "Thanks!",
    ].join("\n")

    expect(extractHtmlDocument(response)).toBe(
      "<!DOCTYPE html><html><body><h1>Hello</h1></body></html>"
    )
  })

  it("extracts a full html document when commentary surrounds a plain html tag", () => {
    const response = [
      "Here is your page:",
      "<html><body><h1>Hello</h1></body></html>",
      "Thanks!",
    ].join("\n")

    expect(extractHtmlDocument(response)).toBe(
      "<html><body><h1>Hello</h1></body></html>"
    )
  })

  it("rebuilds a full html document from head and body blocks", () => {
    const response = [
      "Sure, here it is:",
      "<head><title>Hello</title><style>body{margin:0;}</style></head>",
      "<body><h1>Hello</h1></body>",
    ].join("\n")

    expect(extractHtmlDocument(response)).toBe(
      "<!DOCTYPE html><html><head><title>Hello</title><style>body{margin:0;}</style></head><body><h1>Hello</h1></body></html>"
    )
  })

  it("rebuilds a full html document from a body block only", () => {
    const response = "<body><main><h1>Hello</h1></main></body>"

    expect(extractHtmlDocument(response)).toBe(
      "<!DOCTYPE html><html><head></head><body><main><h1>Hello</h1></main></body></html>"
    )
  })

  it("throws when the response is not a complete html document", () => {
    expect(() => extractHtmlDocument("<div>Only a fragment</div>")).toThrow(
      "AI returned malformed HTML."
    )
  })
})
