import { describe, expect, it } from "vitest"

import {
  appendAssistantMessage,
  canSubmitPrompt,
  createOptimisticUserMessage,
  normalizePrompt,
} from "@/lib/builder/generate-state"

describe("generate-state helpers", () => {
  it("normalizes prompt text before submission", () => {
    expect(normalizePrompt("  Build a landing page  ")).toBe(
      "Build a landing page"
    )
  })

  it("allows submission for a non-empty prompt when not loading", () => {
    expect(canSubmitPrompt("Build a landing page", false)).toBe(true)
  })

  it("blocks submission for a blank prompt", () => {
    expect(canSubmitPrompt("   ", false)).toBe(false)
  })

  it("blocks submission while a request is already loading", () => {
    expect(canSubmitPrompt("Build a landing page", true)).toBe(false)
  })

  it("creates an optimistic user message with trimmed content", () => {
    const createdAt = new Date("2026-03-26T12:00:00.000Z")

    expect(
      createOptimisticUserMessage({
        id: "temp-1",
        projectId: "project-1",
        prompt: "  Add a hero section  ",
        createdAt,
      })
    ).toEqual({
      id: "temp-1",
      projectId: "project-1",
      role: "user",
      content: "Add a hero section",
      createdAt,
    })
  })

  it("appends the assistant message after the current message list", () => {
    const messages = [
      {
        id: "m1",
        projectId: "project-1",
        role: "user" as const,
        content: "Build a landing page",
        createdAt: new Date("2026-03-26T12:00:00.000Z"),
      },
    ]
    const assistantMessage = {
      id: "m2",
      projectId: "project-1",
      role: "assistant" as const,
      content: "<!DOCTYPE html><html></html>",
      createdAt: new Date("2026-03-26T12:01:00.000Z"),
    }

    expect(appendAssistantMessage(messages, assistantMessage)).toEqual([
      messages[0],
      assistantMessage,
    ])
  })
})
