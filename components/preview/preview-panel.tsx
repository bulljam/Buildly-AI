"use client"

import { useState } from "react"
import { BadgeCheck, Clipboard, Download, Loader2, PenBox } from "lucide-react"

import { Button } from "@/components/ui/button"
import { isPreviewMode, type PreviewMode } from "@/lib/builder/preview-state"
import { DEFAULT_PROJECT_HTML } from "@/lib/db/default-html"
import { highlightHtml } from "@/lib/preview/highlight-html"
import { preparePreviewHtml } from "@/lib/preview/prepare-preview-html"
import { downloadProjectHtml } from "@/lib/utils/download-html"
import { cn } from "@/lib/utils"

type PreviewPanelProps = {
  html?: string
  isLoading?: boolean
  onRename?: () => void
  projectName?: string
}

export function PreviewPanel({
  html = DEFAULT_PROJECT_HTML,
  isLoading = false,
  onRename,
  projectName = "Buildly Project",
}: PreviewPanelProps) {
  const [mode, setMode] = useState<PreviewMode>("preview")
  const [isCopying, setIsCopying] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const highlightedHtml = highlightHtml(html)
  const previewHtml = preparePreviewHtml(html)

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

  const windowDots = (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
    </div>
  )

  return (
    <section className="flex min-h-[520px] min-w-0 flex-1 w-full flex-col lg:h-[calc(100svh-6.5rem)]">
      <div className="mb-3 flex items-start justify-between gap-4 px-1">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#2563EB]">
            Preview
          </p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="truncate text-sm font-medium text-[#0F172A]">
              {projectName}
            </p>
            <button
              type="button"
              aria-label="Rename project"
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D7E3F4] bg-white text-[#64748B] transition hover:border-[#93C5FD] hover:text-[#0F172A]"
              onClick={onRename}
            >
              <PenBox className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 border-[#D7E3F4] bg-white text-[#0F172A] hover:bg-[#F8FBFF] hover:text-[#0F172A]"
            onClick={() => downloadProjectHtml(projectName, html)}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <div className="flex rounded-full border border-[#D7E3F4] bg-white p-1 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
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

      <div className="min-h-0 flex-1">
        {mode === "preview" ? (
          <div className="relative h-full min-h-[420px] overflow-hidden rounded-[1.15rem] border border-[#D7E3F4] bg-[#FDFEFF] shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F5F8FC] px-4 py-2.5">
              {windowDots}
              <div />
              <div className="w-[46px]" />
            </div>
            <iframe
              title="Buildly preview"
              srcDoc={previewHtml}
              sandbox="allow-scripts allow-same-origin"
              className="block h-[calc(100%-43px)] min-h-[377px] w-full bg-white"
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
          <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-[1.15rem] border border-[#D7E3F4] bg-[#F8FBFF] shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] bg-[#F5F8FC] px-4 py-2.5">
              <div className="flex items-center gap-3">
                {windowDots}
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 border-[#D7E3F4] bg-white text-[#0F172A] hover:bg-[#F8FBFF] hover:text-[#0F172A]"
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
            <pre className="min-h-0 flex-1 overflow-auto bg-[#F8FBFF] p-4 text-xs leading-6 text-[#0F172A]">
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
