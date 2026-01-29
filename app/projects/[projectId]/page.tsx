import { notFound } from "next/navigation"

import { ProjectBuilder } from "@/components/builder/project-builder"
import { AppHeader } from "@/components/layout/app-header"
import { getProjectWithMessages } from "@/lib/db/projects"
import { isDatabaseConfigured } from "@/lib/db/prisma"

export const dynamic = "force-dynamic"

type ProjectPageProps = {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params

  if (!isDatabaseConfigured()) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <AppHeader />
        <main className="mx-auto flex w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full rounded-3xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            DATABASE_URL is missing. Add it to your local <code>.env</code> file, run Prisma
            setup, and then reload this project.
          </div>
        </main>
      </div>
    )
  }

  const project = await getProjectWithMessages(projectId)

  if (!project) {
    notFound()
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <AppHeader />
      <ProjectBuilder
        initialHtml={project.currentHtml}
        initialMessages={project.messages}
        projectId={project.id}
        projectName={project.name}
      />
    </div>
  )
}
