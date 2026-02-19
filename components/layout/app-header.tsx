export function AppHeader() {
  return (
    <header className="border-b border-white/6 bg-[#1A1A1D]/78 backdrop-blur supports-[backdrop-filter]:bg-[#1A1A1D]/68">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-[0.24em] text-[#A64D79] uppercase">
            Buildly AI
          </p>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            AI website builder
          </h1>
        </div>
        <div className="hidden text-right text-sm text-white/60 sm:block">
          Turn prompts into refined web experiences
        </div>
      </div>
    </header>
  )
}
