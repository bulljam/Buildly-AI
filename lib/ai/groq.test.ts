import { afterEach, describe, expect, it, vi } from "vitest"

const fetchMock = vi.fn()

vi.stubGlobal("fetch", fetchMock)

import { generateHtmlWithGroq } from "@/lib/ai/groq"

const ORIGINAL_ENV = { ...process.env }

describe("generateHtmlWithGroq", () => {
  afterEach(() => {
    fetchMock.mockReset()
    process.env = { ...ORIGINAL_ENV }
  })

  it("sends a request with the configured model and returns the assistant content", async () => {
    process.env.GROQ_API_KEY = "test-key"
    process.env.GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
    process.env.GROQ_MODEL = "openai/gpt-oss-20b"

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "<!DOCTYPE html><html><body>Hello</body></html>",
            },
          },
        ],
      }),
    })

    const result = await generateHtmlWithGroq({
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
      prompt: "Refresh the hero section",
    })

    expect(result).toBe("<!DOCTYPE html><html><body>Hello</body></html>")
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.groq.com/openai/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
          "Content-Type": "application/json",
        }),
      })
    )

    const payload = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)

    expect(payload.model).toBe("openai/gpt-oss-20b")
    expect(payload.messages).toHaveLength(2)
  })

  it("throws a helpful error when Groq returns an error response", async () => {
    process.env.GROQ_API_KEY = "test-key"
    process.env.GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          message: "Rate limited",
        },
      }),
    })

    await expect(
      generateHtmlWithGroq({
        currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
        prompt: "Refresh the hero section",
      })
    ).rejects.toThrow("Rate limited")
  })

  it("throws when Groq returns an empty message", async () => {
    process.env.GROQ_API_KEY = "test-key"
    process.env.GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "   ",
            },
          },
        ],
      }),
    })

    await expect(
      generateHtmlWithGroq({
        currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
        prompt: "Refresh the hero section",
      })
    ).rejects.toThrow("Groq returned an empty response.")
  })

  it("throws when the configured URL is missing", async () => {
    process.env.GROQ_API_KEY = "test-key"
    delete process.env.GROQ_URL

    await expect(
      generateHtmlWithGroq({
        currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
        prompt: "Refresh the hero section",
      })
    ).rejects.toThrow("Missing GROQ_URL.")
  })
})
