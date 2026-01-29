import { PrismaClient } from "@prisma/client"

export const DATABASE_URL_MISSING_ERROR = "Missing DATABASE_URL."

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim())
}

export function assertDatabaseConfigured() {
  if (!isDatabaseConfigured()) {
    throw new Error(DATABASE_URL_MISSING_ERROR)
  }
}
