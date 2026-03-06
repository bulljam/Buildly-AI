import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth/users"
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
  const databaseConfigured = isDatabaseConfigured()
  let projects: ProjectRecord[] = []
  let loadError: string | null = null

  if (!databaseConfigured) {
    return (
      <HomePageShell
        databaseConfigured={false}
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
    console.error("Failed to load homepage projects", error)
    loadError = getDatabaseSetupErrorMessage(error)
  }

  return (
    <HomePageShell
      databaseConfigured={databaseConfigured}
      loadError={loadError}
      projects={projects}
      userEmail={user.email}
    />
  )
}
