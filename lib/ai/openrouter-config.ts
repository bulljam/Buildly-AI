const DEFAULT_OPENROUTER_MODEL = "qwen/qwen3-coder:free"
const DEFAULT_APP_NAME = "Buildly AI"

export function getOpenRouterConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim()
  const url = process.env.OPENROUTER_URL?.trim()

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY.")
  }

  if (!url) {
    throw new Error("Missing OPENROUTER_URL.")
  }

  const model = process.env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL
  const appName = process.env.OPENROUTER_APP_NAME?.trim() || DEFAULT_APP_NAME
  const appUrl = process.env.OPENROUTER_APP_URL?.trim() || undefined

  return {
    apiKey,
    appName,
    appUrl,
    model,
    url,
  }
}
