function stripCodeFences(value: string) {
  return value
    .trim()
    .replace(/^```(?:html)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim()
}

export function extractHtmlDocument(value: string) {
  const sanitized = stripCodeFences(value)
  const documentMatch = sanitized.match(/<!doctype html[\s\S]*<\/html>/i)

  if (documentMatch) {
    return documentMatch[0].trim()
  }

  const htmlMatch = sanitized.match(/<html[\s\S]*<\/html>/i)

  if (htmlMatch) {
    return htmlMatch[0].trim()
  }

  throw new Error("AI returned malformed HTML.")
}
