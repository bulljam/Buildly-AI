export const previewModes = ["preview", "code"] as const

export type PreviewMode = (typeof previewModes)[number]

export function isPreviewMode(value: string): value is PreviewMode {
  return previewModes.includes(value as PreviewMode)
}

export function getNextPreviewMode(currentMode: PreviewMode) {
  return currentMode === "preview" ? "code" : "preview"
}
