export function sanitizeProjectNameForFilename(projectName: string) {
  const normalized = projectName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return normalized || "buildly-project"
}

export function buildHtmlDownloadFilename(projectName: string) {
  return `${sanitizeProjectNameForFilename(projectName)}.html`
}

export function downloadProjectHtml(projectName: string, html: string) {
  if (typeof document === "undefined") {
    return
  }

  const blob = new Blob([html], { type: "text/html;charset=utf-8" })
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = objectUrl
  link.download = buildHtmlDownloadFilename(projectName)
  link.click()

  URL.revokeObjectURL(objectUrl)
}
