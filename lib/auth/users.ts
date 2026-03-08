import { Prisma } from "@prisma/client"

import { assertDatabaseConfigured, prisma } from "@/lib/db/prisma"

import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { getCurrentSessionUserId } from "@/lib/auth/session"

export const AUTH_DUPLICATE_EMAIL_ERROR =
  "An account with this email already exists."

type AuthUserRecord = {
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
    email: user.email,
    name: user.name,
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
      id: true,
      email: true,
      name: true,
    },
  })
}
