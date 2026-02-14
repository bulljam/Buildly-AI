import { AppHeader } from "@/components/layout/app-header"
import { NewProjectButton } from "@/components/projects/new-project-button"
import { ProjectList } from "@/components/projects/project-list"
import { listProjects } from "@/lib/db/projects"
import { isDatabaseConfigured } from "@/lib/db/prisma"
import {
  DATABASE_SETUP_MESSAGE,
  getDatabaseSetupErrorMessage,
} from "@/lib/db/setup-status"
import type { ProjectRecord } from "@/types/project"

export const dynamic = "force-dynamic"

export default async function Page() {
  let projects: ProjectRecord[] = []
  let loadError: string | null = null
  const databaseConfigured = isDatabaseConfigured()

  if (!databaseConfigured) {
    loadError = DATABASE_SETUP_MESSAGE
  } else {
    try {
      projects = await listProjects()
    } catch (error) {
      console.error("Failed to load homepage projects", error)
      loadError = getDatabaseSetupErrorMessage(error)
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-5 rounded-3xl border border-border/70 bg-gradient-to-br from-background via-background to-muted/60 p-6 shadow-sm sm:p-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
              Projects
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Build and refine one HTML website per project.
            </h1>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              Create a project, keep its chat history, and carry one current
              HTML snapshot forward with every future edit.
            </p>
          </div>
          <div>
            <NewProjectButton disabled={!databaseConfigured} />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Recent projects
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Load an existing project or start a fresh one.
              </p>
            </div>
          </div>

          {loadError ? (
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
              {loadError}
            </div>
          ) : (
            <ProjectList projects={projects} />
          )}
        </section>
      </main>
    </div>
  )
}
