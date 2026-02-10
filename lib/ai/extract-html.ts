function stripCodeFences(value: string) {
  return value
    .trim()
    .replace(/^```(?:html)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim()
}

function buildHtmlDocument(parts: { head?: string; body: string }) {
  const head = parts.head?.trim() || ""
  const body = parts.body.trim()

  return [
    "<!DOCTYPE html>",
    "<html>",
    head ? head : "<head></head>",
    body,
    "</html>",
  ].join("")
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

  const headMatch = sanitized.match(/<head[\s\S]*<\/head>/i)
  const bodyMatch = sanitized.match(/<body[\s\S]*<\/body>/i)

  if (bodyMatch) {
    return buildHtmlDocument({
      head: headMatch?.[0],
      body: bodyMatch[0],
    })
  }

  throw new Error("AI returned malformed HTML.")
}
