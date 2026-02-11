const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b"
const DEFAULT_GROQ_MAX_COMPLETION_TOKENS = 8192

export function getGroqConfig() {
  const apiKey = process.env.GROQ_API_KEY?.trim()
  const url = process.env.GROQ_URL?.trim()

  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY.")
  }

  if (!url) {
    throw new Error("Missing GROQ_URL.")
  }

  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_GROQ_MODEL
  const maxCompletionTokens = Number.parseInt(
    process.env.GROQ_MAX_COMPLETION_TOKENS?.trim() ||
      `${DEFAULT_GROQ_MAX_COMPLETION_TOKENS}`,
    10
  )

  return {
    apiKey,
    maxCompletionTokens: Number.isFinite(maxCompletionTokens)
      ? maxCompletionTokens
      : DEFAULT_GROQ_MAX_COMPLETION_TOKENS,
    model,
    url,
  }
}
