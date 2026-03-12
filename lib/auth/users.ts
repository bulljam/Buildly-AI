import { Prisma } from "@prisma/client"

import { assertDatabaseConfigured, prisma } from "@/lib/db/prisma"
import type { ProfileUpdateInput } from "@/lib/schemas/profile"

import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { getCurrentSessionUserId } from "@/lib/auth/session"

export const AUTH_DUPLICATE_EMAIL_ERROR =
  "An account with this email already exists."
export const AUTH_INVALID_PASSWORD_ERROR = "Current password is incorrect."

type AuthUserRecord = {
  avatarDataUrl?: string | null
  email: string
  id: string
  name: string
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export async function createUser(input: {
  email: string
  fullName: string
  password: string
}) {
  assertDatabaseConfigured()

  try {
    return await prisma.user.create({
      data: {
        email: normalizeEmail(input.email),
        name: input.fullName.trim(),
        passwordHash: await hashPassword(input.password),
      },
      select: {
        avatarDataUrl: true,
        id: true,
        email: true,
        name: true,
      },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(AUTH_DUPLICATE_EMAIL_ERROR)
    }

    throw error
  }
}

export async function authenticateUser(input: {
  email: string
  password: string
}): Promise<AuthUserRecord | null> {
  assertDatabaseConfigured()

  const user = await prisma.user.findUnique({
    where: {
      email: normalizeEmail(input.email),
    },
    select: {
      id: true,
      avatarDataUrl: true,
      email: true,
      name: true,
      passwordHash: true,
    },
  })

  if (!user) {
    return null
  }

  const isPasswordValid = await verifyPassword(input.password, user.passwordHash)

  if (!isPasswordValid) {
    return null
  }

  return {
    id: user.id,
    avatarDataUrl: user.avatarDataUrl,
    email: user.email,
    name: user.name,
  }
}

export async function updateUserProfile(
  userId: string,
  input: ProfileUpdateInput
) {
  assertDatabaseConfigured()

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      passwordHash: true,
    },
  })

  if (!user) {
    return null
  }

  const data: {
    avatarDataUrl?: string | null
    email?: string
    name?: string
    passwordHash?: string
  } = {}

  if (input.name !== undefined) {
    data.name = input.name.trim()
  }

  if (input.email !== undefined) {
    data.email = normalizeEmail(input.email)
  }

  if (input.avatarDataUrl !== undefined) {
    data.avatarDataUrl = input.avatarDataUrl
  }

  if (input.newPassword) {
    const isPasswordValid = await verifyPassword(
      input.currentPassword ?? "",
      user.passwordHash
    )

    if (!isPasswordValid) {
      throw new Error(AUTH_INVALID_PASSWORD_ERROR)
    }

    data.passwordHash = await hashPassword(input.newPassword)
  }

  try {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatarDataUrl: true,
      },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(AUTH_DUPLICATE_EMAIL_ERROR)
    }

    throw error
  }
}

export async function getCurrentUser() {
  assertDatabaseConfigured()

  const userId = await getCurrentSessionUserId()

  if (!userId) {
    return null
  }

  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      avatarDataUrl: true,
      id: true,
      email: true,
      name: true,
    },
  })
}
