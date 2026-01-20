export function AppHeader() {
  return (
    <header className="border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Buildly AI
          </p>
          <h1 className="text-lg font-semibold tracking-tight">AI website builder</h1>
        </div>
        <div className="hidden text-right text-sm text-muted-foreground sm:block">
          Chat to generate a full HTML site
        </div>
      </div>
    </header>
  )
}
