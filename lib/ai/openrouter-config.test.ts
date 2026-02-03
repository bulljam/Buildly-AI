import { afterEach, describe, expect, it } from "vitest"

import { getOpenRouterConfig } from "@/lib/ai/openrouter-config"

const ORIGINAL_ENV = { ...process.env }

describe("getOpenRouterConfig", () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it("returns the default model when OPENROUTER_MODEL is not provided", () => {
    process.env.OPENROUTER_API_KEY = "test-key"
    process.env.OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
    delete process.env.OPENROUTER_MODEL

    expect(getOpenRouterConfig()).toMatchObject({
      apiKey: "test-key",
      appName: "Buildly AI",
      model: "openai/gpt-4o-mini",
      url: "https://openrouter.ai/api/v1/chat/completions",
    })
  })

  it("uses trimmed custom OpenRouter config when provided", () => {
    process.env.OPENROUTER_API_KEY = " test-key "
    process.env.OPENROUTER_URL =
      " https://openrouter.ai/api/v1/chat/completions "
    process.env.OPENROUTER_MODEL = " anthropic/claude-3.5-sonnet "
    process.env.OPENROUTER_APP_NAME = " My Buildly "
    process.env.OPENROUTER_APP_URL = " https://example.com "

    expect(getOpenRouterConfig()).toEqual({
      apiKey: "test-key",
      appName: "My Buildly",
      appUrl: "https://example.com",
      model: "anthropic/claude-3.5-sonnet",
      url: "https://openrouter.ai/api/v1/chat/completions",
    })
  })

  it("throws when the API key is missing", () => {
    delete process.env.OPENROUTER_API_KEY

    expect(() => getOpenRouterConfig()).toThrow("Missing OPENROUTER_API_KEY.")
  })

  it("throws when the URL is missing", () => {
    process.env.OPENROUTER_API_KEY = "test-key"
    delete process.env.OPENROUTER_URL

    expect(() => getOpenRouterConfig()).toThrow("Missing OPENROUTER_URL.")
  })
})
