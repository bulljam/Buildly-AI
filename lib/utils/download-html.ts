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
