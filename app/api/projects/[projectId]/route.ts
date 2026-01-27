import { NextResponse } from "next/server"

import { getProjectById } from "@/lib/db/projects"

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

    return NextResponse.json({ project })
  } catch (error) {
    console.error(`Failed to load project ${projectId}`, error)

    return NextResponse.json(
      { error: "Unable to load this project right now." },
      { status: 500 }
    )
  }
}
