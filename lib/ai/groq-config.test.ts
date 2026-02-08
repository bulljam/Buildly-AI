import { afterEach, describe, expect, it } from "vitest"

import { getGroqConfig } from "@/lib/ai/groq-config"

const ORIGINAL_ENV = { ...process.env }

describe("getGroqConfig", () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it("returns the default model when GROQ_MODEL is not provided", () => {
    process.env.GROQ_API_KEY = "test-key"
    process.env.GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
    delete process.env.GROQ_MODEL

    expect(getGroqConfig()).toEqual({
      apiKey: "test-key",
      model: "openai/gpt-oss-20b",
      url: "https://api.groq.com/openai/v1/chat/completions",
    })
  })

  it("uses trimmed custom Groq config when provided", () => {
    process.env.GROQ_API_KEY = " test-key "
    process.env.GROQ_URL = " https://api.groq.com/openai/v1/chat/completions "
    process.env.GROQ_MODEL = " llama-3.3-70b-versatile "

    expect(getGroqConfig()).toEqual({
      apiKey: "test-key",
      model: "llama-3.3-70b-versatile",
      url: "https://api.groq.com/openai/v1/chat/completions",
    })
  })

  it("throws when the API key is missing", () => {
    delete process.env.GROQ_API_KEY

    expect(() => getGroqConfig()).toThrow("Missing GROQ_API_KEY.")
  })

  it("throws when the URL is missing", () => {
    process.env.GROQ_API_KEY = "test-key"
    delete process.env.GROQ_URL

    expect(() => getGroqConfig()).toThrow("Missing GROQ_URL.")
  })
})
