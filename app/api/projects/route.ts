import { NextResponse } from "next/server"

import { AUTH_REQUIRED_ERROR } from "@/lib/auth/session"
import { getCurrentUser } from "@/lib/auth/users"
import { createProject, listProjects } from "@/lib/db/projects"
import { createProjectSchema } from "@/lib/schemas/project"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: AUTH_REQUIRED_ERROR }, { status: 401 })
    }

    const projects = await listProjects(user.id)

    return NextResponse.json({ projects })
  } catch (error) {
    console.error("Failed to list projects", error)

    return NextResponse.json(
      { error: "Unable to load projects right now." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: AUTH_REQUIRED_ERROR }, { status: 401 })
    }

    const json = await request.json().catch(() => ({}))
    const result = createProjectSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.issues[0]?.message ?? "Invalid project payload.",
        },
        { status: 400 }
      )
    }

    const project = await createProject(user.id, result.data)

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error("Failed to create project", error)

    return NextResponse.json(
      { error: "Unable to create a project right now." },
      { status: 500 }
    )
  }
}
