import { describe, expect, it } from "vitest"

import {
  formatMessageTimestamp,
  getMessageAlignment,
  shouldSubmitPromptOnKeyDown,
} from "@/lib/builder/chat-ux"

describe("chat ux helpers", () => {
  it("submits when Enter is pressed without Shift", () => {
    expect(
      shouldSubmitPromptOnKeyDown({
        enterKey: true,
        shiftKey: false,
        isComposing: false,
      })
    ).toBe(true)
  })

  it("does not submit on Shift+Enter", () => {
    expect(
      shouldSubmitPromptOnKeyDown({
        enterKey: true,
        shiftKey: true,
        isComposing: false,
      })
    ).toBe(false)
  })

  it("does not submit while the input method editor is composing", () => {
    expect(
      shouldSubmitPromptOnKeyDown({
        enterKey: true,
        shiftKey: false,
        isComposing: true,
      })
    ).toBe(false)
  })

  it("aligns user messages to the end", () => {
    expect(getMessageAlignment("user")).toBe("end")
  })

  it("aligns assistant messages to the start", () => {
    expect(getMessageAlignment("assistant")).toBe("start")
  })

  it("formats timestamps in a compact readable way", () => {
    const formatted = formatMessageTimestamp(
      new Date("2026-03-26T09:05:00.000Z")
    )

    expect(formatted.length).toBeGreaterThan(0)
    expect(formatted).toMatch(/[:0-9]/)
  })
})
