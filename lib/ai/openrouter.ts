import { buildWebsiteGenerationPrompt } from "@/lib/ai/prompts"

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const DEFAULT_MODEL = "openai/gpt-4o-mini"

type OpenRouterResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  error?: {
    message?: string
  }
}

export async function generateHtmlWithOpenRouter(options: {
  currentHtml: string
  prompt: string
}) {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY.")
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: buildWebsiteGenerationPrompt(options),
    }),
  })

  const json = (await response.json().catch(() => null)) as OpenRouterResponse | null

  if (!response.ok) {
    const message = json?.error?.message || "OpenRouter request failed."
    throw new Error(message)
  }

  const content = json?.choices?.[0]?.message?.content?.trim()

  if (!content) {
    throw new Error("OpenRouter returned an empty response.")
  }

  return content
}
