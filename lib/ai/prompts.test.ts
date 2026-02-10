import { describe, expect, it } from "vitest"

import { buildWebsiteGenerationPrompt } from "@/lib/ai/prompts"

describe("buildWebsiteGenerationPrompt", () => {
  it("includes stricter html and css quality instructions", () => {
    const messages = buildWebsiteGenerationPrompt({
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
      prompt: "Build a modern travel landing page",
    })

    expect(messages).toHaveLength(3)
    expect(messages[0]?.content).toContain(
      "Do not reference undefined CSS variables, classes, fonts, images, or assets."
    )
    expect(messages[0]?.content).toContain(
      "If a design system is introduced with CSS variables, make sure every variable used is defined."
    )
    expect(messages[0]?.content).toContain(
      "Make the visual design feel modern, intentional, and specific to the prompt instead of generic or template-like."
    )
    expect(messages[1]?.content).toContain("Requirements:")
    expect(messages[1]?.content).toContain(
      "- Include polished inline CSS that renders correctly without missing variables or assets."
    )
    expect(messages[1]?.content).toContain(
      "- Make the design feel contemporary and tailored to the prompt, not like a generic starter template."
    )
    expect(messages[2]).toEqual({
      role: "assistant",
      content: "<!DOCTYPE html>\n<html lang=\"en\">",
    })
  })
})
