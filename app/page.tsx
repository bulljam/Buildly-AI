import { HomePageShell } from "@/components/home/home-page-shell"
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
    <HomePageShell
      databaseConfigured={databaseConfigured}
      loadError={loadError}
      projects={projects}
    />
  )
}
