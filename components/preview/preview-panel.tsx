"use client"

import { useState } from "react"
import { Check, Copy, LoaderCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { isPreviewMode, type PreviewMode } from "@/lib/builder/preview-state"
import { DEFAULT_PROJECT_HTML } from "@/lib/db/default-html"
import { highlightHtml } from "@/lib/preview/highlight-html"
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
  const [isCopying, setIsCopying] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const highlightedHtml = highlightHtml(html)

  async function copyHtml() {
    if (typeof window === "undefined" || isCopying) {
      return
    }

    setIsCopying(true)

    try {
      await window.navigator.clipboard.writeText(html)
      setHasCopied(true)
      window.setTimeout(() => {
        setHasCopied(false)
      }, 1600)
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <section className="flex min-h-[520px] min-w-0 flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 shadow-sm lg:h-[calc(100svh-6.5rem)]">
      <div className="flex items-center justify-between border-b border-border/70 bg-background/70 px-5 py-4 backdrop-blur">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Preview
          </p>
          <p className="mt-2 text-base font-semibold tracking-tight">
            {projectName}
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
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-background/10 via-transparent to-muted/20 p-4">
        {mode === "preview" ? (
          <div className="relative h-full min-h-[420px] overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-inner">
            <iframe
              title="Buildly preview"
              srcDoc={html}
              sandbox="allow-scripts allow-same-origin"
              className="block h-full min-h-[420px] w-full bg-white"
            />
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                <div className="flex max-w-xs flex-col items-center gap-3 rounded-3xl border border-border/70 bg-background/95 px-6 py-5 text-center shadow-lg">
                  <LoaderCircle className="h-6 w-6 animate-spin text-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold tracking-tight text-foreground">
                      Rebuilding preview
                    </p>
                    <p className="text-xs leading-5 text-muted-foreground">
                      Generating updated HTML and keeping your last valid preview visible underneath.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="min-h-[420px] overflow-hidden rounded-[1.75rem] border border-border bg-zinc-950 shadow-inner">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div className="text-xs text-zinc-400">
                {isLoading
                  ? "Showing the last saved valid HTML snapshot."
                  : "Current saved HTML"}
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10 hover:text-zinc-100"
                onClick={copyHtml}
                disabled={isCopying}
              >
                {hasCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy HTML
                  </>
                )}
              </Button>
            </div>
            <pre className="h-[420px] overflow-auto bg-zinc-950 p-4 text-xs leading-6 text-zinc-100">
              <code
                dangerouslySetInnerHTML={{
                  __html: highlightedHtml,
                }}
              />
            </pre>
          </div>
        )}
      </div>
    </section>
  )
}
