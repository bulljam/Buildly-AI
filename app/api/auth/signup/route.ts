import { NextResponse } from "next/server"

import { applySessionCookie, SESSION_SECRET_MISSING_ERROR } from "@/lib/auth/session"
import { AUTH_DUPLICATE_EMAIL_ERROR, createUser } from "@/lib/auth/users"
import { authCredentialsSchema } from "@/lib/schemas/auth"

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

    const user = await createUser(result.data)
    const response = NextResponse.json({ user }, { status: 201 })

    applySessionCookie(response, user.id)

    return response
  } catch (error) {
    console.error("Failed to sign up", error)

    const message = error instanceof Error ? error.message : "Sign up failed."
    const status = message === AUTH_DUPLICATE_EMAIL_ERROR ? 409 : 500

    return NextResponse.json(
      {
        error:
          message === AUTH_DUPLICATE_EMAIL_ERROR
            ? message
            : message === SESSION_SECRET_MISSING_ERROR
              ? "Authentication is not configured on the server."
              : "Unable to create your account right now.",
      },
      { status }
    )
  }
}
