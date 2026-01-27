import { notFound } from "next/navigation"

import { ProjectBuilder } from "@/components/builder/project-builder"
import { AppHeader } from "@/components/layout/app-header"
import { getProjectWithMessages } from "@/lib/db/projects"

export const dynamic = "force-dynamic"

type ProjectPageProps = {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params
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
