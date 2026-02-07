const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b"

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

  return {
    apiKey,
    model,
    url,
  }
}
