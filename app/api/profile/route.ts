import { NextResponse } from "next/server"

import {
  AUTH_DUPLICATE_EMAIL_ERROR,
  AUTH_INVALID_PASSWORD_ERROR,
  getCurrentUser,
  updateUserProfile,
} from "@/lib/auth/users"
import { profileUpdateSchema } from "@/lib/schemas/profile"

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      )
    }

    const json = await request.json().catch(() => ({}))
    const result = profileUpdateSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            result.error.issues[0]?.message ?? "Invalid profile update payload.",
        },
        { status: 400 }
      )
    }

    const updatedUser = await updateUserProfile(user.id, result.data)

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Failed to update profile", error)

    const message =
      error instanceof Error ? error.message : "Profile update failed."

    return NextResponse.json(
      {
        error:
          message === AUTH_DUPLICATE_EMAIL_ERROR ||
          message === AUTH_INVALID_PASSWORD_ERROR
            ? message
            : "Unable to update your profile right now.",
      },
      {
        status:
          message === AUTH_DUPLICATE_EMAIL_ERROR
            ? 409
            : message === AUTH_INVALID_PASSWORD_ERROR
              ? 400
              : 500,
      }
    )
  }
}
