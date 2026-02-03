import { getOpenRouterConfig } from "@/lib/ai/openrouter-config"
import { buildWebsiteGenerationPrompt } from "@/lib/ai/prompts"

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
  const { apiKey, appName, appUrl, model, url } = getOpenRouterConfig()

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(appUrl ? { "HTTP-Referer": appUrl } : {}),
      "X-Title": appName,
    },
    body: JSON.stringify({
      model,
      messages: buildWebsiteGenerationPrompt(options),
    }),
  })

  const json = (await response
    .json()
    .catch(() => null)) as OpenRouterResponse | null

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
