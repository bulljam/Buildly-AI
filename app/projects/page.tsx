import { ProjectsGalleryShell } from "@/components/projects/projects-gallery-shell"
import { listProjects } from "@/lib/db/projects"
import { isDatabaseConfigured } from "@/lib/db/prisma"
import {
  DATABASE_SETUP_MESSAGE,
  getDatabaseSetupErrorMessage,
} from "@/lib/db/setup-status"
import type { ProjectRecord } from "@/types/project"

export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  let projects: ProjectRecord[] = []
  let loadError: string | null = null
  const databaseConfigured = isDatabaseConfigured()

  if (!databaseConfigured) {
    loadError = DATABASE_SETUP_MESSAGE
  } else {
    try {
      projects = await listProjects()
    } catch (error) {
      console.error("Failed to load projects gallery", error)
      loadError = getDatabaseSetupErrorMessage(error)
    }
  }

  return <ProjectsGalleryShell loadError={loadError} projects={projects} />
}
