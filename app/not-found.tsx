import Link from "next/link"

import { AppHeader } from "@/components/layout/app-header"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="w-full rounded-3xl border border-border/70 bg-card/80 p-8 shadow-sm">
          <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
            Not Found
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            That project does not exist.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            The link may be old, or the project may never have been created in
            this local database. Go back home to open another project or create
            a new one.
          </p>
          <div className="mt-6">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/">Back to projects</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
