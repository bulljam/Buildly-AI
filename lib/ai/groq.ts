import { getGroqConfig } from "@/lib/ai/groq-config"
import { buildWebsiteGenerationPrompt } from "@/lib/ai/prompts"

type GroqResponse = {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  error?: {
    message?: string
  }
}

export async function generateHtmlWithGroq(options: {
  currentHtml: string
  prompt: string
}) {
  const { apiKey, model, url } = getGroqConfig()

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: buildWebsiteGenerationPrompt(options),
    }),
  })

  const json = (await response.json().catch(() => null)) as GroqResponse | null

  if (!response.ok) {
    const message = json?.error?.message || "Groq request failed."
    throw new Error(message)
  }

  const content = json?.choices?.[0]?.message?.content?.trim()

  if (!content) {
    throw new Error("Groq returned an empty response.")
  }

  return content
}
