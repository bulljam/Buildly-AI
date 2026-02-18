export function AppHeader() {
  return (
    <header className="border-b border-amber-100 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/65">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-[0.24em] text-amber-700/80 uppercase">
            Buildly AI
          </p>
          <h1 className="text-lg font-semibold tracking-tight text-stone-900">
            AI website builder
          </h1>
        </div>
        <div className="hidden text-right text-sm text-stone-600 sm:block">
          Turn prompts into refined web experiences
        </div>
      </div>
    </header>
  )
}
