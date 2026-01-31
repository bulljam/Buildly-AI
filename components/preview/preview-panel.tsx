"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { isPreviewMode, type PreviewMode } from "@/lib/builder/preview-state"
import { DEFAULT_PROJECT_HTML } from "@/lib/db/default-html"
import { buildHtmlDownloadFilename } from "@/lib/utils/download-html"
import { cn } from "@/lib/utils"

type PreviewPanelProps = {
  html?: string
  isLoading?: boolean
  projectName?: string
}

export function PreviewPanel({
  html = DEFAULT_PROJECT_HTML,
  isLoading = false,
  projectName = "Buildly Project",
}: PreviewPanelProps) {
  const [mode, setMode] = useState<PreviewMode>("preview")

  function downloadHtml() {
    if (typeof window === "undefined") {
      return
    }

    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const objectUrl = window.URL.createObjectURL(blob)
    const link = window.document.createElement("a")

    link.href = objectUrl
    link.download = buildHtmlDownloadFilename(projectName)
    link.click()
    window.URL.revokeObjectURL(objectUrl)
  }

  return (
    <section className="flex min-h-[420px] flex-col rounded-3xl border border-border/70 bg-card/80 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
        <div>
          <p className="text-sm font-medium">Preview</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Generated sites render in a sandboxed iframe.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-border bg-background p-1">
            {(["preview", "code"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  if (isPreviewMode(value)) {
                    setMode(value)
                  }
                }}
                className={cn(
                  "rounded-full px-3 py-1 text-xs capitalize transition",
                  mode === value
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {value}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={downloadHtml}>
            Download HTML
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        {mode === "preview" ? (
          <div className="h-full min-h-[420px] overflow-hidden rounded-2xl border border-border bg-white shadow-inner">
            <iframe
              title="Buildly preview"
              srcDoc={html}
              sandbox="allow-scripts"
              className="h-full min-h-[420px] w-full"
            />
          </div>
        ) : (
          <div className="min-h-[420px] overflow-hidden rounded-2xl border border-border bg-zinc-950 shadow-inner">
            <div className="border-b border-white/10 px-4 py-3 text-xs text-zinc-400">
              {isLoading
                ? "Showing the last saved valid HTML snapshot."
                : "Current saved HTML"}
            </div>
            <pre className="h-[420px] overflow-auto p-4 text-xs leading-6 text-zinc-100">
              <code>{html}</code>
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}
