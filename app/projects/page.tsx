import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth/users"
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
  const databaseConfigured = isDatabaseConfigured()
  let projects: ProjectRecord[] = []
  let loadError: string | null = null

  if (!databaseConfigured) {
    return (
      <ProjectsGalleryShell
        loadError={DATABASE_SETUP_MESSAGE}
        projects={projects}
        userEmail=""
      />
    )
  }

  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  try {
    projects = await listProjects(user.id)
  } catch (error) {
    console.error("Failed to load projects gallery", error)
    loadError = getDatabaseSetupErrorMessage(error)
  }

  return (
    <ProjectsGalleryShell
      loadError={loadError}
      projects={projects}
      userEmail={user.email}
    />
  )
}
