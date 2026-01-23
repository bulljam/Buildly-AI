import { ChatPanel } from "@/components/chat/chat-panel"
import { PreviewPanel } from "@/components/preview/preview-panel"

type AppShellProps = {
  eyebrow?: string
  title?: string
  description?: string
  chatPanel?: React.ReactNode
  previewPanel?: React.ReactNode
}

export function AppShell({
  eyebrow = "MVP Foundation",
  title = "Prompt, generate, preview, refine.",
  description = "Buildly AI stores a project, its messages, and the latest generated HTML snapshot. This first slice sets up the data model and gives us the shell for the chat and live preview workflow.",
  chatPanel,
  previewPanel,
}: AppShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-border/70 bg-gradient-to-br from-background via-background to-muted/60 p-6 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        {chatPanel ?? <ChatPanel />}
        {previewPanel ?? <PreviewPanel />}
      </section>
    </main>
  )
}
