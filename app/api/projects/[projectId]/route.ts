import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

import { getProjectById, updateProjectName } from "@/lib/db/projects"
import { updateProjectSchema } from "@/lib/schemas/project"

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

export async function PATCH(request: Request, context: RouteContext) {
  const { projectId } = await context.params

  try {
    const json = await request.json().catch(() => ({}))
    const result = updateProjectSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.issues[0]?.message ?? "Invalid project payload.",
        },
        { status: 400 }
      )
    }

    const project = await updateProjectName(projectId, result.data)

    return NextResponse.json({ project })
  } catch (error) {
    console.error(`Failed to update project ${projectId}`, error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 })
    }

    return NextResponse.json(
      { error: "Unable to update this project right now." },
      { status: 500 }
    )
  }
}
