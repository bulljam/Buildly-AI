import { afterEach, describe, expect, it, vi } from "vitest"

const fetchMock = vi.fn()

vi.stubGlobal("fetch", fetchMock)

import { generateHtmlWithOpenRouter } from "@/lib/ai/openrouter"

const ORIGINAL_ENV = { ...process.env }

describe("generateHtmlWithOpenRouter", () => {
  afterEach(() => {
    fetchMock.mockReset()
    process.env = { ...ORIGINAL_ENV }
  })

  it("sends a request with the configured model and returns the assistant content", async () => {
    process.env.OPENROUTER_API_KEY = "test-key"
    process.env.OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
    process.env.OPENROUTER_MODEL = "openai/gpt-4.1-mini"
    process.env.OPENROUTER_APP_NAME = "Buildly Local"
    process.env.OPENROUTER_APP_URL = "https://example.com"

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

    const result = await generateHtmlWithOpenRouter({
      currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
      prompt: "Refresh the hero section",
    })

    expect(result).toBe("<!DOCTYPE html><html><body>Hello</body></html>")
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(
      "https://openrouter.ai/api/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
          "Content-Type": "application/json",
          "HTTP-Referer": "https://example.com",
          "X-Title": "Buildly Local",
        }),
      })
    )

    const payload = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string)

    expect(payload.model).toBe("openai/gpt-4.1-mini")
    expect(payload.messages).toHaveLength(2)
  })

  it("throws a helpful error when OpenRouter returns an error response", async () => {
    process.env.OPENROUTER_API_KEY = "test-key"
    process.env.OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: {
          message: "Rate limited",
        },
      }),
    })

    await expect(
      generateHtmlWithOpenRouter({
        currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
        prompt: "Refresh the hero section",
      })
    ).rejects.toThrow("Rate limited")
  })

  it("throws when OpenRouter returns an empty message", async () => {
    process.env.OPENROUTER_API_KEY = "test-key"
    process.env.OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

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
      generateHtmlWithOpenRouter({
        currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
        prompt: "Refresh the hero section",
      })
    ).rejects.toThrow("OpenRouter returned an empty response.")
  })

  it("throws when the configured URL is missing", async () => {
    process.env.OPENROUTER_API_KEY = "test-key"
    delete process.env.OPENROUTER_URL

    await expect(
      generateHtmlWithOpenRouter({
        currentHtml: "<!DOCTYPE html><html><body>Old</body></html>",
        prompt: "Refresh the hero section",
      })
    ).rejects.toThrow("Missing OPENROUTER_URL.")
  })
})
