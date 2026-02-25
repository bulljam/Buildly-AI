"use client"

import { useState } from "react"
import { BadgeCheck, Clipboard, Loader2 } from "lucide-react"

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
    <section className="flex min-h-[520px] min-w-0 flex-1 w-full flex-col overflow-hidden rounded-[2rem] border border-[#D7E3F4] bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(244,248,255,0.98)_100%)] shadow-[0_20px_60px_rgba(37,99,235,0.1)] lg:h-[calc(100svh-6.5rem)]">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F8FBFF] px-5 py-4 backdrop-blur">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#2563EB]">
            Preview
          </p>
          <p className="mt-2 text-base font-semibold tracking-tight text-[#0F172A]">
            {projectName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-[#D7E3F4] bg-white p-1">
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
                    ? "bg-[#2563EB] text-white"
                    : "text-[#64748B] hover:text-[#0F172A]"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-[#F8FBFF] via-transparent to-transparent p-4">
        {mode === "preview" ? (
          <div className="relative h-full min-h-[420px] overflow-hidden rounded-[1.75rem] border border-[#D7E3F4] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <iframe
              title="Buildly preview"
              srcDoc={html}
              sandbox="allow-scripts allow-same-origin"
              className="block h-full min-h-[420px] w-full bg-white"
            />
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-sm">
                <div className="flex max-w-xs flex-col items-center gap-3 rounded-3xl border border-[#D7E3F4] bg-white px-6 py-5 text-center shadow-[0_24px_60px_rgba(37,99,235,0.12)]">
                  <Loader2 className="h-6 w-6 animate-spin text-[#2563EB]" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold tracking-tight text-[#0F172A]">
                      Rebuilding preview
                    </p>
                    <p className="text-xs leading-5 text-[#475569]">
                      Generating updated HTML and keeping your last valid preview visible underneath.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="min-h-[420px] overflow-hidden rounded-[1.75rem] border border-[#D7E3F4] bg-[#F8FBFF] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-4 py-3">
              <div className="text-xs text-[#64748B]">
                {isLoading
                  ? "Showing the last saved valid HTML snapshot."
                  : "Current saved HTML"}
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-[#D7E3F4] bg-white text-[#0F172A] hover:bg-[#F8FBFF] hover:text-[#0F172A]"
                onClick={copyHtml}
                disabled={isCopying}
              >
                {hasCopied ? (
                  <>
                    <BadgeCheck className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Clipboard className="h-4 w-4" />
                    Copy HTML
                  </>
                )}
              </Button>
            </div>
            <pre className="h-[420px] overflow-auto bg-[#F8FBFF] p-4 text-xs leading-6 text-[#0F172A]">
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
