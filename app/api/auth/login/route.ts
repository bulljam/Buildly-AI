import { NextResponse } from "next/server"

import { applySessionCookie, SESSION_SECRET_MISSING_ERROR } from "@/lib/auth/session"
import { authenticateUser } from "@/lib/auth/users"
import { authCredentialsSchema } from "@/lib/schemas/auth"

const INVALID_CREDENTIALS_ERROR = "Invalid email or password."

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => ({}))
    const result = authCredentialsSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error.issues[0]?.message ?? "Invalid authentication payload.",
        },
        { status: 400 }
      )
    }

    const user = await authenticateUser(result.data)

    if (!user) {
      return NextResponse.json(
        { error: INVALID_CREDENTIALS_ERROR },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ user })

    applySessionCookie(response, user.id)

    return response
  } catch (error) {
    console.error("Failed to log in", error)

    const message = error instanceof Error ? error.message : "Login failed."

    return NextResponse.json(
      {
        error:
          message === SESSION_SECRET_MISSING_ERROR
            ? "Authentication is not configured on the server."
            : "Unable to sign you in right now.",
      },
      { status: 500 }
    )
  }
}
