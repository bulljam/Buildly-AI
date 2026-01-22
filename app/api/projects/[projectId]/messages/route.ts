import { NextResponse } from "next/server"

import { getProjectById, getProjectMessages } from "@/lib/db/projects"

type RouteContext = {
  params: Promise<{
    projectId: string
  }>
}

export async function GET(_: Request, context: RouteContext) {
  const { projectId } = await context.params

  try {
    const project = await getProjectById(projectId)

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 })
    }

    const messages = await getProjectMessages(projectId)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error(`Failed to load messages for project ${projectId}`, error)

    return NextResponse.json(
      { error: "Unable to load messages right now." },
      { status: 500 },
    )
  }
}
