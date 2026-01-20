import { AppHeader } from "@/components/layout/app-header"
import { AppShell } from "@/components/layout/app-shell"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <AppHeader />
      <AppShell />
    </div>
  )
}
