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
    <section className="flex min-h-[520px] min-w-0 flex-col overflow-hidden rounded-[2rem] border border-amber-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(255,250,240,0.98)_100%)] shadow-[0_20px_60px_rgba(120,53,15,0.08)] lg:h-[calc(100svh-6.5rem)]">
      <div className="flex items-center justify-between border-b border-amber-100 bg-white/75 px-5 py-4 backdrop-blur">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-amber-700/80">
            Preview
          </p>
          <p className="mt-2 text-base font-semibold tracking-tight text-stone-900">
            {projectName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-amber-200 bg-white/85 p-1">
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
                    ? "bg-stone-900 text-white"
                    : "text-stone-500 hover:text-stone-900"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-white/45 via-transparent to-amber-50/40 p-4">
        {mode === "preview" ? (
          <div className="relative h-full min-h-[420px] overflow-hidden rounded-[1.75rem] border border-amber-200/70 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <iframe
              title="Buildly preview"
              srcDoc={html}
              sandbox="allow-scripts allow-same-origin"
              className="block h-full min-h-[420px] w-full bg-white"
            />
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/55 backdrop-blur-sm">
                <div className="flex max-w-xs flex-col items-center gap-3 rounded-3xl border border-amber-200/80 bg-white/95 px-6 py-5 text-center shadow-[0_24px_60px_rgba(120,53,15,0.12)]">
                  <LoaderCircle className="h-6 w-6 animate-spin text-stone-900" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold tracking-tight text-stone-900">
                      Rebuilding preview
                    </p>
                    <p className="text-xs leading-5 text-stone-600">
                      Generating updated HTML and keeping your last valid preview visible underneath.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="min-h-[420px] overflow-hidden rounded-[1.75rem] border border-amber-200/70 bg-[#fffaf1] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
            <div className="flex items-center justify-between gap-3 border-b border-amber-100 px-4 py-3">
              <div className="text-xs text-stone-500">
                {isLoading
                  ? "Showing the last saved valid HTML snapshot."
                  : "Current saved HTML"}
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-amber-200 bg-white/85 text-stone-700 hover:bg-white hover:text-stone-900"
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
            <pre className="h-[420px] overflow-auto bg-[#fffaf1] p-4 text-xs leading-6 text-stone-700">
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
