import { DEFAULT_PROJECT_HTML } from "@/lib/db/default-html"

type PreviewPanelProps = {
  html?: string
  isLoading?: boolean
}

export function PreviewPanel({
  html = DEFAULT_PROJECT_HTML,
  isLoading = false,
}: PreviewPanelProps) {
  return (
    <section className="flex min-h-[420px] flex-col rounded-3xl border border-border/70 bg-card/80 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
        <div>
          <p className="text-sm font-medium">Preview</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Generated sites render in a sandboxed iframe.
          </p>
        </div>
        <div className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
          {isLoading ? "Last valid preview" : "Preview mode"}
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="h-full min-h-[420px] overflow-hidden rounded-2xl border border-border bg-white shadow-inner">
          <iframe
            title="Buildly preview"
            srcDoc={html}
            sandbox="allow-scripts"
            className="h-full min-h-[420px] w-full"
          />
        </div>
      </div>
    </section>
  )
}
