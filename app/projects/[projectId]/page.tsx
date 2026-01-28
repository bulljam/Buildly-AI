import { notFound } from "next/navigation"

import { ChatPanel } from "@/components/chat/chat-panel"
import { AppHeader } from "@/components/layout/app-header"
import { AppShell } from "@/components/layout/app-shell"
import { PreviewPanel } from "@/components/preview/preview-panel"
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
      <AppShell
        eyebrow="Saved project"
        title={project.name}
        description="This project loads from Prisma with its latest HTML snapshot and saved chat history. Generation wiring comes next."
        chatPanel={
          <ChatPanel projectName={project.name} messages={project.messages} />
        }
        previewPanel={<PreviewPanel html={project.currentHtml} />}
      />
    </div>
  )
}
