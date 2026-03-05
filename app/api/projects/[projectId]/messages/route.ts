import { NextResponse } from "next/server"

import { AUTH_REQUIRED_ERROR } from "@/lib/auth/session"
import { getCurrentUser } from "@/lib/auth/users"
import { getProjectById, getProjectMessages } from "@/lib/db/projects"

type RouteContext = {
  params: Promise<{
    projectId: string
  }>
}

export async function GET(_: Request, context: RouteContext) {
  const { projectId } = await context.params

  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: AUTH_REQUIRED_ERROR }, { status: 401 })
    }

    const project = await getProjectById(user.id, projectId)

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 })
    }

    const messages = await getProjectMessages(user.id, projectId)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error(`Failed to load messages for project ${projectId}`, error)

    return NextResponse.json(
      { error: "Unable to load messages right now." },
      { status: 500 }
    )
  }
}
