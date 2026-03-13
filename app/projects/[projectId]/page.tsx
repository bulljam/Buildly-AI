import { notFound, redirect } from "next/navigation"

import { ProjectBuilder } from "@/components/builder/project-builder"
import { getCurrentUser } from "@/lib/auth/users"
import { getProjectWithMessages, listProjects } from "@/lib/db/projects"
import { isDatabaseConfigured } from "@/lib/db/prisma"
import { DATABASE_SETUP_MESSAGE } from "@/lib/db/setup-status"

export const dynamic = "force-dynamic"

type ProjectPageProps = {
  params: Promise<{
    projectId: string
  }>
  searchParams?: Promise<{
    prompt?: string
  }>
}

export default async function ProjectPage({
  params,
  searchParams,
}: ProjectPageProps) {
  const { projectId } = await params
  const resolvedSearchParams = searchParams ? await searchParams : undefined

  if (!isDatabaseConfigured()) {
    return (
      <div className="flex min-h-svh flex-col bg-background">
        <main className="mx-auto flex w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full rounded-3xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            {DATABASE_SETUP_MESSAGE}
          </div>
        </main>
      </div>
    )
  }

  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const project = await getProjectWithMessages(user.id, projectId)
  const projects = await listProjects(user.id)

  if (!project) {
    notFound()
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <ProjectBuilder
        initialHtml={project.currentHtml}
        initialMessages={project.messages}
        initialPrompt={resolvedSearchParams?.prompt}
        projects={projects}
        projectId={project.id}
        projectName={project.name}
        userAvatarDataUrl={user.avatarDataUrl}
        userName={user.name}
      />
    </div>
  )
}
